package com.mbooking.repository.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mbooking.model.Book;
import com.mbooking.model.Follow;
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.FollowRepostitoryCustom;
import com.mbooking.util.MongoCustom;
import com.mbooking.util.TimeUtils;

public class FollowRepositoryImpl implements FollowRepostitoryCustom {
	
	@Autowired
	private MongoTemplate db;

	@Override
	public Boolean followAuthor(Long uid, Long auid) {
	
		try{	
			Long fid = MongoCustom.generateMaxSeq(Follow.class, db);
			
			Follow follow = new Follow();
			follow.setFid(fid);
			follow.setAuid(auid);
			follow.setUid(uid);
			
			Criteria fcriteria = Criteria.where("auid").is(auid);
			Query fquery = new Query(fcriteria);
			int fcount = (int) db.count(fquery, Follow.class) + 1;
			
			Update fupdate = new Update();		
			fupdate.set("auth.fcount", fcount);
			db.updateMulti(fquery, fupdate, Follow.class );
			
			Criteria criteria = Criteria.where("uid").is(auid);
			Query query = new Query(criteria);
			query.fields().include("pic");
			query.fields().include("dname");
			query.fields().include("fcount");
			Update update = new Update();
			update.set("fcount", fcount);
			
			User auth = db.findAndModify(query, update,new FindAndModifyOptions().returnNew(true), User.class);
			
			criteria = Criteria.where("uid").is(uid);
			query = new Query(criteria);
			query.fields().include("pic");
			query.fields().include("dname");
			User foll = db.findOne(query,User.class);
					
			follow.setAuth(auth);
			follow.setFoll(foll);
			db.insert(follow);
			
			return true;
		
		}
		catch(Exception e){
			System.out.println(e);
			return false;
		}
	}
	public List<Page> findFollowingPages(Long uid) {
		try{	
				ArrayList<Page> fpages = new ArrayList<>();
				
				Criteria criteria = Criteria.where("uid").is(uid);
				Query query = new Query(criteria);
				query.fields().include("auid");
				List<Follow> follows = db.find(query, Follow.class);
				
				for(int i = 0;i<follows.size();i++){
					
					Follow follow = follows.get(i);
					Long auid = follow.getAuid();
					User author = follow.getAuth();
					author.setUid(auid);
					
					Criteria pcriteria = Criteria.where("uid").is(auid).and("lpage").exists(true);
					Query pquery = new Query(pcriteria);

					List<Page> pages = db.find(pquery, Page.class);
					for(int j=0;j<pages.size();j++){
						Page page = pages.get(i);
						Long bid = page.getBid();
						Book book = db.findOne(new Query(Criteria.where("bid").is(bid)), Book.class);
						pages.get(i).setBook(book);
						pages.get(i).setAuthor(author);
						pages.get(i).setStrtime(TimeUtils.timefromNow(page.getCdate(),System.currentTimeMillis()));
					}
					fpages.addAll(pages);
				}
				
				Collections.sort(fpages, new Comparator<Page>() {
					@Override
					public int compare(Page page1, Page page2) {
						if(page1.getCdate()>page2.getCdate()){
							return -1;
						}
						else if(page1.getCdate()<page2.getCdate()){
							return 1;
						}
						else{
							return 0;
						}
					}
			    });
				
				
				return fpages;
			}
		catch(Exception e){
			System.out.println(e);
			return null;
		}
	}
	
	public List<Book> findFollowingBooks(Long uid) {
		
		try{	
				ArrayList<Book> fbooks = new ArrayList<>();
				
				Criteria criteria = Criteria.where("uid").is(uid);
				Query query = new Query(criteria);
				query.fields().include("auid");
				List<Follow> follows = db.find(query, Follow.class);
				
				for(int i = 0;i<follows.size();i++){
					
					Follow follow = follows.get(i);
					Long auid = follow.getAuid();
					User author = follow.getAuth();
					author.setUid(auid);
					
					Criteria bcriteria = Criteria.where("uid").is(auid).and("pbdate").exists(true);
					Query bquery = new Query(bcriteria);

					
					List<Book> books = db.find(bquery, Book.class);
					for(int j=0;j<books.size();j++){
						Book book = books.get(i);
						Long pbdate = book.getPbdate();
						books.get(i).setAuthor(author);
						books.get(i).setStrtime(TimeUtils.timefromNow(pbdate,System.currentTimeMillis()));
					}
					fbooks.addAll(books);
				}
				
				Collections.sort(fbooks, new Comparator<Book>() {
					@Override
					public int compare(Book book1, Book book2) {
						if(book1.getPbdate()>book2.getPbdate()){
							return -1;
						}
						else if(book1.getPbdate()<book2.getPbdate()){
							return 1;
						}
						else{
							return 0;
						}
					}
			    });
				
				
				return fbooks;
			}
		catch(Exception e){
			System.out.println(e);
			return null;
		}
	}

}
