package com.hepta.estudo2.rest;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.hepta.estudo2.dto.ProdutoMercadoDTO;
import com.hepta.estudo2.entity.Produto;
import com.hepta.estudo2.entity.Usuario;
import com.hepta.estudo2.persistence.ProdutoDAO;

@Path("/product")
public class RESTProduto {
	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;

	protected void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	@POST
	@Path("/get")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response todosProdutos(String id) {

		try {
			ProdutoDAO gerenciadorProduto = new ProdutoDAO();

			List<ProdutoMercadoDTO> produtos = gerenciadorProduto.todosProdutos(id);
			Collections.reverse(produtos);
			GenericEntity<List<ProdutoMercadoDTO>> entity = new GenericEntity<List<ProdutoMercadoDTO>>(produtos) {
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

	@POST
	@Path("/pesquisa")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response pesquisa(String query) {

		try {
			ProdutoDAO gerenciadorProduto = new ProdutoDAO();

			List<ProdutoMercadoDTO> produtos = gerenciadorProduto.pesquisaProduto(query);

			ProdutoMercadoDTO aux = new ProdutoMercadoDTO();
			for (int i = 0; i < produtos.size() - 1; i++) {
				for (int j = 0; j < produtos.size() - 1; j++) {
					if (produtos.get(j).getValor() > produtos.get(j + 1).getValor()) {
						aux.setIdProduto(produtos.get(j).getIdProduto());
						aux.setCategoria(produtos.get(j).getCategoria());
						aux.setNomeProduto(produtos.get(j).getNomeProduto());
						aux.setMarca(produtos.get(j).getMarca());
						aux.setValor(produtos.get(j).getValor());
						aux.setMercado(produtos.get(j).getMercado());
						aux.setEndereco(produtos.get(j).getEndereco());
						aux.setIdUsuario(produtos.get(j).getIdUsuario());

						produtos.get(j).setIdProduto(produtos.get(j + 1).getIdProduto());
						produtos.get(j).setCategoria(produtos.get(j + 1).getCategoria());
						produtos.get(j).setNomeProduto(produtos.get(j + 1).getNomeProduto());
						produtos.get(j).setMarca(produtos.get(j + 1).getMarca());
						produtos.get(j).setValor(produtos.get(j + 1).getValor());
						produtos.get(j).setMercado(produtos.get(j + 1).getMercado());
						produtos.get(j).setEndereco(produtos.get(j + 1).getEndereco());
						produtos.get(j).setIdUsuario(produtos.get(j + 1).getIdUsuario());

						produtos.get(j + 1).setIdProduto(aux.getIdProduto());
						produtos.get(j + 1).setCategoria(aux.getCategoria());
						produtos.get(j + 1).setNomeProduto(aux.getNomeProduto());
						produtos.get(j + 1).setMarca(aux.getMarca());
						produtos.get(j + 1).setValor(aux.getValor());
						produtos.get(j + 1).setMercado(aux.getMercado());
						produtos.get(j + 1).setEndereco(aux.getEndereco());
						produtos.get(j + 1).setIdUsuario(aux.getIdUsuario());

					}

				}

			}

			GenericEntity<List<ProdutoMercadoDTO>> entity = new GenericEntity<List<ProdutoMercadoDTO>>(produtos) {
			};
			return Response.ok().entity(entity).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.PRECONDITION_FAILED).entity("Erro ao buscar produtos").build();
		}

	}

	@POST
	@Path("/deleteProduct")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response deleteProduct(String id) {

		ProdutoDAO dao = new ProdutoDAO();
		try {
			dao.delete(id);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;

	}

	@POST
	@Path("/update")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response update(Produto p) {

		ProdutoDAO dao = new ProdutoDAO();

		try {
			dao.update(p);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

	}

}
