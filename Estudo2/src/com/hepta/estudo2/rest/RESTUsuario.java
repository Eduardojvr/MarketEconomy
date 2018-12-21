
package com.hepta.estudo2.rest;


import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.hepta.estudo2.entity.Usuario;
import com.hepta.estudo2.persistence.UsuarioDAO;

@Path("/user")
public class RESTUsuario {
	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;
	
	protected void setRequest(HttpServletRequest request) {
		this.request = request;
	}

//	@GET
//	@Path("/getall")
//	@Produces({ MediaType.APPLICATION_JSON })
//	public Response world() {
//		try {
//			UsuarioDAO gerenciadorUsuario = new UsuarioDAO();
//
//			List<Usuario> usuarios = gerenciadorUsuario.todosUsuario();
//			Collections.reverse(usuarios);
//			GenericEntity<List<Usuario>> entity = new GenericEntity<List<Usuario>>(
//					usuarios) {
//			};
//			return Response.ok().entity(entity).build();
//		} catch (Exception e) {
//			e.printStackTrace();
//			return Response.status(Status.PRECONDITION_FAILED).entity("Erro ao buscar usuarios").build();
//		}
//	}
//	

	
	@POST
	@Path("/insert")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response insert(Usuario usuario) {
		UsuarioDAO dao = new UsuarioDAO();
		
		try {
			dao.insert(usuario);
			return Response.ok().entity("Usuario cadastrado").build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).entity("Erro ao cadastrar!").build();
		}
		
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response login(Usuario usuario) {
		UsuarioDAO dao = new UsuarioDAO();
		
		try {
			boolean login = dao.getLogin(usuario);
			request.getSession().setAttribute("logado", login);
			if(login) {
				return Response.ok().status(Status.OK).build();
			}else {
				return Response.status(Status.FORBIDDEN).build();
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(Status.FORBIDDEN).entity("Erro ao cadastrar!").build();
		}
		
	}
	
	
	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response logout() {
		
		try {
			if(request.getSession() != null){
				request.getSession().setAttribute("logado", false);
				return Response.ok().status(Status.OK).build();
			}else {
				return Response.status(Status.FORBIDDEN).build();
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(Status.FORBIDDEN).entity("Erro ao cadastrar!").build();
		}
		
	}
}


