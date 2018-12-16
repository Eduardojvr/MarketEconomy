package com.hepta.estudo2.persistence;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import com.hepta.estudo2.entity.Mercado;

public class MercadoDAO {
	public MercadoDAO() {
		
	}
	
	public boolean insert(Mercado mercado) throws Exception {
		
		Connection db = ConnectionManager.getDBConnection();
		PreparedStatement pstmt = null;

		StringBuilder sql = new StringBuilder();
		
		sql.append("INSERT INTO mercado ");
		sql.append(" ( ");
		sql.append(" nome, ");
		sql.append(" endereco, ");
		sql.append(" foto ");
		sql.append(" ) ");
		sql.append(" VALUES (?,?,?);");
				
		
		try {
			pstmt = db.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, mercado.getNome());
			pstmt.setString(2, mercado.getEndereco());
			pstmt.setString(3, mercado.getFoto());
			pstmt.executeUpdate();
			
		}finally {
			if (pstmt != null)
				pstmt.close();
			db.close();
		}

		return true;

	}

public List<Mercado> todosMercados() throws Exception {
		Connection db = ConnectionManager.getDBConnection();
		List<Mercado> arrayList = new ArrayList<>();

		PreparedStatement pstmt = null;
		ResultSet result = null;
		
		try {
			pstmt = db.prepareStatement("SELECT * FROM mercado");
			result = pstmt.executeQuery();

			while (result.next()) {
				Mercado mercado = new Mercado();
                mercado.setId(result.getInt("id"));
                mercado.setNome(result.getString("nome"));
                mercado.setEndereco(result.getString("endereco"));
                mercado.setFoto(result.getString("foto"));
                arrayList.add(mercado);
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
