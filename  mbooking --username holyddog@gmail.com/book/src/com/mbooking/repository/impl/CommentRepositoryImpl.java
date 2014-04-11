package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;

import com.mbooking.model.Book;
import com.mbooking.model.Comment;
import com.mbooking.model.User;
import com.mbooking.repository.CommentRepostitoryCustom;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class CommentRepositoryImpl implements CommentRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean createComment(Long bid, Long uid,String comment) {
		
		try{			
			Book book = db.findOne(new Query(Criteria.where("bid").is(bid)),Book.class);
			
			if(book!=null){
				Comment comment_obj = new Comment();
				comment_obj.setBid(bid);
				comment_obj.setUid(uid);
				comment_obj.setComment(comment);
				comment_obj.setPdate(System.currentTimeMillis());
				
				User user = db.findOne(new Query(Criteria.where("uid").is(uid)), User.class);
				comment_obj.setDname(user.getDname());
				
				if(user.getPic()!=null&&!user.getPic().equals("")&&!user.getPic().equals("undefined"))
				{
					comment_obj.setPic(user.getPic());
					
				}
		
				db.insert(comment_obj);
			
				NotificationRepositoryImpl.sendCommentFromFollowerNotification(uid, bid,user.getDname(),user.getPic(), comment, book.getTitle(), book.getPic());
				return true;	
			}
			else
				return false;
			
		}catch(Exception e){
			System.out.println(e);
			return false;
			
		}
		
	}

	@Override
	public List<Comment> findCommentsByBid(Long bid,Integer skip,Integer limit) {
		
		Query query = new Query(Criteria.where("bid").is(bid));
		query.sort().on("pdate",Order.DESCENDING);
		
		if(skip!=null&&limit!=null&&limit!=0){
			query.skip(skip);
			query.limit(limit);
		}
		
		List<Comment> comments = db.find(query, Comment.class);
		
		for(Comment comment : comments){
			Long pdate = comment.getPdate();
			if(pdate!=null){
				
				comment.setStrtime(TimeUtils.timefromNow(pdate, System.currentTimeMillis()));
				
			}
		}
		
		return comments;
	}
	

}
