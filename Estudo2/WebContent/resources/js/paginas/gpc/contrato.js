var resultado = new Vue({
    el : '#containerContrato',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-contrato' : httpVueLoader('../../resources/components/modal_contrato.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	cod_contrato: 0,
    	pesquisa: '',
    	titulo: '',
        contratos:[],
        contratosHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'cliente.nom_cliente',
                label: 'Cliente'
            },
            {
                key: 'num_contrato',
                label: 'Nº Contrato'
            },
            {
                key: 'nom_contrato',
                label: 'Nome Contrato'
            },
            {
                key: 'dta_inicio',
                label: 'Data de início'
            },
            {
                key: 'dta_fim',
                label: 'Data de fim'
            },
            {
                key: 'ind_ativo',
                label: 'Ativo'
            },
            {
                key: 'dta_inicio',
                label: 'Contrato'
            },
            {
                key: 'actions',
                label: 'Ações'
            }
        ],
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
        buscaContratos(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.contratos = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/contrato/listarPorPagina?pagina=" + vm.currentPage 
        			: "../../rs/contrato/listarPorNome?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.contratos= response.data;
				for(var i = 0; i < vm.contratos.length; i++){
					if(vm.contratos[i].dta_inicio != null){
						vm.contratos[i].dta_inicio = createDateFromSQLString(vm.contratos[i].dta_inicio).toLocaleDateString();
					}
					if(vm.contratos[i].dta_fim != null){
						vm.contratos[i].dta_fim = createDateFromSQLString(vm.contratos[i].dta_fim).toLocaleDateString();
					}
				}
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar contratos");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaContratos(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/contrato/total/" : 
        		"../../rs/contrato/totalPorNome?nom=" + vm.pesquisa);

        	axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar contratos");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaContratos(vm.currentPage);
            });
        },
        insereNovoContrato(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	 var novo = {
                     cliente: {
                         cod_cliente: -1,
                         nom_cliente: ''
                     },
                     cod_contrato: -1,
                     num_contrato: '',
                     nom_contrato: '',   
                     des_contrato: '',   
                     dta_inicio: null,
                     dta_fim: null,
                     ind_ativo: false,
                 };
        	
 	       	novo.cliente = obj.cliente;
 	       	novo.num_contrato = obj.num_contrato;
 	       	novo.nom_contrato = obj.nom_contrato;
 	       	novo.des_contrato = obj.des_contrato;
 	       	if(obj.dta_inicio > 0){
 	       		novo.dta_inicio = obj.dta_inicio.addHours(3).getTime();
 	       	}
 	       	if(obj.dta_fim > 0){
 	       		novo.dta_fim = obj.dta_fim.addHours(3).getTime();
 	       	}
 	       	novo.ind_ativo = obj.ind_ativo;

        	axios.post("../../rs/contrato/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Contrato inserido com sucesso");
                vm.buscaContratos(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir contrato");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaContrato(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
                    cliente: {
                        cod_cliente: -1,
                        nom_cliente: ''
                    },
                    cod_contrato: -1,
                    num_contrato: '',
                    nom_contrato: '',   
                    des_contrato: '',   
                    dta_inicio: null,
                    dta_fim: null,
                    ind_ativo: false,
                };
	       	
        	novo.cod_contrato = obj.cod_contrato;
	       	novo.cliente = obj.cliente;
	       	novo.num_contrato = obj.num_contrato;
	       	novo.nom_contrato = obj.nom_contrato;
	       	novo.des_contrato = obj.des_contrato;
	       	if(obj.dta_inicio > 0){
	       		novo.dta_inicio = obj.dta_inicio.getTime();
	       	}
	       	if(obj.dta_fim > 0){
	       		novo.dta_fim = obj.dta_fim.getTime();
	       	}
	       	novo.ind_ativo = obj.ind_ativo;
        	
        	//PASSE DE OBJ PARA NOVO

        	axios.post("../../rs/contrato/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Contrato editado com sucesso");
                vm.buscaContratos(vm.currentPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar contrato");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_contrato = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar novo contrato";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_contrato = id; 
        	vm.modal = true;
        	vm.titulo = "Editar contrato";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/contrato/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Contrato deletado com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar contrato");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaContratos(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaContratos(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaContratos();
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;

        vm.sghGrupo = vm.getCookie("sghGrupo");
      
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.contaContratos();
        
    }
});
