package com.mbooking.repository;

import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Tag;
import com.mbooking.model.User;

public interface BookRepostitoryCustom {

	public Book create(Long bid, String title, String desc, Long fdate, Long tdate, String[] tags, Long uid, String pic, Boolean pub);

	public Book edit(Long bid, String title, String desc, Long fdate, Long tdate, String[] tags, Long uid, String pic);

	public Boolean delete(Long bid, Long uid);

	public List<Book> edit_seq(Long[] bid, Integer[] seq, Long uid);

	public User publishBook(Long bid, Long uid, String cover);
	public User unpublishBook(Long bid, Long uid);
	public Boolean changeCover(Long bid, String newCover);

	public Book findBookWithPages(Long bid, Long uid, Long gid,String key, Boolean isCount);
	
	public Boolean addTag(Long bid, String tag);
	public Boolean removeTag(Long bid, String tag);
	
	public List<Book> findRelatedStory(Long bid, Long uid);
	public List<Book> findLastBookByUid(Long uid);
	public List<Book> findBooksByTitle(String keyword);
	public List<Book> findBooksByTag(String tag);
	public List<Tag> findTags(String keyword);
	public String findLastCover(Long uid);
	public Boolean likeBook(Long bid, Long who, boolean like);
	public Boolean favBook(Long bid, Long who, boolean fav);
	
	public List<Book> findByPbdateExists(boolean exists,Integer skip,Integer limit);
	public List<Book> findByPbdateExistsByTag(String tag, Integer skip, Integer limit);
	public List<Tag> findTagCategories();
	
	public List<Book> findFollowingBooks(Long uid,Integer skip,Integer limit);

	public List<Book> findBooksByUid(Long uid,Integer pbstate,Integer skip,Integer limit);

	public Book findBookWithPagesByBid(Long bid, String key);
}
