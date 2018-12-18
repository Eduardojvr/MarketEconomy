function valida_campo (){
	if(document.getElementById("nome").value.length < 1){
		alert('Por favor, preencha o campo nome');
		document.getElementById("nome").focus();
	}else if(document.getElementById("endereco").value.length < 1){
		alert('Campo vazio');
	}
}

