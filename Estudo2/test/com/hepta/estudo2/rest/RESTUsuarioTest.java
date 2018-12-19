package com.hepta.estudo2.rest;

import static org.junit.jupiter.api.Assertions.*;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.hepta.estudo2.entity.Usuario;

class RESTUsuarioTest {

	@BeforeAll
	static void setUpBeforeClass() throws Exception {
	}

	@Test
	void testInsert() {
		fail("Not yet implemented");
	}

	@Test
	void testLogin() {
		// DADO
		Usuario user = new Usuario();
		user.setEmail("Happyta");
		user.setSenha("Passw0rd31072017");
		
		// QUANDO
//		Response response = service.login(user);
//		System.out.println(response.getStatusInfo().getStatusCode());
		// ENTAO
//		assert(response.getStatusInfo().getStatusCode() == Status.OK.getStatusCode());
//	
	}

}
