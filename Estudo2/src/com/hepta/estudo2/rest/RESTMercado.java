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

import com.hepta.estudo2.entity.Mercado;
import com.hepta.estudo2.persistence.MercadoDAO;

@Path("/market")
public class RESTMercado {
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
			MercadoDAO gerenciadorProduto = new MercadoDAO();

			List<Mercado> mercados = gerenciadorProduto.todosMercados();
			Collections.reverse(mercados);
			GenericEntity<List<Mercado>> entity = new GenericEntity<List<Mercado>>(
					mercados) {
			};
			return Response.ok().entity(entity).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.PRECONDITION_FAILED).entity("Erro ao buscar mercados").build();
		}
	}
	

	
	@POST
	@Path("/insert")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response insert(Mercado p) {
		MercadoDAO dao = new MercadoDAO();
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


