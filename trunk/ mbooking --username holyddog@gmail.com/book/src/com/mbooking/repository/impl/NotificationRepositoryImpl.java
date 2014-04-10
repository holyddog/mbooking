package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Notification;
import com.mbooking.repository.NotificationRepositoryCustom;
import com.mbooking.util.MongoCustom;

public class NotificationRepositoryImpl implements NotificationRepositoryCustom{
	@Autowired
	private static MongoTemplate db;


	public static Boolean sendNewFollowerNotification(Long uid, Long follid,
			String dname, String pic) {

		try{
			Notification notification = new Notification();
			Long ntid = MongoCustom.generateMaxSeq(Notification.class, db);
			notification.setNtid(ntid);
			notification.setUid(uid);
			notification.setFollid(follid);
			notification.setAdate(System.currentTimeMillis());
			notification.setPic(pic);
			notification.setDname(dname);
			notification.setMessage(String.format(ConstValue.NEW_FOLLOWER_MSG_FORMAT_EN, dname));
			notification.setNtype(ConstValue.NEW_FOLLOWER);
			db.insert(notification);
			
			return true;
		}
		catch(Exception e){
			return false;
		}
	}


	public static Boolean sendCommentFromFollowerNotification(Long uid, Long bid,
			String dname, String pic, String comment, String bname, String bpic) {
		try{
			Notification notification = new Notification();
			Long ntid = MongoCustom.generateMaxSeq(Notification.class, db);
			notification.setNtid(ntid);
			
			notification.setUid(uid);
		
			notification.setBid(bid);
			notification.setBname(bname);
			notification.setBpic(bpic);
			
			notification.setAdate(System.currentTimeMillis());
		
			notification.setPic(pic);
			notification.setDname(dname);
			notification.setMessage(String.format(ConstValue.FOLLOWER_COMMENT_MSG_FORMAT_EN, dname,bname,comment));
			
			notification.setNtype(ConstValue.FOLLOWER_COMMENT);
			
			db.insert(notification);
			
			return true;
		}
		catch(Exception e){
			return false;
		}
	}

	@Override
	public Boolean hadBeenRead(Long ntid) {
		try{
			Update update = new Update();
			update.set("hide",true);
			db.updateFirst(new Query(Criteria.where("ntid").is(ntid)), update, Notification.class);
			return true;
		}
		catch(Exception e){
			return false;
		}
	}

	@Override
	public List<Notification> findNotificationsByUid(Long uid,Integer skip, Integer limit) {
		
		Query query = new Query(Criteria.where("uid").is(uid).and("hide").exists(false));
		query.sort().on("adate",Order.DESCENDING);
		
		if(skip!=null&&limit!=null&&limit!=0)
		{
			query.skip(skip);
			query.limit(limit);
		}
		return db.find(query, Notification.class);
	}


}
