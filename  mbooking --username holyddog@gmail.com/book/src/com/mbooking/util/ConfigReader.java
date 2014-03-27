package com.mbooking.util;

import java.io.IOException;
import java.util.Properties;

public class ConfigReader {
	public static String getProp(String name) {
		Properties prop = new Properties();
		try {
			prop.load(ConfigReader.class.getClassLoader().getResourceAsStream("config.properties"));

			return prop.getProperty(name);

		} catch (IOException ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
