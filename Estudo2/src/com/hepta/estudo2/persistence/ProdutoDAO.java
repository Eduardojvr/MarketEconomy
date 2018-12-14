package com.hepta.estudo2.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

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
		sql.append(" produto ");
		sql.append(" ) ");
		sql.append(" VALUES (?);");
		
		
		try {
			pstmt = db.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, produto.getProduto());
			pstmt.executeUpdate();
			
		}finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}

		return true;

	}


}
