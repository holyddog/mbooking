package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.PageRepostitoryCustom;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.MongoCustom;

public class PageRepositoryImpl implements PageRepostitoryCustom {

	@Autowired
	private MongoTemplate db;

	@Override
	public Book create(Long bid, Long uid, Long date, String pic, String caption) {
		Page page = new Page();
		Book book = null;
		try {

			page.setBid(bid);

			if (caption != null)
				page.setCaption(caption);

			if (date != null)
				page.setDate(date);

			Long create_date = System.currentTimeMillis();

			page.setCdate(create_date);
			page.setUid(uid);

			if (pic != null && !pic.equals("") && !pic.equals("undefined")) {
				String img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER
						+ uid + "/" + ConstValue.BOOK_FOLDER + bid, pic, ConstValue.PAGE_IMG_TYPE);
				pic = img_path;
				page.setPic(pic);
			}

			Criteria criteria = Criteria.where("bid").is(bid).and("uid")
					.is(uid);
			Query query = new Query(criteria);
			Integer seq = (int) db.count(query, Page.class) + 1;

			page.setSeq(seq);
			

			Long pid = MongoCustom.generateMaxSeq(Page.class, db);
			page.setPid(pid);
			db.insert(page);

			if (seq == 1 && pic != null && !pic.equals("")
					&& !pic.equals("undefined")) {
				Update update = new Update();
				update.set("pic", pic);
				db.updateFirst(query, update, Book.class);
			}

			Update update = new Update();
			int pcount = (int) db.count(
					new Query(Criteria.where("bid").is(bid)), Page.class);
			update.set("pcount", pcount);
			update.set("ledate", create_date);

			db.updateFirst(query, update, Book.class);

			Update user_update = new Update();
			Query q = new Query(Criteria.where("bid").is(bid));
			q.fields().include("title").include("pic").include("pcount");
			book = db.findOne(q, Book.class);
			user_update.set("leb", book);

			db.updateFirst(new Query(Criteria.where("uid").is(uid)),
					user_update, User.class);

		} catch (Exception e) {
			System.out.println("Create page arr: " + e);
			return null;
		}
		return book;
	}
	
	@Override
	public Page add(String picture, Integer imgSize, Integer cropPos, String caption, Long bookId, Long addBy) {
		Query query = new Query(Criteria.where("bid").is(bookId));
		
		// insert new page data
		Page page = new Page();
		Long pid = MongoCustom.generateMaxSeq(Page.class, db);
		Integer seq = (int) db.count(query, Page.class) + 1;
		
		page.setPid(pid);
		page.setSeq(seq);
		page.setCaption(caption);
		page.setBid(bookId);
		page.setUid(addBy);
		page.setCdate(System.currentTimeMillis());
		
		// generate picture to directory
		String pic = ImageUtils.generatePicture(picture, imgSize, cropPos, "u" + addBy + "/b" + bookId);
		page.setPic(pic);
		
		db.insert(page);		
		
		// update book (page count, 
		Update update = new Update();
		update.inc("pcount", 1);
		
		// set picture to cover image for seq = 1
		if (seq.intValue() == 1) {
			update.set("pic", pic);
		}
		db.updateFirst(query, update, Book.class);
		
		Page retPage = new Page();
		retPage.setPid(pid);
		retPage.setSeq(seq);
		retPage.setPic(pic);
		return retPage;
	}
	
	@Override
	public Boolean editCaption(Long pid, String caption) {
		Query query = new Query(Criteria.where("pid").is(pid));
		db.updateFirst(query, new Update().set("caption", caption), Page.class);
		return true;
	}

	@Override
	public Page edit(Long pid, Long uid, Long bid, Long date, String pic,
			String caption) {

		Criteria criteria = Criteria.where("pid").is(pid).and("bid").is(bid)
				.and("uid").is(uid);
		Query query = new Query(criteria);

		Update update = new Update();
		
		if(date!=null)
		update.set("date", date);
		update.set("pic", pic);
		
		if(caption!=null)
		update.set("caption", caption);

		return db.findAndModify(query, update,
				new FindAndModifyOptions().returnNew(true), Page.class);
	}
	
	@Override
	public void changeSeq(Long bid, Integer fromSeq, Integer toSeq) {
		int from = fromSeq.intValue();
		int to = toSeq.intValue();
		
		Criteria c = Criteria.where("bid").is(bid);
		boolean rev = false;
		if (fromSeq < toSeq) {
			c.andOperator(Criteria.where("seq").lte(toSeq), Criteria.where("seq").gte(fromSeq));			
		}
		else {
			c.andOperator(Criteria.where("seq").lte(fromSeq), Criteria.where("seq").gte(toSeq));
			rev = true;
		}
		
		Query query = new Query(c);
		
		query.fields().include("seq");
		query.sort().on("seq", Order.ASCENDING);
		List<Page> pages = db.find(query, Page.class);
		for (int i = 0; i < pages.size(); i++) {
			Page p = pages.get(i);
			int seq = p.getSeq().intValue();
			long pageId = p.getPid().longValue();
			Update update = new Update();
			
			if (!rev) {
				if (seq == from) { // change to new seq
					update.set("seq", to);
				}
				else {
					update.inc("seq", -1);
				}			
			}
			else {
				if (seq == from) { // change to new seq
					update.set("seq", to);
				}
				else {
					update.inc("seq", 1);
				}					
			}
			db.updateFirst(new Query(Criteria.where("pid").is(pageId)), update, Page.class);	
		}
	}

	@Override
	public Boolean delete(Long pid, Long bid) {
		Query query = new Query(Criteria.where("pid").is(pid));
		query.fields().include("pic");
		query.fields().include("seq");		
		Page page = db.findOne(query, Page.class);
		
		// Remove Page
		db.remove(query, Page.class);

		// Remove Image Files
		String filename = page.getPic();
		if (filename != null && filename != "")
			ImageUtils.deleteImageFile(filename, ConstValue.PAGE_IMG_TYPE);

		// Update page count
		query = new Query(Criteria.where("bid").is(bid));
		db.updateFirst(query, new Update().inc("pcount", -1), Book.class);
		
		// Re-sequence
		query = new Query(Criteria.where("bid").is(bid));
		query.fields().include("seq");
		query.sort().on("seq", Order.ASCENDING);
		List<Page> list = db.find(query, Page.class);
		for (int i = 0; i < list.size(); i++) {
			Page p = list.get(i);
			db.updateFirst(new Query(Criteria.where("pid").is(p.getPid())), new Update().set("seq", i + 1), Page.class);
		}

		return true;
	}

	@Override
	public List<Page> edit_seq(Long bid, Long uid, Long[] pid, Integer[] seq) {
		if (pid.length == seq.length) {
			Criteria criteria;
			Query query;
			Update update;
			for (int i = 0; i < pid.length; i++) {
				criteria = Criteria.where("pid").is(pid[i]).and("uid").is(uid)
						.and("bid").is(bid);
				query = new Query(criteria);
				update = new Update();
				update.set("seq", seq[i]);
				db.updateFirst(query, update, Page.class);
			}
			criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
			query = new Query(criteria);

			return db.find(query, Page.class);

		}

		return null;
	}
	
	public List<Page> findFollowingPages(Long uid,Integer skip,Integer limit) {
		return null;
//		try{	
//			
//			Criteria criteria = Criteria.where("uid").is(uid);
//			Query query = new Query(criteria);
//			User user = db.findOne(query,User.class);
//			Long[] followings  = user.getFollowing();
//			ArrayList<Long> arr = new ArrayList<Long>();
//			for(Long f : followings){
//				arr.add(f);
//			}
//			Criteria pcriteria = Criteria.where("uid").in(arr).and("pbdate").exists(true);;
//			Query pquery = new Query(pcriteria);
//			pquery.sort().on("cdate", Order.DESCENDING);
//			
//			if(skip!=null&&limit!=null&&limit!=0)
//			pquery.skip(skip).limit(limit);
//			
//			List<Page> pages = db.find(pquery, Page.class);
//			
//			for(Page page : pages){
//				Long cdate = page.getCdate();
//				page.setStrtime(TimeUtils.timefromNow(cdate,System.currentTimeMillis()));
//			}
//			
//			return pages;
//			
////				ArrayList<Page> fpages = new ArrayList<>();
////				
////				Criteria criteria = Criteria.where("uid").is(uid);
////				Query query = new Query(criteria);
////				query.fields().include("auid");
////				query.fields().include("auth");
////				List<Follow> follows = db.find(query, Follow.class);
////				
////				for(int i = 0;i<follows.size();i++){
////					
////					Follow follow = follows.get(i);
////					Long auid = follow.getAuid();
////					User author = follow.getAuth();
////					author.setUid(auid);
////					
////					Criteria pcriteria = Criteria.where("uid").is(auid).and("pbdate").exists(true);
////					Query pquery = new Query(pcriteria);
////
////					List<Page> pages = db.find(pquery, Page.class);
////					for(int j=0;j<pages.size();j++){
////						Page page = pages.get(j);
////						Long bid = page.getBid();
////						Book book = db.findOne(new Query(Criteria.where("bid").is(bid)), Book.class);
////						pages.get(j).setBook(book);
////						pages.get(j).setAuthor(author);
////						pages.get(j).setStrtime(TimeUtils.timefromNow(page.getCdate(),System.currentTimeMillis()));
////					}
////					fpages.addAll(pages);
////				}
////				
////				Collections.sort(fpages, new Comparator<Page>() {
////					@Override
////					public int compare(Page page1, Page page2) {
////						if(page1.getCdate()>page2.getCdate()){
////							return -1;
////						}
////						else if(page1.getCdate()<page2.getCdate()){
////							return 1;
////						}
////						else{
////							return 0;
////						}
////					}
////			    });
////				
////				
////				return fpages;
//			}
//		catch(Exception e){
//			System.out.println(e);
//			return null;
//		}
	}

}
