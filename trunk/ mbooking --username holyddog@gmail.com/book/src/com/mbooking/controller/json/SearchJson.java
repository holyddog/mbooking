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
import com.mbooking.model.Tag;
import com.mbooking.model.User;
import com.mbooking.repository.BookRepository;
import com.mbooking.repository.UserRepository;
import com.mbooking.util.Convert;

@Controller
public class SearchJson {
	@Autowired
	UserRepository userRepo;	
	@Autowired
	BookRepository bookRepo;
	
	@RequestMapping(method = RequestMethod.GET, value = "/findUsersByName.json")
	public @ResponseBody
	Object findUsers(
			@RequestParam(value = "keyword") String keyword
			) {
		List<User> users = userRepo.findUsersByName(Convert.toString(keyword));
		if (users != null) {
			return users;
		}
		return ErrorResponse.getError("An internal error");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/findBooksByTitle.json")
	public @ResponseBody
	Object findBooksByTitle(
			@RequestParam(value = "keyword") String keyword
			) {
		List<Book> books = bookRepo.findBooksByTitle(Convert.toString(keyword));
		if (books != null) {
			return books;
		}
		return ErrorResponse.getError("An internal error");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/findTags.json")
	public @ResponseBody
	Object findTags(
			@RequestParam(value = "keyword") String keyword
			) {
		List<Tag> tags = bookRepo.findTags(Convert.toString(keyword));
		if (tags != null) {
			return tags;
		}
		return ErrorResponse.getError("An internal error");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/findBooksByTag.json")
	public @ResponseBody
	Object findBooksByTag(
			@RequestParam(value = "tag") String tag
			) {
		List<Book> books = bookRepo.findBooksByTag(tag);
		if (books != null) {
			return books;
		}
		return ErrorResponse.getError("An internal error");
	}
}