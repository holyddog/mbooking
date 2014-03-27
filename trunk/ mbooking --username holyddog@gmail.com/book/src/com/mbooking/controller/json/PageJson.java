package com.mbooking.controller.json;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mbooking.common.ErrorResponse;
import com.mbooking.common.ResultResponse;
import com.mbooking.model.Page;
import com.mbooking.repository.PageRepository;

@Controller
public class PageJson {
	@Autowired
	PageRepository pageRepo;

	@RequestMapping(method = RequestMethod.POST, value = "/createPage.json")
	public @ResponseBody
	Object createPage(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required = false) Long date,
			@RequestParam(value = "caption", required = false) String caption

	) {
		return ResultResponse.getResult("success", pageRepo.create(bid, uid, date, pic, caption));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/editPage.json")
	public @ResponseBody
	Object editPage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required = false) Long date,
			@RequestParam(value = "caption", required = false) String caption

	) {

		Page page = pageRepo.edit(pid, uid, bid, date, pic, caption);
		if (page != null) {
			return page;
		}

		return ErrorResponse.getError("Unsuccess to edit page id: " + pid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/deletePage.json")
	public @ResponseBody
	Object deletePage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {

		return ResultResponse.getResult("success", pageRepo.delete(pid, bid, uid));
	}
}
