package com.mbooking.repository;

import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	User signIn(String email, String password);
	User signUp(String email, String password, String displayName, String userName);
	
	Boolean changePassword(Long uid, String oldpassword, String newpassword);
	Boolean changeDisplayName(Long uid, String displayName);
	String changePic(Long uid, String pic);
}
