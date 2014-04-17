package com.mbooking.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.User;
import com.mbooking.repository.UserRepostitoryCustom;
import com.mbooking.util.Convert;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.MongoCustom;

public class UserRepositoryImpl implements UserRepostitoryCustom {
	@Autowired
	private MongoTemplate db;
	
	@Override
	public User signIn(String loginName, String password) {
		Criteria loginCriteria = new Criteria().orOperator(
			Criteria.where("uname").is(loginName), 
			Criteria.where("email").is(loginName)
		);
		password = Convert.toMD5Password(password);
		
		Criteria criteria = Criteria.where("pwd").is(password).and("inactive").ne(true).andOperator(loginCriteria);
		Query query = new Query(criteria);
		query.fields().exclude("pwd");
		return db.findOne(query, User.class);
	}

	@Override
	public User signUp(String email, String password, String displayName, String userName) {
		User user = new User();
		user.setUid(MongoCustom.generateMaxSeq(User.class, db));
		user.setEmail(email);
		user.setPwd(Convert.toMD5Password(password));
		user.setDname(displayName);
		user.setUname(userName);
		
		db.insert(user);
		
		user.setPwd(null); // remove password before return data
		return user;
	}

	@Override
	public Boolean changePassword(Long uid, String oldpassword,
			String newpassword) {
		
		Query query = new Query(Criteria.where("uid").is(uid));
		User user = db.findOne(query, User.class);
		
		String oldpassword_MD5 = Convert.toMD5Password(oldpassword);
		if(oldpassword_MD5.equals(user.getPwd())){
			
			Update update = new Update();
			update.set("pwd",Convert.toMD5Password(newpassword));
			
			db.updateFirst(query, update, User.class);
			return true;
		}
		
		return false;
	}

	@Override
	public Boolean changeDisplayName(Long uid, String displayName) {
		try{
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), new Update().set("dname", displayName), User.class);
			return true;
		} catch (Exception e) {
			System.out.println("Unsuccess Change DisplayName, User Service error: " + e);
			return false;
		}
	}

	@Override
	public String changePic(Long uid, String pic) {
		try{
				User user = db.findOne(new Query(Criteria.where("uid").is(uid)), User.class);
				String oldpic = user.getPic();	
				
				String path = "";
						
				if (pic != null && !pic.equals("") && !pic.equals("undefined")) {
					String img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER
							+ uid , pic, ConstValue.PROFILE_IMG_TYPE);
					path = img_path;
			
					db.updateFirst(new Query(Criteria.where("uid").is(uid)), new Update().set("pic", path), User.class);
					
					if (oldpic != null && !oldpic.equals("") && !oldpic.equals("undefined")) {
						ImageUtils.deleteImageFile(oldpic, ConstValue.PROFILE_IMG_TYPE);
					}	
					
					
					return path;	
				
				}
			
			return "";
		} catch (Exception e) {
			System.out.println("Unsuccess Change Profile Pic, User Service error: " + e);
			return "";
		}
	}
}