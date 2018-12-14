var resultado = new Vue({
    el : '#containerCargo',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-cargo-gpc' : httpVueLoader('../../resources/components/modal_cargo_gpc.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	cod_cargo: 0,
    	pesquisa: '',
    	titulo: '',
    	cargosDuplicados: [],
    	cargosDuplicadosHeader: [
    		{
    			key: 'nom',
    			label: 'Nome'
    		},
    		{
                key: 'qtd',
                label: 'Quantidade'
            },
            
    	],
        cargos:[],
        cargosHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'nom_cargo',
                label: 'Nome'
            },
            {
                key: 'des_cargo',
                label: 'Descrição'
            },
            {
                key: 'vlr_salario',
                label: 'Salário'
            },
            {
                key: 'ind_temporario',
                label: 'Temporário'
            },
            {
                key: 'contrato.cliente.nom_cliente',
                label: 'Cliente'
            },
            {
                key: 'num_nom_contrato',
                label: 'Contrato'
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
        	
        	axios.get("../../rs/cargo/listaNomDuplicados")
			.then(response => {
				vm.cargosDuplicados = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar duplicados");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.contaCargos();
            });
        	
        },
        buscaCargos(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.cargos = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/cargo/listarPorPagina?pagina=" + vm.currentPage 
        			: "../../rs/cargo/listarPorNome?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.cargos = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar cargos");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaCargos(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/cargo/total/" : 
        		"../../rs/cargo/totalPorNome?nom=" + vm.pesquisa);

        	axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar cargos");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaCargos(vm.currentPage);
            });
        },
        insereNovoCargo(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
            		contrato: {
            			cliente: {
            				cod_cliente: 0,
            				nom_cliente: ''
            			},
            			cod_contrato: 0,
            			num_contrato: '',
            			nom_contrato: ''
            		},
            		cod_cargo: 0,
            		nom_cargo: '',
            		vlr_salario: 0,
            		des_cargo: '',
            		dth_registro: null,
            		ind_temporario: false
            	};
            	
            	novo.contrato.cod_contrato = obj.contrato.cod_contrato;
            	novo.contrato.num_contrato = obj.contrato.num_contrato;
            	novo.contrato.nom_contrato = obj.contrato.nom_contrato;
            	novo.contrato.cliente.cod_cliente = obj.contrato.cliente.cod_cliente;
            	novo.contrato.cliente.nom_cliente = obj.contrato.cliente.nom_cliente;
            	novo.nom_cargo = obj.nom_cargo;
            	novo.vlr_salario = obj.vlr_salario;
            	novo.des_cargo = obj.des_cargo;
        	
        	axios.post("../../rs/cargo/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Cargo inserido com sucesso");
                vm.buscaCargos(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir cargo");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaCargo(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		contrato: {
        			cliente: {
        				cod_cliente: 0,
        				nom_cliente: ''
        			},
        			cod_contrato: 0,
        			num_contrato: '',
        			nom_contrato: ''
        		},
        		cod_cargo: 0,
        		nom_cargo: '',
        		vlr_salario: 0,
        		des_cargo: '',
        		dth_registro: null,
        		ind_temporario: false
        	};
        	
        	novo.contrato.cod_contrato = obj.contrato.cod_contrato;
        	novo.contrato.num_contrato = obj.contrato.num_contrato;
        	novo.contrato.nom_contrato = obj.contrato.nom_contrato;
        	novo.contrato.cliente.cod_cliente = obj.contrato.cliente.cod_cliente;
        	novo.contrato.cliente.nom_cliente = obj.contrato.cliente.nom_cliente;
        	novo.cod_cargo = obj.cod_cargo;
        	novo.nom_cargo = obj.nom_cargo;
        	novo.vlr_salario = obj.vlr_salario;
        	novo.des_cargo = obj.des_cargo;

        	axios.post("../../rs/certificacao/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Cargo editado com sucesso");
                vm.buscaCertificacoes(vm.currentPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar cargo");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_cargo = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar novo cargo";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_cargo = id; 
        	vm.modal = true;
        	vm.titulo = "Editar cargo";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/cargo/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Cargo deletado com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar cargo");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaCargos(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaCargos(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaCargos();
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