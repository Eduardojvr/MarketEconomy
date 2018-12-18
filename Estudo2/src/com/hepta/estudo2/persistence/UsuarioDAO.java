package com.hepta.estudo2.persistence;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

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

	public List<Usuario> todosUsuario() {
		// TODO Auto-generated method stub
		return null;
	}
}
