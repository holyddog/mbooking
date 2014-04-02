package com.mbooking.repository.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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
import com.mbooking.model.Follow;
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.PageRepostitoryCustom;
import com.mbooking.util.Convert;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class PageRepositoryImpl implements PageRepostitoryCustom {

	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean create(Long bid, Long uid, Long date, String pic, String caption) {
		Page page = new Page();
		try {
			
			page.setBid(bid);
			
			if(caption!=null)
			page.setCaption(caption);
			
			if(date!=null)
			page.setDate(date);
			
			Long create_date = System.currentTimeMillis(); 
		
			page.setCdate(create_date);
			page.setUid(uid);
			
			if(pic!=null&&!pic.equals("")&&!pic.equals("undefined"))
			{
				String img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER+uid+"/"+ConstValue.BOOK_FOLDER+bid, pic, true);
				pic = img_path;
				page.setPic(pic);
			}
			
			Criteria criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
			Query query = new Query(criteria);
			Integer seq = (int) db.count(query, Page.class) + 1;

			page.setSeq(seq);

			Long pid = MongoCustom.generateMaxSeq(Page.class, db);
			page.setPid(pid);
			db.insert(page);

			if (seq == 1&&pic!=null&&!pic.equals("")&&!pic.equals("undefined")) {
				Update update = new Update();
				update.set("pic", pic);
				db.updateFirst(query, update, Book.class);
			}

			Update update = new Update();
			int pcount = (int)db.count(new Query(Criteria.where("bid").is(bid)), Page.class);
			update.set("pcount", pcount);
			update.set("ledate", create_date);
			
			db.updateFirst(query, update, Book.class);

			Update user_update = new Update();
			user_update.set("leb", bid);
			
			Book book = db.findOne(new Query(Criteria.where("bid").is(bid)), Book.class);
			if(book!=null){
				String btitle = book.getTitle();
				String bpic = book.getPic();
				
				if(btitle!=null&&!btitle.isEmpty()&&!btitle.equals("")&&!btitle.equals("undefined")){
					user_update.set("lebt", btitle);
				}
				if(bpic!=null&&!bpic.isEmpty()&&!bpic.equals("")&&!bpic.equals("undefined")){
					user_update.set("lebp", bpic);
				}
			}
			
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), user_update, User.class);
			
		} catch (Exception e) {
			System.out.println("Create page arr: " + e);
			return false;
		}
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
	public Boolean delete(Long pid, Long bid, Long uid) {
		Criteria criteria = Criteria.where("pid").is(pid).and("bid").is(bid)
				.and("uid").is(uid);
		Query query = new Query(criteria);

		try {
			
			query.fields().include("pic");
			query.fields().include("seq");
			
			Page page = db.findOne(query, Page.class);
			
			
			
			// Remove Page
			db.remove(query, Page.class);

			// Remove Image Files
			String filename = page.getPic();
			if (filename != null && filename != "")
				ImageUtils.deleteImageFile(filename, true);

			// Update pcount
			criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
			query = new Query(criteria);
			Integer pcount = (int) db.count(query, Page.class);
			Update update = new Update();
			update.set("pcount", pcount);
			db.updateFirst(query, update, Book.class);
			
		} catch (Exception e) {

			System.out.println("Delete page err :" + e);
			return false;
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
	
	public List<Page> findFollowingPages(Long uid) {
		try{	
				ArrayList<Page> fpages = new ArrayList<>();
				
				Criteria criteria = Criteria.where("uid").is(uid);
				Query query = new Query(criteria);
				query.fields().include("auid");
				query.fields().include("auth");
				List<Follow> follows = db.find(query, Follow.class);
				
				for(int i = 0;i<follows.size();i++){
					
					Follow follow = follows.get(i);
					Long auid = follow.getAuid();
					User author = follow.getAuth();
					author.setUid(auid);
					
					Criteria pcriteria = Criteria.where("uid").is(auid).and("pbdate").exists(true);
					Query pquery = new Query(pcriteria);

					List<Page> pages = db.find(pquery, Page.class);
					for(int j=0;j<pages.size();j++){
						Page page = pages.get(j);
						Long bid = page.getBid();
						Book book = db.findOne(new Query(Criteria.where("bid").is(bid)), Book.class);
						pages.get(j).setBook(book);
						pages.get(j).setAuthor(author);
						pages.get(j).setStrtime(TimeUtils.timefromNow(page.getCdate(),System.currentTimeMillis()));
					}
					fpages.addAll(pages);
				}
				
				Collections.sort(fpages, new Comparator<Page>() {
					@Override
					public int compare(Page page1, Page page2) {
						if(page1.getCdate()>page2.getCdate()){
							return -1;
						}
						else if(page1.getCdate()<page2.getCdate()){
							return 1;
						}
						else{
							return 0;
						}
					}
			    });
				
				
				return fpages;
			}
		catch(Exception e){
			System.out.println(e);
			return null;
		}
	}

}
