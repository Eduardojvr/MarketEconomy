var resultado = new Vue({
    el : '#containerGeral',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'paginacao' : httpVueLoader('../../resources/components/b-table-paginacao.vue')
    },
    data : {
        sghGrupo:"",
        nomeCompleto:"",
        listaClientes: [],
        solicitacoes:[],
        solicitacoesHeader: [
        	{
                key: 'index',
                label: 'Nº'
            },
            {
                key: 'cargo.nom_cargo',
                label: 'Cargo'
            },
            {
                key: 'cod_cliente',
                label: 'Cliente'
            },
            {
                key: 'nom_pessoa',
                label: 'Criador'
            },
            {
                key: 'nom_area',
                label: 'Área'
            },
            {
                key: 'nom_funcao_efetiva',
                label:"Função efetiva"
            },
            {
                key: 'ind_aprovado',
                label: 'Aprovado?'
            },
            {
                key: 'dta_abertura',
                label: 'Data abertura'
            },
            {
                key: 'dth_registro',
                label: 'Data registro'
            },
            {
                key: 'actions',
                label: 'Ações'
            }
        ],
        solicitacoesContabilizados: 0,
        perPage: 10,
        currentPage: 1,
        totalPages: 0,
        vis:
        {
            mostraGeral:false,
            mostraFinanceiro:false,
            mostraGPC:false    
        }
       
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
        buscaCamposExtras(){
            const vm = this;
            var clientes = vm.listaClientes;
            
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/solicitacao/camposExtras")
            .then(response => {
                for(var i=0;i<vm.solicitacoes.length;i++){
                    var s = vm.solicitacoes[i];
                    s.nom_area = response.data.area[parseInt(s.nom_area)];
                    s.formacao = response.data.formacao[parseInt(s.formacao)];
                    s.nom_experiencia = response.data.tempoExperiencia[parseInt(s.nom_experiencia)];
                    s.nom_motivo_recrutamento = response.data.motivoRecrutamento[parseInt(s.nom_motivo_recrutamento)];
                    s.nom_horario = response.data.horarioTrabalho[parseInt(s.nom_horario)];
                    s.dta_admissao = formatDateDMY(new Date(s.dta_admissao));
                    s.dta_abertura = formatDateDMY(new Date(s.dta_abertura));
                    s.dth_registro = formatDateDMY(new Date(s.dth_registro));
                    s.ind_aprovado = s.ind_aprovado ? "Sim" : "Não";
                    s.ind_pcd = s.ind_pcd ? "Sim" : "Não";
                    var aux_cod_cliente = parseInt(s.cod_cliente);
                    for(var j=0;j<clientes.length;j++){
                        if(clientes[j].cod_cliente == aux_cod_cliente){
                            s.cod_cliente = clientes[j].nom_cliente;
                            break;
                        }
                    }
                }
            }).catch(function (error) {
                vm.mostraAlertaErro(error, "Erro ao buscar campos extras");
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        },
        editarSolicitacaoHandler(record,index){
            iniciaLoader("loader-primario");
            document.location.href = "../geral/abertura_vaga.html?id="+record.cod_solicitacao;
        },
        buscarSolicitacoes(currentPage){
            const vm = this;
            iniciaLoader("loader-primario");
            
            vm.currentPage = currentPage;
            
            axios.get("../../rs/solicitacao/listarPorPagina?pagina=" + vm.currentPage)
            .then(response => {
                vm.solicitacoes = response.data;
            }).catch(function (error) {
                if(error.response.status === 403)
                    window.location = "/";
                else
                    vm.mostraAlertaErro(error, "Erro ao buscar solicitacoes");
            }).finally(function(){
            	vm.buscaClientes();
            	encerraLoader("loader-primario");
            });
        },
        buscaClientes(){
            const vm = this;
            var url;

            iniciaLoader("loader-primario");
            
            
            axios.get("../../rs/cliente/listar")
            .then(response => {
                vm.listaClientes = response.data;
                if(vm.listaClientes.length > 0){
                    vm.buscaCamposExtras();
                }
            }).catch(function (error) {
                vm.mostraAlertaErro(error, "Erro ao buscar clientes");
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        },
        aprovaSolicitacaoVaga(){

        },
        suspendeSolicitacaoVaga(){

        },
        deletaSolicitacaoVaga(){

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
        contaSolicitacoes(){
            const vm = this;
            
            iniciaLoader("loader-primario");

            axios.get("../../rs/solicitacao/total/")
            .then(response => {
                vm.totalPages = response.data;
            }).catch(function (error) {
                if(error.response.status === 403)
                    window.location = "/";
                else
                    vm.mostraAlertaErro(error, "Erro ao buscar solicitacoes");
            }).finally(function(){
            	encerraLoader("loader-primario");
            	vm.buscarSolicitacoes(vm.currentPage);
            });
        }

    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;
        
        vm.sghGrupo = vm.getCookie("sghGrupo");
        vm.vis = resolverVisualizacao(vm.sghGrupo);
        vm.contaSolicitacoes();
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../errorPage.html");
        }
    }
});