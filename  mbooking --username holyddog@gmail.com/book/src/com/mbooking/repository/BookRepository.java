package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Book;

public interface BookRepository extends MongoRepository<Book, String>, BookRepostitoryCustom {
	@Query(value="{ 'uid' : ?0 }", fields="{ 'bid' : 1 ,'title' : 1,'pic' : 1}")
	List<Book> findByUid(Long uid);
	@Query(value="{ 'bid' : ?0 }", fields="{ 'bid' : 1 ,'title' : 1,'desc' : 1, 'pic': 1, 'pub': 1, 'pcount': 1, 'pbdate': 1, 'tags': 1 }")
	Book findByBid(Long bid);
}