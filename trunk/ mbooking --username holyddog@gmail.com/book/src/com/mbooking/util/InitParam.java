package com.mbooking.util;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

public class InitParam  {
	
	public static String getParam(String paramName) {
		FacesContext context = FacesContext.getCurrentInstance();
		ExternalContext extContext = context.getExternalContext();
		return extContext.getInitParameter(paramName);
	}

}
