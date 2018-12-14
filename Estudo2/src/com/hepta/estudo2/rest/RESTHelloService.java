package com.hepta.estudo2.rest;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/hello")
public class RESTHelloService {
	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;
	
	protected void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	@GET
	@Path("/world")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response world() {
		String s = "hello world";
		return Response.ok().entity(s).build();
		
	}
	
	
	@POST
	@Path("/teste")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response update() {
		return Response.ok().entity("post").build();

	}


}


