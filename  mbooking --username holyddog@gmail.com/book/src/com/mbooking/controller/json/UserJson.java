package com.mbooking.controller.json;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.common.ErrorResponse;
import com.mbooking.common.ResultResponse;
import com.mbooking.model.Conf;
import com.mbooking.model.Notification;
import com.mbooking.model.User;
import com.mbooking.repository.BookRepository;
import com.mbooking.repository.ConfRepository;
import com.mbooking.repository.UserRepository;

@Controller
public class UserJson {
	@Autowired
	UserRepository userRepo;	
	@Autowired
	BookRepository bookRepo;
	@Autowired
	ConfRepository confRepo;
	
	@RequestMapping(method = RequestMethod.POST, value = "/getFBFriendsList.json")
	public @ResponseBody Object getFBFriendsList(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "fbid") String fblist_str
			) {		
		String[] strarr = fblist_str.split(":");
		List<String> strlist = Arrays.asList(strarr);
		List<Long> longlist = new ArrayList<Long>();
		for(String str : strlist){
			if(!str.equals(""))
			longlist.add(Long.parseLong(str));
		}
		return userRepo.findFBFriends(uid,longlist);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getProfile.json")
	public @ResponseBody Object getProfile(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "gid", required = false) Long guestId
			) {
		return userRepo.getUserProfile(uid, guestId);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getPublicBooks.json")
	public @ResponseBody Object getPublicBooks(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "start") Integer start,
			@RequestParam(value = "limit") Integer limit) {
		return userRepo.findPublicBooks(uid, start, limit);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getPrivateBooks.json")
	public @ResponseBody Object getPrivateBooks(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "start") Integer start,
			@RequestParam(value = "limit") Integer limit) {
		return userRepo.findPrivateBooks(uid, start, limit);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFavBooks.json")
	public @ResponseBody Object getFavBooks(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "start") Integer start,
			@RequestParam(value = "limit") Integer limit) {
		return userRepo.findFavBooks(uid, start, limit);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getMyLastBooks.json")
	public @ResponseBody Object getMyLastBooks(
			@RequestParam(value = "uid") Long uid
			) {
		return bookRepo.findLastBookByUid(uid);
	}
	
	// check duplicate email
	@RequestMapping(method = RequestMethod.GET, value = "/checkEmail.json")
	public @ResponseBody Object checkEmail(
			@RequestParam(value = "email") String email
			) {
		return ResultResponse.getResult("result", userRepo.findByEmail(email) != null);
	}	
	
	// check duplicate username
	@RequestMapping(method = RequestMethod.GET, value = "/checkUserName.json")
	public @ResponseBody Object checkUserName(
			@RequestParam(value = "uname") String userName
			) {
		return ResultResponse.getResult("result", userRepo.findByUserName(userName) != null);
	}
	
	/**/
	
	@RequestMapping(method = RequestMethod.POST, value = "/signIn.json")
	public @ResponseBody Object signIn(
			@RequestParam(value = "login") String loginName,
			@RequestParam(value = "pwd",required = false) String password,
			@RequestParam(value = "os",required = false) Integer os,
			@RequestParam(value = "dvtoken",required = false) String dvtoken,
			@RequestParam(value = "version",required = false) String version
			) {
		User user = userRepo.signIn(loginName, password,os,dvtoken,version);
		if (user != null) {
			return user;
		}
		return ErrorResponse.getError("Invalid email/username or password");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/signUp.json")
	public @ResponseBody Object signUp(
			@RequestParam(value = "email") String email,
			@RequestParam(value = "dname") String displayName,
			@RequestParam(value = "uname") String userName,
			@RequestParam(value = "pwd") String password,
			@RequestParam(value = "os",required = false) Integer os,
			@RequestParam(value = "dvtoken",required = false) String dvtoken,
			@RequestParam(value = "version",required = false) String version
			)
			{
		User user = userRepo.signUp(email, password, displayName, userName,os,dvtoken,version);
		if (user != null) {
			return user;
		}
		return ErrorResponse.getError("Sign Up unsuccess ");
	}
	
	/**/
	
	@RequestMapping(method = RequestMethod.POST, value = "/signInFB.json")
	public @ResponseBody Object signInFB(
			@RequestParam(value = "fbid") Long fbid,			
			@RequestParam(value = "os",required = false) Integer os,
			@RequestParam(value = "dvtoken",required = false) String dvtoken,
			@RequestParam(value = "version",required = false) String version
			)
	{
		User user = userRepo.signInFB(fbid,os,dvtoken,version);
		if (user != null) {
			return user;
		}
		else{
			return ErrorResponse.getError("Have no fb account");
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/signUpFB.json")
	public @ResponseBody Object signUpFB(
			@RequestParam(value = "email") String email,
			@RequestParam(value = "dname") String displayName,
			@RequestParam(value = "uname") String userName,
			@RequestParam(value = "pwd") String password,
			@RequestParam(value = "fbid") Long fbid,
			@RequestParam(value = "fbpic") String fbpic,
			@RequestParam(value = "fbname") String fbname,
			@RequestParam(value = "fbemail", required = false) String fbemail,
			@RequestParam(value = "os",required = false) Integer os,
			@RequestParam(value = "dvtoken",required = false) String dvtoken,
			@RequestParam(value = "version",required = false) String version
			)
			{
		User user = userRepo.signUpFB(email, displayName, userName, password, fbid, fbpic, fbname, fbemail,os,dvtoken,version);
		if (user != null) {
			return user;
		}
		return ErrorResponse.getError("Sign Up unsuccess ");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/unlinkFB.json")
	public @ResponseBody Object unlinkFB(
			@RequestParam(value = "uid") Long uid
			)
	{
		return ResultResponse.getResult("result", userRepo.unlinkFB(uid)!= false);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/linkFB.json")
	public @ResponseBody
	Object linkFB(@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "fbid") Long fbid,
			@RequestParam(value = "fbpic") String fbpic,
			@RequestParam(value = "fbname") String fbname,
			@RequestParam(value = "fbemail", required = false) String fbemail,
			@RequestParam(value = "token") String token) {
		return ResultResponse.getResult("result", userRepo.linkFB(uid, fbid, fbpic, fbname, fbemail, token) != false);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changePassword.json")
	public @ResponseBody Object changePassword(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "oldpwd") String oldpassword,
			@RequestParam(value = "newpwd") String newpassword
			) {
		return ResultResponse.getResult("result", userRepo.changePassword(uid, oldpassword, newpassword)!= false);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changeDisplayName.json")
	public @ResponseBody Object changeName(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "dname") String displayName
			) {
		return ResultResponse.getResult("result", userRepo.changeDisplayName(uid, displayName) != false);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changeProfilePic.json")
	public @ResponseBody Object changeProfilePic(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic
			) {
		return ResultResponse.getResult("picture", userRepo.changePic(uid, pic));
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changeProfileCover.json")
	public @ResponseBody Object changeProfileCover(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic
			) {
		return ResultResponse.getResult("picture", userRepo.changeCover(uid, pic));
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getNotificationByUid.json")
	public @ResponseBody
	Object getNotifications(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit) {
		List<Notification> notf = userRepo.notifications(uid, skip, limit);
		if (notf != null) {
			return notf;
		}

		return ErrorResponse.getError("Unsuccess to find notication by uid: " + uid);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/countNotifications.json")
	public @ResponseBody
	Object countNotifications(
			@RequestParam(value = "uid") Long uid) {
		return ResultResponse.getResult("result", userRepo.notfCount(uid));
	}
	
	@RequestMapping(method = RequestMethod.POST,value = "/sendForgetPassToEmail")
	public @ResponseBody
	Object sendForgtPassToEmail(
			@RequestParam(value = "email") String email){
			return ResultResponse.getResult("result", userRepo.sendFogetPassToEmail(email));
	}
	
	// check duplicate email
	@RequestMapping(method = RequestMethod.GET, value = "/checkAccount.json")
	public @ResponseBody Object checkLoginName(
			@RequestParam(value = "user") String userName 
			) {
		User user = userRepo.findByEmail(userName);
		if(user!= null){
			return user;
		}
		else{
			user = userRepo.findByUserName(userName);
			if(user != null){
				return user;			
			}
		}
		return ResultResponse.getResult("result", user);
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/resetForgetPass.json")
	public @ResponseBody Object resetForgetPass(
			@RequestParam(value = "code") String code,
			@RequestParam(value = "pass") String pass
			) {
		return ResultResponse.getResult("result", userRepo.resetForgetPass(pass,code));
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/viewGuide.json")
	public @ResponseBody Object viewGuide(
			@RequestParam(value = "guide") String guide,
			@RequestParam(value = "uid") Long uid
			) {
		return ResultResponse.getResult("result", userRepo.viewedGuide(guide,uid));
	}	
	
	
	//Old Service version for InStory Version 0.2
	@RequestMapping(method = RequestMethod.POST, value = "/submitReport.json")
	public @ResponseBody Object submitReport(
			@RequestParam(value = "type") Integer type,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "msg", required = false) String msg
			) {
		return ResultResponse.getResult("result", userRepo.submitReportStory(type, bid, uid, msg));
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/submitReportWithType.json")
	public @ResponseBody Object submitReportWithType(
			@RequestParam(value = "type") Integer type,
			@RequestParam(value = "subtype", required = false) Integer subtype,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "uname", required = false) String uname,
			@RequestParam(value = "auid", required = false) Long auid,
			@RequestParam(value = "auname", required = false) String auname,
			@RequestParam(value = "oid", required = false) Long oid,//object id >ex: bid, cmid, others id
			@RequestParam(value = "msg", required = false) String msg,
			@RequestParam(value = "comment", required = false) String comment
			) {
		return ResultResponse.getResult("result", userRepo.submitReport(type, subtype, uid, auid, oid, msg, uname, auname, comment));
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/getAppInfo.json")
	public @ResponseBody
	Object getAppInfo() {
		return ResultResponse.getResult("result",confRepo.findAll());
	}
}