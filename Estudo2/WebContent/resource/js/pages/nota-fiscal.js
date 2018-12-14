var cp = new Vue({
	el:"#nf",
	components: {
        'alerta' : httpVueLoader('../resources/components/alerta.vue'),
        'nf-acao' : httpVueLoader('../resources/components/nota-fiscal-acao.vue')
    },
	data: {
		acao: {
			tipo: '',
			data: ''
		},
		dtaEmissaoFormatada: '',
		notaFiscal: {
			codNotaFiscal: '',
			numNF: '',
			naturezaServico: {
				codNaturezaServico: '',
				nomNaturezaServico: ''
			},
			controleDePagamento: {
				codCP: '',
				codEstado: '',
				contrato: {
					cliente: '',
					codContrato: '',
					dtaFim: '',
					dtaInicio: '',
					dthRegistro: '',
					indAtivo: '',
					nomContrato: '',
					numContrato: ''
				},
				desCP: '',
				dtaCP: '',
				numGlosa: '',
				situacao: {
					codSituacao: '',
					nomSituacao: ''
				}
			},
			numOS: '',
			desPeriodoFaturado: '',
			desServico: '',
			numQuantidade: '',
			numValorUnitario: '',
			numValorTotal: '',
			desDocumentosNecessarios: '',
			dtaEmissao: '',
			numValorBrutoNF: '',
			numValorLiquidoF: '',
			desNF: '',
			desPeriodoFaturado: '',
			situacao: {
				codSituacao: '',
				nomSituacao: ''
			}
		},
		listaNatureza: [],
		pendencias: [],
		pendenciasHeader: [
			{sortable: false, key: "estado", label:"Estado"},
			{sortable: false, key: "dtaInclusaoFormatada", label:"Data de inclusão"},
			{sortable: false, key: "tipoPendencia.desTitulo", label:"Descrição"},
			{sortable: false, key: "tipoPendencia.desResponsavel", label:"Responsável"},
			{sortable: false, key: "dtaLimiteFormatada", label:"Data limite"},
			{sortable: false, key: "dtaResolucaoFormatada", label:"Data de resolução"}
		]
	},
	created: function() {
		let vm =  this;
		iniciaLoader("loader-primario");
		vm.notaFiscal.titulo = getParams('item');
		vm.getItem(vm.notaFiscal);
		vm.buscaPendencias();
		vm.buscaNatureza();
		encerraLoader("loader-primario");

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
		buscaNatureza: function(){
			const vm = this;
			iniciaLoader("loader-primario");
			
			axios.get("/controleDePagamento/rs/natureza/nf/list/")
			.then(response => {
				vm.listaNatureza = response.data;
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi listar natureza de serviços");
			}).finally(function() {
				encerraLoader("loader-primario");
			});
		},
		buscaPendencias: function() {
			const vm = this;
			 let itensNF = [];
			iniciaLoader("loader-primario");
			axios.get("/controleDePagamento/rs/pendenciasNF/get/" + vm.notaFiscal.titulo)
			.then(response => {
				if (response.data) {
					vm.pendencias = response.data;
					
					for(var i = 0; i < vm.pendencias.length; i++){
						setEstado(vm.pendencias[i]);
						vm.pendencias[i]["dtaInclusaoFormatada"] = new Date(vm.pendencias[i].dtaInclusao).toLocaleDateString('pt-BR');
						vm.pendencias[i]["dtaLimiteFormatada"] = new Date(vm.pendencias[i].dtaLimite).toLocaleDateString('pt-BR');
						if(vm.pendencias[i].dtaResolucao)
							vm.pendencias[i]["dtaResolucaoFormatada"] = new Date(vm.pendencias[i].dtaResolucao).toLocaleDateString('pt-BR');
						else
							vm.pendencias[i]["dtaResolucaoFormatada"] = '';
						//console.log(vm.pendencias[i].tipoPendencia);
					}
				}
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível buscar Nota Fiscal " + vm.notaFiscal.titulo);
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		getItem: function (item){
			vm = this;
			iniciaLoader("loader-primario");
			//mock do Item
			//const db = JSON.parse(localStorage.getItem("DB"));
			//return db.notasFiscais.find(cp => cp.titulo == item.titulo);
			axios.get("/controleDePagamento/rs/nf/get/" + vm.notaFiscal.titulo)
			.then(response => {
				if (response.data) {
					vm.notaFiscal = response.data;
					//console.log(vm.notaFiscal);
					if (vm.notaFiscal.dtaEmissao) {
						var dta = vm.notaFiscal.dtaEmissao;
						vm.notaFiscal["dtaEmissao"] = new Date(dta).toLocaleDateString('pt-BR');
						vm.dtaEmissaoFormatada = formatDate(dta);
					}
					if (vm.notaFiscal.dtaPagamento) {
						vm.notaFiscal["dtaPagamentoFormatada"] = new Date(vm.notaFiscal.dtaPagamento).toLocaleDateString('pt-BR');
					}
					if(isNullUndefined(vm.notaFiscal.naturezaServico)){
						vm.notaFiscal.naturezaServico = {
								codNaturezaServico: '',
								nomNaturezaServico: ''
						}
					}
					
					this.$refs.acao.defineBotoes(vm.notaFiscal.situacao.codSituacao);
					this.$refs.acao.defineCodNF(vm.notaFiscal.codNotaFiscal);
				}
				
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível buscar NF" + vm.notaFiscal.codNotaFiscal);
			}).finally(function(){
				encerraLoader("loader-primario");
			});
			
		},
		verDetalhesPendencia: function(pendencia, index) {
			const item = pendencia.item;
			if (item.toUpperCase().indexOf("CP") == 0) {
				location.href='controle-pagamento.html?item=' + item;
			} else if (item.toUpperCase().indexOf("NF") == 0) {
				location.href='nota-fiscal.html?item=' + item;
			} else {
				vm.mostraAlertaErro("Erro", "Não foi possível abrir essa pendência");
			}
		},
		salvaNotaFiscal: function(){
			let vm = this;
			
			iniciaLoader("loader-primario");
			vm.notaFiscal.dtaEmissao = createDateFromSQLString(vm.dtaEmissaoFormatada);
			axios.post("/controleDePagamento/rs/nf/update/", vm.notaFiscal)
			.then(response => {
				console.log(response.data);
				vm.mostraAlertaMensagem("Nota Fiscal atualizada com sucesso");
				vm.notaFiscal["dtaEmissao"] = new Date(vm.notaFiscal.dtaEmissao).toLocaleDateString('pt-BR');
				vm.dtaEmissaoFormatada = formatDate(vm.notaFiscal.dtaEmissao);
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível editar Nota Fiscal" +  vm.notaFiscal.titulo);
				// Volta cp original
				//vm.notaFiscal = JSON.parse(JSON.stringify(notaFiscalOriginal));
			}).finally(function() {
				encerraLoader("loader-primario");
			});
		},
		excluiNotaFiscal() {
			const vm = this;
			
			iniciaLoader("loader-primario");
			
			let notaFiscalOriginal = JSON.parse(JSON.stringify(vm.notaFiscal));
			axios.get("/controleDePagamento/rs/nf/delete/" + notaFiscal.codNotaFiscal)
			.then(response => {
				location.href='controle-pagamento.html?item=' + notaFiscal.controleDePagamento.codCP;
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível excluir Nota Fiscal" +  notaFiscal.titulo);
				// Volta cp original
			}).finally(function() {
				encerraLoader("loader-primario");
			});
		},
	}
});
