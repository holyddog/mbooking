package com.mbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.constant.ConstValue;
import com.mbooking.model.Book;
import com.mbooking.model.Comment;
import com.mbooking.model.Notification;
import com.mbooking.model.User;
import com.mbooking.repository.CommentRepostitoryCustom;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class CommentRepositoryImpl implements CommentRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean createComment(Long bid, Long uid,String message) {

		try {
			Query query = new Query(Criteria.where("bid").is(bid));
			query.fields().include("title").include("pic").include("uid");
			Book book = db.findOne(query, Book.class);			

			if (book != null) {
				Long now = System.currentTimeMillis();
				
				Comment comment = new Comment();
				comment.setCmid(MongoCustom.generateMaxSeq(Comment.class, db));
				comment.setBid(bid);
				comment.setUid(uid);
				comment.setComment(message);
				comment.setPdate(now);

				query = new Query(Criteria.where("uid").is(uid));
				query.fields().include("dname").include("pic");
				User user = db.findOne(query, User.class);
				comment.setDname(user.getDname());

				if (user.getPic() != null) {
					comment.setPic(user.getPic());
				}
				db.insert(comment);
				
				db.updateFirst(new Query(Criteria.where("bid").is(bid)), new Update().inc("ccount", 1), Book.class);

				Notification notf = new Notification();
				notf.setUid(book.getUid()); // set notify to book author
				notf.setUnread(true);
				
				Book b = new Book();
				b.setBid(book.getBid());
				b.setPic(book.getPic());
				b.setTitle(book.getTitle());
				notf.setBook(b);
				notf.setWho(user);
				
				notf.setAdate(now);
				
				String fullMessage = String.format(ConstValue.FOLLOWER_COMMENT_MSG_FORMAT_EN, user.getDname(), book.getTitle(), message);
				notf.setMessage(fullMessage);
				notf.setNtype(ConstValue.FOLLOWER_COMMENT);

				db.insert(notf);

				return true;
			} else
				return false;

		} catch (Exception e) {
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
