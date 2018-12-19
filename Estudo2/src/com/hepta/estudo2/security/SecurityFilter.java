package com.hepta.estudo2.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SecurityFilter implements Filter{
	
	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpSession session = ((HttpServletRequest) req).getSession(false);
		boolean user = (boolean) session.getAttribute("logado");
		HttpServletResponse response = (HttpServletResponse) res;

		if (user) {
				chain.doFilter(request, res);
	
		} else {
			response.sendRedirect(request.getContextPath() + "/index.html");
		}

	}

}
