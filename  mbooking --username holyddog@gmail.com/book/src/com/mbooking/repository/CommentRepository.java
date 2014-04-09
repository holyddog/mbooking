package com.mbooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mbooking.model.Comment;

public interface CommentRepository extends MongoRepository<Comment, String>, CommentRepostitoryCustom {

}