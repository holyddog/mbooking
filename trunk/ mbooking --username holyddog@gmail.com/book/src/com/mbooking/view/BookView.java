package com.mbooking.view;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.mbooking.model.Book;
import com.mbooking.repository.BookRepository;

@Component
@Scope("request")
public class BookView {
	@Autowired
	BookRepository bookRepo;
	
	@Value("#{request.getParameter('bid')}")
	private Long bookId;
	
	@PostConstruct
	public void init() {
		book = bookRepo.findBookWithPagesByBid(bookId);
	}
	
	private Book book;
	public Book getBook() {
		return book;
	}
}
