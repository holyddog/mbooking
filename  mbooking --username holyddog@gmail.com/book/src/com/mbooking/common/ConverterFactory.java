package com.mbooking.common;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoTypeMapper;

public class ConverterFactory implements FactoryBean<MappingMongoConverter> {
	private MappingMongoConverter mongoConverter;

	public void setMongoConverter(MappingMongoConverter mongoConverter) {
		this.mongoConverter = mongoConverter;
	}

	@Override
	public MappingMongoConverter getObject() throws Exception {		
		MongoTypeMapper typeMapper = new DefaultMongoTypeMapper(null);
		mongoConverter.setTypeMapper(typeMapper);
		return mongoConverter;
	}

	@Override
	public Class<?> getObjectType() {
		return MappingMongoConverter.class;
	}

	@Override
	public boolean isSingleton() {
		return true;
	}
}
