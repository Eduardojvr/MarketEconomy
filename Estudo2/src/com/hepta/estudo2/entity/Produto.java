package com.hepta.estudo2.entity;

public class Produto {
	private int id;
	private int mercadoid;
	private String nome;
	private String marca;
	private float valor;
    private String categoria;
	
    
   
	public int getMercadoid() {
		return mercadoid;
	}

	public void setMercadoid(int mercadoid) {
		this.mercadoid = mercadoid;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String produto) {
		this.nome = produto;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public float getValor() {
		return valor;
	}

	public void setValor(float valor) {
		this.valor = valor;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	
	

}
