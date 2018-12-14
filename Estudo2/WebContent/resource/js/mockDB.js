var DB = {
	pendencias: [
		/*{
			codPendencia:'',
			tipoPendencia: {
				codTipoPendencia:'',
				numDiasAteVencimento:'',
				desCodigo:'',
				desResponsavel:'',
				desTitulo:''
			},
			dtaInclusao:'',
			dtaLimite:'',
			dtaResolucao:'',
			pessoa: {
				codPessoa:'',
				nomPessoa:''
			},
			idCPouNF:''
		}*/
	],
	notasFiscais: [
		/*{
			codNotaFiscal:'',
			numOS:'',
			desServico:'',
			numQuantidade:'',
			numValorUnitario:'',
			desPeriodoFaturado:'',
			desDocumentosNecessarios:'',
			controleDePagamento:'',
			numValorTotal:'',
			numRTA:'',
			naturezaServico: {
				codNaturezaServico:'',
				nomNaturezaServico:''
			},
			numNF:'',
			dtaEmissao:'',
			numValorBrutoNF:'',
			numValorLiquidoF:'',
			situacao: {
				codSituacao:'',
				nomSituacao:''
			},
			dtaPagamento:'',
			desNF:''
		}*/
	],
	controlesDePagamento: [
		/*{
			codCP:'',
			desCP:'',
			dtaCP:'',
			contrato: {
				codContrato:'',
				cliente: {
					codCliente:'',
					codTipoCliente:'',
					codUF:'',
					nomCliente:'',
					nomRazaoSocial:'',
					desCliente:'',
					desEmail:'',
					numCNPJ:'',
					numInscricaoEstadual:'',
					numTelefone:'',
					numCEP:'',
					desLogradouro:'',
					desComplemento:'',
					nomBairro:'',
					nomCidade:'',
					dthRegistro:''
				},
				numContrato:'',
				nomeContrato:'',
				desContrato:'',
				dataInicio:'',
				dataFim:'',
				dthRegistro:'',
				numValorGlobalAnual:''
			},
			numGlosa:''
		}*/
	]
};


function mockDB() {
	// Check browser support
	if (typeof(Storage) !== "undefined") {
		// Store pendencias
		DB.pendencias.push({
				cliente: "ANEEL",
				periodo: '2018/11',
				dtaInclusao: 1541041200000,
				tipoPendencia: 'Controle de pagamento não iniciado',
				dtaLimite: 1541127600000,
				dtaResolucao: null,
				responsavel: 'GC', 
				item: 'CP3446'
		});
		DB.pendencias.push({
				cliente: "MME",
				periodo: '2018/11',
				dtaInclusao: 1541041200000,
				tipoPendencia: 'Controle de pagamento não iniciado',
				dtaLimite: 1538535600000,
				dtaResolucao: null,
				responsavel: 'GC',
				item: 'CP3445'
		});
		// pedencias CP3435
		DB.pendencias.push({
				cliente: "REDE RECORD",
				periodo: '2018/09',
				dtaInclusao: 1535770800000,
				tipoPendencia: 'Controle de pagamento não iniciado',
				dtaLimite: 1535857200000,
				dtaResolucao: 1535943600000,
				responsavel: 'GC',
				item: 'CP3435'
		});
		DB.pendencias.push({
				cliente: "REDE RECORD",
				periodo: '2018/09',
				dtaInclusao: 1535943600000,
				tipoPendencia: 'RTA não aprovado',
				dtaLimite: 1536116400000,
				dtaResolucao: 1535943600000,
				responsavel: 'GC',
				item: 'CP3435'
		})
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'Cadastramento de NFs não realizado',
			dtaLimite: 1536202800000,
			dtaResolucao: 1535943600000,
			responsavel: 'GC',
			item: 'CP3435'
		});
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'Entrega formal do RTA ao cliente ainda não realizada',
			dtaLimite: 1536289200000,
			dtaResolucao: 1535943600000,
			responsavel: 'GC',
			item: 'CP3435'
		});
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'NF ainda não solicitada ao ADM',
			dtaLimite: 1536375600000,
			dtaResolucao: 1535943600000,
			responsavel: 'AF',
			item: 'CP3435'
		});
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'NF ainda não emitida pelo ADM',
			dtaLimite: 1536548400000,
			dtaResolucao: 1536030000000,
			responsavel: 'ADM',
			item: 'CP3435'
		});
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'Documentação do faturamento ainda não entregue ao cliente',
			dtaLimite: 1536721200000,
			dtaResolucao: 1536030000000,
			responsavel: 'ADM',
			item: 'CP3435'
		});
		DB.pendencias.push({
			cliente: "REDE RECORD",
			periodo: '2018/09',
			dtaInclusao: 1535943600000,
			tipoPendencia: 'NF em aberto',
			dtaLimite: 1536807600000,
			dtaResolucao: null,
			responsavel: 'GC; ADM',
			item: 'NF3683'
		});
		// Store controles de pagamento
		DB.controlesDePagamento.push({
				codCP: '3446',
				titulo: 'CP3446',
				periodo: '2018/11',
				cliente: 'ANEEL - Agência Nacional de Energia Elétrica',
				descricao: 'Contrato ANEEL, faturamento de novembro',
				contrato: 'ANEEL - 043.2016'
		});
		DB.controlesDePagamento.push({
				codCP: '3445',
				titulo: 'CP3445',
				periodo: '2018/11',
				cliente: 'MME',
				descricao: 'Contrato MME, faturamento de novembro',
				contrato: 'Ministério de Minas e Energia',
				anexos:'2018.11 - Relatório Controle Franquia - MME.pdf'
		});
		DB.controlesDePagamento.push({
				codCP: '3435',
				titulo: 'CP3435',
				periodo: '2018/09',
				cliente: 'REDE RECORD',
				descricao: 'Contrato RECORD - Contrato 2015, faturamento de agosto/2018',
				contrato: 'RECORD - Contrato 2015',
				anexos:'2018.09 - Relatório Controle Franquia - Record.pdf'
		});
		
		// Store notas fiscais
		// Nota Fiscal CP3435
		DB.notasFiscais.push({
			titulo: 'NF3683',
			numeroNF: '3683',
			descricao: 'Suporte Técnico - ISS 2%',
			quantidade: '1',
			cliente: 'HEPTA',
			contrato: 'Hepta - Sede',
			periodo: '2018/09',
			situacao: '3.Em Aberto	',
			numeroOS: '004/2018',
			valorUnitario:'R$1.384,66',
			valorTotal: 'R$1.384,66',
			valorBruto: 'R$1.384,66',
			valorLiquido: 'R$1.271,81',
			dtaEmissao: 1535943600000,
			dtaPagamento: null,
			controlePagamento: 'CP3435'
		});
		DB.notasFiscais.push({
			titulo: 'NF3684',
			numeroNF: '3684',
			descricao: 'Teste',
			quantidade: '1',
			cliente: 'Teste',
			contrato: 'Teste - Sede',
			periodo: '2018/09',
			situacao: '3.Em Aberto	',
			numeroOS: '004/2018',
			valorUnitario:'R$1.000,00',
			valorTotal: 'R$1.000,00',
			valorBruto: 'R$1.000,00',
			valorLiquido: 'R$1.000,00',
			dtaEmissao: 1505012400000,
			dtaPagamento: null,
			controlePagamento: 'CP3435'
		});
		localStorage.setItem("DB", JSON.stringify(DB));
	} else {
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}