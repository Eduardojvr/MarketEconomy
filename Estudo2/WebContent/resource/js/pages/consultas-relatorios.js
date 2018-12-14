const nf = new Vue({
	el: "#relatorio",
	components: {
        'alerta' : httpVueLoader('../resources/components/alerta.vue')
    },
	data: {
		notasFiscais: [],
		notasFiscaisHeader: [
			{sortable: true, key: "numeroNF", label:"Número NFe"},
			{sortable: true, key: "cliente", label:"Cliente"},
			{sortable: true, key: "contrato", label:"Contrato"},
			{sortable: true, key: "periodo", label:"Período"},
			{sortable: true, key: "situacao", label:"Situação"},
			{sortable: true, key: "numeroOS", label:"Número OS"},
			{sortable: true, key: "valorBruto", label:"Valor Bruto"},
			{sortable: true, key: "valorLiquido", label:"Valor Líquido"},
			{sortable: true, key: "dtaEmissao", label:"Data Emissao"},
			{sortable: true, key: "dtaPagamento", label:"Data Pagamento"}
		],
		notasFiscaisFiltro: null,
		notasFiscaisFiltradas: [],
		nfTotal: 0,
		dtaInicio: '',
		dtaFim:''
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
			db = JSON.parse(localStorage.getItem("DB"));
			vm.notasFiscais = db.notasFiscais;
			/*for(let i = 0; i < vm.notasFiscais.length; i++){
				vm.notasFiscais[i].dtaEmissao = new Date(vm.notasFiscais[i].dtaEmissao).toLocaleDateString('pt-BR');
			}*/
			// Seta variaveis para mostrar na interface
			vm.notasFiscaisFiltradas = vm.notasFiscais;
			vm.nfTotal = vm.notasFiscais.length;
			console.log("busca notas fiscais");
			encerraLoader("loader-primario");
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
							//objFormatado[att] = new Date(obj[att]).toLocaleDateString('pt-BR');
							break;
						case "dtaPagamento":
							//objFormatado[att] = obj[att];
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
		},
		getDataEmissao(data){
			return data.value ? new Date(data.value).toLocaleDateString('pt-BR') : ''; 
		}
	}
});