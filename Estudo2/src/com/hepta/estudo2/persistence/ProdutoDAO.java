package com.hepta.estudo2.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

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
		sql.append(" categoria ");
		sql.append(" ) ");
		sql.append(" VALUES (?,?,?,?);");
				
		
		try {
			pstmt = db.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, produto.getNome());
			pstmt.setString(2, produto.getMarca());
			pstmt.setFloat(3, produto.getValor());
			pstmt.setString(4, produto.getCategoria());
			pstmt.executeUpdate();
			
		}finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}

		return true;

	}

public List<Produto> todosProdutos() throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		List<Produto> arrayList = new ArrayList<>();

		PreparedStatement pstmt = null;
		ResultSet result = null;
		
		try {
			pstmt = db.prepareStatement("SELECT * FROM produto");
			result = pstmt.executeQuery();

			while (result.next()) {
				Produto produto = new Produto();
                produto.setId(result.getInt("id"));
                produto.setNome(result.getString("nome"));
                produto.setMarca(result.getString("marca"));
                produto.setValor(result.getFloat("valor"));
                produto.setCategoria(result.getString("categoria"));
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


}
