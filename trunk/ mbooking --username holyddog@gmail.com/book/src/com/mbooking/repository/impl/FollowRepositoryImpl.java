package com.mbooking.repository.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Follow;
import com.mbooking.model.Notification;
import com.mbooking.model.User;
import com.mbooking.repository.FollowRepostitoryCustom;
import com.mbooking.util.PushNotification;
import com.urbanairship.api.push.model.audience.Selectors;

public class FollowRepositoryImpl implements FollowRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean followAuthor(Long uid, Long auid) {	
		try {
			Long now = System.currentTimeMillis();
			
			Follow follow = new Follow();
			follow.setAuid(auid);
			follow.setUid(uid);
			follow.setFdate(now);
			db.insert(follow);
			
			db.updateFirst(new Query(Criteria.where("uid").is(auid)), new Update().inc("fcount", 1), User.class);
			
			Update update = new Update();
			update.push("following", auid);
			update.inc("fgcount", 1);
			
			FindAndModifyOptions opt = FindAndModifyOptions.options().returnNew(true);
			User foll = db.findAndModify(new Query(Criteria.where("uid").is(uid)), update, opt, User.class);
			
			if(db.count(new Query(Criteria.where("uid").is(uid).and("everfoll").in(auid)),User.class)==0){
				Notification notf = new Notification();
				notf.setUid(auid);
				notf.setAdate(System.currentTimeMillis());
				notf.setUnread(true);
				
				User who = new User();
				who.setUid(foll.getUid());
				who.setDname(foll.getDname());
				who.setPic(foll.getPic());
				notf.setWho(who);
				
				String fullMessage = String.format(ConstValue.NEW_FOLLOWER_MSG_FORMAT_EN, foll.getDname());
				notf.setMessage(fullMessage);
				notf.setNtype(ConstValue.NEW_FOLLOWER);
				db.insert(notf);
				
			    User author = db.findOne(new Query(Criteria.where("uid").is(auid)),User.class);
				HashMap<String, String> map = new HashMap<String, String>();
				map.put("page", "Profile");
				map.put("followid",uid+"");
				PushNotification.sendPush(String.format(ConstValue.NEW_FOLLOWER_MSG_FORMAT_PUSH_EN, foll.getDname()), Selectors.alias(author.getEmail()), null, map);

			}
			return true;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public Boolean unfollowAuthor(Long uid, Long auid) {
		try {
			db.remove(new Query(Criteria.where("uid").is(uid).and("auid").is(auid)), Follow.class);
			db.updateFirst(new Query(Criteria.where("uid").is(auid)), new Update().inc("fcount", -1), User.class);
			
			Update update = new Update();
			update.pull("following", auid);
			update.inc("fgcount", -1);
			
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);

			
			if(db.count(new Query(Criteria.where("uid").is(uid).and("everfoll").in(auid)),User.class)==0){
				update = new Update();
				update.push("everfoll", auid);
				db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			}
			
			return true;

		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}

	@Override
	public Boolean isFollow(Long uid, Long auid) {		
		return db.count(new Query(Criteria.where("auid").is(auid).and("uid").is(uid)), Follow.class) > 0;
	}

	@Override
	public List<User> getFollowing(Long uid) {
		List<Follow> follows = db.find(new Query(Criteria.where("uid").is(uid)), Follow.class);
		List<User> users = new ArrayList<User>();
		for (int i = 0; i < follows.size(); i++) {
			Follow f = follows.get(i);
			Query query = new Query(Criteria.where("uid").is(f.getAuid()));
			query.fields().include("dname").include("uname").include("pic").include("pbcount");
			users.add(db.findOne(query, User.class));			
		}
		return users;
	}

	@Override
	public List<User> getFollowers(Long uid) {
		List<Follow> follows = db.find(new Query(Criteria.where("auid").is(uid)), Follow.class);
		List<User> users = new ArrayList<User>();
		for (int i = 0; i < follows.size(); i++) {
			Follow f = follows.get(i);
			Query query = new Query(Criteria.where("uid").is(f.getUid()));
			query.fields().include("dname").include("uname").include("pic").include("pbcount");
			users.add(db.findOne(query, User.class));			
		}
		return users;
	}
}
