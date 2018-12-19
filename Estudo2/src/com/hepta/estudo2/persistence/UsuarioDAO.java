package com.hepta.estudo2.persistence;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import com.hepta.estudo2.dto.ProdutoMercadoDTO;
import com.hepta.estudo2.entity.Usuario;

public class UsuarioDAO {
	public UsuarioDAO() {
		
	}
	
	public boolean insert(Usuario usuario) throws Exception {
		
		Connection db = ConnectionManager.getDBConnection();
		PreparedStatement pstmt = null;

		StringBuilder sql = new StringBuilder();
		
		sql.append("INSERT INTO usuario ");
		sql.append(" ( ");
		sql.append(" nome, ");
		sql.append(" email, ");
		sql.append(" senha ");
		sql.append(" ) ");
		sql.append(" VALUES (?,?,?);");
				
		
		try {
			pstmt = db.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, usuario.getNome());
			pstmt.setString(2, usuario.getEmail());
			pstmt.setString(3, usuario.getSenha());
			pstmt.executeUpdate();
			
		}finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}

		return true;

	}

	public boolean getLogin(Usuario user) throws Exception {
		boolean achou = false;
		Connection db = ConnectionManager.getDBConnection();
		PreparedStatement pstmt = null;
		
		ResultSet result = null;
		
		pstmt = db.prepareStatement("select email, senha from usuario");
		
		try {
			result = pstmt.executeQuery();
			while (result.next()) {
				if(user.getEmail().equals(result.getString("email")) && user.getSenha().equals(result.getString("senha"))) {
					achou = true;
				}
			}
		}catch (Exception e) {
			throw new Exception(e);
		} finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}
		return achou;
	}
	
}
