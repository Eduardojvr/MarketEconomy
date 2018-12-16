package com.hepta.estudo2.rest;


import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.hepta.estudo2.entity.Produto;
import com.hepta.estudo2.persistence.ProdutoDAO;

@Path("/product")
public class RESTHelloService {
	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;
	
	protected void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	@GET
	@Path("/get")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response world() {
		try {
			ProdutoDAO gerenciadorProduto = new ProdutoDAO();

			List<Produto> produtos = gerenciadorProduto.todosProdutos();
			Collections.reverse(produtos);
			GenericEntity<List<Produto>> entity = new GenericEntity<List<Produto>>(
					produtos) {
			};
			return Response.ok().entity(entity).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.PRECONDITION_FAILED).entity("Erro ao buscar produtos").build();
		}
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
			return Response.status(Status.BAD_REQUEST).entity("Erro ao inserir!").build();
		}
		
	}
}


