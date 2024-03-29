package com.mbooking.repository;

import java.util.HashMap;
import java.util.List;

import com.mbooking.model.Book;
import com.mbooking.model.Notification;
import com.mbooking.model.User;

public interface UserRepostitoryCustom {
	User signIn(String email, String password,Integer os,String dvtoken,String version);
	User signUp(String email, String password, String displayName, String userName,Integer os,String dvtoken,String version);
	List<User> findUsersByName(String keyword);
	
	User signInFB(Long fbid,Integer os,String dvtoken,String version);
	User signUpFB(String email, String displayName, String userName,String password,Long fbid,String fbpic,String fbname,String fbemail,Integer os,String dvtoken,String version);	
	
	Boolean changePassword(Long uid, String oldpassword, String newpassword);
	String changeCover(Long uid, String newCover);
	HashMap<String, Object> getUserProfile(Long uid, Long guestId); 
	Boolean changeDisplayName(Long uid, String displayName);
	String changePic(Long uid, String pic);
	List<Notification> notifications(Long uid, Integer skip, Integer limit);
	Integer notfCount(Long uid);
	
	List<Book> findPublicBooks(Long uid, Integer start, Integer limit);
	List<Book> findPrivateBooks(Long uid, Integer start, Integer limit);
	List<Book> findFavBooks(Long uid, Integer start, Integer limit);

	List<User> findFBFriends(Long uid,List<Long> fbid_list);
	
	Boolean unlinkFB(Long uid);
	Boolean linkFB(Long uid, Long fbid, String fbpic, String fbname, String fbemail, String token);
	Boolean sendFogetPassToEmail(String email);
	Boolean resetForgetPass(String pass,String code);
	User findUserByForgetPwdKey(String code);
	
	Boolean viewedGuide(String guide,Long uid);
	Boolean submitReportStory(Integer type, Long bid, Long uid, String msg);

	Boolean submitReport(Integer type,Integer subtype,Long uid,Long auid,Long oid,String msg,String uname,String auname,String comment);
	User getAccountInfo(Long uid);
}
