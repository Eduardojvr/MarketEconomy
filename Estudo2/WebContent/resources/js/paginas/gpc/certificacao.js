var resultado = new Vue({
    el : '#containerCertificacao',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-certificacao' : httpVueLoader('../../resources/components/modal_certificacao.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	cod_certificacao: 0,
    	pesquisa: '',
    	titulo: '',
    	certificacoesDuplicadas: [],
    	certificacoesDuplicadasHeader: [
    		{
    			key: 'nom',
    			label: 'Nome'
    		},
    		{
                key: 'qtd',
                label: 'Quantidade'
            },
            
    	],
        certificacoes:[],
        certificacoesHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'empresa.nom_empresa',
                label: 'Empresa'
            },
            {
                key: 'num_certificacao',
                label: 'Número'
            },
            {
                key: 'nom_certificacao',
                label: 'Nome'
            },
            {
                key: 'des_certificacao',
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
        	
        	axios.get("../../rs/certificacao/listaNomDuplicados")
			.then(response => {
				vm.certificacoesDuplicadas = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar duplicados");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.contaCertificacoes();
            });
        	
        },
        buscaCertificacoes(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.certificacoes = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/certificacao/listarPorPagina/?pagina=" + vm.currentPage 
        			: "../../rs/certificacao/listarPorNome/?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.certificacoes = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar certificações");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaCertificacoes(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/certificacao/total/" : 
        		"../../rs/certificacao/totalPorNome?nom=" + vm.pesquisa);

        	axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar certificações");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaCertificacoes(vm.currentPage);
            });
        },
        insereNovaCertificacao(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_certificacao: 0,
        		cod_empresa: 0,
        		nom_certificacao: '',
        		num_certificacao: '',
        		des_certificacao: '',
        		ind_manual: false,
        		ind_temporario: false
        	};
        	
        	novo.cod_empresa = obj.cod_empresa;
        	novo.nom_certificacao = obj.nom_certificacao;
        	novo.num_certificacao = obj.num_certificacao;
        	novo.des_certificacao = obj.des_certificacao;
        	
        	axios.post("../../rs/certificacao/inserir", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Certificação inserida com sucesso");
                vm.buscaCertificacoes(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir certificação");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaCertificacao(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	var novo = {
        		cod_certificacao: 0,
        		cod_empresa: 0,
        		nom_certificacao: '',
        		num_certificacao: '',
        		des_certificacao: '',
        		ind_manual: false,
        		ind_temporario: false
        	};
        	
        	novo.cod_certificacao = obj.cod_certificacao;
        	novo.cod_empresa = obj.cod_empresa;
        	novo.nom_certificacao = obj.nom_certificacao;
        	novo.num_certificacao = obj.num_certificacao;
        	novo.des_certificacao = obj.des_certificacao;
        	
        	axios.post("../../rs/certificacao/editar", novo)
            .then(response => {
                vm.mostraAlertaMensagem("Tipo de chave editada com sucesso");
                vm.buscaCertificacoes(vm.currentPage);
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
        	
        	vm.cod_certificacao = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar nova certificação";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_certificacao = id; 
        	vm.modal = true;
        	vm.titulo = "Editar certificação";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/certificacao/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Certificação deletada com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar certificação");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaCertificacoes(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaCertificacoes(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaCertificacoes();
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