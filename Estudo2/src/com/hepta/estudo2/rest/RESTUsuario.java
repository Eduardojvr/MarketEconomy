
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
			Usuario login = dao.getLogin(usuario);	
			
			if(login != null) {
				request.getSession().setAttribute("logado", true);
				request.getSession().setAttribute("usuario", login);
				return Response.ok().build();
			}else {
				return Response.status(Status.FORBIDDEN).build();
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			//System.out.println("Erro RESTUsuario");
			return Response.status(Status.FORBIDDEN).entity("Error class RESTUsuario").build();
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
			return Response.status(Status.FORBIDDEN).entity("Erro ao realizar logout!").build();
		}
		
	}
	
	
	
	@POST
	@Path("/isLogin")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean isLogin() {
		
		try {
			Object obj = request.getSession().getAttribute("logado");
			if(request.getSession() == null || obj.equals(false)){
				return false;
			}else {
				return true;
			}
			
		} catch (Exception e) {
			//e.printStackTrace();
			return false;
		}
		
		
	}

	@GET
	@Path("/getUser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userAut() {		

		try {
			Usuario user = (Usuario)request.getSession().getAttribute("usuario");
			return Response.ok().entity(user).build();
			
		}catch(Exception e) {
			e.printStackTrace();
			return Response.status(Status.FORBIDDEN).build();
		}
		
	
	}
}


