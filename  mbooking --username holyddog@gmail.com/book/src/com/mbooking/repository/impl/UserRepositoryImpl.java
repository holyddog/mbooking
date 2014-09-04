package com.mbooking.repository.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.crypto.Cipher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.Comment;
import com.mbooking.model.Device;
import com.mbooking.model.FBobj;
import com.mbooking.model.Favourite;
import com.mbooking.model.Follow;
import com.mbooking.model.Notification;
import com.mbooking.model.Report;
import com.mbooking.model.User;
import com.mbooking.repository.UserRepostitoryCustom;
import com.mbooking.util.ConfigReader;
import com.mbooking.util.Convert;
import com.mbooking.util.ImageUtils;
import com.mbooking.util.JavaMail;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class UserRepositoryImpl implements UserRepostitoryCustom {
	@Autowired
	private MongoTemplate db;
	
	private void addDevice(String email,Integer os,String dvtoken,String version){
		Query query = new Query();
		query.addCriteria(Criteria.where("os").is(os).and("token").is(dvtoken));
		Update update = new Update();
		update.set("token", dvtoken);
		update.set("os", os);
		update.set("alias", email);
		update.set("lstuse", System.currentTimeMillis());
		update.set("version", version);
		try{
			db.upsert(query, update, Device.class);
		}
		catch(Exception ex){
			throw ex;
		}
	}
	
	@Override
	public User signIn(String loginName, String password,Integer os,String dvtoken,String version) {
		Criteria loginCriteria = new Criteria().orOperator(
			Criteria.where("uname").is(loginName), 
			Criteria.where("email").is(loginName)
		);
		
		password = Convert.toMD5Password(password);
		Criteria criteria = Criteria.where("inactive").ne(true).andOperator(loginCriteria).and("pwd").is(password);
			
		Query query = new Query(criteria);
		query.fields().exclude("pwd");
		query.fields().exclude("fb.fbid");
		
		User user = db.findOne(query, User.class);
		if (user != null) {
			query = new Query(Criteria.where("uid").is(user.getUid()).and("pbdate").exists(false));
			query.fields().include("pic").include("title").include("pcount");
			List<Book> books = db.find(query, Book.class);
			user.setBooks(books);
				if(os!=null&&dvtoken!=null&&!dvtoken.equals(""))
					addDevice(user.getEmail(),os,dvtoken,version);
		
		}
		
		return user;
	}

	@Override
	public User signUp(String email, String password, String displayName, String userName,Integer os,String dvtoken,String version) {
		User user = new User();
		
		user.setPwd(Convert.toMD5Password(password));	
		user.setUid(MongoCustom.generateMaxSeq(User.class, db));
		user.setEmail(email);
		user.setDname(displayName);
		user.setUname(userName);
		user.setExguide(true);
		user.setBguide(true);
		user.setEpguide(true);
		user.setFguide(true);
		db.insert(user);
		user.setPwd(null); // remove password before return data
		
		if(os!=null&&dvtoken!=null)
		addDevice(email,os,dvtoken,version);
		
		return user;
	}
	
	@Override
	public List<User> findUsersByName(String keyword) {
		Criteria searchCriteria = new Criteria().orOperator(
				Criteria.where("dname").regex("^(?i)" + keyword + "(?i)"), Criteria.where("uname").regex("^(?i)" + keyword + "(?i)"));
		Query query  = new Query(searchCriteria);
		query.limit(50);
		query.fields().include("dname").include("uname").include("pic").include("pbcount");
		return db.find(query, User.class);
	}

	@Override
	public User signInFB(Long fbid,Integer os,String dvtoken,String version) {
			Criteria criteria = Criteria.where("fbobj._id").is(fbid).and("inactive").ne(true).and("unlinkfb").exists(false);
			Query query = new Query(criteria);
			query.fields().exclude("pwd");
			query.fields().exclude("fbobj._id");
			
			User user = db.findOne(query, User.class);
			if (user != null) {
				query = new Query(Criteria.where("uid").is(user.getUid()).and("pbdate").exists(false));
				query.fields().include("pic").include("title").include("pcount");
				List<Book> books = db.find(query, Book.class);
				user.setBooks(books);
			}
			
			if(os!=null&&dvtoken!=null&&user!=null)
				addDevice(user.getEmail(),os,dvtoken,version);
			
			return user;
	}

	@Override
	public User signUpFB(String email, String displayName, String userName,String password,
			Long fbid, String fbpic,String fbname,String fbemail,Integer os,String dvtoken,String version) {
		
		User user = new User();
		user.setUid(MongoCustom.generateMaxSeq(User.class, db));
		user.setEmail(email);
		user.setDname(displayName);
		user.setUname(userName);
		user.setPwd(Convert.toMD5Password(password));	
		user.setExguide(true);
		user.setBguide(true);
		user.setEpguide(true);
		user.setFguide(true);

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
		if(os!=null&&dvtoken!=null)
			addDevice(fbemail,os,dvtoken,version);
		
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
			db.updateMulti(new Query(Criteria.where("uid").is(uid)), new Update().set("author.dname", displayName), Book.class);
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
//					ImageUtils.deleteImageFile(oldpic, ConstValue.PROFILE_IMG_TYPE);
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
	public Boolean linkFB(Long uid, Long fbid, String fbpic, String fbname, String fbemail, String token) {
		try {
			
			if(db.count(new Query(Criteria.where("fbobj.email").is(fbemail)), User.class)<1){
				Update update = new Update();
				update.unset("unlinkfb");
				
				if (fbid != null) {
					FBobj fbobj = new FBobj();
					fbobj.setFbid(fbid);
					fbobj.setPic(fbpic);
					fbobj.setDname(fbname);
					fbobj.setToken(token);
					if (fbemail != null) {
						fbobj.setEmail(fbemail);
					}
					update.set("fbobj", fbobj);
				}
	
				db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
				return true;
			}
			else
				return false;
		} catch (Exception e) {
			return false;

		}
	}

	@Override
	public HashMap<String, Object> getUserProfile(Long uid, Long guestId) {
		if (guestId == null) {
			guestId = uid;
		}
		
		int limit = ConstValue.LIMIT_ITEM;
		
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
		query.sort().on("pbdate", Order.DESCENDING);
		query.skip(0).limit(limit);
		
		query.fields().include("title");
		query.fields().include("pic");
		query.fields().include("pcount");
		query.fields().include("lcount");
		query.fields().include("key");
		query.fields().include("ccount");
		
		List<Book> pubBooks = db.find(query, Book.class);
		map.put("pubBooks", pubBooks);
		
		// find private/draft book for author
		if (uid.equals(guestId)) {
			query = new Query(Criteria.where("uid").is(uid).and("pub").is(false).and("pbdate").exists(true));
			query.sort().on("pbdate", Order.DESCENDING);
			query.skip(0).limit(limit);
			
			query.fields().include("title");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("lcount");
			query.fields().include("key");
			query.fields().include("ccount");
			
			List<Book> priBooks = db.find(query, Book.class);
			map.put("priBooks", priBooks);
			
//			query = new Query(Criteria.where("uid").is(uid).and("pbdate").exists(false));
//			
//			query.fields().include("title");
//			query.fields().include("pic");
//			query.fields().include("pcount");
//			
//			List<Book> drBooks = db.find(query, Book.class);
//			map.put("drBooks", drBooks);
		}
		else {			
			boolean isFollow = db.count(new Query(Criteria.where("auid").is(uid).and("uid").is(guestId)), Follow.class) > 0;
			map.put("isFollow", isFollow);			
			
			if(isFollow){
				boolean isRecvNot = db.count(new Query(Criteria.where("uid").is(guestId).and("recvnot").in(uid)), User.class) > 0;
				map.put("isRecvNot", isRecvNot);	
			}
		}
		
		return map;
	}
	
	@Override 
	public Integer notfCount(Long uid) {
		return (int) db.count(new Query(Criteria.where("uid").is(uid).and("unread").is(true)), Notification.class);
	}
	
	@Override
	public List<Notification> notifications(Long uid,Integer skip, Integer limit) {
		Query query = new Query(Criteria.where("uid").is(uid));
		query.sort().on("adate", Order.DESCENDING);

		if (skip != null && limit != null && limit != 0) {
			query.skip(skip);
			query.limit(limit);
		}
		
		List<Notification> list = db.find(query, Notification.class);
		if (list != null) {
			long now = System.currentTimeMillis();
			for (int i = 0; i < list.size(); i++) {
				Notification n = list.get(i);
				n.setTime(TimeUtils.timefromNow(n.getAdate(), now));				
			}
		}
		db.updateMulti(query, new Update().unset("unread"), Notification.class);
		return list;		
	}

	@Override
	public List<Book> findPublicBooks(Long uid, Integer start, Integer limit) {
		Query query = new Query(Criteria.where("uid").is(uid).and("pub").is(true).and("pbdate").exists(true));
		query.sort().on("pbdate", Order.DESCENDING);
		query.skip(start).limit(limit);
		
		query.fields().include("title");
		query.fields().include("pic");
		query.fields().include("pcount");
		query.fields().include("lcount");
		query.fields().include("key");
		query.fields().include("ccount");
		
		return db.find(query, Book.class);
	}

	@Override
	public List<Book> findPrivateBooks(Long uid, Integer start, Integer limit) {
		Query query = new Query(Criteria.where("uid").is(uid).and("pub").is(false).and("pbdate").exists(true));
		query.sort().on("pbdate", Order.DESCENDING);
		query.skip(start).limit(limit);
		
		query.fields().include("title");
		query.fields().include("pic");
		query.fields().include("pcount");
		query.fields().include("lcount");
		query.fields().include("key");
		query.fields().include("ccount");
		
		return db.find(query, Book.class);
	}

	@Override
	public List<Book> findFavBooks(Long uid, Integer start, Integer limit) {
		List<Favourite> favList = db.find(new Query(Criteria.where("uid").is(uid).and("inactive").exists(false)), Favourite.class);
		List<Book> bookList = new ArrayList<Book>();
		for (int i = 0; i < favList.size(); i++) {
			Long bid = favList.get(i).getBid();
			
			Query query = new Query(Criteria.where("bid").is(bid));
			
			query.fields().include("title");
			query.fields().include("pic");
			query.fields().include("pcount");
			query.fields().include("lcount");
			query.fields().include("key");
			query.fields().include("ccount");
			query.fields().include("author");
			
			Book b= db.findOne(query, Book.class);
			if(b!=null)
			bookList.add(b);
		}
		
		return bookList;
	}
	
	@Override
	public String changeCover(Long uid, String newCover) {
		try {
			String img_path = "";
			if (newCover != null) {
				img_path = ImageUtils.toImageFile(ConstValue.USER_FOLDER + uid, newCover, ConstValue.COVER_IMG_TYPE);
				db.updateFirst(new Query(Criteria.where("uid").is(uid)), new Update().set("cover", img_path), User.class);
			}
			return img_path;
		} catch (Exception e) {
			return "";
		}
	}

	@Override
	public List<User> findFBFriends(Long uid,List<Long> fbid_list) {
		Query query = new Query(Criteria.where("fbobj._id").in(fbid_list));
		query.fields().include("uid");
		query.fields().include("pic");
		query.fields().include("dname");
		query.fields().include("fbobj.dname");
		List<User> friends = db.find(query,User.class);
		User user = db.findOne(new Query(Criteria.where("uid").is(uid)),User.class);
		Object[] following = user.getFollowing();		
		if(following!=null){
			if(following.length!=0){
				for(User friend :friends){
					if(Arrays.asList(following).contains(friend.getUid())){
						friend.setIsFollow(true);
					}
				}
			}
		}
		return friends;
	}

	@Override
	public Boolean sendFogetPassToEmail(String email) {
		try{
			int mindigit = 18;
			int maxdigit = 20;
			Random rand = new Random();
			int digit = rand.nextInt(maxdigit - mindigit) + mindigit;
			String unq_str = Convert.uniqueString(digit);
			
			if(db.count(new Query(Criteria.where("fgpass").is(unq_str)), User.class)>0){
				unq_str = Convert.uniqueString(digit);
			}
			
			Update update = new Update();
			update.set("fgpass", unq_str);
			
			db.updateFirst(new Query(Criteria.where("email").is(email)), update, User.class);
			
			JavaMail sender = new JavaMail();
						
			sender.sendMail(email.toLowerCase(),"Forget password",
					"<html>From your change password request, <a href='"+ConfigReader.getProp("root")+"/reset.jsf?key="+unq_str+"'>Click Here</a> to reset your password </html>"
			);
			
			return true;
		}catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}
	
	@Override
	public Boolean resetForgetPass(String pass,String code) {
		if (code == null) {
			return null;
		}
		else if(code.isEmpty() || code.equals(""))
		{
			return null;
		}
		
		Query query = new Query(Criteria.where("fgpass").is(code));
		if(db.count(query, User.class)>0){
			Update update = new Update();
			update.set("pass",Convert.toMD5Password(pass));
			update.unset("fgpass");
			db.updateFirst(query, update,User.class);
			return true;
		}else{
			return false;
		}
	}

	@Override
	public User findUserByForgetPwdKey(String code) {
		if (code == null) {
			return null;
		}
		else if(code.isEmpty() || code.equals(""))
		{
			return null;
		}
		
		Query query = new Query(Criteria.where("fgpass").is(code));
		query.fields().include("dname");
		query.fields().include("pic");
		return db.findOne(query, User.class);
	}

	@Override
	public Boolean viewedGuide(String guide,Long uid) {
		Update update = new Update();
		
		if(guide.equals("exguide"))
			update.unset("exguide");
		
		if(guide.equals("bguide"))
			update.unset("bguide");
		
		if(guide.equals("epguide"))
			update.unset("epguide");
		
		if(guide.equals("fguide"))
			update.unset("fguide");
		
		db.updateFirst(new Query(Criteria.where("uid").is(uid)), update, User.class);
		
		return true;
	}

	@Override
	public Boolean submitReportStory(Integer type, Long bid, Long uid, String msg) {
		try {
			Update update = new Update();
			update.set("type", type);
			update.set("subtype", type);
			update.set("bid",bid);
			update.set("uid",uid);
		
			Query query = new Query(Criteria.where("uid").is(uid));
			query.fields().include("uname");
			User user = db.findOne(query, User.class);
			update.set("uname",user.getUname());
			
			Query bquery = new Query(Criteria.where("bid").is(bid));
			bquery.fields().include("uid");
			Book story = db.findOne(bquery, Book.class);
			Long auid = story.getUid();	
			update.set("auid",auid);
			
			Query auquery = new Query(Criteria.where("uid").is(auid));
			auquery.fields().include("uname");
			User author = db.findOne(auquery, User.class);
			update.set("auname",author.getUname());
			update.set("msg",msg);
			update.set("rdate",System.currentTimeMillis());
			update.set("inactive",false);
			
			db.upsert(new Query(Criteria.where("uid").is(uid).and("bid").is(bid).and("auid").is(auid).and("type").is(type).and("subtype").is(type)), update, Report.class);	
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		
		return true;
	}

	@Override
	public Boolean submitReport(Integer type, Integer subtype, Long uid,
			Long auid, Long oid, String msg, String uname, String auname,
			String comment) {
		try {
			Update update = new Update();
			update.set("type",type);
			update.set("subtype",subtype);
			update.set("uid",uid);
			update.set("auid",auid);
			update.set("uname",uname);
			update.set("auname",auname);
			update.set("msg",msg);
			update.set("inactive",false);
			
			if(uname==null||uname.equals("")){
				Query query = new Query(Criteria.where("uid").is(uid));
				query.fields().include("uname");
				User user = db.findOne(query, User.class);
				update.set("uname",user.getUname());
			}
			else{
				update.set("uname",uname);
			}
			
			update.set("rdate",System.currentTimeMillis());

			Criteria criteria = Criteria.where("uid").is(uid).and("auid").is(auid).and("type").is(type).and("subtype").is(subtype).and("inactive").is(false);
			
			if(type==1){
				//story
				update.set("bid",oid);
				
				criteria.and("bid").is(oid);
				db.upsert(new Query(criteria), update, Report.class);
			
			}else if(type==2){
				update.set("cmid",oid);
				
				criteria.and("cmid").is(oid);
				update.set("comment",comment);
				
				Query comq = new Query(Criteria.where("cmid").is(oid));
				comq.fields().include("bid");
				comq.fields().include("uid");
				
				Comment com = db.findOne(comq, Comment.class);
				
				update.set("bid",com.getBid());
				if(auid!=null){
					auid = com.getUid();
					update.set("auid",auid);					
				}
			}
			
			if(auid!=null&&(auname==null||auname.equals(""))){
				Query userq = new Query(Criteria.where("uid").is(auid));
				userq.fields().include("uname");
				User user = db.findOne(userq, User.class);
				update.set("auname",user.getUname());
			}
			else if(auname!=null&&!auname.equals("")){
				update.set("auname",auname);
			}
			
			db.upsert(new Query(criteria), update, Report.class);			
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		
		return true;
	}

	@Override
	public User getAccountInfo(Long uid) {
		Query q = new Query(Criteria.where("uid").is(uid));
		q.fields().include("drcount");
		q.fields().include("pbcount");
		q.fields().include("inactive");
		
		return db.findOne(q,User.class);
	}


	
	
	
}
