package com.mbooking;

import java.util.Locale;
import java.util.TimeZone;

public class StartUp {
	public StartUp() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Bangkok"));
		Locale.setDefault(Locale.US);
	}
}
