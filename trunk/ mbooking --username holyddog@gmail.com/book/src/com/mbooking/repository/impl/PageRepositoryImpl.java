package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.Page;
import com.mbooking.repository.PageRepostitoryCustom;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.MongoCustom;

public class PageRepositoryImpl implements PageRepostitoryCustom {

	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean create(Long bid, Long uid, Long date, String pic, String caption) {
		Page page = new Page();
		try {
			Long pid = MongoCustom.generateMaxSeq(Page.class, db);
			page.setBid(pid);

			page.setBid(bid);
			page.setCaption(caption);
			page.setDate(date);

			String img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER+uid+"/"+ConstValue.BOOK_FOLDER+bid, pic, true);
			pic = img_path;

			page.setPic(pic);

			Criteria criteria = Criteria.where("bid").is(bid).and("uid").is(uid);
			Query query = new Query(criteria);
			Integer seq = (int) db.count(query, Page.class) + 1;

			page.setSeq(seq);

			db.insert(page);

			if (seq == 1) {
				Update update = new Update();
				update.set("pic", pic);
				db.updateFirst(query, update, Book.class);
			}

			Update update = new Update();
			update.set("pcount", seq);

			db.updateFirst(query, update, Book.class);

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
		update.set("date", date);
		update.set("pic", pic);
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

}
