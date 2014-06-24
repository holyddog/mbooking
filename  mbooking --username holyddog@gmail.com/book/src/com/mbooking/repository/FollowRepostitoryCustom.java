package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Follow;
import com.mbooking.model.Page;
import com.mbooking.model.User;

public interface FollowRepostitoryCustom {
	public User followMulti(Long uid, List<Long> auid);
	public User followAuthor(Long uid, Long auid);
	public User unfollowAuthor(Long uid, Long auid);
	public Boolean isFollow(Long uid, Long auid);
	
	public List<User> getFollowing(Long uid);
	public List<User> getFollowers(Long uid);
	
}
