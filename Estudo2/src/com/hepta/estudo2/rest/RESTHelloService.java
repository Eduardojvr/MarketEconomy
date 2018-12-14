package com.hepta.estudo2.rest;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.hepta.estudo2.entity.Produto;
import com.hepta.estudo2.persistence.ProdutoDAO;

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
	@Path("/insert")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response insert(Produto p) {
		ProdutoDAO dao = new ProdutoDAO();
		
		try {
			dao.insert(p);
			return Response.ok().entity("deu tudo certo").build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).entity("Erro ao buscar auditorias").build();
		}
		
		

	}


}


