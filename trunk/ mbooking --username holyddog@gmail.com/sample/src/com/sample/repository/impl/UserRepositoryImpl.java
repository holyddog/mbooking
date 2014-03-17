package com.sample.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.sample.model.User;
import com.sample.repository.UserRepostitoryCustom;
import com.sample.util.Convert;

public class UserRepositoryImpl implements UserRepostitoryCustom {

	@Autowired
	private MongoTemplate db;
	
	@Override
	public User login(String email, String password) {
//		password = Convert.toMD5Password(password);
		return db.findOne(new Query(Criteria.where("email").is(email)), User.class);
	}

	@Override
	public User register(String email, String password, String name) {
		User user = new User();
		user.setUid(System.currentTimeMillis());
		user.setEmail(email);
		user.setPwd(Convert.toMD5Password(password));
		user.setName(name);
		
		db.insert(user);
		
		return user;
	}

}
