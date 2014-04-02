package com.mbooking.repository.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.model.Book;
import com.mbooking.model.Follow;
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.FollowRepostitoryCustom;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class FollowRepositoryImpl implements FollowRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean followAuthor(Long uid, Long auid) {
	
		try{	
			Long fid = MongoCustom.generateMaxSeq(Follow.class, db);
			
			Follow follow = new Follow();
			follow.setFid(fid);
			follow.setAuid(auid);
			follow.setUid(uid);
			
			Criteria fcriteria = Criteria.where("auid").is(auid);
			Query fquery = new Query(fcriteria);
			int fcount = (int) db.count(fquery, Follow.class) + 1;
			
			Update fupdate = new Update();		
			fupdate.set("auth.fcount", fcount);
			db.updateMulti(fquery, fupdate, Follow.class );
			
			Criteria criteria = Criteria.where("uid").is(auid);
			Query query = new Query(criteria);
			query.fields().include("pic");
			query.fields().include("dname");
			query.fields().include("fcount");
			Update update = new Update();
			update.set("fcount", fcount);
			
			User auth = db.findAndModify(query, update,new FindAndModifyOptions().returnNew(true), User.class);
			
			criteria = Criteria.where("uid").is(uid);
			query = new Query(criteria);
			query.fields().include("pic");
			query.fields().include("dname");
			User foll = db.findOne(query,User.class);
					
			follow.setAuth(auth);
			follow.setFoll(foll);
			db.insert(follow);
			
			return true;
		
		}
		catch(Exception e){
			System.out.println(e);
			return false;
		}
	}

	@Override
	public Boolean unfollowAuthor(Long uid, Long auid) {
		try{	
		
			
			Follow follow = new Follow();
			follow.setAuid(auid);
			follow.setUid(uid);
			
			Criteria rcriteria = Criteria.where("auid").is(auid).and("uid").is(uid);
			Query rquery = new Query(rcriteria);
			
			db.remove(rquery, Follow.class);
			
			
			Criteria au_criteria = Criteria.where("auid").is(auid);
			Query au_query = new Query(au_criteria);
			
			int fcount = (int) db.count(au_query, Follow.class);
			
			Criteria u_criteria = Criteria.where("uid").is(auid);
			Query u_query = new Query(u_criteria);
			
			Update update = new Update();
			update.set("fcount", fcount);
			
			db.updateFirst(u_query, update, User.class);
			
			return true;
		
		}
		catch(Exception e){
			System.out.println(e);
			return false;
		}
	}
	
	
	

}
