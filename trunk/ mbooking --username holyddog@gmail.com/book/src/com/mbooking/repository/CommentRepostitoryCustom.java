package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mbooking.model.Comment;


public interface CommentRepostitoryCustom{
	
	public Boolean createComment(
			Long bid,		//Tune by indexing collection with bid
			Long uid,
			String comment
	);

	public List<Comment> findCommentsByBid(Long bid,Integer skip,Integer limit);
	
}
