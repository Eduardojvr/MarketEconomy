var resultado = new Vue({
    el : '#containerCliente',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue'),
        'modal-cliente' : httpVueLoader('../../resources/components/modal_cliente.vue')
    },
    data : {
    	modal: false,
    	pesquisando: false,
    	cod_ID: 0,
    	pesquisa: '',
    	titulo: '',
        clientes:[],
        clientesHeader: [
            {
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'nom_cliente',
                label: 'Cliente'
            },
            {
                key: 'nom_razao_social',
                label: 'Razão Social'
            },
            {
                key: 'endereco',
                label: 'Endereço'
            },
            {
                key: 'des_email',
                label: 'Email'
            },
            {
                key: 'num_telefone',
                label: 'Telefone'
            },
            {
                key: 'tipo_cliente.nom_dominio',
                label: 'Tipo'
            },
            {
                key: 'num_cnpj',
                label: 'CNPJ'
            },
            {
                key: 'num_inscricao_estadual',
                label: 'Nº Inscrição Estadual'
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
        buscaClientes(currentPage){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	vm.currentPage = currentPage;
        	vm.clientes = [];
        	
        	url = (vm.pesquisa == "" ? "../../rs/cliente/listarPorPagina?pagina=" + vm.currentPage 
        			: "../../rs/cliente/listarPorNome?pagina=" + vm.currentPage + "&nom=" + vm.pesquisa);
        	
        	axios.get(url)
			.then(response => {
				vm.clientes = response.data;
				$(document).ready(function(){
					$('.cep').mask('00000-000');
					$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
					$('.telefone').mask("(00) Z0000-0000", {translation: { 'Z': {pattern: /[0-9]/, optional: true}} });
				});
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao listar clientes");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        	
        },
        contaClientes(){
        	const vm = this;
        	var url;
        	
        	iniciaLoader("loader-primario");
        	
        	url = (vm.pesquisa == "" ? "../../rs/cliente/total/" : 
        		"../../rs/cliente/totalPorNome?nom=" + vm.pesquisa);

        	axios.get(url)
			.then(response => {
				vm.totalRegistros = response.data;
				vm.totalPages = Math.ceil(vm.totalRegistros/vm.perPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar clientes");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscaClientes(vm.currentPage);
            });
        },
        insereNovoCliente(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");

        	axios.post("../../rs/cliente/inserir", obj)
            .then(response => {
                vm.mostraAlertaMensagem("Cliente inserido com sucesso");
                vm.buscaClientes(1);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir cliente");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        editaCliente(obj){
        	const vm = this;
        	iniciaLoader("loader-primario");
        	
        	axios.post("../../rs/cliente/editar", obj)
            .then(response => {
                vm.mostraAlertaMensagem("Cliente editado com sucesso");
                vm.buscaClientes(vm.currentPage);
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao editar cliente");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
        },
        cria(){
        	const vm = this;
        	
        	vm.cod_cliente = 0; 
        	vm.modal = true;
        	vm.titulo = "Criar novo cliente";
        },
        edita(id){
        	const vm = this;
        	
        	vm.cod_cliente = id; 
        	vm.modal = true;
        	vm.titulo = "Editar cliente";
        },
        deleta(id){
        	const vm = this;
        	
        	var resp = confirm("Tem certeza que deseja deletar? Deletar um cliente implica em deletar todas as outras entidades que estão relacionadas a ele. Esta ação não poderá ser revertida.");
        	
        	if(resp){
        		iniciaLoader("loader-primario");
        		
	        	axios.get("../../rs/cliente/deletar?cod=" + id)
				.then(response => {
					vm.mostraAlertaMensagem("Cliente deletado com sucesso");
	            }).catch(function (error) {
	                if(error.response.status === 403){
	                	window.location = "/";
	                } else {
	                    vm.mostraAlertaErro(error, "Erro ao deletar cliente");
	                }
	            }).finally(function(){
	            	encerraLoader("loader-primario");
	            	vm.buscaClientes(vm.currentPage);
	            });
        	}
        },
        limparCampos(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.pesquisa = "";
        	vm.buscaClientes(vm.currentPage);
        },
        pesquisar(){
        	const vm = this;
        	
        	vm.currentPage = 1;
        	vm.contaClientes();
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;

        vm.sghGrupo = vm.getCookie("sghGrupo");
      
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.contaClientes();
        
    }
});
