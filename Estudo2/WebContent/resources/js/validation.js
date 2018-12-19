function validator(){
	
	if(vm.foto == null){
		obj.foto = '';
	}
	if (vm.nome == null || vm.endereco == null) {
		alert("Os campos marcados com asterisco são obrigatórios!");
	}else{
			axios.post('rs/market/insert',obj).then(function (response) {
			console.log(response);
			alert("Cadastro realizado com sucesso!");
        });
	}	
}
