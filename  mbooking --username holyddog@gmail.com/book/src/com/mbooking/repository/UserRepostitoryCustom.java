package com.mbooking.repository;

import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	User signIn(String email, String password);
	User signUp(String email, String password, String displayName, String userName);
}
