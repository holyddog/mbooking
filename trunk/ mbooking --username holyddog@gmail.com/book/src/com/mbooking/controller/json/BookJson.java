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
import com.mbooking.model.Page;
import com.mbooking.model.User;
import com.mbooking.repository.BookRepository;
import com.mbooking.repository.PageRepository;
import com.mbooking.repository.UserRepository;

@Controller
public class BookJson {
	@Autowired
	BookRepository bookRepo;
	PageRepository pageRepo;
	
	@RequestMapping(method = RequestMethod.POST, value = "/createBook.json")
	public @ResponseBody Object createBook(
			@RequestParam(value = "title") String title,
			@RequestParam(value = "desc") String desc,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "fdate", required=false) Long fdate,
			@RequestParam(value = "tdate", required=false) Long tdate,
			@RequestParam(value = "tags", required=false) String[] tags
			) 
	{	
		Book book =  bookRepo.create(title, desc, fdate, tdate, tags, uid, pic);
		if(book!=null){
			return book;
		}
		
		return ErrorResponse.getError("Unsuccess to create book");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/editBook.json")
	public @ResponseBody Object editBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "title") String title,
			@RequestParam(value = "desc") String desc,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "fdate", required=false) Long fdate,
			@RequestParam(value = "tdate", required=false) Long tdate,
			@RequestParam(value = "tags", required=false) String[] tags
			) 
	{	
		Book book = bookRepo.edit(bid, title, desc, fdate, tdate, tags, uid, pic);
		if(book!=null){
			return book;
		}
		
		return ErrorResponse.getError("Unsuccess to edit book id: "+bid);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/deleteBook.json")
	public @ResponseBody Object editBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid
			) 
	{	
		Boolean success = bookRepo.delete(bid, uid);
		
		if(success){
			return success;
		}
		
		return ErrorResponse.getError("Unsuccess to delete book id:"+bid);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/createPage.json")
	public @ResponseBody Object createPage(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required=false) Long date,
			@RequestParam(value = "caption", required=false) String caption
				
			) 
	{
		Boolean success = pageRepo.create(bid, uid, date, pic, caption); 
		if(success){
			return success;
		}
		
		return ErrorResponse.getError("Unsuccess to create page");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/editPage.json")
	public @ResponseBody Object editPage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "date", required=false) Long date,
			@RequestParam(value = "caption", required=false) String caption

			) {

		Page page = pageRepo.edit(pid, uid, bid, date, pic, caption); 
		
		if(page!=null){
			return page;
		}
		
		return ErrorResponse.getError("Unsuccess to edit page id: "+pid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/deletePage.json")
	public @ResponseBody Object deletePage(
			@RequestParam(value = "pid") Long pid,
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid
			) {

		Boolean success = pageRepo.delete(pid, bid, uid);
		
		if(success){
			return success;
		}
		
		return ErrorResponse.getError("Unsuccess to delete page id:"+pid);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getBook.json")
	public @ResponseBody Object getBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid
			) {

		Book book = bookRepo.findBookWithPages(bid, uid);
		
		if(book!=null){
			return book;
		}
		
		return ErrorResponse.getError("Find book id: "+bid+" was not found");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getBooksByUid.json")
	public @ResponseBody Object getBooksByUid(
			@RequestParam(value = "uid") Long uid
			) {

		List<Book> books = bookRepo.findByUid(uid);
		
		if(books!=null&&books.size()!=0){
			return books;
		}
		
		return ErrorResponse.getError("Find book by uid: "+uid+" was not found");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/publishBook.json")
	public @ResponseBody Object publishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid
			) {

		Boolean success = bookRepo.publish_book(bid, uid);
		
		if(success){
			return success;
		}
		
		return ErrorResponse.getError("Unsuccess to publish book id:"+bid);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/unpublishBook.json")
	public @ResponseBody Object unpublishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid
			) {

		Boolean success = bookRepo.unpublish_book(bid, uid);
		
		if(success){
			return success;
		}
		
		return ErrorResponse.getError("Unsuccess to unpublish book id:"+bid);
	}
}