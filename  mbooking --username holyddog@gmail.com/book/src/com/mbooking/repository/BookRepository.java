package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Book;

public interface BookRepository extends MongoRepository<Book, String>, BookRepostitoryCustom {
	@Query(value="{ 'uid' : ?0 }", fields="{ 'bid' : 1 ,'title' : 1,'pic' : 1}")
	List<Book> findByUid(Long uid);
	
}