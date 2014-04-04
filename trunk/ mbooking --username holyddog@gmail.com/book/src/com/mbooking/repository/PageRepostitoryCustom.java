package com.mbooking.repository;
import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Page;

public interface PageRepostitoryCustom {
	
	public Book create(
			Long bid,
			Long uid,
			Long date,
			String pic,
			String caption
	);
	
	public Page edit(
			Long pid,
			Long uid,
			Long bid,
			Long date,
			String pic,
			String caption
	);	
	
	public Boolean delete(
			Long pid,
			Long bid,
			Long uid
	);		
	
	public List<Page> edit_seq(
			Long bid,
			Long uid,
			Long[]pid,
			Integer[]seq
	);
	
	public List<Page> findFollowingPages(
			Long uid
	);
	
}
