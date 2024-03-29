package com.mbooking.repository;
import java.io.File;
import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Page;

public interface PageRepostitoryCustom {

	public Book create(Long bid, Long uid, Long date, String pic, String caption);

	public Page add(Long pid, String picture, Integer imageSize, Integer cropPos, String caption, String ref, Long bookId, Long addBy);
	public Boolean editCaption(Long pid, String caption);

	public Page edit(Long pid, Long uid, Long bid, Long date, String pic, String caption);

	public Boolean delete(Long pid, Long bid);
	public void changeSeq(Long bid, Integer fromSeq, Integer toSeq);

	public List<Page> edit_seq(Long bid, Long uid, Long[] pid, Integer[] seq);

	public List<Page> findFollowingPages(Long uid, Integer skip, Integer limit);
	public List<Page> addMultiPages(String pics, Long uid, Long bid);

	public Boolean addMulti(
			String pic,
			File file,
			Long bookId,	
			Long addBy
	);
}
