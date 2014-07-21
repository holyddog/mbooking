package com.mbooking.repository.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.Favourite;
import com.mbooking.model.Like;
import com.mbooking.model.Notification;
import com.mbooking.model.Page;
import com.mbooking.model.Tag;
import com.mbooking.model.User;
import com.mbooking.model.View;
import com.mbooking.repository.ActivityRepository;
import com.mbooking.repository.BookRepostitoryCustom;
import com.mbooking.util.ConfigReader;
import com.mbooking.util.Convert;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.PushNotification;
import com.urbanairship.api.push.model.audience.Selectors;

public class BookRepositoryImpl implements BookRepostitoryCustom {

	@Autowired
	private MongoTemplate db;
	@Autowired
	ActivityRepository actRepo;
	
	private String genKey() {
		String key = Convert.uniqueString(10);
		while (db.findOne(new Query(Criteria.where("key").is(key)), Book.class) != null) {
			key = Convert.uniqueString(10);
		}
		return key;
	}

	@Override
	public Book create(Long bookId, String title, String desc, Long fdate, Long tdate,
			String[] tags, Long uid, String pic, Boolean pub) {
		
		if (bookId != null) {			
			Query query = new Query(Criteria.where("bid").is(bookId));
			query.fields().include("title");
			query.fields().include("desc");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("pub");
			
			Update update = new Update();
			update.set("title", title);
			update.set("desc", desc);
			update.set("pub", pub);
			
			Book b = db.findAndModify(query, update, new FindAndModifyOptions().returnNew(true),Book.class);			
			return b;
		}
		else {
//			Book book = new Book();
//
//			Long bid = MongoCustom.generateMaxSeq(Book.class, db);
//			book.setBid(bid);
//	
//			book.setTitle(title);
//			book.setDesc(desc);
//			book.setUid(uid);
//	
//			book.setLedate(System.currentTimeMillis());
//	
//			if (fdate != null)
//				book.setFdate(fdate);
//	
//			if (tdate != null)
//				book.setTdate(tdate);
//	
//			if (tags != null && tags.length != 0)
//				book.setTags(tags);
//	
//			if (pic != null && !pic.equals("") && !pic.equals("undefined"))
//				book.setPic(pic);
//	
//			Criteria criteria = Criteria.where("uid").is(uid);
//			Query query = new Query(criteria);
//			Integer seq = (int) db.count(query, Book.class) + 1;
//	
//			book.setSeq(seq);
//	
//			db.insert(book);
//	
//			Book rbook = new Book();
//			rbook.setBid(bid);
//			rbook.setTitle(title);
//	
//			int tcount = (int) db.count(query, Book.class);
//			Update user_update = new Update();
//			user_update.set("tcount", tcount);
//	
//			Book b = new Book();
//			b.setBid(bid);
//			b.setTitle(book.getTitle());
//			b.setPic(book.getPic());
//	
//			user_update.set("leb", b);
//	
//			db.updateFirst(query, user_update, User.class);
			
			// create book object with data
			Book book = new Book();
			Long bid = MongoCustom.generateMaxSeq(Book.class, db);
			
			book.setKey(genKey());
			book.setBid(bid);	
			book.setTitle(title);
			book.setDesc(desc);
			book.setUid(uid);
			book.setPub(pub);

			Query query = new Query(Criteria.where("uid").is(uid));
			query.fields().include("dname").include("uname").include("pic");
			User user = db.findOne(query, User.class);
			book.setAuthor(user);
			
			db.insert(book);
			
			// update book count to author (User.class)
			Update update = new Update();
			// set draft book count
			update.inc("drcount", 1);
			db.updateFirst(query, update, User.class);
			
			return book;
		}
	}

	@Override
	public Book edit(Long bid, String title, String desc, Long fdate,
			Long tdate, String[] tags, Long uid, String pic) {

		Criteria criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
		Query query = new Query(criteria);

		Update update = new Update();
		update.set("title", title);
		update.set("desc", desc);
		
		if(fdate!=null)
		update.set("fdate", fdate);
		
		if(tdate!=null)
		update.set("tdate", tdate);
		
		if(tags!=null&&tags.length!=0)
		update.set("tags", tags);
		
		if(pic!=null&&!pic.equals(""))
		update.set("pic", pic);

		return db.findAndModify(query, update,new FindAndModifyOptions().returnNew(true), Book.class);

	}

	@Override
	public Boolean delete(Long bid, Long uid) {
		try {
			Query query = new Query(Criteria.where("bid").is(bid));
			query.fields().include("pbdate").include("pub").include("pic");
			Book book = db.findOne(query, Book.class);
			
			query = new Query(Criteria.where("bid").is(bid).and("uid").is(uid));
			// Remove book
			db.remove(query, Book.class);
			
			// Remove pages
			db.remove(query, Page.class);
			
			// Update book count from author
			Update update = new Update();
			Query userQuery = new Query(Criteria.where("uid").is(uid));
			userQuery.fields().include("cover");
			User user = db.findOne(userQuery, User.class);
			if (user != null && book.getPic() != null &&  user.getCover().equals(book.getPic())) {
				update.unset("cover");
			}
			
			if (book.getPbdate() != null) {
				if (book.getPub() != null && book.getPub()) {
					db.updateFirst(userQuery, update.inc("pbcount", -1), User.class);					
				}				
				else {
					db.updateFirst(userQuery, update.inc("prcount", -1), User.class);						
				}
			}
			else {
				db.updateFirst(userQuery, update.inc("drcount", -1), User.class);				
			}
			
			// Remove book image files directory
			String dir = ConfigReader.getProp("upload_path") + "/u" + uid + "/b" + bid;
			FileUtils.deleteDirectory(new File(dir));
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	@Override
	public List<Book> edit_seq(Long[] bid, Integer[] seq, Long uid) {

		if (bid.length == seq.length) {
			Criteria criteria;
			Query query;
			Update update;
			for (int i = 0; i < bid.length; i++) {
				criteria = Criteria.where("bid").is(bid[i]).and("uid").is(uid);
				query = new Query(criteria);
				update = new Update();
				update.set("seq", seq[i]);
				db.updateFirst(query, update, Book.class);
			}
			criteria = Criteria.where("uid").is(uid);
			query = new Query(criteria);

			return db.find(query, Book.class);

		}

		return null;
	}

	@Override
	public Book findBookWithPages(Long bid, Long uid, Long gid, Boolean isCount) {
		try {
			Criteria criteria = Criteria.where("uid").is(uid);
			Query query = new Query(criteria);
			query.fields().include("dname");
			query.fields().include("pic");

			User user = db.findOne(query, User.class);

			criteria.and("bid").is(bid);
			query = new Query(criteria);
//			query.fields().include("title");
//			query.fields().include("desc");
//			query.fields().include("pic");
//			query.fields().include("pcount");
//			query.fields().include("pbdate");
//			query.fields().include("tags");
//			query.fields().include("lcount");
//			query.fields().include("ccount");
//			query.fields().include("pub");

			Book book = db.findOne(query, Book.class);

			query = new Query(Criteria.where("bid").is(bid));
			query.fields().include("seq");
			query.fields().include("pic");
			query.fields().include("caption");
			query.fields().include("ref");
			query.sort().on("seq", Order.ASCENDING);
			List<Page> pages = db.find(query, Page.class);

			book.setAuthor(user);
			book.setPages(pages);
			
			if (gid != null) {
				long count = db.count(new Query(Criteria.where("bid").is(bid).and("likes").is(gid)), Book.class);
				if (count > 0) {
					book.setLiked(true);
				}
				if (db.count(new Query(Criteria.where("bid").is(bid).and("uid").is(gid).and("inactive").exists(false)), Favourite.class) > 0) {
					book.setFaved(true);
				}
				
				if (gid.longValue() != uid.longValue() && isCount != null && isCount) {
					db.updateFirst(query, new Update().inc("vcount", 1), Book.class);
					Update up = new Update().inc("count", 1).set("ldate", System.currentTimeMillis());
					db.upsert(new Query(Criteria.where("bid").is(bid).and("uid").is(uid)), up, View.class);
//					db.upsert(query, new Update().set("tag", tag).inc("count", 1), Tag.class);
				}
			}

			return book;
		} catch (Exception e) {
			System.out.println("Find Book With Page Service error : " + e);
			return null;
		}
	}
	
	@Override
	public Book findBookWithPagesByBid(Long bid, String key) {
		try {
			Criteria criteria = null;
			if (bid != null) {
				criteria = Criteria.where("bid").is(bid);				
			}
			else {
				criteria = Criteria.where("key").is(key);
			}
			Query query = new Query(criteria);
			query.fields().include("title");
			query.fields().include("desc");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("pbdate");
			query.fields().include("uid");
			query.fields().include("lcount");
			query.fields().include("key");
			query.fields().include("ccount");

			Book book = db.findOne(query, Book.class);

			query = new Query(Criteria.where("bid").is(bid));
			query.fields().include("seq");
			query.fields().include("pic");
			query.fields().include("caption");
			query.sort().on("seq", Order.ASCENDING);
			List<Page> pages = db.find(query, Page.class);

			Criteria criteria_user = Criteria.where("uid").is(book.getUid());
			Query query_user = new Query(criteria_user);
			query_user.fields().include("dname");
			query_user.fields().include("pic");

			User user = db.findOne(query_user, User.class);
			
			book.setAuthor(user);
			book.setPages(pages);

			return book;
		} catch (Exception e) {
			System.out.println("Find Book With Page Service error : " + e);
			return null;
		}
	}

	@Override
	public User publishBook(Long bid, Long uid, String cover) {
		User user = null;
		try {
			// update book status to publish
			Criteria criteria = Criteria.where("bid").is(bid);
			Query query = new Query(criteria);
			Update update = new Update();
			update.set("pbdate", System.currentTimeMillis());

			db.updateFirst(query, update, Book.class);			
			
			int bookCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(true).and("pub").is(true)), Book.class);
			int draftCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(false)), Book.class);
			
			update = new Update();
			update.set("pbcount", bookCount);
			update.set("drcount", draftCount);
//			update.set("cover", cover);

			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			
			user = new User();
			user.setPbcount(bookCount);
			user.setDrcount(draftCount);
//			user.setCover(cover);
			
			Query bookq = new Query(Criteria.where("bid").in(bid));
			bookq.fields().include("title");
			bookq.fields().include("pub");
			Book book = db.findOne(bookq, Book.class);
			
			if(book!=null){
				if(book.getPub()){
					Query acptnotq = new Query(Criteria.where("recvnot").in(uid));
					acptnotq.fields().include("uid");
					acptnotq.fields().include("email");
					List<User> users = db.find(acptnotq,User.class);
					
					if(users!=null){
					
						Query whoq = new Query(Criteria.where("uid").is(uid));
						whoq.fields().include("uid");
						whoq.fields().include("dname");
						whoq.fields().include("pic");
						
						User who = db.findOne(whoq,User.class);
						
						for(int i=0;i<users.size();i++){
							User recvnot = users.get(i);
							
							Notification notf = new Notification();
							notf.setUid(recvnot.getUid());
							notf.setAdate(System.currentTimeMillis());
							notf.setUnread(true);
							notf.setWho(who);
							notf.setBook(book);
							
							String fullMessage = String.format(ConstValue.NEW_PUBLISH_BOOK_MSG_FORMAT_EN, who.getDname(),book.getTitle());
							notf.setMessage(fullMessage);
							notf.setNtype(ConstValue.NEW_PUBLISH_BOOK);
							db.insert(notf);
		
							HashMap<String, String> map = new HashMap<String, String>();
							map.put("page", "Book");
							map.put("bid",bid+"");
							map.put("uid",uid+"");
							PushNotification.sendPush(String.format(ConstValue.NEW_PUBLISH_BOOK_MSG_FORMAT_PUSH_EN, who.getDname(),book.getTitle()), Selectors.alias(recvnot.getEmail()), null, map);
			
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return user;
	}

	@Override
	public User unpublishBook(Long bid, Long uid) {
		User user = null;
		try {
			Criteria criteria = Criteria.where("bid").is(bid);
			Query query = new Query(criteria);
			Update update = new Update();
			update.unset("pbdate");

			db.updateFirst(query, update, Book.class);

			int bookCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(true)), Book.class);
			int draftCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(false)), Book.class);
			
			update = new Update();
			update.set("pbcount", bookCount);
			update.set("drcount", draftCount);
			
			query = new Query(Criteria.where("pbdate").exists(true));
			query.fields().include("pic");
			query.sort().on("pbdate", Order.DESCENDING);
			Book book = db.findOne(query, Book.class);
			
			user = new User();
			user.setPbcount(bookCount);
			user.setDrcount(draftCount);
			
			if (book != null) {
				update.set("cover", book.getPic());
				user.setCover(book.getPic());
			}
			else {
				update.unset("cover");
			}
			
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			
			return user;
		} catch (Exception e) {
			return user;
		}
	}

	@Override
	public List<Book> findLastBookByUid(Long uid) {
		Query query = new Query(Criteria.where("uid").is(uid).and("pbdate").exists(true));
		query.sort().on("pbdate", Order.DESCENDING);
		query.skip(0).limit(3);
		query.fields().include("title").include("pic");
		return db.find(query, Book.class);
	}

	@Override
	public List<Book> findByPbdateExists(boolean exists, Integer skip, Integer limit) {
		Criteria criteria = Criteria.where("pbdate").exists(exists).and("pub").is(true);
		Query query = new Query(criteria);

		query.sort().on("pbdate", Order.DESCENDING);
		query.fields().include("bid").include("title").include("pic").include("uid").include("pcount").include("ccount").include("key").include("lcount").include("author");

		if (skip != null && limit != null && limit != 0)
			query.skip(skip).limit(limit);

		List<Book> books = db.find(query, Book.class);
		return books;
	}	
	
	@Override
	public List<Book> findByPbdateExistsByTag(String tag, Integer skip, Integer limit) {
		Criteria criteria = Criteria.where("pbdate").exists(true).and("pub").is(true).and("tags").regex("^(?i)" + tag + "(?i)");
		Query query = new Query(criteria);

		query.sort().on("pbdate", Order.DESCENDING);
		query.fields().include("bid").include("title").include("pic").include("uid").include("pcount").include("ccount").include("key").include("lcount").include("author");

		if (skip != null && limit != null && limit != 0)
			query.skip(skip).limit(limit);

		List<Book> books = db.find(query, Book.class);
		return books;
	}
	
	public List<Book> findFollowingBooks(Long uid, Integer start, Integer limit) {
		try {
			Query query = new Query(Criteria.where("uid").is(uid));
			query.fields().include("following");
			User user = db.findOne(query, User.class);
			if (user.getFollowing() != null && user.getFollowing().length > 0) {			
				query = new Query(Criteria.where("uid").in(user.getFollowing()).and("pub").is(true).and("pbdate").exists(true));
				query.sort().on("pbdate", Order.DESCENDING);
				query.fields().include("title").include("pic").include("uid").include("pcount").include("author").include("ccount").include("lcount").include("key");
				query.skip(start).limit(limit);
				
				return db.find(query, Book.class);
			}
			
			return null;
			
//			Criteria criteria = Criteria.where("uid").is(uid);
//			Query query = new Query(criteria);
//			User user = db.findOne(query, User.class);
//			Long[] followings = user.getFollowing();
//
//			List<Long> auids = Arrays.asList(followings);
//			Query auquery = new Query(Criteria.where("uid").in(auids));
//			auquery.sort().on("uid", Order.ASCENDING);
//			auquery.fields().include("uid");
//			auquery.fields().include("dname");
//			auquery.fields().include("pic");

//			List<User> authors = db.find(auquery, User.class);
//			HashMap<Long, User> users_map = new HashMap<Long, User>();
//
//			for (int i = 0; i < authors.size(); i++) {
//				Long userid = authors.get(i).getUid();
//				users_map.put(userid, authors.get(i));
//			}

//			Criteria bcriteria = Criteria.where("uid").in(auids).and("pub").is(true).and("pbdate").exists(true);
//			Query bquery = new Query(bcriteria);
//			bquery.sort().on("pbdate", Order.DESCENDING);
//
//			if (skip != null && limit != null) {
//				bquery.skip(skip).limit(limit);
//			}
//
//			List<Book> books = db.find(bquery, Book.class);

//			for (Book book : books) {
//				Long pbdate = book.getPbdate();
//				book.setStrtime(TimeUtils.timefromNow(pbdate, System.currentTimeMillis()));
//				Long userid = book.getUid();
//				
//				if (users_map.containsKey(userid)) {
//					book.setAuthor(users_map.get(userid));
//				}
//
//			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public List<Book> findBooksByUid(Long uid,Integer pbstate,Integer skip,Integer limit) {
		
		Criteria criteria  = Criteria.where("uid").is(uid);
			
		if(pbstate!=null&&pbstate==1)
		criteria.and("pbdate").exists(true);
		
		if(pbstate!=null&&pbstate==2)
		criteria.and("pbdate").exists(false);
			
		Query query = new Query(criteria);
		
		if(pbstate==null || pbstate==0||pbstate==2)
			query.sort().on("ledate", Order.DESCENDING);
		else if(pbstate==1)
			query.sort().on("pbdate", Order.DESCENDING);
		
		
		if(skip!=null&&limit!=null&&limit!=0)
		query.skip(skip).limit(limit);
		
		query.fields().include("title").include("pic").include("pcount").include("ccount").include("lcount").include("key");
		return db.find(query, Book.class);
	
	}

	@Override
	public String findLastCover(Long uid) {
		Query query = new Query(Criteria.where("uid").is(uid).and("pbdate").exists(true));
		query.fields().include("pic");
		query.sort().on("pbdate", Order.DESCENDING);
		Book b = db.findOne(query, Book.class);
		return b.getPic();
	}

	@Override
	public Boolean changeCover(Long bid, String newCover) {
		Query query = new Query(Criteria.where("bid").is(bid));
		Update update = new Update();
		update.set("pic", newCover);
		db.updateFirst(query , update, Book.class);
		return true;
	}

	@Override
	public Boolean addTag(Long bid, String tags) {
		try {
			String[] tagArr = tags.split("[,]");
			for (int i = 0; i < tagArr.length; i++) {
				if (tagArr[i].trim().length() > 0) {
					insertTag(bid, tagArr[i].trim());					
				}
			}
//			db.upsert(new Query(Criteria.where("tag").is(tag)), new Update().set("tag", tag).inc("count", 1), Tag.class);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	private boolean insertTag(Long bid, String tag) {
		long count = db.count(new Query(Criteria.where("bid").is(bid).and("tags").regex("^(?i)" + tag + "(?i)")), Book.class);
		if (count > 0) {
			return false;
		}
		db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().push("tags", tag), Book.class);
		
		tag = tag.toLowerCase();
		if (db.count(new Query(Criteria.where("tag").is(tag)), Tag.class) > 0) {
			db.updateFirst(new Query(Criteria.where("tag").is(tag)), new Update().inc("count", 1), Tag.class);
		}
		else {
			Tag t = new Tag();
			t.setTag(tag);
			t.setCount(1);
			db.insert(t);
		}
		return true;
	}

	@Override
	public Boolean removeTag(Long bid, String tag) {
		try {
			db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().pull("tags", tag), Book.class);
			db.updateFirst(new Query(Criteria.where("tag").is(tag.toLowerCase())), new Update().inc("count", -1), Tag.class);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public List<Book> findBooksByTitle(String keyword) {
		Criteria criteria = Criteria.where("title").regex("^(?i)" + keyword + "(?i)").and("pbdate").exists(true).and("pub").is(true);
		Query query  = new Query(criteria);
		query.limit(50);
		query.fields().include("title").include("pic").include("key").include("ccount").include("pcount").include("ccount").include("lcount").include("author");
		return db.find(query, Book.class);
	}	

	@Override
	public List<Tag> findTags(String keyword) {
		Query query  = new Query(Criteria.where("tag").regex("^(?i)" + keyword + "(?i)"));
		query.limit(50);
		return db.find(query, Tag.class);
	}

	@Override
	public List<Book> findBooksByTag(String tag) {
		Query query  = new Query(Criteria.where("tags").is(tag).and("pbdate").exists(true).and("pub").is(true));
		query.fields().include("title").include("pic").include("key").include("ccount").include("pcount").include("ccount").include("lcount").include("author");
		return db.find(query, Book.class);		
	}

	@Override
	public Boolean likeBook(Long bid, Long who, boolean isLike) {
		try {
			if (isLike) {
				Book book = db.findAndModify(new Query(Criteria.where("bid").is(bid)), new Update().push("likes", who).inc("lcount", 1), FindAndModifyOptions.options().returnNew(true), Book.class);
				
				Update update = new Update().unset("inactive").set("ldate", System.currentTimeMillis());
				FindAndModifyOptions opt = FindAndModifyOptions.options().upsert(true).returnNew(false);
				Like oldLike = db.findAndModify(new Query(Criteria.where("bid").is(bid).and("uid").is(who)), update, opt, Like.class);
				
				Long auid = book.getUid();
				if (oldLike == null && auid.longValue() != who.longValue()) {
					actRepo.liked(who, bid);
					
					Notification notf = new Notification();
					notf.setUid(auid);
					notf.setAdate(System.currentTimeMillis());
					notf.setUnread(true);
					
					Book b = new Book();
					b.setBid(book.getBid());
					b.setPic(book.getPic());
					b.setTitle(book.getTitle());
					notf.setBook(b);
					
					Query q = new Query(Criteria.where("uid").is(who));
					q.fields().include("uid").include("dname").include("pic");
					User u = db.findOne(q, User.class);
					notf.setWho(u);
					
//					u.setUid(foll.getUid());
//					u.setDname(foll.getDname());
//					u.setPic(foll.getPic());
					
					String fullMessage = String.format(ConstValue.NEW_LIKE_MSG_FORMAT_EN, u.getDname(), book.getTitle());
					notf.setMessage(fullMessage);
					notf.setNtype(ConstValue.NEW_LIKE);
					
					db.insert(notf);
					
//					Query auth_q= new Query(Criteria.where("uid").is(auid));
//					auth_q.fields().include("email");
//					User author =  db.findOne(auth_q, User.class);
//					
//					HashMap<String, String> map = new HashMap<String, String>();
//					map.put("page", "Book");
//					map.put("bid", book.getBid()+"");
//					PushNotification.sendPush(String.format(ConstValue.NEW_LIKE_MSG_FORMAT_PUSH_EN, u.getDname(), book.getTitle()), Selectors.alias(author.getEmail()), null, map);
				}
			}
			else {
				db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().pull("likes", who).inc("lcount", -1), Book.class);
//				db.remove(new Query(Criteria.where("bid").is(bid).and("uid").is(who)), Like.class);
				
				db.updateFirst(new Query(Criteria.where("bid").is(bid).and("uid").is(who)), new Update().set("inactive", true), Like.class);
			}
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public Boolean favBook(Long bid, Long who, boolean fav) {
		Query query = new Query(Criteria.where("bid").is(bid).and("uid").is(who));
		if (fav) {
			Long now = System.currentTimeMillis();
			
			if (db.count(query, Favourite.class) > 0) {
				db.updateFirst(query, new Update().set("fdate", now).unset("inactive"), Favourite.class);
			}
			else {
				Favourite f = new Favourite();
				f.setBid(bid);
				f.setUid(who);
				f.setFdate(now);
				db.insert(f);
				
				actRepo.favourite(who, bid);
			}			
		}
		else {
			db.updateFirst(query, new Update().set("inactive", true), Favourite.class);
			
//			db.remove(query, Favourite.class);
		}
		return true;
	}
}
