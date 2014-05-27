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
import com.mbooking.repository.BookRepostitoryCustom;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.MongoCustom;

public class BookRepositoryImpl implements BookRepostitoryCustom {

	@Autowired
	private MongoTemplate db;

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

		Criteria criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
		Query query = new Query(criteria);
		query.fields().include("pic");

		List<Page> pages = db.find(query, Page.class);

		try {
			// Remove Pages
			db.remove(query, Page.class);

			// Remove Book
			db.remove(query, Book.class);

			// Remove Image Files
			for (int i = 0; i < pages.size(); i++) {

				String filename = pages.get(i).getPic();
				if (filename != null && filename != "") {
					ImageUtils.deleteImageFile(filename, ConstValue.PAGE_IMG_TYPE);
				}
			}
			
			Query user_query = new Query(Criteria.where("uid").is(uid));
			
			User user = db.findOne(user_query,User.class);
			
			if (user != null) {
				int tcount = (int) db.count(user_query, Book.class);

				Update user_update = new Update();

				user_update.set("tcount", tcount);

				if (user.getLeb() != null && user.getLeb().getBid().longValue() == bid.longValue()) {
					Query book_query = new Query(Criteria.where("uid").is(uid));
					book_query.fields().include("ledate");
					book_query.fields().include("bid");
					book_query.fields().include("title");
					book_query.fields().include("pic");
					book_query.sort().on("ledate", Order.DESCENDING);
					Book book = db.findOne(book_query, Book.class);

					if (book != null) {
						Book b = new Book();
						b.setBid(bid);
						b.setTitle(book.getTitle());
						b.setPic(book.getPic());
						user_update.set("leb", b);
						
//						user_update.set("leb", book.getBid());
//
//						String btitle = book.getTitle();
//						String bpic = book.getPic();
//
//						if (btitle != null && !btitle.isEmpty()
//								&& !btitle.equals("")
//								&& !btitle.equals("undefined")) {
//							user_update.set("lebt", btitle);
//						}
//						if (bpic != null && !bpic.isEmpty() && !bpic.equals("")
//								&& !bpic.equals("undefined")) {
//							user_update.set("lebp", bpic);
//						}

					}
				}

				db.updateFirst(user_query, user_update, User.class);
			}
		} catch (Exception e) {

			System.out.println("Delete book err :" + e);
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
	public Book findBookWithPages(Long bid, Long uid) {
		try {
			Criteria criteria = Criteria.where("uid").is(uid);
			Query query = new Query(criteria);
			query.fields().include("dname");
			query.fields().include("pic");

			User user = db.findOne(query, User.class);

			criteria.and("bid").is(bid);
			query = new Query(criteria);
			query.fields().include("title");
			query.fields().include("desc");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("pbdate");
			query.fields().include("tags");

			Book book = db.findOne(query, Book.class);

			query = new Query(Criteria.where("bid").is(bid));
			query.fields().include("seq");
			query.fields().include("pic");
			query.fields().include("caption");
			query.sort().on("seq", Order.ASCENDING);
			List<Page> pages = db.find(query, Page.class);

			book.setAuthor(user);
			book.setPages(pages);

			return book;
		} catch (Exception e) {
			System.out.println("Find Book With Page Service error : " + e);
			return null;
		}
	}
	
	@Override
	public Book findBookWithPagesByBid(Long bid) {
		try {
			Criteria criteria = Criteria.where("bid").is(bid);
			Query query = new Query(criteria);
			query.fields().include("title");
			query.fields().include("desc");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("pbdate");
			query.fields().include("uid");

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
			
			int bookCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(true)), Book.class);
			int draftCount = (int) db.count(new Query(Criteria.where("uid").is(uid).and("pbdate").exists(false)), Book.class);
			
			update = new Update();
			update.set("pbcount", bookCount);
			update.set("drcount", draftCount);
			update.set("cover", cover);

			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			
			user = new User();
			user.setPbcount(bookCount);
			user.setDrcount(draftCount);
			user.setCover(cover);
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
		query.fields().include("bid").include("title").include("pic").include("uid").include("pcount").include("author");

		if (skip != null && limit != null && limit != 0)
			query.skip(skip).limit(limit);

		List<Book> books = db.find(query, Book.class);

//		HashMap<Long, User> authors_map = new HashMap<Long, User>();
//		for (int i = 0; i < books.size(); i++) {
//			Long uid = books.get(i).getUid();
//			if (authors_map.get(uid) == null) {
//				Query user_query = new Query(Criteria.where("uid").is(uid));
//				user_query.fields().include("uid");
//				user_query.fields().include("pic");
//				user_query.fields().include("dname");
//				User user = db.findOne(user_query, User.class);
//				authors_map.put(uid, user);
//			}
//			User author = authors_map.get(uid);
//			if (author != null) {
//				books.get(i).setAuthor(author);
//			}
//		}

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
				query.fields().include("title").include("pic").include("uid").include("pcount").include("author");
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
		
		query.fields().include("title").include("pic").include("pcount");
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
	public Boolean addTag(Long bid, String tag) {
		try {
			long count = db.count(new Query(Criteria.where("bid").is(bid).and("tags").is(tag)), Book.class);
			if (count > 0) {
				return false;
			}
			db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().push("tags", tag), Book.class);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public Boolean removeTag(Long bid, String tag) {
		try {
			db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().pull("tags", tag), Book.class);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}	
}
