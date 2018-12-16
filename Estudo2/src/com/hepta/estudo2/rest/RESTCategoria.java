package com.hepta.estudo2.rest;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.hepta.estudo2.entity.Categoria;
import com.hepta.estudo2.persistence.CategoriaDAO;

@Path("/category")
public class RESTCategoria {
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
			CategoriaDAO gerenciadorProduto = new CategoriaDAO();

			List<Categoria> categorias = gerenciadorProduto.todasCategorias();
			Collections.reverse(categorias);
			GenericEntity<List<Categoria>> entity = new GenericEntity<List<Categoria>>(
					categorias) {
			};
			return Response.ok().entity(entity).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.PRECONDITION_FAILED).entity("Erro ao buscar categorias").build();
		}
	}	
}


