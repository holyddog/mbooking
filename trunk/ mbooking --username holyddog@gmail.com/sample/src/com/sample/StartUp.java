package com.sample;

import java.util.Locale;
import java.util.TimeZone;

import javax.servlet.http.HttpServlet;

public class StartUp extends HttpServlet {
	private static final long serialVersionUID = -5288508765274338718L;

	public StartUp() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Bangkok"));
		Locale.setDefault(Locale.US);
	}
}
