var inicio = new Vue({
	el:"#inicio",
	components: {
        'alerta' : httpVueLoader('../resources/components/alerta.vue')
    },
	data: {
		pendencias: [],
		pendenciasHeader: [
			{sortable: true, key: "estado", label:"Estado"},
			 {sortable: true, key: "contrato", label:"Contrato"},
			 {sortable: true, key: "periodo", label:"Período"},
			{sortable: true, key: "dtaInclusaoFormatada", label:"Data de inclusão"},
			{sortable: true, key: "tipoPendencia.desTitulo", label:"Tipo de pendência"},
			{sortable: true, key: "tipoPendencia.desResponsavel", label:"Responsável"},
			{sortable: true, key: "dtaLimiteFormatada", label:"Data limite"},
			{sortable: true, key: "item", label:"Item"}
		],
		pendenciasFiltro: null,
		pendenciasFiltradas: [],
		pendenciasTotal: 0,
		clienteCP:'',
		novoCP: {
			contrato: {},
			dtaCP:'',
			numGlosa:''
		}, 
		clientes: [],
		contratos: []
	},
	created: function() {
		const vm = this;
		iniciaLoader("loader-primario");
		vm.buscaPendencias();
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
		buscaPendencias: function() {
			const vm = this;
			iniciaLoader("loader-primario");
			let pedenciasCP = [];
			let pendenciasNF = [];
			
			let p1 = new Promise (function(resolve, reject){
				axios.get("/controleDePagamento/rs/pendenciasCP/listAtivas")
				.then(response => {
					pendenciasCP = response.data;
					resolve(); 
				}).catch(function (error) {
					vm.mostraAlertaErro("Erro interno", "Não foi possível buscar pendencias de Controle de Pagamento");
					reject();
				}).finally(function(){
					encerraLoader("loader-primario");
				})
			});
			
			let p2 = new Promise(function(resolve, reject) {
				axios.get("/controleDePagamento/rs/pendenciasNF/listAtivas")
				.then(response => {
					pendenciasNF = response.data;
					console.log(pendenciasNF);
					resolve(); 
				}).catch(function (error) {
					vm.mostraAlertaErro("Erro interno", "Não foi possível buscar pendencias de Notas Fiscais");
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
					vm.buscaClientes();
					if(pendenciasNF){
						vm.pendencias = vm.pendencias.concat(pendenciasNF);
					}
					
					vm.pendencias = orderPendenciasByDtaInclusao(vm.pendencias);
					
					for(var i = 0; i < vm.pendencias.length; i++){
						setEstado(vm.pendencias[i]);
						if(vm.pendencias[i].notaFiscal){
							vm.pendencias[i]['periodo'] =  new Date(vm.pendencias[i].notaFiscal.controleDePagamento.dtaCP).toLocaleDateString('pt-BR');
							vm.pendencias[i]['item'] =  vm.pendencias[i].notaFiscal.codNotaFiscal;
							vm.pendencias[i]['contrato'] =  vm.pendencias[i].notaFiscal.controleDePagamento.contrato.numContrato + ' - ' + vm.pendencias[i].notaFiscal.controleDePagamento.contrato.nomContrato;
							
						}else if(vm.pendencias[i].controleDePagamento){
							vm.pendencias[i]['periodo'] =  new Date(vm.pendencias[i].controleDePagamento.dtaCP).toLocaleDateString('pt-BR');
							vm.pendencias[i]['item'] =  vm.pendencias[i].controleDePagamento.codCP;
							vm.pendencias[i]['contrato'] =  vm.pendencias[i].controleDePagamento.contrato.numContrato + ' - ' + vm.pendencias[i].controleDePagamento.contrato.nomContrato;
						}
						vm.pendencias[i]["dtaInclusaoFormatada"] = new Date(vm.pendencias[i].dtaInclusao).toLocaleDateString('pt-BR');
						vm.pendencias[i]["dtaLimiteFormatada"] = new Date(vm.pendencias[i].dtaLimite).toLocaleDateString('pt-BR');
					}
					console.log(vm.pendencias);
					// Seta variaveis da interface
					vm.pendenciasFiltradas = vm.pendencias;
					vm.pendenciasTotal = vm.pendencias.length;
				});
			});
			

			
			encerraLoader("loader-primario");
		},
		buscaClientes: function(){
			vm = this;
			axios.get("/controleDePagamento/rs/cliente/list")
			.then(response => {
				if (response.data) {
					vm.clientes = response.data;
					console.log(response.data);
				}
			}).catch(function (error) {
				vm.mostraAlertaErro("Erro interno", "Não foi possível buscar seus clientes");
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		buscaContratos: function(codCliente){
			vm = this;
				axios.get("/controleDePagamento/rs/contrato/getList/" + codCliente)
				.then(response => {
					if (response.data) {
						vm.contratos = response.data;
						console.log(response.data);
					}
				}).catch(function (error) {
					vm.mostraAlertaErro("Erro interno", "Não foi possível buscar os contratos do Cliente" + codCliente);
				}).finally(function(){
					encerraLoader("loader-primario");
				});
		},
		adicionaControlePagamento: function(){
			const vm = this;
			iniciaLoader("loader-primario");
			// Chama funcao aqui e insere controle de pagamento novo
			// if(vm.novoCP.cliente && vm.novoCP.contrato && vm.novoCP.dtaCP ){
				axios.post('/controleDePagamento/rs/cp/insert/', vm.novoCP)
		  		  .then(function (response) {
		  			 console.log(response);
		  			vm.mostraAlertaMensagem("Controle de pagamento inserido com sucesso");
		  		  })
		  		  .catch(function (error) {
				      if (error != null && error != undefined &&
				              error.response != null && error.response != undefined) {
		    			  if(error.response.status == 412){
		    			      login.msgErro = "Preencha o login e a senha";
		    			  }
						  if(error.response.status == 500){
						      login.msgErro = "Login ou senha inválidos";
		    			  }
						  if(error.response.status == 406){
						    login.msgErro = "Usuário não autorizado";
		    			  }
				      } else {
				        login.msgErro = "Erro interno do servidor";
				      }
				      
				      btn.disabled = false;
				      encerraLoader("loader-primario");
		  		  })
		    	  .finally(function () {
		    		  
				    })
			/*
			 * } else{ vm.mostraAlertaErro("Erro", "Preencha os campos de
			 * Cliente, Contrato e Data para inserir um controle de pagamento"); }
			 */
			
			encerraLoader("loader-primario"); // desativar loader da página
												// principal
		},
		verDetalhesPendencia: function(pendencia, index) {
			const item = pendencia.item;
			if (pendencia.controleDePagamento) {
				location.href='controle-pagamento.html?cod=' + item;
			} else if (pendencia.notaFiscal) {
				location.href='nota-fiscal.html?item=' + item;
			} else {
				vm.mostraAlertaErro("Erro", "Não foi possível abrir essa pendência");
			}
		},
		filtrarPendencias(pendenciasFiltradas) {
			var vm = this;
			this.pendenciasFiltradas = this.pendencias.filter(function(obj) {
				var objFormatado = {};
				for (att of Object.keys(obj)) {
					switch (att) {
						// Nao filtra nas colunas formatadas
						case "dtaInclusao":
						case "dtaLimite":
						case "dtaResolucao":
							break;
						default:
							objFormatado[att] = obj[att];
							break;
					}
				}
				// Verifica se string procurada esta dentro do objeto
				return JSON.stringify(Object.values(objFormatado)).toLowerCase()
						.indexOf(vm.pendenciasFiltro.toLowerCase()) > -1;
			});
			this.pendenciasTotal = this.pendenciasFiltradas.length;
			// this.currentPage = 1;
		}
	}
});
