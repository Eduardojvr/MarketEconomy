new Vue({
	el: "#meus-controles",
	components: {
		'alerta' : httpVueLoader('../resources/components/alerta.vue')
	},
	data: {
		controlesDePagamento: [],
		controlesDePagamentoHeader: [
			{sortable: true, key: "codCP", label:"Código"},
			{sortable: true, key: "periodo", label:"Período"},
			{sortable: true, key: "cliente", label:"Cliente"},
			{sortable: true, key: "contrato", label:"Contrato"},
			{sortable: true, key: "descricao", label:"Descrição"}
		],
		cpFiltro: null,
		cpFiltrados: [],
		cpTotal: 0
	},
	created: function() {
		const vm = this;
		vm.verificaMensagens();
		vm.buscaControlesDePagamento();
	},
	methods: {
		getCookie(cname) {
            const vm = this;
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
		buscaControlesDePagamento() {
			const vm = this;
			iniciaLoader("loader-primario");
			
			axios.get("/controleDePagamento/rs/cp/list")
			.then(response => {
				const cps = response.data;
				for (var i = 0; i < cps.length; i++) {
					var cp = {};
					cp["codCP"] = cps[i].codCP;
					cp["periodo"] = new Date(cps[i].dtaCP).toLocaleDateString('pt-BR');
					cp["cliente"] = cps[i].contrato.cliente.nomCliente;
					cp["contrato"] = cps[i].contrato.numContrato;
					cp["descricao"] = cps[i].desCP;
					vm.controlesDePagamento.push(cp);
				}
				
				vm.cpTotal = vm.controlesDePagamento.length;
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível buscar a lista de controles de pagamento");
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		verDetalhesCP: function(cp, index) {
			location.href='controle-pagamento.html?cod=' + cp.codCP;
		},
		filtrarCP(cpFiltrados) {
			this.cpTotal = cpFiltrados.length;
			//this.currentPage = 1;
		},
		verificaMensagens() {
			const cpExcluido = getParams("cp-excluido");
			if (cpExcluido) {
				vm.mostraAlertaMensagem("CP" + cpExcluido + " excluído com sucesso!");
			}
		}
	}
});