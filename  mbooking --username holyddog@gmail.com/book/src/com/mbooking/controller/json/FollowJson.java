package com.mbooking.controller.json;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.common.ErrorResponse;
import com.mbooking.model.Book;
import com.mbooking.model.Follow;
import com.mbooking.model.Page;
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
	
	@RequestMapping(method = RequestMethod.POST, value = "/followAuthor.json")
	public @ResponseBody
	Object followAuthor(
			@RequestParam(value = "auid") Long auid,
			@RequestParam(value = "uid") Long uid
		) {
		
		Boolean success = followRepo.followAuthor(uid, auid);
		if (success != null) {
			return success;
		}

		return ErrorResponse.getError("Unsuccess to follow author :"+auid);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowAuthors.json")
	public @ResponseBody
	Object getAuthors(
			@RequestParam(value = "uid") Long uid
		) {
		
		List<Follow> authors = followRepo.findByUid(uid);
		if (authors != null) {
			return authors;
		}

		return ErrorResponse.getError("Unsuccess to load authors that uid: "+uid+" following");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowBooksByUID.json")
	public @ResponseBody
	Object getFollowBooksByUID(
			@RequestParam(value = "uid") Long uid
		) {
		
		List<Book> books = bookRepo.findFollowingBooks(uid);
		if (books != null) {
			return books;
		}

		return ErrorResponse.getError("Unsuccess to find following books by uid: "+uid);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowPagessByUID.json")
	public @ResponseBody
	Object getFollowPagessByUID(
			@RequestParam(value = "uid") Long uid
		) {
		
		List<Page> pages = pageRepo.findFollowingPages(uid);
		if (pages != null) {
			return pages;
		}

		return ErrorResponse.getError("Unsuccess to find following pages by uid: "+uid);
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/getFollowers.json")
	public @ResponseBody
	Object getFollowers(
			@RequestParam(value = "auid") Long auid
		) {
		
		List<Follow> followers = followRepo.findByAuid(auid);
		if (followers != null) {
			return followers;
		}

		return ErrorResponse.getError("Unsuccess to load followers of author : "+auid);
	}	
	
}
