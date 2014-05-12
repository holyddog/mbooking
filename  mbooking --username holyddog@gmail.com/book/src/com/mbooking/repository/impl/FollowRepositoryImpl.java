package com.mbooking.repository.impl;

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
import com.mbooking.util.MongoCustom;

public class FollowRepositoryImpl implements FollowRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean followAuthor(Long uid, Long auid) {
	
		try{
			if(db.count(new Query(Criteria.where("uid").is(uid).and("auid").is(auid)),Follow.class) == 0){
			
				Long fid = MongoCustom.generateMaxSeq(Follow.class, db);
				
				Follow follow = new Follow();
				follow.setFid(fid);
				follow.setAuid(auid);
				follow.setUid(uid);
				
				Criteria fcriteria = Criteria.where("auid").is(auid);
				Query fquery = new Query(fcriteria);
				int fcount = (int) db.count(fquery, Follow.class) + 1;
				
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
				query.fields().include("dname");
				
				User foll = db.findOne(query,User.class);
				Long[] following = foll.getFollowing();		
				foll.setFollows(null);
				
				follow.setAuth(auth);
				follow.setFoll(foll);
				db.insert(follow);
				
				if(following==null||following.length==0)
				{	following = new Long[1];
					following[0]=auid;
				}
				else{
					Long [] temp = new Long[following.length+1];
					for(int i =0;i< following.length;i++){
						temp[i] = following[i];
					}
					temp[following.length] = auid;
					following = temp;
				}
				
				Update following_update = new Update();
				following_update.set("following", following);
				
				int fgcount = (int) db.count(new Query(criteria), Follow.class);
				following_update.set("fgcount", fgcount);
				db.updateFirst(new Query(criteria), following_update, User.class);
				
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
				
				return true;
			}
			return false;
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
			
			
			
			User foll = db.findOne(new Query(Criteria.where("uid").is(uid)),  User.class);
			
			Long[] following = foll.getFollowing();
			
			if(following!=null&&following.length!=0)
			{
				Long [] temp = new Long[following.length-1];
				
				boolean found=false;
				for(int i =0;i< temp.length;i++){
					
					if(following[i]!=uid&&!found){
						temp[i] = following[i];	
					}
					else if(following[i]==uid&&!found){
						found = true;
						temp[i] = following[i+1];
					}
					else if(found){
						temp[i] = following[i+1];
					}
				}
				
				following = temp;
			}
			
		
			Update following_update = new Update();
			int fgcount = (int) db.count(new Query(Criteria.where("uid").is(uid)), Follow.class);
			following_update.set("fgcount", fgcount);
			following_update.set("following", following);
			
			db.updateFirst(new Query(Criteria.where("uid").is(uid)), following_update, User.class);
			
			
			return true;
		
		}
		catch(Exception e){
			System.out.println(e);
			return false;
		}
	}

	@Override
	public Boolean isFollow(Long uid, Long auid) {		
		return db.count(new Query(Criteria.where("auid").is(auid).and("uid").is(uid)), Follow.class) > 0;
	}
}
