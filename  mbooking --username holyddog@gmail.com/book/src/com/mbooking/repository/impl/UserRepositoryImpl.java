package com.mbooking.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.FBobj;
import com.mbooking.model.Follow;
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
		Criteria criteria = Criteria.where("inactive").ne(true).andOperator(loginCriteria).and("pwd").is(password);
			
			
		Query query = new Query(criteria);
		query.fields().exclude("pwd");
		query.fields().exclude("fb.fbid");
		
		return db.findOne(query, User.class);
	}

	@Override
	public User signUp(String email, String password, String displayName, String userName) {
		User user = new User();
		
		user.setPwd(Convert.toMD5Password(password));	
		user.setUid(MongoCustom.generateMaxSeq(User.class, db));
		user.setEmail(email);
		user.setDname(displayName);
		user.setUname(userName);
		
		db.insert(user);
		
		user.setPwd(null); // remove password before return data
		return user;
	}

	@Override
	public User signInFB(Long fbid) {
			Criteria criteria = Criteria.where("fbobj.fbid").is(fbid).and("inactive").ne(true).and("unlinkfb").exists(false);
			Query query = new Query(criteria);
			query.fields().exclude("pwd");
			query.fields().exclude("fbobj.fbid");
			return db.findOne(query, User.class);
	}

	@Override
	public User signUpFB(String email, String displayName, String userName,String password,
			Long fbid, String fbpic,String fbname,String fbemail) {
		
		User user = new User();
		user.setUid(MongoCustom.generateMaxSeq(User.class, db));
		user.setEmail(email);
		user.setDname(displayName);
		user.setUname(userName);
		user.setPwd(Convert.toMD5Password(password));	

		if(fbid!=null){
			FBobj fbobj = new FBobj();
			fbobj.setFbid(fbid);
			fbobj.setPic(fbpic);
			fbobj.setDname(fbname);
			if(fbemail!=null)
			fbobj.setEmail(fbemail);
			user.setFbobj(fbobj);
		}
		
		db.insert(user);

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
		try {
			User user = db.findOne(new Query(Criteria.where("uid").is(uid)), User.class);
			String oldpic = user.getPic();

			String path = "";

			if (pic != null && !pic.equals("") && !pic.equals("undefined")) {
				String img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER + uid, pic, ConstValue.PROFILE_IMG_TYPE);
				path = img_path;

				db.updateFirst(new Query(Criteria.where("uid").is(uid)), new Update().set("pic", path), User.class);
				db.updateMulti(new Query(Criteria.where("uid").is(uid)), new Update().set("author.pic", path), Book.class);

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

	@Override
	public Boolean unlinkFB(Long uid) {
		try{
			Update update = new Update();
			update.set("unlinkfb", true);
			update.unset("fbobj");
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			return true;
		}catch(Exception e){
			System.out.println("Unsuccess unlink fb, User Service error: " + e);
			return false;
		
		}
	}

	@Override
	public Boolean linkFB(Long uid,Long fbid,String fbpic,String fbname,String fbemail) {
		try{
			Update update = new Update();
			update.unset("unlinkfb");
			
			if(fbid!=null){
				FBobj fbobj = new FBobj();
				fbobj.setFbid(fbid);
				fbobj.setPic(fbpic);
				fbobj.setDname(fbname);
				if(fbemail!=null)
				fbobj.setEmail(fbemail);
				update.set("fbobj",fbobj);
			}
			
			
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
			return true;
		}catch(Exception e){
			System.out.println("Unsuccess unlink fb, User Service error: " + e);
			return false;
		
		}
	}

	@Override
	public HashMap<String, Object> getUserProfile(Long uid, Long guestId) {
		if (guestId == null) {
			guestId = uid;
		}
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		// get user info
		Query query = new Query(Criteria.where("uid").is(uid));
		
		query.fields().include("email");
		query.fields().include("dname");
		query.fields().include("uname");
		query.fields().include("pic");
		query.fields().include("cover");
		
		query.fields().include("fcount"); // followers
		query.fields().include("fgcount"); // following
		query.fields().include("pbcount"); // book count
		query.fields().include("drcount"); // draft count
		
		User user = db.findOne(query, User.class);
		map.put("user", user);
		
		// find public book
		query = new Query(Criteria.where("uid").is(uid).and("pub").is(true).and("pbdate").exists(true));
		
		query.fields().include("title");
		query.fields().include("pic");
		query.fields().include("pcount");
		
		List<Book> pubBooks = db.find(query, Book.class);
		map.put("pubBooks", pubBooks);
		
		// find private/draft book for author
		if (uid.equals(guestId)) {
			query = new Query(Criteria.where("uid").is(uid).and("pub").is(false).and("pbdate").exists(true));
			
			query.fields().include("title");
			query.fields().include("pic");
			query.fields().include("pcount");
			
			List<Book> priBooks = db.find(query, Book.class);
			map.put("priBooks", priBooks);
			
			query = new Query(Criteria.where("uid").is(uid).and("pbdate").exists(false));
			
			query.fields().include("title");
			query.fields().include("pic");
			query.fields().include("pcount");
			
			List<Book> drBooks = db.find(query, Book.class);
			map.put("drBooks", drBooks);
		}
		else {			
			boolean isFollow = db.count(new Query(Criteria.where("auid").is(uid).and("uid").is(guestId)), Follow.class) > 0;
			map.put("isFollow", isFollow);			
		}
		
		return map;
	}

}
