new Vue({
	el: "#minhas-notas",
	components: {
        'alerta' : httpVueLoader('../resources/components/alerta.vue')
    },
	data: {
		notasFiscais: [],
		notasFiscaisHeader: [
			{sortable: true, key: "codCP", label:"Controle de Pagamento"},
			{sortable: true, key: "cliente", label:"Cliente"},
			{sortable: true, key: "contrato", label:"Contrato"},
			{sortable: true, key: "numNF", label:"Número NFe"},
			{sortable: true, key: "desPeriodoFaturado", label:"Período"},
			{sortable: true, key: "situacao", label:"Situação"},
			{sortable: true, key: "numOS", label:"Número OS"},
			{sortable: true, key: "numValorBrutoNF", label:"Valor Bruto"},
			{sortable: true, key: "numValorLiquidoF", label:"Valor Líquido"},
			{sortable: true, key: "dtaEmissao", label:"Data Emissao"},
			{sortable: true, key: "dtaPagamento", label:"Data Pagamento"},
		],
		notasFiscaisFiltro: null,
		notasFiscaisFiltradas: [],
		nfTotal: 0
	},
	created: function() {
		const vm = this;
		vm.buscaNotasFiscais();
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
		buscaNotasFiscais() {
			const vm = this;
			iniciaLoader("loader-primario");
			//db = JSON.parse(localStorage.getItem("DB"));
			//vm.notasFiscais = db.notasFiscais;
			
			// Seta variaveis para mostrar na interface
			vm.notasFiscaisFiltradas = vm.notasFiscais
			vm.nfTotal = vm.notasFiscais.length;
			
			//console.log("busca notas fiscais");
			axios.get("/controleDePagamento/rs/nf/list")
			.then(response => {
				//console.log(response.data);
				vm.nfTotal = response.data.length;
				nfs = response.data;
				//console.log(nfs);
				for(i = 0; i < nfs.length; i++){
					var nf = {};
					nf["titulo"] = nfs[i].codNotaFiscal;
					nf["codCP"] = nfs[i].controleDePagamento.codCP;
					nf["cliente"]=  nfs[i].controleDePagamento.contrato.cliente.nomCliente;
					nf["contrato"] = nfs[i].controleDePagamento.contrato.numContrato;
					nf["numNF"] = nfs[i].numNF;
					nf["desPeriodoFaturado"] = nfs[i].desPeriodoFaturado;
					nf["situacao"] = nfs[i].situacao.nomSituacao;
					nf["numOS"] = nfs[i].numOS;
					nf["numValorBrutoNF"] = nfs[i].numValorBrutoNF;
					nf["numValorBrutoNF"] = nfs[i].numValorBrutoNF;
					nf["dtaEmissao"] = nfs[i].numValorBrutoNF;
					nf["dtaPagamento"] = nfs[i].numValorBrutoNF;
					vm.notasFiscais.push(nf);
				}
				//console.log(response.data.length);
				//console.log(vm.notasFiscais.length);
				
			}).catch(function (error) {
				if(error.response.status === 403)
					window.location = "/";
			else
				vm.mostraAlertaErro(error, "Não foi possível buscar suas notas fiscais");
			}).finally(function(){
				encerraLoader("loader-primario");
			});
		},
		verDetalhesNF: function(nf, index) {
			location.href='nota-fiscal.html?item=' + nf.titulo;
		},
		FiltrarNotasFiscais(notasFiscaisFiltradas) {
			var vm = this;
			this.notasFiscaisFiltradas = this.notasFiscais.filter(function(obj) {
				var objFormatado = {};
				for (att of Object.keys(obj)) {
					switch (att) {
						// Nao filtra nas colunas formatadas
						case "dtaEmissao":
						case "dtaPagamento":
							break;
						default:
							objFormatado[att] = obj[att];
							break;
					}
				}
				// Verifica se string procurada esta dentro do objeto
				return JSON.stringify(Object.values(objFormatado)).toLowerCase()
						.indexOf(vm.notasFiscaisFiltro.toLowerCase()) > -1;
			});
			this.nfTotal = this.notasFiscaisFiltradas.length;
			//this.currentPage = 1;
		}
	}
});