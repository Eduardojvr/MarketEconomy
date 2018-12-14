var resultado = new Vue({
    el : '#containerTipoChav',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-tipochav' : httpVueLoader('../../resources/components/modal_tipochav.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	pesquisa: '',
    	cod_tipo_chav: 0,
    	titulo: '',
        tipos:[],
        tiposHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'nom_tipo_chav',
                label: 'Nome'
            },
            {
                key: 'des_tipo_chav',
                label: 'Descrição'
            },
            {
                key: 'actions',
                label: 'Ações'
            }
        ],
        solicitacoesContabilizados: 0,
        perPage: 10,
        currentPage: 1,
        totalRegistros: 0,
        totalPages: 0
    },
    mounted: function(){

    },
    methods: {
        getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        mostraAlertaErro(erro,str){
            const vm = this;
            var childIndex = hasChild(vm,"alerta");
            if(childIndex !== -1)
                vm.$children[childIndex].mostraErro(erro,str);  
        },
        mostraAlertaMensagem(str){
            const vm = this;
            var childIndex = hasChild(vm,"alerta");
            if(childIndex !== -1)
                vm.$children[childIndex].mostraMsg(str);
        },
        buscaTipos(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.tipos = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/tipochav/listarPorPagina/?pagina=" + vm.currentPage 
        			: "../../rs/tipochav/listarPorNome/?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.tipos = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar tipos de chavs");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaTipos(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/tipochav/total/" : 
        		"../../rs/tipochav/totalPorNome?nom=" + vm.pesquisa);
        	
			axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar tipos de chavs");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaTipos(vm.currentPage);
            });
        },
        insereNovoTipo(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_tipo_chav: 0,
        		nom_tipo_chav: '',
        		des_tipo_chav: ''
        	};
        	
        	novo.nom_tipo_chav = obj.nom_tipo_chav;
        	novo.des_tipo_chav = obj.des_tipo_chav;
        	
        	axios.post("../../rs/tipochav/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Tipo de chave inserido com sucesso");
                vm.buscaTipos(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir tipo de chave");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaTipo(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_tipo_chav: 0,
        		nom_tipo_chav: '',
        		des_tipo_chav: ''
        	};
        	
        	novo.cod_tipo_chav = obj.cod_tipo_chav;
        	novo.nom_tipo_chav = obj.nom_tipo_chav;
        	novo.des_tipo_chav = obj.des_tipo_chav;
        	
        	axios.post("../../rs/tipochav/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Tipo de chave editada com sucesso");
                vm.buscaTipos(vm.currentPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar tipo de chave");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_tipo_chav = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar novo tipo de CHAVE";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_tipo_chav = id; 
        	vm.modal = true;
        	vm.titulo = "Editar tipo de CHAVE";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Deletar um tipo de chave implicará em deletar todas as chaves associadas a ela. Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/tipochav/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Tipo de chave deletada com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar tipo de chave");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaTipos(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaTipos(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaTipos();
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;

        vm.sghGrupo = vm.getCookie("sghGrupo");
      
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.contaTipos();
        
    }
});