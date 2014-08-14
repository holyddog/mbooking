package com.mbooking.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.mbooking.model.Conf;

public interface ConfRepository extends MongoRepository<Conf, String>{
	List<Conf> findAll();
}