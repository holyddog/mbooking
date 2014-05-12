package com.mbooking.repository;

import java.util.HashMap;
import java.util.List;

import com.mbooking.model.Notification;
import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	User signIn(String email, String password);
	User signUp(String email, String password, String displayName, String userName);
	
	User signInFB(Long fbid);
	User signUpFB(String email, String displayName, String userName,String password,Long fbid,String fbpic,String fbname,String fbemail);	
	
	Boolean changePassword(Long uid, String oldpassword, String newpassword);
	HashMap<String, Object> getUserProfile(Long uid, Long guestId); 
	Boolean changeDisplayName(Long uid, String displayName);
	String changePic(Long uid, String pic);
	List<Notification> notifications(Long uid, Integer skip, Integer limit);
	Integer notfCount(Long uid);

	Boolean unlinkFB(Long uid);
	Boolean linkFB(Long uid,Long fbid,String fbpic,String fbname,String fbemail);
}
