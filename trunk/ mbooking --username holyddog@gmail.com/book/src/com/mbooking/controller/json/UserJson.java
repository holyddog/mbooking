package com.mbooking.controller.json;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.model.User;
import com.mbooking.repository.UserRepository;

@Controller
public class UserJson {
	@Autowired
	UserRepository userRepo;
	
	@RequestMapping(method = RequestMethod.GET, value = "/user.json")
	public @ResponseBody User getUser(@RequestParam(value = "uid") Long uid) {
		return userRepo.findByUid(uid);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/login.json")
	public @ResponseBody User login(@RequestParam(value = "email") String email) {
		return userRepo.login(email, null);
	}
}