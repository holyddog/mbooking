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
			@RequestParam(value = "title") String title,
			@RequestParam(value = "desc") String desc,
			@RequestParam(value = "uid") Long uid,
			@RequestParam(value = "pic") String pic,
			@RequestParam(value = "fdate", required = false) Long fdate,
			@RequestParam(value = "tdate", required = false) Long tdate,
			@RequestParam(value = "tags", required = false) String[] tags) {
		
		Book book = bookRepo.create(title, desc, fdate, tdate, tags, uid, pic);
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
			@RequestParam(value = "uid") Long uid) {

		Book book = bookRepo.findBookWithPages(bid, uid);
		if (book != null) {
			return book;
		}

		return ErrorResponse.getError("Find book id: " + bid + " was not found");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/getBooksByUid.json")
	public @ResponseBody
	Object getBooksByUid(@RequestParam(value = "uid") Long uid) {
		
		List<Book> books = bookRepo.findByUid(uid);
		if (books != null && books.size() != 0) {
			return books;
		}

		return ErrorResponse.getError("Find book by uid: " + uid + " was not found");
	}

	@RequestMapping(method = RequestMethod.POST, value = "/publishBook.json")
	public @ResponseBody
	Object publishBook(
			@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {

		return ResultResponse.getResult("success", bookRepo.publish_book(bid, uid));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/unpublishBook.json")
	public @ResponseBody
	Object unpublishBook(@RequestParam(value = "bid") Long bid,
			@RequestParam(value = "uid") Long uid) {

		return ResultResponse.getResult("success", bookRepo.unpublish_book(bid, uid));
	}
}