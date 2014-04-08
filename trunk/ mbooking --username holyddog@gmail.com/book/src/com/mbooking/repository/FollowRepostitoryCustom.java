package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Page;

public interface FollowRepostitoryCustom {
	
	public Boolean followAuthor(
			Long uid,
			Long auid
	);

	public Boolean unfollowAuthor(
			Long uid,
			Long auid
	);
	
	public Boolean isFollow(
			Long uid,	//follid from UserJson
			Long auid	//uid from UserJson
	);
}
