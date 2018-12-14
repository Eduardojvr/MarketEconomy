var resultado = new Vue({
    el : '#containerEmpresa',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-empresa' : httpVueLoader('../../resources/components/modal_empresa.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	pesquisa: '',
    	cod_empresa: 0,
    	titulo: '',
        empresas:[],
        empresasHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'nom_empresa',
                label: 'Nome'
            },
            {
                key: 'des_empresa',
                label: 'Descrição'
            },
            {
                key: 'ind_parceira',
                label: 'Parceira'
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
        buscaEmpresas(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.empresas = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/empresa/listarPorPagina/?pagina=" + vm.currentPage 
        			: "../../rs/empresa/listarPorNome/?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.empresas = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar empresas");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaEmpresas(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/empresa/total/" : 
        		"../../rs/empresa/totalPorNome?nom=" + vm.pesquisa);
        	
			axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar empresas");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaEmpresas(vm.currentPage);
            });
        },
        insereNovaEmpresa(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_empresa: 0,
        		nom_empresa: '',
        		des_empresa: '',
        		ind_parceira: false
        	};
        	
        	novo.nom_empresa = obj.nom_empresa;
        	novo.des_empresa = obj.des_empresa;
        	novo.ind_parceira = obj.ind_parceira;
        	
        	axios.post("../../rs/empresa/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Empresa inserida com sucesso");
                vm.buscaEmpresas(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir empresa");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaEmpresa(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_empresa: 0,
        		nom_empresa: '',
        		des_empresa: '',
        		ind_parceira: false
        	};
        	
        	novo.cod_empresa = obj.cod_empresa;
        	novo.nom_empresa = obj.nom_empresa;
        	novo.des_empresa = obj.des_empresa;
        	novo.ind_parceira = obj.ind_parceira;
        	
        	axios.post("../../rs/empresa/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Empresa editada com sucesso");
                vm.buscaEmpresas(vm.currentPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar empresa");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_empresa = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar nova empresa";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_empresa = id; 
        	vm.modal = true;
        	vm.titulo = "Editar empresa";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Deletar uma empresa implica em deletar todos os certificados associados a ela. Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/empresa/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Empresa deletada com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar empresa");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaEmpresas(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaEmpresas(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaEmpresas();
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;

        vm.sghGrupo = vm.getCookie("sghGrupo");
      
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.contaEmpresas();
        
    }
});