package com.mbooking.repository;

import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	public User login(String email, String password);
	public User register(String email, String password, String name);
}
