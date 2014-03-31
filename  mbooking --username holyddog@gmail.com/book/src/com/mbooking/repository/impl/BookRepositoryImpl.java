package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

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
	public Book create(String title, String desc, Long fdate, Long tdate,
			String[] tags, Long uid, String pic) {

		Book book = new Book();

		Long bid = MongoCustom.generateMaxSeq(Book.class, db);
		book.setBid(bid);

		book.setTitle(title);
		book.setDesc(desc);
		book.setUid(uid);
		
		if(fdate!=null)
		book.setFdate(fdate);
		
		if(tdate!=null)
		book.setTdate(tdate);
		
		if(tags!=null)
		book.setTags(tags);
		
		if(pic!=null)
		book.setPic(pic);

		Criteria criteria = Criteria.where("uid").is(uid);
		Query query = new Query(criteria);
		Integer seq = (int) db.count(query, Book.class) + 1;

		book.setSeq(seq);

		db.insert(book);

		Book rbook = new Book();
		rbook.setBid(bid);
		rbook.setTitle(title);

		return rbook;
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
		
		if(tags!=null)
		update.set("tags", tags);
		
		if(pic!=null)
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
					ImageUtils.deleteImageFile(filename, true);
				}
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
	public Boolean publish_book(Long bid, Long uid) {
		Long current_time = System.currentTimeMillis();
		try {
			Criteria criteria = Criteria.where("bid").is(bid).and("uid")
					.is(uid);
			Query query = new Query(criteria);
			Update update = new Update();
			update.set("pbdate", current_time);

			db.updateFirst(query, update, Book.class);
			return true;
		} catch (Exception e) {
			System.out.println("Publish Book Service error: " + e);
			return false;
		}
	}

	@Override
	public Boolean unpublish_book(Long bid, Long uid) {
		try {
			Criteria criteria = Criteria.where("bid").is(bid).and("uid")
					.is(uid);
			Query query = new Query(criteria);
			Update update = new Update();
			update.unset("pbdate");

			db.updateFirst(query, update, Book.class);
			return true;
		} catch (Exception e) {
			System.out.println("Unpublish Book Service error: " + e);
			return false;
		}
	}

	@Override
	public List<Book> findLastBookByUid(Long uid) {
		Query query = new Query(Criteria.where("uid").is(uid));
		query.sort().on("pbdate", Order.DESCENDING);
		query.skip(0).limit(3);
		query.fields().include("title").include("pic");
		return db.find(query, Book.class);
	}
}
