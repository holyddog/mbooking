package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Book;

public interface BookRepostitoryCustom {

	public Book create(String title, String desc, Long fdate, Long tdate, String[] tags, Long uid, String pic);

	public Book edit(Long bid, String title, String desc, Long fdate, Long tdate, String[] tags, Long uid, String pic);

	public Boolean delete(Long bid, Long uid);

	public List<Book> edit_seq(Long[] bid, Integer[] seq, Long uid);

	public Boolean publish_book(Long bid, Long uid);

	public Boolean unpublish_book(Long bid, Long uid);

	public Book findBookWithPages(Long bid, Long uid);
	
	public List<Book> findLastBookByUid(Long uid);
	
	public List<Book> findByPbdateExists(boolean exists);
	
}
