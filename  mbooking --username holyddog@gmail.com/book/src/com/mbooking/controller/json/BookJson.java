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
import com.mbooking.model.User;
import com.mbooking.repository.ActivityRepository;
import com.mbooking.repository.BookRepository;

@Controller
public class BookJson {
	@Autowired
	BookRepository bookRepo;
	@Autowired
	ActivityRepository actRepo;

	@RequestMapping(method = RequestMethod.POST, value = "/createBook.json")
	public @ResponseBody
	Object createBook(
			@RequestParam(value = "bid", required = false) Long bid,
			@RequestParam(value = "title") String title,
			@RequestParam(value = "desc", required = false) String desc,
			@RequestParam(value = "uid", required = false) Long uid,
			@RequestParam(value = "pic", required = false) String pic,
			@RequestParam(value = "fdate", required = false) Long fdate,
			@RequestParam(value = "tdate", required = false) Long tdate,
			@RequestParam(value = "tags", required = false) String[] tags,
			@RequestParam(value = "pub", required = false) Boolean pub) {
		
		Book book = bookRepo.create(bid, title, desc, fdate, tdate, tags, uid, pic, pub);
		if (book != null) {
			return book;
		}

		return ErrorResponse.getError("Unsuccess to create book");
	}

	@RequestMapping(method = RequestMethod.POST, value = "/editBook.json")
	public @ResponseBody
	Object editBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "title") String title,
			@RequestParam(value = "desc") String desc,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "fdate", required = false) Long fdate,
			@RequestParam(value = "tdate", required = false) Long tdate,
			@RequestParam(value = "tags", required = false) String[] tags) {
		
		Book book = bookRepo.edit(bid, title, desc, fdate, tdate, tags, uid,
				pic);
		if (book != null) {
			return book;
		}

		return ErrorResponse.getError("Unsuccess to edit book id: " + bid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/deleteBook.json")
	public @ResponseBody
	Object editBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {
		return ResultResponse.getResult("success", bookRepo.delete(bid, uid));
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getBook.json")
	public @ResponseBody
	Object getBook(
			@RequestParam(value = "bid", required = false) Long bid,
			@RequestParam(value = "uid", required = false) Long uid,
			@RequestParam(value = "key", required = false) String key,
			@RequestParam(value = "gid", required = false) Long guestId,
			@RequestParam(value = "count", required = false) Boolean isCount) {

		Book book = null;
		if ((uid != null && uid > 0) || (key!=null&&(!key.equals(""))&&(!key.equals("undefined")))) {
			book = bookRepo.findBookWithPages(bid, uid, guestId,key, isCount);	
		}
		else if(bid != null && bid > 0){
			book = bookRepo.findByBid(bid);	
		}
		else{
			return ErrorResponse.getError("Find book id: invalid parameter");	
		}	
		
		if (book != null) {
			return book;
		}

		return ErrorResponse.getError("Find book" + (bid!=null?("bid :"+bid):(key!=null?("key :"+key):"")) + " was not found");
	}

	//Web View Mode
	@RequestMapping(method = RequestMethod.GET, value = "/getBookByUid.json")
	public @ResponseBody
	Object getBookByUid(
			@RequestParam(value = "bid") Long bid) {

		Book book = bookRepo.findBookWithPagesByBid(bid, null);	

		if (book != null) {
			return book;
		}

		return ErrorResponse.getError("Find book id: " + bid + " was not found");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/getBooksByUid.json")
	public @ResponseBody
	Object getBooksByUid(@RequestParam(value = "uid") Long uid,
						@RequestParam(value = "pbstate", required = false) Integer pbstate,
						@RequestParam(value = "skip", required = false) Integer  skip,
						@RequestParam(value = "limit", required = false) Integer limit) { 	// 0:all , 1:publish, 2:un-publish
		List<Book> books;
		
		books = bookRepo.findBooksByUid(uid, pbstate, skip, limit);
		
		if (books != null) {
			return books;
		}

		return ErrorResponse.getError("Find books by uid: " + uid + " was not found");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getPublishBooks.json")
	public @ResponseBody
	Object getPublishBooks(
			@RequestParam(value = "skip", required = false) Integer  skip,
			@RequestParam(value = "limit", required = false) Integer limit)  {
		
		List<Book> books = bookRepo.findByPbdateExists(true,skip,limit);
		if (books != null && books.size() != 0) {
			return books;
		}

		return ErrorResponse.getError("Has no publish books");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getPublishBooksByTag.json")
	public @ResponseBody
	Object getPublishBooksByTag(
			@RequestParam(value = "tag") String tag,
			@RequestParam(value = "skip", required = false) Integer  skip,
			@RequestParam(value = "limit", required = false) Integer limit)  {
		
		List<Book> books = bookRepo.findByPbdateExistsByTag(tag, skip, limit);
		if (books != null) {
			return books;
		}
		return ErrorResponse.getError("Has no publish books");
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/publishBook.json")
	public @ResponseBody
	Object publishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "cover") String cover) {

		User user = bookRepo.publishBook(bid, uid, cover);
		if (user != null) {
			actRepo.published(uid, bid);
		}
		return ResultResponse.getResult("user", user);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/unpublishBook.json")
	public @ResponseBody
	Object unpublishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {

		return ResultResponse.getResult("user", bookRepo.unpublishBook(bid, uid));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/changeCover.json")
	public @ResponseBody
	Object changeCover(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "cover") String newCover) {

		return ResultResponse.getResult("success", bookRepo.changeCover(bid, newCover));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/updateTag.json")
	public @ResponseBody
	Object updateTag(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "tag") String tag,
			@RequestParam(value = "isNew") Boolean isNew) {
		
		Boolean res = false;
		if (isNew) {
			res = bookRepo.addTag(bid, tag);
		}
		else {
			res = bookRepo.removeTag(bid, tag);
		}
		return ResultResponse.getResult("success", res);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/likeBook.json")
	public @ResponseBody
	Object likeBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "like") Boolean like
			) {
		boolean success = bookRepo.likeBook(bid, uid, like);
		return ResultResponse.getResult("success", success);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/favBook.json")
	public @ResponseBody
	Object favBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "fav") Boolean fav
			) {
		boolean success = bookRepo.favBook(bid, uid, fav);
		return ResultResponse.getResult("success", success);
	}
}