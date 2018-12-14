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
                        	<form  id="form-modal" class="needs-validation" novalidate>
	                            <div class="form-group">
	                                <label for="cliente" class="label-required">Cliente</label>
	                                <select class="form-control" id="contrato" required v-model="novo.contrato.cliente.cod_cliente" @change="buscaContrato">
	                                        <option disabled selected value="-1">
	                                            Selecione o cliente
	                                        </option>
	                                        <option v-bind:value="option.cod_cliente" v-for="(option, index) in listaCliente">
	                                            {{ option.nom_cliente}}
	                                        </option>
	                                </select> 
	                                <div class="invalid-feedback">
								        Selecione um cliente
								    </div>
	                            </div>
	                            <div class="form-group">
	                                <label for="contrato" class="label-required">Contrato</label>
	                                <select class="form-control" id="contrato" required v-model="novo.contrato.cod_contrato">
	                                        <option disabled selected value="-1">
	                                            Selecione o contrato
	                                        </option>
	                                        <option v-bind:value="option.cod_contrato" v-for="(option, index) in listaContrato">
	                                            [{{ option.num_contrato}}] - {{ option.nom_contrato}}
	                                        </option>
	                                </select>
	                                <div class="invalid-feedback">
								        Selecione um contrato
								    </div> 
	                            </div>
	                            <div class="form-group">
	                                <label for="nom_cargo" class="label-required">Nome</label>
	                                <input class="form-control" placeholder="Nome do cargo" id="nom_cargo" required type="text" v-model="novo.nom_cargo"/>
	                                <div class="invalid-feedback">
								        Escreva o nome do cargo
								    </div>
	                            </div>
	                            <div class="form-group">
	                                <label for="vlr_salario" class="label-required">Salário fixo</label>
	                                <input type="text" class="form-control dinheiro" id="vlr_salario" placeholder="0,00" required/>
	                                <div class="invalid-feedback">
								        Escreva o salário
								    </div>
	                            </div>

	                            <div class="form-group">
	                                <label for="descricao">Descrição</label>
	                                <textarea class="form-control" id="descricao" placeholder="Descreva em poucas palavras o que cargo realiza" rows="3" v-model="novo.des_cargo" ></textarea>
	                            </div>
                        	</form>

                            <div class="form-group" id="botoes-criacao">
                                <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="inserirCargo()">Salvar</button>
                                <button type="button" class="btn btn-sm btn-danger" id="cancela-novo" @click="cancelaCargo()">Cancelar</button>
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
    props: ['cod_cargo', 'titulo'],
    data: function() {
        return {
            novo:{
                contrato: {
                    cliente: {
                        cod_cliente: -1,
                        nom_cliente: ''
                    },
                    cod_contrato: -1,
                    num_contrato: '',
                    nom_contrato: ''
                },
                cod_cargo: 0,
                nom_cargo: '',
                vlr_salario: 0,
                des_cargo: '',
                ind_temporario: false
            },
            listaContrato: [],
            listaCliente: []
        }
    },
    methods: {
        fechaModal : function(){
            this.$emit('fecha-modal-cargo-gpc');
        },
        buscaCargo : function(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/cargo/buscar?cod=" + vm.cod_cargo)
                .then(response => {
                    vm.novo = response.data;
                    console.log(vm.novo);
                    var vlr = String(vm.novo.vlr_salario * 100).replace('.','');
                    var vlrAux = vlr.replace(',','');
                    document.getElementById("vlr_salario").setAttribute('value',$('.dinheiro').masked(vlrAux));
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao buscar cargo");
                }).finally(function(){
                    vm.buscaContrato();
                    encerraLoader("loader-primario");

                });
        },
        buscaContrato : function(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/contrato/listarPorCliente?cod=" + vm.novo.contrato.cliente.cod_cliente)
                .then(response => {
                    vm.listaContrato = response.data;
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao listar contratos");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
        buscaCliente : function(){
            const vm = this;

            iniciaLoader("loader-primario");
            axios.get("../../rs/cliente/listar")
                .then(response => {
                    vm.listaCliente = response.data;
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao listar clientes");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
        cancelaCargo : function(){
            const vm = this;
            vm.novo = {
                contrato: {
                    cliente: {
                        cod_cliente: -1,
                        nom_cliente: ''
                    },
                    cod_contrato: -1,
                    num_contrato: '',
                    nom_contrato: ''
                },
                cod_cargo: 0,
                nom_cargo: '',
                vlr_salario: 0,
                des_cargo: '',
                ind_temporario: false
            };
            vm.fechaModal();
        },
        inserirCargo: function(){
            const vm = this;
            
            vm.novo.vlr_salario = parseFloat($('.dinheiro').cleanVal())/100;

            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

           	if(vm.cod_cargo > 0){
                this.$emit('edita-cargo-gpc', vm.novo);
            }
            else{
                this.$emit('cria-cargo-gpc', vm.novo);
            }
            
            vm.novo = {
                contrato: {
                    cliente: {
                        cod_cliente: -1,
                        nom_cliente: ''
                    },
                    cod_contrato: -1,
                    num_contrato: '',
                    nom_contrato: ''
                },
                cod_cargo: 0,
                nom_cargo: '',
                vlr_salario: 0,
                des_cargo: '',
                ind_temporario: false
            };
            vm.fechaModal();
        }
    },
    created: function() {
        const vm = this;

		$(document).ready(function(){
		    $('.dinheiro').mask("#.##0,00", {reverse: true, maxlength: false});
		});
        $('body').on('focus', '.dinheiro', function(){
            $(this).mask("#.##0,00", {reverse: true, maxlength: false});
        });
        
        vm.buscaCliente();
        if(vm.cod_cargo > 0){
            vm.buscaCargo();
        }
    }
}
</script>
