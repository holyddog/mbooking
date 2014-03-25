package com.mbooking.util;

import java.lang.annotation.Annotation;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class MongoCustom {
	public static long generateMaxSeq(Class<?> cls, MongoTemplate db) {
		Annotation a = cls.getAnnotations()[0];
		String collName = (String) AnnotationUtils.getAnnotationAttributes(a).get("collection");
		
		DBCollection coll = db.getCollection("counters");
		
		BasicDBObject find = new BasicDBObject();
		find.put("_id", collName);
		
		if (coll.findOne(find) == null) {
			BasicDBObject gen = new BasicDBObject();
	        gen.put("_id", collName);
	        gen.put("c", 1);
	        
	        coll.insert(gen);
		}		
		
		DBObject update = new BasicDBObject("$inc", new BasicDBObject("c", 1));
		
		Object val = coll.findAndModify(find, update).get("c");
		if (val instanceof Double) {
			val = (double) val;
		}
		return new Long(val.toString());
	}
}
