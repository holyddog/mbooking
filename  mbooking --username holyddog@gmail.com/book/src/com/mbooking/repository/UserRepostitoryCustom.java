package com.mbooking.repository;

import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	User signIn(String email, String password);
	User signUp(String email, String password, String displayName, String userName);
	
	User signInFB(String email, Long fbid);
	User signUpFB(String email, String displayName, String userName,String password,Long fbid,String fbpic,String fbname,String fbemail);
	
	
	Boolean changePassword(Long uid, String oldpassword, String newpassword);
	Boolean changeDisplayName(Long uid, String displayName);
	String changePic(Long uid, String pic);

	Boolean unlinkFB(Long uid);
	Boolean linkFB(Long uid,Long fbid,String fbpic,String fbname,String fbemail);
}
