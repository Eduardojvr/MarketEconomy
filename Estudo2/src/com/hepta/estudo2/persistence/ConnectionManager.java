
package com.hepta.estudo2.persistence;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionManager implements Serializable {
	private static final long serialVersionUID = 1L;
	private static final String DB_DRIVER = "com.mysql.cj.jdbc.Driver";
	/*
	 * * ######## PRODUÇÃO #########################################################
	 * *
	 */ private static final String DB_CONNECTION = "jdbc:mysql://localhost:3306/banco?serverTimezone=America/Sao_Paulo&useSSL=false";
	private static final String DB_USER = "root";
	private static final String DB_PASSWORD = "slash35006578";
	/*
	 * * ######## HOMOLOGAÇÃO
	 * ######################################################### private static
	 * final String DB_CONNECTION =
	 * "jdbc:mysql://localhost:3306/heptaauditoria?serverTimezone=America/Sao_Paulo&useSSL=false";
	 * private static final String DB_USER = "root"; private static final String
	 * DB_PASSWORD = "root";
	 */ Connection dbConnection = null;

	public static Connection getDBConnection() throws Exception {
		return getDBConnection(DB_CONNECTION, DB_USER, DB_PASSWORD);
	}

	public static Connection getDBConnection(String conn, String user, String pass) throws Exception {
		Connection dbConnection = null;
		Class.forName(DB_DRIVER);
		dbConnection = DriverManager.getConnection(conn, user, pass);
		return dbConnection;
	}
}
