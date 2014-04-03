package com.mbooking.controller.json;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.common.ErrorResponse;
import com.mbooking.common.ResultResponse;
import com.mbooking.model.Book;
import com.mbooking.model.User;
import com.mbooking.repository.BookRepository;
import com.mbooking.repository.UserRepository;

@Controller
public class UserJson {
	@Autowired
	UserRepository userRepo;	
	@Autowired
	BookRepository bookRepo;

	@RequestMapping(method = RequestMethod.GET, value = "/getProfile.json")
	public @ResponseBody Object checkUserName(
			@RequestParam(value = "uid") Long uid
			) {
		User user = userRepo.findById(uid);
		if (user != null) {
			List<Book> books = bookRepo.findLastBookByUid(uid);
			user.setBooks(books);
			return user;
		}
		return ErrorResponse.getError("User not found");
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
	
	@RequestMapping(method = RequestMethod.POST, value = "/signIn.json")
	public @ResponseBody Object signIn(
			@RequestParam(value = "login") String loginName,
			@RequestParam(value = "pwd") String password
			) {
		User user = userRepo.signIn(loginName, password);
		if (user != null) {
			return user;
		}
		return ErrorResponse.getError("Invalid email/username or password");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/signUp.json")
	public @ResponseBody User signUp(
			@RequestParam(value = "email") String email,
			@RequestParam(value = "pwd") String password,
			@RequestParam(value = "dname") String displayName,
			@RequestParam(value = "uname") String userName) {
		return userRepo.signUp(email, password, displayName, userName);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/changePassword.json")
	public @ResponseBody Object changePassword(
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "oldpwd") String oldpassword,
			@RequestParam(value = "newpwd") String newpassword
			) {
		return ResultResponse.getResult("result", userRepo.changePassword(uid, oldpassword, newpassword)!= null);
	}
	
}