var resultado = new Vue({
    el : '#containerChav',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-chav' : httpVueLoader('../../resources/components/modal_chav.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	pesquisa: '',
    	cod_chav: 0,
    	titulo: '',
    	chavsDuplicadas:[],
    	chavsDuplicadasHeader:[
    		{
    			key: 'nom',
    			label: 'Nome'
    		},
    		{
                key: 'qtd',
                label: 'Quantidade'
            },
    	],
        chavs:[],
        chavsHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'nom_chav',
                label: 'Nome'
            },
            {
                key: 'des_chav',
                label: 'Descrição'
            },
            {
                key: 'tipo_chav.nom_tipo_chav',
                label: 'Tipo'
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
        totalPages: 0,
        currentPageDuplicado: 1
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
        buscaDuplicados(){
        	const vm = this;
        	
        	iniciaLoader("loader-primario");
        	vm.cargos = [];
        	
        	axios.get("../../rs/chav/listaNomDuplicados")
			.then(response => {
				vm.chavsDuplicadas = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar duplicados");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.contaChavs();
            });
        	
        },
        buscaChavs(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.chavs = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/chav/listarPorPagina/?pagina=" + vm.currentPage 
        			: "../../rs/chav/listarPorNome/?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.chavs = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar chaves");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaChavs(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/chav/total/" : 
        		"../../rs/chav/totalPorNome?nom=" + vm.pesquisa);
        	
			axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar chavs");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaChavs(vm.currentPage);
            });
        },
        insereNovaChav(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_chav: 0,
        		nom_chav: '',
        		des_chav: '',
        		cod_tipo_chav: 0
        	};
        	
        	novo.nom_chav = obj.nom_chav;
        	novo.des_chav = obj.des_chav;
        	novo.cod_tipo_chav = obj.tipo_chav.cod_tipo_chav;
        	
        	axios.post("../../rs/chav/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Chave inserida com sucesso");
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir chav");
                }
            }).finally(function(){
            	vm.buscaChavs(vm.currentPage);
                encerraLoader("loader-primario");
                
            });
        },
        editaChav(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_chav: 0,
        		nom_chav: '',
        		des_chav: '',
        		cod_tipo_chav: 0
        	};
        	
        	novo.cod_chav = obj.cod_chav;
        	novo.nom_chav = obj.nom_chav;
        	novo.des_chav = obj.des_chav;
        	novo.cod_tipo_chav = obj.tipo_chav.cod_tipo_chav;
        	
        	axios.post("../../rs/chav/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Chave editada com sucesso");
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar chav");
                }
            }).finally(function(){
            	vm.buscaChavs(vm.currentPage);
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_chav = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar nova CHAVE";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_chav = id; 
        	vm.modal = true;
        	vm.titulo = "Editar CHAVE";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/chav/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Chave deletada com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar chavs");
	                }
	            }).finally(function(){
	            	vm.buscaChavs(vm.currentPage);
	            	encerraLoader("loader-primario");
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaChavs(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaChavs();
        },
        pesquisarDuplicados(record, index){
        	const vm = this;
        	
        	vm.pesquisa = record.nom;
        	vm.pesquisar();
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;

        vm.sghGrupo = vm.getCookie("sghGrupo");
      
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.buscaDuplicados();
        
    }
});