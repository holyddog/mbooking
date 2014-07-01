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
import com.mbooking.model.Book;
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.ActivityRepository;
import com.mbooking.repository.BookRepository;
import com.mbooking.repository.FollowRepository;
import com.mbooking.repository.PageRepository;

@Controller
public class FollowJson {
	@Autowired
	FollowRepository followRepo;
	@Autowired
	BookRepository bookRepo;
	@Autowired
	PageRepository pageRepo;
	@Autowired
	ActivityRepository actRepo;	
	
	@RequestMapping(method = RequestMethod.POST, value = "/followMulti.json")
	public @ResponseBody Object followMulti(
			@RequestParam(value = "auid") String auid_str,
			@RequestParam(value = "uid") Long uid
			) {		
		List<String> strlist = Arrays.asList(auid_str.split(":"));
		List<Long> longlist = new ArrayList<Long>();
		for(String str : strlist){
			longlist.add(Long.parseLong(str));
		}
		User user =  followRepo.followMulti(uid, longlist);
		if (user != null) {
			return user;
		}

		return ErrorResponse.getError("Internal Error : can't follow");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/followAuthor.json")
	public @ResponseBody
	Object followAuthor(
			@RequestParam(value = "auid") Long auid,
			@RequestParam(value = "uid") Long uid
		) {
		
		User user = followRepo.followAuthor(uid, auid);
		
		if (user != null) {
			actRepo.startedFollowing(uid, auid);
			return user;
		}

		return ErrorResponse.getError("Internal Error : can't follow");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/unfollowAuthor.json")
	public @ResponseBody
	Object unfollowAuthor(
			@RequestParam(value = "auid") Long auid,
			@RequestParam(value = "uid") Long uid
		) {
		
		User user = followRepo.unfollowAuthor(uid, auid);
		
		if (user != null) {
			return user;
		}

		return ErrorResponse.getError("Internal Error : can't unfollow");
		
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowBooksByUID.json")
	public @ResponseBody
	Object getFollowBooksByUID(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit
		) 
	{
		
		List<Book> books = bookRepo.findFollowingBooks(uid,skip,limit);
		if (books != null) {
			return books;
		}

		return ErrorResponse.getError("Unsuccess to find following books by uid: "+uid);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowActivity.json")
	public @ResponseBody
	Object getFollowActivity(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit
		) {
		
		return actRepo.findFollowActivities(uid, skip, limit);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowPagessByUID.json")
	public @ResponseBody
	Object getFollowPagessByUID(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit
		) {
		
		List<Page> pages = pageRepo.findFollowingPages(uid,skip,limit);
		if (pages != null) {
			return pages;
		}

		return ErrorResponse.getError("Unsuccess to find following pages by uid: "+uid);
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowers.json")
	public @ResponseBody
	Object getFollowers(@RequestParam(value = "uid") Long uid) {

		List<User> users = followRepo.getFollowers(uid);
		if (users != null) {
			return users;
		}

		return ErrorResponse.getError("Internal Error");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getFollowing.json")
	public @ResponseBody
	Object getFollowing(@RequestParam(value = "uid") Long uid) {

		List<User> users = followRepo.getFollowing(uid);
		if (users != null) {
			return users;
		}

		return ErrorResponse.getError("Internal Error");
	}	
	
}
