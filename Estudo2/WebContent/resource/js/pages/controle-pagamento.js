var cp = new Vue({
	el:"#cp",
	components: {
        'alerta' : httpVueLoader('../resources/components/alerta.vue')
    },
	data: {
		controlePagamento: {
				codCP: '',
				periodo: '',
				cliente: '',
				descricao: '',
				contrato: '',
				glosa: ''
		},
		novaNF: {
			codCP: '',
			numOS: '',
			desNF: '',
			numQuantidade: '',
			numValorUnitario: '',
			numValorTotal: '',
			desPeriodoFaturado: '',
			desDocumentosNecessarios: ''
		},
		pendencias: [],
		pendenciasHeader: [
			{sortable: false, key: "estado", label:"Estado"},
			{sortable: false, key: "dtaInclusaoFormatada", label:"Data de inclusão"},
			{sortable: false, key: "tipoPendencia.desTitulo", label:"Tipo de pendência"},
			{sortable: false, key: "tipoPendencia.desResponsavel", label:"Responsável"},
			{sortable: false, key: "dtaLimiteFormatada", label:"Data limite"},
			{sortable: false, key: "dtaResolucaoFormatada", label:"Data de resolução"}
		],
		notasFiscais: [],
		notasFiscaisHeader: [
			{sortable: false, key: "codNotaFiscal", label:"Nº"},
			{sortable: false, key: "numNF", label:"Número NFe"},
			{sortable: false, key: "controleDePagamento.contrato.numContrato", label:"Contrato"},
			{sortable: false, key: "desPeriodoFaturado", label:"Período"},
			{sortable: false, key: "situacao.nomSituacao", label:"Situação"},
			{sortable: false, key: "numOS", label:"Número OS"},
			{sortable: false, key: "numValorBrutoNF", label:"Valor Bruto"},
			{sortable: false, key: "numValorLiquidoF", label:"Valor Líquido"},
			{sortable: false, key: "dtaEmissao", label:"Data Emissao"},
			{sortable: false, key: "dtaPagamento", label:"Data Pagamento"}
		],
		/* Edicao */
		edicaoCPdeshabilitada: true,
		controlePagamentoOriginal: {}
	},
	created: function() {
		let vm =  this;
		iniciaLoader("loader-primario");
		vm.controlePagamento.codCP = getParams('cod');
		vm.buscaCP();
		vm.buscaPendencias();
		vm.buscaNotasFiscais();
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
        buscaNotasFiscais(){
        	const vm = this;
        	
        	iniciaLoader("loader-primario");
        	axios.get("/controleDePagamento/rs/nf/listaPorCP/" + vm.controlePagamento.codCP)
			.then(response => {
				if (response.data) {
					vm.notasFiscais = response.data;
					
					for(let i = 0; i < vm.notasFiscais.length; i++){
						if(!isNullUndefined(vm.notasFiscais[i]["dtaEmissao"]) && vm.notasFiscais[i]["dtaEmissao"] > 0){
							vm.notasFiscais[i]["dtaEmissao"] = longToStringData(vm.notasFiscais[i]["dtaEmissao"]);
						}
						if(!isNullUndefined(vm.notasFiscais[i]["dtaPagamento"]) && vm.notasFiscais[i]["dtaPagamento"] > 0){
							vm.notasFiscais[i]["dtaPagamento"] = longToStringData(vm.notasFiscais[i]["dtaPagamento"]);
						}
					}
				}
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível notas fiscais");
			}).finally(function(){
				encerraLoader("loader-primario");
			});
        },
		buscaPendencias: function(){
			const vm = this;
			let pedenciasCP = [];
			let pendenciasNF = [];
			iniciaLoader("loader-primario");
			
			let p1 = new Promise (function(resolve, reject){
				axios.get("/controleDePagamento/rs/pendenciasCP/get/" + vm.controlePagamento.codCP)
				.then(response => {
					pendenciasCP = response.data;
					resolve(); 
				}).catch(function (error) {
					vm.mostraAlertaErro("Erro interno", "Não foi possível buscar CP" + vm.controlePagamento.codCP);
					reject();
				}).finally(function(){
					encerraLoader("loader-primario");
				})
			});
			
			let p2 = new Promise(function(resolve, reject) {
				axios.get("/controleDePagamento/rs/pendenciasNF/getByCP/" + vm.controlePagamento.codCP)
				.then(response => {
					pendenciasNF = response.data;
					resolve(); 
				}).catch(function (error) {
					vm.mostraAlertaErro("Erro interno", "Não foi possível buscar CP" + vm.controlePagamento.codCP);
					reject();
				}).finally(function(){
					encerraLoader("loader-primario");
				})
			});
			
			// Quando a promise p1 for resolvida
			p1.then(function(){
				if(pendenciasCP){
					vm.pendencias = vm.pendencias.concat(pendenciasCP);
				}
				// Quando a promise p2 for resolvida
				p2.then(function(){
					if(pendenciasNF){
						vm.pendencias = vm.pendencias.concat(pendenciasNF);
					}
					
					vm.pendencias = orderPendenciasByDtaInclusao(vm.pendencias);
					
					for(var i = 0; i < vm.pendencias.length; i++){
						setEstado(vm.pendencias[i]);
						if(vm.pendencias[i].notaFiscal){
							vm.pendencias[i]['item'] =  vm.pendencias[i].notaFiscal.codNotaFiscal;
						}
						
						vm.pendencias[i]["dtaInclusaoFormatada"] = new Date(vm.pendencias[i].dtaInclusao).toLocaleDateString('pt-BR');
						vm.pendencias[i]["dtaLimiteFormatada"] = new Date(vm.pendencias[i].dtaLimite).toLocaleDateString('pt-BR');
						if(vm.pendencias[i].dtaResolucao)
							vm.pendencias[i]["dtaResolucaoFormatada"] = new Date(vm.pendencias[i].dtaResolucao).toLocaleDateString('pt-BR');
						else
							vm.pendencias[i]["dtaResolucaoFormatada"] = '';
						//console.log(vm.pendencias[i]);
					}
				});
			});
		},

		buscaCP: function() {
			const vm = this;
			iniciaLoader("loader-primario");
			
			axios.get("/controleDePagamento/rs/cp/get/" + vm.controlePagamento.codCP)
			.then(response => {
				if (response.data) {
					vm.controlePagamento = response.data;
					if (vm.controlePagamento.dtaCP) {
						vm.controlePagamento["dtaCPFormatada"] = new Date(vm.controlePagamento.dtaCP).toLocaleDateString('pt-BR');
					}
				}
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível buscar CP" + vm.controlePagamento.codCP);
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		fazerAcao: function(){
			const vm = this;
			iniciaLoader("loader-primario");
			// Chama funcao aqui e insere controle de pagamento novo
			vm.mostraAlertaErro("Erro", "Ação não implementada");
			encerraLoader("loader-primario"); //desativar loader da página principal
		},
		verDetalhesPendencia: function(pendencia, index) {
			const item = pendencia.item;
			if (item) {
				location.href='nota-fiscal.html?item=' + item;
			}
		},
		verDetalhesNF: function(nf, index) {
			location.href='nota-fiscal.html?item=' + nf.codNotaFiscal;
		},
		salvaControlePagamento: function(){
			let vm = this;
			
			iniciaLoader("loader-primario");
			axios.post("/controleDePagamento/rs/nf/save/", vm.novaNF)
			.then(response => {
				//location.href='controle-pagamento.html?item=' + notaFiscal;
				console.log(response.data);
				vm.mostraAlertaMensagem("Nota Fiscal atualizada com sucesso");
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível editar Nota Fiscal" +  notaFiscalOriginal.titulo);
				// Volta cp original
				//vm.notaFiscal = JSON.parse(JSON.stringify(notaFiscalOriginal));
			}).finally(function() {
				encerraLoader("loader-primario");
			});
		},
		criaNotaFiscal: function(){
			let vm = this;
			iniciaLoader("loader-primario");
			
			vm.novaNF.codCP = vm.controlePagamento.codCP;
			
			axios.post("/controleDePagamento/rs/nf/save/", vm.novaNF)
			.then(response => {
				console.log(response.data);
				vm.mostraAlertaMensagem("Nota Fiscal inserida com sucesso");
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível inserir nova nota fiscal");
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		habilitaEdicaoCP() {
			// Faz copia de CP original
			this.controlePagamentoOriginal = JSON.parse(JSON.stringify(this.controlePagamento));
			this.edicaoCPdeshabilitada = false;
		},
		cancelaEdicaoCP() {
			// Volta cp original
			this.controlePagamento = JSON.parse(JSON.stringify(this.controlePagamentoOriginal));
			this.edicaoCPdeshabilitada = true;
		},
		excluiCP() {
			const vm = this;
			iniciaLoader("loader-primario");
			
			axios.get("/controleDePagamento/rs/cp/delete/" + vm.controlePagamento.codCP)
			.then(response => {
				location.href='meus-controles.html?cp-excluido=' + vm.controlePagamento.codCP;
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível excluir CP" + vm.controlePagamento.codCP);
				// Volta cp original
				vm.controlePagamento = JSON.parse(JSON.stringify(vm.controlePagamentoOriginal));
			}).finally(function() {
				encerraLoader("loader-primario");
			});
		},
		salvaEdicaoCP() {
			const vm = this;
			iniciaLoader("loader-primario");
			
			// Faz copia de CP original
			var controlePagamentoBD = JSON.parse(JSON.stringify(vm.controlePagamento));
			delete controlePagamentoBD.dtaCPFormatada;
			
			axios.post("/controleDePagamento/rs/cp/save", controlePagamentoBD)
			.then(response => {
				vm.mostraAlertaMensagem("CP" + vm.controlePagamento.codCP + " salvo com sucesso!");
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível salvar CP" + vm.controlePagamento.codCP);
				// Volta cp original
				vm.controlePagamento = JSON.parse(JSON.stringify(vm.controlePagamentoOriginal));
			}).finally(function(){
				encerraLoader("loader-primario");
				vm.edicaoCPdeshabilitada = true;
			});
		}
	}
});

