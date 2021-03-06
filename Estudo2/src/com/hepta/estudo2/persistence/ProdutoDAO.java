package com.hepta.estudo2.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.hepta.estudo2.dto.ProdutoMercadoDTO;
import com.hepta.estudo2.entity.Produto;

public class ProdutoDAO {
	public ProdutoDAO() {

	}

	public boolean insert(Produto produto) throws Exception {

		Connection db = ConnectionManager.getDBConnection();
		PreparedStatement pstmt = null;

		StringBuilder sql = new StringBuilder();

		sql.append("INSERT INTO produto ");
		sql.append(" ( ");
		sql.append(" nome, ");
		sql.append(" marca, ");
		sql.append(" valor, ");
		sql.append(" categoria, ");
		sql.append(" mercadoId, ");
		sql.append(" usuarioId ");
		sql.append(" ) ");
		sql.append(" VALUES (?,?,?,?,?,?);");

		try {
			pstmt = db.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, produto.getNome());
			pstmt.setString(2, produto.getMarca());
			pstmt.setFloat(3, produto.getValor());
			pstmt.setString(4, produto.getCategoria());
			pstmt.setInt(5, produto.getMercadoid());
			pstmt.setInt(6, produto.getIdUsuario());
			pstmt.executeUpdate();

		} finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}

		return true;

	}

	public List<ProdutoMercadoDTO> todosProdutos(String id) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		List<ProdutoMercadoDTO> arrayList = new ArrayList<>();

		PreparedStatement pstmt = null;

		ResultSet result = null;

		try {
//			pstmt = db.prepareStatement(
//					"select produto.id, produto.nome, produto.marca, produto.valor, produto.categoria, mercado.nome, mercado.endereco from produto\n"
//							+ "INNER JOIN mercado ON produto.mercadoId = mercado.id");
			pstmt = db.prepareStatement(
					"select * from produto inner join mercado on produto.mercadoId = mercado.id inner join usuario on produto.usuarioId=usuario.id where usuario.id="
							+ id);

			result = pstmt.executeQuery();

			while (result.next()) {
				ProdutoMercadoDTO produto = new ProdutoMercadoDTO();
				produto.setIdProduto(result.getInt("produto.id"));
				produto.setNomeProduto(result.getString("produto.nome"));
				produto.setMarca(result.getString("produto.marca"));
				produto.setValor(result.getFloat("produto.valor"));
				produto.setCategoria(result.getString("produto.categoria"));
				produto.setMercado(result.getString("mercado.nome"));
				produto.setEndereco(result.getString("mercado.endereco"));
				arrayList.add(produto);
			}
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}
		return arrayList;
	}

	public List<ProdutoMercadoDTO> pesquisaProduto(String query) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		List<ProdutoMercadoDTO> arrayList = new ArrayList<>();

		PreparedStatement pstmt = null;

		ResultSet result = null;

		String querySql = "select produto.id, produto.nome, produto.marca, produto.valor, produto.categoria, mercado.nome, mercado.endereco from produto INNER JOIN mercado ON produto.mercadoId = mercado.id where produto.nome like"
				+ "'%" + query + "%'";

		try {
			pstmt = db.prepareStatement(querySql);
			result = pstmt.executeQuery();

			while (result.next()) {
				ProdutoMercadoDTO produto = new ProdutoMercadoDTO();

				produto.setIdProduto(result.getInt("produto.id"));
				produto.setNomeProduto(result.getString("produto.nome"));
				produto.setMarca(result.getString("produto.marca"));
				produto.setValor(result.getFloat("produto.valor"));
				produto.setCategoria(result.getString("produto.categoria"));
				produto.setMercado(result.getString("mercado.nome"));
				produto.setEndereco(result.getString("mercado.endereco"));
				arrayList.add(produto);
			}
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}
		return arrayList;
	}

	public boolean delete(String query) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		Statement st = null;
		String querySql = "delete from produto where id=" + query;

		try {
			st = db.createStatement();
			st.executeUpdate(querySql);
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (st != null)
				st.close();
			db.close();
		}
		return false;

	}

	public boolean update(Produto p) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		Statement st = null;

		String querySql = "update produto set nome=" + "'" + p.getNome() + "', marca=" + "'" + p.getMarca()
				+ "', valor=" + "'" + p.getValor() + "', categoria=" + "'" + p.getCategoria() + "', mercadoId=" + "'"
				+ p.getMercadoid() + "'" + " where id=" + p.getId();

		try {
			st = db.createStatement();
			st.executeUpdate(querySql);
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (st != null)
				st.close();
			db.close();
		}
		return false;

	}
	
	public int soma_like(String idProduto) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		
		Statement st = null;
		
		PreparedStatement pstmt = null;

		ResultSet result = null;

		int certificado = 0;
		
		//String de busca
		String busca =  "select * from produto where id=" + idProduto;
		try {
			pstmt = db.prepareStatement(busca);
			result = pstmt.executeQuery();
		}catch(Exception e) {
			throw new Exception(e);
		}
		
		while (result.next()) {
			certificado  = result.getInt("produto.certificado");
		}
		
		//String de atualização
		certificado+=1;
		String querySql = "update produto set certificado="+ certificado + " where id=" + idProduto;
		
		try {
			st = db.createStatement();
			st.executeUpdate(querySql);
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (st != null)
				st.close();
			db.close();
		}
		return certificado;

	}
	
	public int subtrai_like(String idProduto) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		
		Statement st = null;
		
		PreparedStatement pstmt = null;

		ResultSet result = null;

		int certificado = 0;
		
		//String de busca
		String busca =  "select * from produto where id=" + idProduto;
		try {
			pstmt = db.prepareStatement(busca);
			result = pstmt.executeQuery();
		}catch(Exception e) {
			throw new Exception(e);
		}
		
		while (result.next()) {
			certificado  = result.getInt("produto.certificado");
		}
		
		//String de atualização
		certificado-=1;
		String querySql = "update produto set certificado="+ certificado + " where id=" + idProduto;
		
		try {
			st = db.createStatement();
			st.executeUpdate(querySql);
		} catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (st != null)
				st.close();
			db.close();
		}
		return certificado;

	}


	public int controle_like(String idProduto) throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		
		PreparedStatement pstmt = null;
		
		ResultSet result = null;
		
		int certificado = 0;
		
		//String de busca
		String busca =  "select * from produto where id=" + idProduto;
		
		
		
		try {
			pstmt = db.prepareStatement(busca);
			result = pstmt.executeQuery();
			while (result.next()) {
				certificado  = result.getInt("produto.certificado");
			}

		}catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}
		return certificado;
		
	}

}
