package com.mbooking.repository.impl;

import java.io.File;
import java.util.ArrayList;
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
import com.mbooking.util.ConfigReader;
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
	public Page add(Long pid, String picture, Integer imgSize, Integer cropPos, String caption, String ref, Long bookId, Long addBy) {	
		if (pid == null) {	
			// insert new page data
			Page page = new Page();
			Page retPage = new Page();
			
			Query query = new Query(Criteria.where("bid").is(bookId));
			pid = MongoCustom.generateMaxSeq(Page.class, db);
			Integer seq = (int) db.count(query, Page.class) + 1;
			
			page.setPid(pid);
			page.setSeq(seq);
			page.setCaption(caption);
			page.setBid(bookId);
			page.setUid(addBy);
			page.setRef(ref);
			page.setCdate(System.currentTimeMillis());

            String imgPath = "u" + addBy + "/b" + bookId;
            String uploadPath = ConfigReader.getProp("upload_path") + "/" + imgPath;
            File file = null;
            if (picture.indexOf(";base64") == -1) {
            	file = new File(uploadPath + "/" + picture);
            }    
			
			// generate picture to directory
			Integer[] pos = new Integer[2];
			String pic = ImageUtils.generatePicture(file, picture, imgSize, cropPos, "u" + addBy + "/b" + bookId, pos);
			page.setPic(pic);
			page.setPos(pos);
			
			db.insert(page);		
			
			// update book (page count, 
			Update update = new Update();
			update.inc("pcount", 1);
			
			// set picture to cover image for seq = 1
			if (seq.intValue() == 1) {
				update.set("pic", pic);
			}
			db.updateFirst(query, update, Book.class);
			
			retPage.setSeq(seq);
			retPage.setPic(pic);			
			retPage.setPid(pid);
			return retPage;
		}
		else {
			Query query = new Query(Criteria.where("pid").is(pid));
            query.fields().include("seq").include("pic").include("pid");
            
            String imgPath = "u" + addBy + "/b" + bookId;
            String uploadPath = ConfigReader.getProp("upload_path") + "/" + imgPath;

            File file = null;
            if (picture.indexOf(";base64") == -1) {
            	file = new File(uploadPath + "/" + picture);
            }            
            
            Integer[] pos = new Integer[2];
            String newImage = ImageUtils.generatePicture(file, picture, imgSize, cropPos, imgPath, pos);
            
            Update update = new Update().set("pos", pos).set("caption", caption);
            if (file == null) {
            	update.set("pic", newImage);
            }
            
            if (ref != null && ref.trim().length() > 0) {
                    update.set("ref", ref);
            }
            
            Page retPage = db.findAndModify(query, update, new FindAndModifyOptions().returnNew(true), Page.class);
            return retPage;
			
//			Query query = new Query(Criteria.where("pid").is(pid));
//			query.fields().include("seq").include("pic").include("pid");
//			
//			String imgPath = "u" + addBy + "/b" + bookId;
//			String uploadPath = ConfigReader.getProp("upload_path") + "/" + imgPath;
//
//			
//			
//			Update update = new Update();
//			if(picture.length()>150){
//				String	pic = ImageUtils.generatePicture(null, picture, imgSize, cropPos, imgPath, null);
//				update.set("pic", pic);
//			}
//			else if(cropPos!=0){
//				/*File file = new File(uploadPath + "/" + picture);
//				Integer[] pos = new Integer[2];
//				String	pic = ImageUtils.generatePicture(file, picture, imgSize, cropPos, imgPath, pos);
//				update.set("pic", pic);
//				update.set("pos", pos);*/
//			}
//			
//			update.set("caption", caption);
//			if (ref != null && ref.trim().length() > 0) {
//				update.set("ref", ref);
//			}
//			
//			Page retPage = db.findAndModify(query, update, new FindAndModifyOptions().returnNew(true), Page.class);
//			return retPage;
		}
	}
	
	@Override
	public Boolean editCaption(Long pid, String caption) {
		Query query = new Query(Criteria.where("pid").is(pid));
		db.updateFirst(query, new Update().set("caption", caption), Page.class);
		return true;
	}

	@Override
	public Boolean addMulti(String pic,File file,Long bookId, Long addBy) {
		
		try{
		if(!pic.isEmpty()&&!ImageUtils.generatePictureUrl(file)){
			return false;
		}
		
		Query query = new Query(Criteria.where("bid").is(bookId));
		Page page = new Page();	
		Integer seq = (int) db.count(query, Page.class) + 1;
		Long pid = MongoCustom.generateMaxSeq(Page.class, db);
		page.setPid(pid);
		page.setSeq(seq);
		page.setBid(bookId);
		page.setUid(addBy);
		page.setCdate(System.currentTimeMillis());
				
		// generate picture to directory
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
		
		return true;
		}
		catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
		
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

	@Override
	public List<Page> addMultiPages(String pics, Long uid, Long bid) {
		List<Page> pages = new ArrayList<Page>();
		
		String[] picArr = pics.split("[|]");

		Query query = new Query(Criteria.where("bid").is(bid));
		
	    Integer seq = (int) db.count(query, Page.class) + 1;		
		Long now = System.currentTimeMillis();
		
    	String imgPath = "u" + uid + "/b" + bid;
		String uploadPath = ConfigReader.getProp("upload_path") + "/" + imgPath;
		
		String cover = null;
	    for (int i = 0; i < picArr.length; i++) {
	    	Long pid = MongoCustom.generateMaxSeq(Page.class, db);
	    	
	    	String str = uploadPath + "/" + picArr[i];
			Integer[] pos = new Integer[2];
	    	String img = ImageUtils.generatePicture(new File(str), picArr[i], 0, -999, imgPath, pos);
	    	
	    	Page page = new Page();
	    	page.setPid(pid);
	    	page.setPic(img);
	    	page.setPos(pos);
	    	
	    	if (seq.intValue() == 1) {
	    		cover = "/" + imgPath + "/" + picArr[i];
	    	}
	    	
	    	page.setSeq(seq++);
	    	page.setCdate(now);
	    	page.setBid(bid);
	    	page.setUid(uid);
	    	
	    	db.insert(page);
	    	
	    	pages.add(page);
	    }

	    // update book (page count, 
		Update update = new Update();
		update.set("pcount", seq - 1);
		
		if (cover != null) {
			update.set("pic", cover);
		}
		db.updateFirst(query, update, Book.class);
		
		return pages;
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
