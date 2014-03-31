package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Page;

public interface FollowRepostitoryCustom {
	
	public Boolean followAuthor(
			Long uid,
			Long auid
	);

	public List<Book> findFollowingBooks(
			Long uid
	);
	
	public List<Page> findFollowingPages(
			Long uid
	);
}
