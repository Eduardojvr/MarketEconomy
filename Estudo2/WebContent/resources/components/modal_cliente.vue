<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-headerSair">
                        <button type="button" class="btn btn-secondary" @click="fechaModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-header">
                        <div slot="header">
                            <h1>{{titulo}}</h1>
                        </div>
                    </div>

                    <div class="modal-body">
                        <div slot="body">
                            <!-- ESTRUTURA DO SEU MODAL -->
                            <form  id="form-modal" class="needs-validation" novalidate>
	                            <div class="row">
	                            	<div class="col">
			                            <div class="form-group">
			                                <label for="nom_cliente" class="label-required">Nome</label>
			                                <input class="form-control" placeholder="Nome" id="nom_cliente" required type="text" v-model="novo.nom_cliente"/>
			                                <div class="invalid-feedback">
									          Por favor, escreva o nome do cliente
									        </div>
			                            </div>
		                        	</div>
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="razao_social">Nome razão social</label>
			                                <input class="form-control" placeholder="Razão social" id="razao_social" type="text" v-model="novo.nom_razao_social"/>
			                            </div>
		                        	</div>
	                        	</div>
	                            <div class="form-group">
	                                <label for="descricao">Descrição</label>
	                                <textarea class="form-control" id="descricao" placeholder="Descreva em poucas palavras a atividade deste cliente" rows="3" v-model="novo.des_cliente" ></textarea>
	                            </div>
	                            <div class="row">
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="cnpj">Nº CNPJ</label>
			                                <input class="form-control cnpj" placeholder="Nº CNPJ" id="cnpj" required type="text"/>
			                                <div class="invalid-feedback">
								        		Por favor, escreva o cnpj
								        	</div>
			                            </div>
			                        </div>
			                        <div class="col">
			                            <div class="form-group">
			                                <label for="num_inscricao_estadual">Nº Inscrição estadual</label>
			                                <input class="form-control" placeholder="Nº inscrição" id="num_inscricao_estadual" type="number" max="9999999999" v-model="novo.num_inscricao_estadual"/>
			                            </div>
		                        	</div>
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="tipo_cliente" class="label-required">Tipo Cliente</label>
			                                <select class="form-control" id="contrato" v-model="novo.tipo_cliente.cod_dominio" required>
		                                        <option disabled selected value="-1">
		                                            Selecione o tipo do cliente
		                                        </option>
		                                        <option v-bind:value="option.cod_dominio" v-for="(option, index) in listaTipoCliente">
		                                            {{option.nom_dominio}}
		                                        </option>
		                                	</select>
		                                	<div class="invalid-feedback">
									        	Por favor, selecione o tipo do cliente
									        </div>
			                            </div>
		                        	</div>
		                        </div>
		                        <div class="row">
			                        <div class="col">
			                            <div class="form-group">
			                                <label for="email">E-mail</label>
			                                <input class="form-control" placeholder="email@email.com" id="email" type="email" v-model="novo.des_email"/>
			                            </div>
		                        	</div>
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="telefone" class="label-required">Telefone</label>
			                                <input class="form-control telefone" placeholder="Nº de telefone com DDD" id="telefone" type="text" required />
			                                <div class="invalid-feedback">
									          Por favor, escreva o número de telefone
									        </div>
			                            </div>
		                        	</div>
		                        	
	                        	</div>
	                        	<div class="row">
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="cep" class="label-required">CEP</label>
			                                <input class="form-control cep" placeholder="CEP" id="cep" required type="text" @change="buscaEnderecoPorCep"/>
			                                <div class="invalid-feedback">
									        	Por favor, escreva o cep
									        </div>
			                            </div>
			                        </div>
			                        <div class="col">
			                            <div class="form-group">
			                                <label for="cep" class="label-required">UF</label>
				                            <select class="form-control" id="uf" v-model="novo.uf.cod_dominio" required>
		                                        <option disabled selected value="-1">
		                                            Selecione o estado
		                                        </option>
		                                        <option v-bind:value="option.cod_dominio" v-for="(option, index) in listaUF">
		                                            {{option.nom_dominio}}
		                                        </option>
		                                	</select>
		                                	<div class="invalid-feedback">
									        	Por favor, selecione o UF ou digite o CEP
									        </div>
			                            </div>
			                        </div>
			                        <div class="col">
			                            <div class="form-group">
			                                <label for="logradouro" class="label-required">Logradouro</label>
			                                <input class="form-control" placeholder="Logradouro" id="logradouro" type="text" v-model="novo.des_logradouro" required/>
			                                <div class="invalid-feedback">
										      	Por favor, escreva o logradouro ou digite o CEP
										    </div>
			                            </div>
		                        	</div>
	                        	</div>
	                        	<div class="row">
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="complemento">Complemento</label>
			                                <input class="form-control" placeholder="Complemento" id="complemento" type="text" v-model="novo.des_complemento"/>
			                            </div>
		                        	</div>
			                        <div class="col">
			                            <div class="form-group">
			                                <label for="bairro" class="label-required">Bairro</label>
			                                <input class="form-control" placeholder="Bairro" id="bairro" type="text" v-model="novo.nom_bairro" required/>
			                                <div class="invalid-feedback">
										      	Por favor, escreva o bairro ou digite o CEP
										    </div>
			                            </div>
		                        	</div>
		                        	<div class="col">
			                            <div class="form-group">
			                                <label for="cidade" class="label-required">Cidade</label>
			                                <input class="form-control" placeholder="Cidade" id="cidade" type="text" v-model="novo.nom_cidade" required/>
			                                <div class="invalid-feedback">
										      	Por favor, escreva a cidade ou digite o CEP
										    </div>
			                            </div>
		                        	</div>
	                        	</div>
                        	</form>

                            <div class="form-group" id="botoes-criacao">
                                <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="salvar()">Salvar</button>
                                <button type="button" class="btn btn-sm btn-danger" id="cancela-novo" @click="cancelar()">Cancelar</button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <slot name="close">
                            <button type="button" class="btn btn-sm btn-primary" @click="fechaModal">Fechar</button>
                        </slot>         
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

module.exports = {
    props: ['cod_cliente', 'titulo'],
    data: function() {
        return {
            novo:{
                nom_cliente: '',
                nom_razao_social: '',
                des_cliente: '',
                des_email: '',
                num_cnpj: '',
                num_inscricao_estadual: '',
                num_telefone: '',
                num_cep: '',
                des_logradouro: '',
                des_complemento: '',
                nom_bairro: '',
                nom_cidade: '',
                tipo_cliente: {
                	cod_dominio: -1,
                	nom_dominio: ''
                },
                uf: {
                	cod_dominio: -1,
                	nom_dominio: ''
                }
            },
            listaUF: [],
            listaTipoCliente: []
        }
    },
    methods: {
        fechaModal : function(){
            this.$emit('fecha-modal-cliente');
        },
        buscaCliente: function(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/cliente/buscar?cod=" + vm.cod_cliente)
                .then(response => {
                	var aux;
                    vm.novo = response.data;

                    document.getElementById("cep").setAttribute('value',$('.cep').masked(vm.novo.num_cep));
                    document.getElementById("cnpj").setAttribute('value',$('.cnpj').masked(vm.novo.num_cnpj));
                    document.getElementById("telefone").setAttribute('value',$('.telefone').masked(vm.novo.num_telefone));

                    document.getElementById("uf").disabled = true;
                    document.getElementById("logradouro").disabled = true;
                    document.getElementById("complemento").disabled = true;
                    document.getElementById("bairro").disabled = true;
                    document.getElementById("cidade").disabled = true;

                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao buscar cliente");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
        buscaCamposExtras: function(){
        	const vm = this;
            iniciaLoader("loader-primario");

        	axios.get("../../rs/cliente/camposExtras")
                .then(response => {
                    vm.listaUF = response.data.uf;
                    vm.listaTipoCliente = response.data.tipoCliente;
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        vm.$emit('alerta-erro', error, "Erro ao listar clientes");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
  		buscaEnderecoPorCep: function(){
  			const vm = this;

  			iniciaLoader("loader-primario");
  			vm.novo.num_cep = parseInt($('#cep').cleanVal());

  			axios.get("https://viacep.com.br/ws/" + vm.novo.num_cep + "/json")
                .then(response => {
                	
                	if(response.data.erro){
                		throw {
                			response: {
                				status: 404,
                				data: "Cep não encontrado"
                			}
                		};
                	}

                    vm.novo.des_logradouro = response.data.logradouro;
                    vm.novo.des_complemento = response.data.complemento;
                    vm.novo.nom_bairro = response.data.bairro;
                    vm.novo.nom_cidade = response.data.localidade;

                    vm.novo.uf.cod_dominio = vm.listaUF.find(function(x) {
                    	return x.nom_dominio === response.data.uf
                    }).cod_dominio;

                    /*for(var i = 0; i < vm.listaUF.length; i++){
                    	if(vm.listaUF[i].nom_dominio === response.data.uf){
                    		vm.novo.cod_uf = vm.listaUF[i].cod_dominio;
                    		break;
                    	}
                    }*/

                    document.getElementById("uf").disabled = true;
                    document.getElementById("logradouro").disabled = true;
                    document.getElementById("complemento").disabled = true;
                    document.getElementById("bairro").disabled = true;
                    document.getElementById("cidade").disabled = true;

                }).catch(function (error) {
                	console.log(error);
                    if(error.response.status === 403){
                        window.location = "/";
                    }
                    else{
                        vm.$emit('alerta-erro', error, "Erro ao pesquisar por cep");
                        document.getElementById("uf").disabled = false;
                    	document.getElementById("logradouro").disabled = false;
                    	document.getElementById("complemento").disabled = false;
                    	document.getElementById("bairro").disabled = false;
                    	document.getElementById("cidade").disabled = false;
                    }
                }).finally(function(){
                    encerraLoader("loader-primario");

                });

  		},
        cancelar: function(){
            const vm = this;
            vm.novo = {
                nom_cliente: '',
                nom_razao_social: '',
                des_cliente: '',
                des_email: '',
                num_cnpj: '',
                num_inscricao_estadual: '',
                num_telefone: '',
                num_cep: '',
                des_logradouro: '',
                des_complemento: '',
                nom_bairro: '',
                nom_cidade: '',
                tipo_cliente: {
                	cod_dominio: -1,
                	nom_dominio: ''
                },
                uf: {
                	cod_dominio: -1,
                	nom_dominio: ''
                }
            };
            vm.fechaModal();
        },
        salvar: function(){
            const vm = this;

            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

            vm.novo.num_cnpj = $('#cnpj').cleanVal();
            vm.novo.num_telefone = parseInt($('#telefone').cleanVal());
            vm.novo.num_inscricao_estadual = parseInt(vm.novo.num_inscricao_estadual);

            vm.novo.tipo_cliente = vm.listaTipoCliente.find(
            	function(x) {
                    	return x.cod_dominio === vm.novo.tipo_cliente.cod_dominio;
                }
            );            
            if(vm.cod_cliente > 0){
            	vm.novo.cod_cliente = vm.cod_cliente;
                vm.$emit('edita-cliente', vm.novo);
            }
            else{
                vm.$emit('cria-cliente', vm.novo);
            }
            
            vm.novo = {
                nom_cliente: '',
                nom_razao_social: '',
                des_cliente: '',
                des_email: '',
                num_cnpj: '',
                num_inscricao_estadual: '',
                num_telefone: '',
                num_cep: '',
                des_logradouro: '',
                des_complemento: '',
                nom_bairro: '',
                nom_cidade: '',
                tipo_cliente: {
                	cod_dominio: -1,
                	nom_dominio: ''
                },
                uf: {
                	cod_dominio: -1,
                	nom_dominio: ''
                }
            };
            vm.fechaModal();
        }
    },
    created: function() {
        const vm = this;
        
        $(document).ready(function(){
		    $('.cep').mask('00000-000');
		    $('.cnpj').mask('00.000.000/0000-00', {reverse: true});
		    $('.telefone').mask("(00) Z0000-0000", {translation: { 'Z': {pattern: /[0-9]/, optional: true}} });
		});

        $('body').on('focus', '.cep', function(){
    		$(this).mask('00000-000');
		});
		$('body').on('focus', '.cnpj', function(){
    		$(this).mask('00.000.000/0000-00', {reverse: true});
		});
		$('body').on('focus', '.telefone', function(){
    		$(this).mask("(00) Z0000-0000", {translation: { 'Z': {pattern: /[0-9]/, optional: true}} });
		});

		vm.buscaCamposExtras();
        if(vm.cod_cliente > 0){
            vm.buscaCliente();
        }
    }
}
</script>
