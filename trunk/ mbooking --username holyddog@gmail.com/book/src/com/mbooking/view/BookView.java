package com.mbooking.view;

import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.mbooking.model.Book;
import com.mbooking.model.Page;
import com.mbooking.repository.BookRepository;

@Component
@Scope("request")
public class BookView {
	@Autowired
	BookRepository bookRepo;
	
	@Value("#{request.getParameter('key')}")
	private String key;
	
	@PostConstruct
	public void init() {
		book = bookRepo.findBookWithPagesByBid(null, key);
		
		if (book != null) {
			coverPic = getImage(book.getPic(), "_c");
			
			pages = book.getPages();
			if (pages != null) {
				for (int i = 0; i < pages.size(); i++) {
					Page p = pages.get(i);
					p.setPic(getImage(p.getPic(), "_c"));
				}
				Collections.reverse(pages);
				pageSize = pages.size();
			}

			if (book.getAuthor() != null) {
				authorPic = getImage(book.getAuthor().getPic(), "_sp");
			}
		}		
	}
	
	private String getImage(String pic, String suffix) {
		if (pic == null) {
			return null;
		}
		return pic.substring(0, pic.lastIndexOf('.')) + suffix + pic.substring(pic.lastIndexOf('.'), pic.length());
	}
	
	private Book book;
	private List<Page> pages;
	private int pageSize;
	private String authorPic, coverPic;
	
	public Book getBook() {
		return book;
	}

	public List<Page> getPages() {
		return pages;
	}

	public int getPageSize() {
		return pageSize;
	}

	public String getCoverPic() {
		return coverPic;
	}

	public String getAuthorPic() {
		return authorPic;
	}
}
