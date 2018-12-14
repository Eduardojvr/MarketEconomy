var resultado = new Vue({
    el : '#containerGPC',
    components: {
        'alerta' : httpVueLoader('../../resources/components/alerta.vue')
    },
    data : {
        sghGrupo:"",
        nomeCompleto:"",
        qtdSolicitacoes: 0,
        vis:
        {
            mostraGeral:false,
            mostraFinanceiro:false,
            mostraGPC:false    
        },
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
        populaNomeCompleto(data){
            const vm = this;
            vm.nomeCompleto = data;
        },
        buscaQtdSolicitacoes(){
        	const vm = this;
        	axios.get("../../rs/solicitacao/totalNaoAprovado/")
			.then(response => {
				vm.qtdSolicitacoes = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                	window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar solicitações");
                }
            }).finally(function(){
            	encerraLoader("loader-primario");
            });
        }
    },
    
    /* ON LOAD */
    created: function() {
        const vm = this;
        iniciaLoader("loader-primario");
        vm.sghGrupo = vm.getCookie("sghGrupo");
        vm.vis = resolverVisualizacao(vm.sghGrupo);

        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.buscaQtdSolicitacoes();
        
    }
});