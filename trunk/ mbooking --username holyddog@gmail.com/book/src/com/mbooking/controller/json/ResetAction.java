package com.mbooking.controller.json;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ResetAction {
    @RequestMapping(value = "/reset", method = RequestMethod.POST)
	public @ResponseBody
	ModelAndView resetPassword(
			@RequestParam(value = "pwd") String oldPwd,
			@RequestParam(value = "npwd") String newPwd) {
    	System.out.println(oldPwd + ", " + newPwd);
    	return new ModelAndView("redirect:/reset.jsf?success=true");
	}    
}