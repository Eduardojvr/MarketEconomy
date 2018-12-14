var vueAberturaVaga = new Vue({
    el : '#container-abertura-vaga',
    components: {
        'modal-certificacao' : httpVueLoader('../../resources/components/modal_certificacao.vue'),
        'modal-chav' : httpVueLoader('../../resources/components/modal_chav.vue'),
        'modal-cargo' : httpVueLoader('../../resources/components/modal_cargo.vue'),
        'modal-curso' : httpVueLoader('../../resources/components/modal_curso_formacao.vue'),
        'alerta' : httpVueLoader('../../resources/components/alerta.vue'),
        'modal-aprovacao' : httpVueLoader('../../resources/components/modal_aprovacao.vue')
    },
    data : {
        sghGrupo:"",
        nomeCompleto:"",
        vaga: {},
        listaTipo: [],
        listaArea: [],
        listaFormacao: [],
        listaTempoExperiencia: [],
        listaClientes: [],
        listaChavs: [],
        listaChavsAdicionadas: [],
        qtdChavs: 0,
        pesquisandoChavs: false,
        pagina_chav: 1,
        listaCurso: [],
        listaCursosAdicionados: [],
        cursoTexto: '',
        qtdCursos: 0,
        pesquisandoCursos: false,
        pagina_curso: 1,
        chavTexto: '',
        listaCidades:[],
        listaCidadesAux:[],
        listaMotivo: [],
        listaHorario: [],
        listaCertificacoes: [],
        listaCertificacoesAdicionadas: [],
        listaHeranca: [],
        qtdCertificacoes: 0,
        pesquisandoCertificacoes: false,
        pagina_certificacao: 1,
        certificacaoTexto: '',
        pagina_cargo: 1,
        cargoTexto: '',
        listaCargos: [],
        cargoObjAux: {},
        pesquisandoCargos: false,
        timeout: null,
        idSolicitacao: 0,
        carregandoSolicitacao: false,
        mostrarCursos: true,
        vis:
        {
            mostraGeral:false,
            mostraFinanceiro:false,
            mostraGPC:false    
        },
        cidadeAux:"",
        cidadeAuxTamanho:0,
        abreModalCertificacao: false,
        abreModalChav: false,
        abreModalCargo: false,
        abreModalCurso: false,
        abreModalAprovacao: false
        
    },
    mounted: function(){
        
    },
    watch: {
        cidadeAux(){
            const vm = this;
            var lista = [];

            if(vm.cidadeAux == null || vm.cidadeAuxTamanho == null)
                return;

            if(vm.cidadeAuxTamanho > vm.cidadeAux.length){
                vm.listaCidadesAux = [];
                vm.listaCidadesAux = vm.listaCidades;
            }

            for(var i=0; i<vm.listaCidadesAux.length;i++){
                var match = true;
                for(var j=0;j<vm.cidadeAux.length;j++){
                    if(vm.listaCidadesAux[i].nome[j] === undefined)
                        return;
                    if(vm.listaCidadesAux[i].nome[j].toLowerCase() !== vm.cidadeAux[j].toLowerCase()){
                        match = false;
                    }
                }
                if (match === true)
                    lista.push(vm.listaCidadesAux[i]);
            }
            vm.listaCidadesAux = [];
            vm.listaCidadesAux = lista;
            vm.cidadeAuxTamanho = vm.cidadeAux.length;
        },
        cargoObjAux(){
            const vm = this;
            if(vm.cargoObjAux.cod_cargo == null || vm.cargoObjAux.cod_cargo == undefined)
                return;
            if(vm.cargoObjAux.cod_cargo != 0 && !vm.carregandoSolicitacao){
                vm.buscaHerancasPorCargo();
            }
        },
        certificacaoTexto () {
            const vm = this;
            
            vm.pesquisandoCertificacoes = true;
            vm.pagina_certificacao = 1;
            vm.listaCertificacoes = [];
            
            clearTimeout(vm.timeout);
            vm.timeout = setTimeout(function(){
                vueAberturaVaga.buscaCertificacoesPorNome();
            }, 1000);
        },
        chavTexto () {
            const vm = this;
            
            vm.pesquisandoChavs = true;
            vm.pagina_chav = 1;
            vm.listaChavs = [];
            
            clearTimeout(vm.timeout);
            vm.timeout = setTimeout(function(){
                vueAberturaVaga.buscaChavsPorNome();
            }, 1000);
        },
        cargoTexto () {
            const vm = this;
            
            var result = vm.listaCargos.find(function(x){
            	return x.nom_cargo === vm.cargoTexto;
            });
            if(isEmpty(result) && vm.cargoTexto != ""){
	            vm.pesquisandoCargos = true;
	            vm.pagina_cargo = 1;
	            vm.listaCargos = [];
	            
	            clearTimeout(vm.timeout);
	            vm.timeout = setTimeout(function(){
	                vueAberturaVaga.buscaCargoPorCliente();
	            }, 1000);
            }
        },
        cursoTexto () {
            const vm = this;
            
            vm.pesquisandoCursos = true;
            vm.pagina_curso_formacao = 1;
            vm.listaCurso = [];
            
            clearTimeout(vm.timeout);
            vm.timeout = setTimeout(function(){
                vueAberturaVaga.buscaCursoPorNome();
            }, 1000);
        }
    },
    methods: {
        classeHerdado(id, manual){
            if(id == 0){
                return 'novo-item';
            } else if(manual){
                return 'naoherdado-item';
            } else {
                return 'herdado-item';
            }
        },
        salvaSolicitacaoVaga(){
            const vm = this;

            var sol = vm.preparaSolicitacao();

            if(!todosCamposRequiredForamPreenchidos("form") || !vm.checarCamposValidos(sol)){
                vm.mostraAlertaErroSimples("Erro!", "Erro ao salvar solicitação, campos inválidos");
                
                var elements = document.getElementsByClassName('is-invalid');
                var requiredElement = elements[0];
                window.scroll(0, scrollToElement(requiredElement));
                return ;
            }

            iniciaLoader("loader-primario");
            
            axios.post("../../rs/solicitacao/salvar", sol)
            .then(response => {
                vm.mostraAlertaMensagem("Solicitação salva com sucesso");
                window.location = "/sgh/pages/geral/geral.html";
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao salvar solicitação");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
            });
            
        },
        inserirSolicitacaoVaga(){
            const vm = this;

            var sol = vm.preparaSolicitacao();

            if(!todosCamposRequiredForamPreenchidos("form") || !vm.checarCamposValidos(sol)){
                vm.mostraAlertaErroSimples("Erro!", "Erro ao salvar solicitação, campos inválidos");
                
                var elements = document.getElementsByClassName('is-invalid');
                var requiredElement = elements[0];
                window.scroll(0, scrollToElement(requiredElement));
                
                return ;
            }
            iniciaLoader("loader-primario");

            axios.post("../../rs/solicitacao/inserir", sol)
            .then(response => {
                vm.mostraAlertaMensagem("Solicitação inserida com sucesso");
                window.location = "/sgh/pages/geral/geral.html";
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao inserir solicitação");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
                
            });
            
        },
        preparaSolicitacao(){
            const vm = this;
            
            vm.vaga.certificado = vm.listaCertificacoesAdicionadas;
            vm.vaga.chav = vm.listaChavsAdicionadas;
            vm.vaga.cargo = vm.cargoObjAux;
            vm.vaga.curso = vm.listaCursosAdicionados;
            
            var solicitacao = {};
            solicitacao.cod_solicitacao = vm.vaga.cod_solicitacao;
            solicitacao.ind_aprovado = false;
            solicitacao.nom_area = vm.vaga.area;
            solicitacao.nom_funcao_efetiva = vm.vaga.funcaoEfetiva;
            solicitacao.cargo = vm.vaga.cargo;
            solicitacao.formacao = vm.vaga.formacaoNecessaria;
            solicitacao.curso = JSON.stringify(vm.vaga.curso);
            solicitacao.chavs = JSON.stringify(vm.vaga.chav);
            solicitacao.nom_conhecimentos_tecnicos = vm.vaga.conhecimentos;
            solicitacao.nom_experiencia = vm.vaga.tempoExperiencia;
            solicitacao.nom_horario = vm.vaga.horario;
            solicitacao.nom_motivo_recrutamento = vm.vaga.motivo;
            solicitacao.nom_substituido = vm.vaga.nom_substituido;
            solicitacao.certificacoes = JSON.stringify(vm.vaga.certificado);
            solicitacao.cod_cliente = vm.vaga.cod_cliente;
            solicitacao.des_observacoes = vm.vaga.obs;
            solicitacao.ind_pcd = vm.vaga.exclusivoPCD;
            solicitacao.nom_cidade = vm.vaga.nom_cidade;
            solicitacao.num_vagas = vm.vaga.num_vagas;
            solicitacao.des_atividades = vm.vaga.des_atividades;
            solicitacao.cod_tipo_solicitacao = vm.vaga.cod_tipo_solicitacao;

            if(!isNullUndefined(vm.vaga.dataAberturaString) ){
                var dataAbertura = vm.vaga.dataAberturaString.split("-");
                solicitacao.dta_abertura = new Date(parseInt(dataAbertura[0]), parseInt(dataAbertura[1]) - 1, parseInt(dataAbertura[2]));
                solicitacao.dta_abertura.setHours(solicitacao.dta_abertura.getHours() + 3);
                solicitacao.dta_abertura = solicitacao.dta_abertura.getTime();
            }
            
            if(!isNullUndefined(vm.vaga.dataAdmissaoString)){
                var dataAdmissao = vm.vaga.dataAdmissaoString.split("-");
                solicitacao.dta_admissao = new Date(parseInt(dataAdmissao[0]), parseInt(dataAdmissao[1]) - 1, parseInt(dataAdmissao[2]));    
                solicitacao.dta_admissao.setHours(solicitacao.dta_admissao.getHours() + 3);
                solicitacao.dta_admissao = solicitacao.dta_admissao.getTime();
            }

            solicitacao.nom_pessoa = "";
            return solicitacao;
        },
        checarCamposValidos(solicitacao){
            const vm = this;
            var valido = true;
            
            document.getElementById("formacao-curso").classList.remove('is-invalid');
            document.getElementById("formacao-curso").classList.remove('was-validated');
            document.getElementById("cidade-autocomplete").classList.remove('is-invalid');
            document.getElementById("cidade-autocomplete").classList.remove('was-validated');
            document.getElementById("cargo-contratual").classList.remove('is-invalid');
            document.getElementById("cargo-contratual").classList.remove('was-validated');
            document.getElementById("competencias-comportamentais").classList.remove('is-invalid');
            document.getElementById("competencias-comportamentais").classList.remove('was-validated');
            
            if(isNullUndefined(solicitacao.nom_cidade) ||  solicitacao.nom_cidade === ""){
                document.getElementById("cidade-autocomplete").classList.add('was-validated');
                document.getElementById("cidade-autocomplete").classList.add('is-invalid');
                valido = false;
            }
            if(isNullUndefined(solicitacao.cargo.nom_cargo.length) ||  solicitacao.cargo.nom_cargo.length === 0){
                document.getElementById("cargo-contratual").classList.add('was-validated');
                document.getElementById("cargo-contratual").classList.add('is-invalid');
                valido = false;
            }
            if(solicitacao.formacao >= 49 && solicitacao.curso === "[]"){
            	document.getElementById("formacao-curso").classList.add('was-validated');
                document.getElementById("formacao-curso").classList.add('is-invalid');
                valido = false;
            }
            if(solicitacao.chavs === "[]" || isNullUndefined(solicitacao.chavs)){
                document.getElementById("competencias-comportamentais").classList.add('was-validated');
                document.getElementById("competencias-comportamentais").classList.add('is-invalid');
                valido = false;
            }
            return valido;
        },
        cancelaSolicitacaoVaga(){
            
        },
        suspendeSolicitacaoVaga(){
            const vm = this;
            
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/solicitacao/suspender"
                +"?id="+vm.vaga.cod_solicitacao)
            .then(response => {
                vm.mostraAlertaMensagem("Solicitação suspendida com sucesso");
                window.location = "/sgh/pages/geral/geral.html";
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao suspender solicitação");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
            });
        },
        deletaSolicitacaoVaga(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/solicitacao/deletar"
                + "?id="+vm.vaga.cod_solicitacao)
            .then(response => {
                vm.mostraAlertaMensagem("Solicitação deletada com sucesso");
                window.location = "/sgh/pages/geral/geral.html";
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao deletar solicitação");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
            });
        },
        contaCertificacoes(){
            const vm = this;
            
            axios.get("../../rs/certificacao/total/")
            .then(response => {
                vm.qtdCertificacoes = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar certificações");
                }
            }).finally(function(){
                vm.contaChavs();
            });
        },
        contaChavs(){
            const vm = this;
            
            axios.get("../../rs/chav/total/")
            .then(response => {
                vm.qtdChavs = response.data;
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar chavs");
                }
            }).finally(function(){
                vm.contaCursos();
            });
        },
        contaCursos(){
            const vm = this;
            
            axios.get("../../rs/cursoformacao/total/")
            .then(response => {
                vm.qtdCursos = response.data;
                if(vm.idSolicitacao != 0){
                    vm.carregandoSolicitacao = true;
                    vm.buscaSolicitacao(vm.idSolicitacao);
                }
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao contar chavs");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
            });
        },
        buscaHerancasPorCargo(){
            const vm = this;
            
            iniciaLoader("loader-primario");
            vm.listaChavsAdicionadas = [];
            vm.listaCertificacoesAdicionadas = [];
            axios.get("../../rs/cargo/buscaHerancasCargo?cod=" + vm.cargoObjAux.cod_cargo)
            .then(response => {
                vm.listaHeranca = response.data;
                
                var chavs = vm.listaHeranca.chavs;
                var certificacoes = vm.listaHeranca.certificacoes;
                
                for(var i = 0; i < chavs.length; i++){
                    var obj = {
                            cod_chav: 0,
                            nom_chav: '',
                            des_chave:  '',
                            ind_manual: false,
                            ind_temporario: true
                    };
                    obj.cod_chav = chavs[i].cod_chav;
                    obj.nom_chav = chavs[i].nom_chav;
                    obj.des_chav = chavs[i].des_chav;
                    
                    vm.listaChavsAdicionadas.push(obj);
                }
                
                for(var i = 0; i < certificacoes.length; i++){
                    var obj = {
                        cod_certificacao: 0,
                        des_certificacao: '',
                        ind_manual:  false,
                        nom_certificacao: '',
                        num_certificacao: ''
                    };
                    obj.cod_certificacao = certificacoes[i].cod_certificacao;
                    obj.des_certificacao = certificacoes[i].des_certificacao;
                    obj.nom_certificacao = certificacoes[i].nom_certificacao;
                    obj.num_certificacao = certificacoes[i].num_certificacao;
                    
                    vm.listaCertificacoesAdicionadas.push(obj);
                }
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao buscar certificações e chaves herdados de cargo");
                }
            }).finally(function(){
                encerraLoader("loader-primario");
            });
        },
        buscaCertificacoesPorNome(){
            const vm = this;
            
            if(vm.certificacaoTexto.length <= 0){
                vm.pesquisandoCertificacoes = false;
                return;
            }
            axios.get("../../rs/certificacao/listarPorNome"
                + "?nom=" + vm.certificacaoTexto 
                + "&pagina=" + vm.pagina_certificacao)
            .then(response => {
                if(response.data.length > 0){
                    if(vm.pagina_certificacao === 1){
                        vm.listaCertificacoes = response.data;
                    } else {
                        vm.listaCertificacoes = vm.listaCertificacoes.concat(response.data);
                    }
                }
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao buscar certificações");
                }
            }).finally(function(){
                vm.pesquisandoCertificacoes = false;
            });
        },
        buscaChavsPorNome(){
            const vm = this;
            
            if(vm.chavTexto.length <= 0){
                vm.pesquisandoChavs = false;
                return;
            }
            axios.get("../../rs/chav/listarPorNome"
                + "?nom=" + vm.chavTexto 
                + "&pagina=" + vm.pagina_chav)
            .then(response => {
                if(response.data.length > 0){
                    if(vm.pagina_chav == 1){
                        vm.listaChavs = response.data;
                    } else {
                        vm.listaChavs = vm.listaChavs.concat(response.data);
                    }
                }
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao buscar competências");
                }
            }).finally(function(){
                vm.pesquisandoChavs = false;
            });
        },
        buscaCursoPorNome(){
            const vm = this;
            
            if(vm.cursoTexto.length <= 0){
                vm.pesquisandoCursos = false;
                return;
            }
            axios.get("../../rs/cursoformacao/listarPorNome"
                + "?nom=" + vm.cursoTexto 
                + "&pagina=" + vm.pagina_curso_formacao)
            .then(response => {
                if(response.data.length > 0){
                    if(vm.pagina_curso_formacao == 1){
                        vm.listaCurso = response.data;
                    } else {
                        vm.listaCurso = vm.listaCurso.concat(response.data);
                    }
                }
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao buscar cursos");
                }
            }).finally(function(){
                vm.pesquisandoCursos = false;
            });
        },
        buscaCamposExtras(){
            const vm = this;

            axios.get("../../rs/solicitacao/camposExtras")
            .then(response => {
                vm.vaga.tempoExperiencia = -1;
                vm.vaga.horario = -1;
                vm.vaga.area = -1;
                vm.vaga.motivo = -1;
                vm.vaga.formacaoNecessaria = -1;
                vm.vaga.cod_cliente = -1;
                vm.vaga.exclusivoPCD = false;
                vm.vaga.cod_tipo_solicitacao = -1;
                vm.listaArea = response.data.area;
                vm.listaFormacao = response.data.formacao;
                vm.listaTempoExperiencia = response.data.tempoExperiencia;
                vm.listaMotivo = response.data.motivoRecrutamento;
                vm.listaHorario = response.data.horarioTrabalho;
                vm.listaTipo = response.data.tipoSolicitacao;
            }).catch(function (error) {
                vm.mostraAlertaErro(error, "Erro ao buscar campos extras");
            }).finally(function(){
                vm.buscaClientes();
            });
        },
        selecionaEscolaridade(event){
            const vm = this;
            var index = event.target.options.selectedIndex-1;
            if(vm.listaFormacao[index].cod_dominio <= 48){
                document.getElementById("seleciona-curso").style = "display:none !important;";
            } else {
                document.getElementById("seleciona-curso").style = "";
            }
        },
        buscaClientes(){
            const vm = this;

            axios.get("../../rs/cliente/listar")
            .then(response => {
                vm.listaClientes = response.data;
            }).catch(function (error) {
                vm.mostraAlertaErro(error, "Erro ao buscar clientes");
            }).finally(function(){
                vm.contaCertificacoes();
            });
        },
        scrollCertificacao(){
            const vm = this;
            var scroll = document.getElementById("lista-certificacoes");
            
            if(scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight){
                vm.pagina_certificacao++;
                vm.buscaCertificacoesPorNome();
            }
        },
        scrollChav(){
            const vm = this;
            var scroll = document.getElementById("lista-chavs");
            
            if(scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight){
                vm.pagina_chav++;
                vm.buscaChavsPorNome();
            }
        },
        scrollCargo(){
            const vm = this;
            var scroll = document.getElementById("lista-cargos");
            
            if(scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight){
                vm.pagina_cargo++;
                vm.buscaCargoPorCliente();
            }
        },
        scrollCurso(){
            const vm = this;
            var scroll = document.getElementById("lista-cursos");
            
            if(scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight){
                vm.pagina_curso_formacao++;
                vm.buscaCursoPorNome();
            }
        },
        criaNovoCurso(obj){
            const vm = this;
            
            vm.cursoTexto = '';
            vm.listaCursosAdicionados.push(obj);
            
        },
        adicionaCurso(obj){
            const vm = this;
            
            var novoObj = {
                    cod_curso_formacao: 0,
                    nom_curso_formacao: '',
                    ind_manual:  true,
                    ind_temporario:  false,
                    setor_curso_formacao: {
                        nom_setor: '',
                        cod_setor: ''
                    }
            };
            novoObj.cod_curso_formacao = obj.cod_curso_formacao;
            novoObj.nom_curso_formacao = obj.nom_curso_formacao;
            novoObj.setor_curso_formacao.nom_setor = obj.setor_curso_formacao.nom_setor;
            novoObj.setor_curso_formacao.cod_setor = obj.setor_curso_formacao.cod_setor;
                        
            vm.listaCursosAdicionados.push(novoObj);
        },
        retiraCurso(obj){
            const vm = this;
            var index;
            
            for(var i = 0; i < vm.listaCursosAdicionados.length; i++){
                if(vm.listaCursosAdicionados[i].cod_curso_formacao == obj.cod_curso_formacao 
                        && vm.listaCursosAdicionados[i].nom_curso_formacao == obj.nom_curso_formacao){
                    index = i;
                    break;
                }
            }
            vm.listaCursosAdicionados.splice(index, 1);
        },
        criaNovaCertificacao(obj){
            const vm = this;
            
            vm.cursoTexto = '';
            vm.listaCertificacoesAdicionadas.push(obj);
            
        },
        adicionaCertificado(obj){
            const vm = this;
            
            var novoObj = {
                    cod_certificacao: 0,
                    des_certificacao: '',
                    ind_manual:  true,
                    nom_certificacao: '',
                    num_certificacao: '',
                    ind_obrigatorio: true
            };
            novoObj.cod_certificacao = obj.cod_certificacao;
            novoObj.des_certificacao = obj.des_certificacao;
            novoObj.nom_certificacao = obj.nom_certificacao;
            novoObj.num_certificacao = obj.num_certificacao;
                        
            vm.listaCertificacoesAdicionadas.push(novoObj);
        },
        retiraCertificado(obj){
            const vm = this;
            var index;
            
            for(var i = 0; i < vm.listaCertificacoesAdicionadas.length; i++){
                if(vm.listaCertificacoesAdicionadas[i].cod_certificacao == obj.cod_certificacao 
                        && vm.listaCertificacoesAdicionadas[i].nom_certificacao == obj.nom_certificacao){
                    index = i;
                    break;
                }
            }
            vm.listaCertificacoesAdicionadas.splice(index, 1);
        },
        criaNovaChav(obj){
            const vm = this;

            vm.chavTexto = '';
            vm.listaChavsAdicionadas.push(obj);
            
        },
        adicionaChav(obj){
            const vm = this;
            obj.ind_manual = true;
            
            vm.listaChavsAdicionadas.push(obj);
        },
        retiraChav(obj){
            const vm = this;
            var index;
            
            for(var i = 0; i < vm.listaChavsAdicionadas.length; i++){
                if(vm.listaChavsAdicionadas[i].cod_chav === obj.cod_chav
                        && vm.listaChavsAdicionadas[i].nom_chav === obj.chav){
                    index = i;
                    break;
                }
            }
            vm.listaChavsAdicionadas.splice(index, 1);
        },
        retiraCargo(){
            const vm = this;
            vm.cargoObjAux = {};
        },
        criaNovoCargo(obj){
            const vm = this;

            vm.cargoTexto = '';
            vm.cargoObjAux = obj;
            
        },
        exibeListaCargos(){
        	document.getElementById("lista-cargos").style.display="block";
        },
        adicionaCargo(obj){
            const vm = this;
            
            vm.cargoObjAux = obj;
            vm.cargoTexto = obj.nom_cargo;
            document.getElementById("lista-cargos").style.display="none";
        },
        tentaSelecionarCargo(){
            const vm = this;

            if(vm.vaga.cod_cliente === -1){
                document.getElementById("info-cargos").style="font-size: small;color: red";
            } else {
                document.getElementById("info-cargos").style="display:none";
            }
        },
        selecionaCliente(){
            const vm = this;
            
            vm.listaCargos = [];
            vm.cargoTexto = "";
            vm.pagina_cargo = 1;
            vm.buscaCargoPorCliente();
            document.getElementById("info-cargos").style="display:none";
            document.getElementById("lista-cargos").style.display = "block";
        },
        buscaCargoPorCliente(){
            const vm = this;

            vm.pesquisandoCargos = true;
            axios.get("../../rs/cargo/listarPorNomeCargoCliente"
                + "?cod=" + vm.vaga.cod_cliente 
                + "&pagina=" + vm.pagina_cargo 
                + "&nom=" + vm.cargoTexto)
            .then(response => {
                if(response.data.length > 0){
                    if(vm.pagina_cargo == 1){
                        vm.listaCargos = response.data;
                    } else {
                        vm.listaCargos = vm.listaCargos.concat(response.data);
                    }
                } else if(vm.pagina_cargo == 1) {
                    vm.listaCargos = [];
                }
            }).catch(function (error) {
                vm.mostraAlertaErro(error, "Erro ao buscar cargos");
            }).finally(function(){
                vm.pesquisandoCargos = false;
            });
        },
        buscaSolicitacao(id){
            const vm = this;
            axios.get("../../rs/solicitacao/buscar"
                +"?id=" + id)
            .then(response => {
                vm.carregandoSolicitacao = true;
                vm.vaga.cod_solicitacao = response.data.cod_solicitacao;
                vm.vaga.tempoExperiencia = response.data.nom_experiencia;
                vm.vaga.horario = response.data.nom_horario;
                vm.vaga.area = response.data.nom_area;
                vm.vaga.motivo = response.data.nom_motivo_recrutamento;
                vm.vaga.formacaoNecessaria = response.data.formacao;

                var cursos = JSON.parse(response.data.curso);
                for(var i=0;i<cursos.length;i++){
                    vm.vaga.formacaoCurso = cursos[i].cod_curso_formacao;
                    vm.adicionaCurso(cursos[i])
                }

                vm.vaga.ind_aprovado = response.data.ind_aprovado;
                vm.vaga.exclusivoPCD = response.data.ind_pcd;
                vm.vaga.cod_cliente = response.data.cod_cliente;
                vm.vaga.dta_abertura = response.data.dta_abertura;
                vm.vaga.dta_admissao = response.data.dta_admissao;
                vm.vaga.dth_registro = response.data.dth_registro;
                vm.vaga.cod_solicitacao = response.data.cod_solicitacao;
                vm.vaga.obs = response.data.des_observacoes;
                vm.vaga.conhecimentos = response.data.nom_conhecimentos_tecnicos;
                vm.vaga.funcaoEfetiva = response.data.nom_funcao_efetiva;
                vm.vaga.motivo = response.data.nom_motivo_recrutamento;
                vm.vaga.nom_pessoa = response.data.nom_pessoa;
                vm.vaga.nom_cidade = response.data.nom_cidade;
                vm.cidadeAux = response.data.nom_cidade;
                vm.vaga.des_atividades = response.data.des_atividades;
                vm.vaga.nom_substituido = response.data.nom_substituido;
                vm.vaga.num_vagas = response.data.num_vagas;
                vm.salarioAux = ""+response.data.cargo.vlr_salario;
                //vm.atualizaReal();
                vm.vaga.cargoContratual = response.data.nom_substituido;
                vm.vaga.dataAdmissaoString = formatDate(response.data.dta_admissao);
                vm.vaga.dataAberturaString = formatDate(response.data.dta_abertura);
                vm.cargoObjAux = response.data.cargo;
                vm.vaga.cargo = vm.cargoObjAux;
                vm.vaga.cod_tipo_solicitacao = response.data.cod_tipo_solicitacao;
                
                vm.listaCertificacoesAdicionadas = JSON.parse(response.data.certificacoes);
                vm.listaChavsAdicionadas = JSON.parse(response.data.chavs);
                vm.vaga.certificacoes =  vm.listaCertificacoesAdicionadas;
                vm.vaga.chavs =  vm.listaChavsAdicionadas;

            }).catch(function (error) {
                if(error.response.status === 403)
                    window.location = "/";
                else
                    vm.mostraAlertaErro(error, "Erro ao buscar solicitacao");
            }).finally(function(){
                vm.carregandoSolicitacao = false;
            });
        },
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
        buscaCidades(){
            const vm = this;

            axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/microrregioes")
            .then(response => {
                vm.listaCidades = response.data;
                vm.listaCidades.sort(compareCidade);
                vm.listaCidadesAux = vm.listaCidades;
                document.getElementById("lista-cidades").style.display = "none";
            }).catch(function (error) {
                if(error.response.status === 403)
                    window.location = "/";
                else
                    vm.mostraAlertaErro(error, "Erro ao buscar cidades");
            }).finally(function(){
                document.getElementById("lista-cidades").style.display = "none";
            });
        },
        escolheCidade(obj){
            const vm = this;
            vm.cidadeAux = obj.nome;
            vm.vaga.nom_cidade = obj.nome;
            document.getElementById("lista-cidades").style.display = "none";
        },
        mostraListaCidades(){
            var lista = document.getElementById("lista-cidades");
            if(lista.style.display !=="")
                lista.style.display = "";
            else
                lista.style.display = "none";
        },
        mostraAlertaErroSimples(erro,str){
            const vm = this;
            var childIndex = hasChild(vm,"alerta");
            if(childIndex !== -1)
                vm.$children[childIndex].mostraErroSimples(erro,str);  
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
        criaAprovar(dados){
            const vm = this;
            iniciaLoader("loader-primario");
            var sol = vm.preparaSolicitacao();

            if(!todosCamposRequiredForamPreenchidos("form") || !vm.checarCamposValidos(sol)){
                vm.mostraAlertaErroSimples("Erro!", "Erro ao salvar solicitação, campos inválidos");
                
                var elements = document.getElementsByClassName('is-invalid');
                var requiredElement = elements[0];
                window.scroll(0, scrollToElement(requiredElement));
                
                return ;
            }
                        
            axios.get("../../rs/solicitacao/aprovar"
                + "?id=" + dados.cod 
                + "&obs=" + dados.obs 
                + "&data=" + createDateFromSQLString(dados.data).getTime())
            .then(response => {
                vm.mostraAlertaMensagem("Solicitação aprovada com sucesso");
                window.location = "/sgh/pages/geral/geral.html";
            }).catch(function (error) {
                if(error.response.status === 403){
                    window.location = "/";
                } else {
                    vm.mostraAlertaErro(error, "Erro ao aprovar solicitação");
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
        vm.buscaCidades();
        var aux = queryParameters(document.location.search);
        if(aux.id !== undefined){
            vm.idSolicitacao = aux.id[0];
            document.getElementById("botoes-criacao").style="display:none";
            vm.vis = resolverVisualizacao(vm.sghGrupo)
        }
        if (!vm.sghGrupo) { // Token expirou
            window.location.replace("../../errorPage.html");
        }
        vm.buscaCamposExtras();
        vm.cargoObjAux = {
            cod_cargo: 0,
            nom_cargo: '',
            des_cargo:  '',
            vlr_salario: ''
        };
        
        vm.abreModalCertificacao = false;
        vm.abreModalChav = false;
        vm.abreModalCargo = false;
        
        $(function () {
          $('[data-toggle="tooltip"]').tooltip();
        })
        
    },
    destroyed () {
        const vm = this;
        document.body.removeEventListener('scroll', vm.scrollCertificacao);
    }
});

function compareCidade(a,b) {
    if (a.nome < b.nome)
        return -1;
    if (a.nome > b.nome)
        return 1;
    return 0;
}

function scrollToElement(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop - 75];
    }
}