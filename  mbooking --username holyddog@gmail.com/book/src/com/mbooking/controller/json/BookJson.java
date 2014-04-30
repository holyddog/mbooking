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
import com.mbooking.repository.BookRepository;

@Controller
public class BookJson {
	@Autowired
	BookRepository bookRepo;

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
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid", required = false) Long uid) {

		Book book = null;
		if (uid != null && uid > 0) {
			book = bookRepo.findBookWithPages(bid, uid);	
		}
		else {
			book = bookRepo.findByBid(bid);	
		}
		
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
	
	@RequestMapping(method = RequestMethod.POST, value = "/publishBook.json")
	public @ResponseBody
	Object publishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "cover") String cover) {

		return ResultResponse.getResult("success", bookRepo.publishBook(bid, uid, cover));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/unpublishBook.json")
	public @ResponseBody
	Object unpublishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {

		return ResultResponse.getResult("success", bookRepo.unpublishBook(bid, uid));
	}
}