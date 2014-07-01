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
import com.mbooking.model.Comment;
import com.mbooking.repository.ActivityRepository;
import com.mbooking.repository.CommentRepository;

@Controller
public class CommentJson {
	@Autowired
	CommentRepository commentRepo;
	@Autowired
	ActivityRepository actRepo;
	
	@RequestMapping(method = RequestMethod.POST, value = "/postComment.json")
	public @ResponseBody
	Object postComment(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "comment") String comment
		) {
		
		boolean success = commentRepo.createComment(bid, uid, comment);
		if (success) {
			actRepo.commented(uid, bid, comment);
		}
		return ResultResponse.getResult("success", success);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/findCommentsByBid.json")
	public @ResponseBody
	Object findComments(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "skip", required = false) Integer skip,
			@RequestParam(value = "limit", required = false) Integer limit
		) {
		
		List<Comment> comments = commentRepo.findCommentsByBid(bid, skip, limit);
		if(comments!=null){
			return comments;
		}
		
		return  ErrorResponse.getError("Unsuccess to load comments by book id: " + bid);
	}
	
}
