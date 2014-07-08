package com.mbooking.controller.json;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.mbooking.repository.UserRepository;

@Controller
public class ResetAction {
	@Autowired
	UserRepository userRepo;	
    @RequestMapping(value = "/reset", method = RequestMethod.POST)
	public @ResponseBody
	ModelAndView resetPassword(
			@RequestParam(value = "key") String key,
			@RequestParam(value = "npwd") String newPwd,
			@RequestParam(value = "cpwd") String confPwd){
    	
    	if(newPwd.length()==0||!newPwd.equals(confPwd)||newPwd.equals(""))
    		return new ModelAndView("redirect:/reset.jsf?success=false");
        
    	if(userRepo.resetForgetPass(newPwd, key))
    		return new ModelAndView("redirect:/reset.jsf?success=true");
    	else
    		return new ModelAndView("redirect:/reset.jsf?success=false");
        
    }    
}