package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.model.Activity;
import com.mbooking.model.Book;
import com.mbooking.model.User;
import com.mbooking.repository.ActivityRepostitoryCustom;
import com.mbooking.util.TimeUtils;

public class ActivityRepositoryImpl implements ActivityRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public void published(Long uid, Long bid) {
		Long now = System.currentTimeMillis();
		
		User user = getUser(uid);
		
		Activity act = new Activity();
		act.setType(Activity.PUBLISHED);
		act.setAdate(now);
		act.setMessage(getMessage(Activity.PUBLISHED, new String[] { user.getDname() }));
		act.setUid(uid);
		act.setUser(user);
		act.setBid(bid);
		
		db.insert(act);
	}

	@Override
	public void newPage(Long uid, Long bid) {
		Book book = getBook(bid);
		if (book.getPbdate() == null) {
			return;
		}
		
		Long now = System.currentTimeMillis();
		
		Query query = new Query(Criteria.where("type").is(Activity.NEW_PAGE).and("uid").is(uid).and("book._id").is(bid));
		query.fields().include("pcount");
		Activity act = db.findOne(query, Activity.class);

		User user = getUser(uid);
		if (act != null) {
			Integer pcount = (act.getPcount().intValue() + 1);
			String message = getMessage(Activity.NEW_PAGE, new String[] { user.getDname(), pcount.toString() });
			Update update = new Update().inc("pcount", 1).set("message", message).set("adate", now);
			db.updateFirst(query, update, Activity.class);
		}
		else {			
			Activity a = new Activity();
			a.setType(Activity.NEW_PAGE);
			a.setAdate(now);
			a.setMessage(getMessage(Activity.NEW_PAGE, new String[] { user.getDname(), "1" }));
			a.setUid(uid);
			a.setBid(bid);
			a.setUser(user);
			
			a.setPcount(1);
			
			db.insert(a);				
		}
	}

	@Override
	public void liked(Long uid, Long bid) {
		Long now = System.currentTimeMillis();
		
		Query query = new Query(Criteria.where("type").is(Activity.LIKED).and("uid").is(uid).and("bid").is(bid));
		long count = db.count(query, Activity.class);
		
		// insert like activity at first time
		if (count == 0) {
			User user = getUser(uid);
			
			Activity act = new Activity();
			act.setType(Activity.LIKED);
			act.setAdate(now);
			act.setMessage(getMessage(Activity.LIKED, new String[] { user.getDname() }));
			act.setUid(uid);
			act.setUser(user);
			act.setBid(bid);
			
			db.insert(act);			
		}
	}

	@Override
	public void favourite(Long uid, Long bid) {
		Long now = System.currentTimeMillis();
		
		Query query = new Query(Criteria.where("type").is(Activity.FAVOURITE).and("uid").is(uid).and("bid").is(bid));
		long count = db.count(query, Activity.class);
		
		// insert like activity at first time
		if (count == 0) {
			User user = getUser(uid);
			
			Activity act = new Activity();
			act.setType(Activity.FAVOURITE);
			act.setAdate(now);
			act.setMessage(getMessage(Activity.FAVOURITE, new String[] { user.getDname() }));
			act.setUid(uid);
			act.setUser(user);
			act.setBid(bid);
			
			db.insert(act);			
		}
	}

	@Override
	public void startedFollowing(Long uid, Long who) {
		Long now = System.currentTimeMillis();
		
		Query query = new Query(Criteria.where("type").is(Activity.NEW_FOLLOWING).and("uid").is(uid).and("who._id").is(who));
		long count = db.count(query, Activity.class);
		
		// insert like activity at first time
		if (count == 0) {
			User user = getUser(uid);
			User foll = getUser(who);
			
			Activity act = new Activity();
			act.setType(Activity.NEW_FOLLOWING);
			act.setAdate(now);
			act.setMessage(getMessage(Activity.NEW_FOLLOWING, new String[] { user.getDname() }));
			act.setUid(uid);
			act.setUser(user);
			act.setWho(foll);
			
			db.insert(act);			
		}
	}

	@Override
	public void commented(Long uid, Long bid, String comment) {
		Long now = System.currentTimeMillis();
		
		User user = getUser(uid);
		
		Activity act = new Activity();
		act.setType(Activity.COMMENTED);
		act.setAdate(now);
		act.setMessage(getMessage(Activity.COMMENTED, new String[] { user.getDname() }));
		act.setUid(uid);
		act.setUser(user);
		act.setBid(bid);
		act.setComment(comment);
		
		db.insert(act);
	}
	
	private User getUser(Long uid) {
		Query query = new Query(Criteria.where("uid").is(uid));
		query.fields().include("dname").include("uname").include("pic");
		return db.findOne(query, User.class);
	}
	
	private Book getBook(Long bid) {
		Query query = new Query(Criteria.where("bid").is(bid));
		query.fields().include("title").include("pic").include("pcount").include("key").include("lcount").include("ccount").include("pbdate").include("author");
		return db.findOne(query, Book.class);
	}
	
	private String getMessage(int type, String[] args) {
		switch (type) {
			case Activity.PUBLISHED: {
				return "<b>" + args[0] + "</b> published a story";
			}
			case Activity.NEW_PAGE: {
				int count = Integer.parseInt(args[1]);
				if (count > 1) {
					return "<b>" + args[0] + "</b> added a new page";					
				}
				else {
					return "<b>" + args[0] + "</b> added " + count + " new pages";
				}
			}
			case Activity.LIKED: {
				return "<b>" + args[0] + "</b> liked a story";
			}
			case Activity.FAVOURITE: {
				return "<b>" + args[0] + "</b> added to favourites";
			}
			case Activity.NEW_FOLLOWING: {
				return "<b>" + args[0] + "</b> started following";
			}
			case Activity.COMMENTED: {
				return "<b>" + args[0] + "</b> commented on a story";
			}
		}
		return null;
	}

	@Override
	public List<Activity> findFollowActivities(Long uid, Integer start, Integer limit) {
		Query query = new Query(Criteria.where("uid").is(uid));
		query.fields().include("following");
		User user = db.findOne(query, User.class);
		if (user.getFollowing() != null && user.getFollowing().length > 0) {			
			query = new Query(Criteria.where("uid").in(user.getFollowing()));
			query.sort().on("adate", Order.DESCENDING);
			query.skip(start).limit(limit);
			
			long now = System.currentTimeMillis();
			List<Activity> list = db.find(query, Activity.class);
			for (int i = 0; i < list.size(); i++) {
				Activity a = list.get(i);
				a.setBook(getBook(a.getBid()));
				a.setDateStr(TimeUtils.timefromNow(a.getAdate(), now));				
			}	
			return list;
		}
		
		return null;
	}
}
