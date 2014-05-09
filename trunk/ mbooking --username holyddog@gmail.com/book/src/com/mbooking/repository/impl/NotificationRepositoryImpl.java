package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;

import com.mbooking.model.Notification;
import com.mbooking.repository.NotificationRepositoryCustom;

public class NotificationRepositoryImpl implements NotificationRepositoryCustom {
	@Autowired
	private static MongoTemplate db;

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
