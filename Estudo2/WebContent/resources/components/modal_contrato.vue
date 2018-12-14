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
	                                <select class="form-control" id="contrato" required v-model="novo.cliente.cod_cliente">
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
	                            <div class="row">
	                                <div class="col">
	                                    <div class="form-group">
	                                        <label for="num_contrato" class="label-required">Número</label>
	                                        <input class="form-control" placeholder="Número do contrato" id="num_contrato" required type="text" v-model="novo.num_contrato"/>
	                                        <div class="invalid-feedback">
								        		Escreva o número do contrato
								    		</div>
	                                    </div>
	                                </div>
	                                <div class="col">
	                                    <div class="form-group">
	                                        <label for="nom_contrato" class="label-required">Nome</label>
	                                        <input class="form-control" placeholder="Nome do contrato" id="nom_contrato" required type="text" v-model="novo.nom_contrato"/>
	                                        <div class="invalid-feedback">
								        		Escreva o nome do contrato
								    		</div>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="row">
	                                <div class="col">
	                                    <div class="form-group">
	                                        <label for="dta_inicio" class="label-required">Data início</label>
	                                        <input type="date" class="form-control" id="dta_inicio" v-model="dta_inicio" required/>
	                                        <div class="invalid-feedback">
								        		Selecione a data de início
								    		</div>
	                                    </div>
	                                </div>
	                                <div class="col">
	                                    <div class="form-group">
	                                        <label for="dta_fim">Data fim</label>
	                                        <input type="date" class="form-control" id="dta_fim" v-model="dta_fim"/>
	                                    </div>
	                                </div>
	                            </div>
	                            <div class="form-group row">
	                                <input type="checkbox" class="custom-control-input" id="ind_ativo" v-model="novo.ind_ativo">
	                                <label class="custom-control-label" for="ind_ativo">Ativo</label>
	                            </div>

	                            <div class="form-group">
	                                <label for="descricao">Descrição</label>
	                                <textarea class="form-control" id="descricao" placeholder="Descreva em poucas palavras o que este contrato representa" rows="3" v-model="novo.des_contrato" ></textarea>
	                            </div>
                        	</form>

                            <div class="form-group" id="botoes-criacao">
                                <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="inserir()">Salvar</button>
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
    props: ['cod_contrato', 'titulo'],
    data: function() {
        return {
            novo:{
                cliente: {
                    cod_cliente: -1,
                    nom_cliente: ''
                },
                cod_contrato: -1,
                num_contrato: '',
                nom_contrato: '',   
                des_contrato: '',   
                dta_inicio: 0,
                dta_fim: 0,
                ind_ativo: 0,
            },
            listaCliente: [],
            dta_fim: null,
            dta_inicio: null
        }
    },
    methods: {
        fechaModal : function(){
            this.$emit('fecha-modal-contrato');
        },
        buscaContrato : function(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/contrato/buscar?cod=" + vm.cod_contrato)
                .then(response => {
                    vm.novo = response.data;

                    vm.dta_inicio = longToStringDataInputDate(vm.novo.dta_inicio);
                    vm.dta_fim = longToStringDataInputDate(vm.novo.dta_fim);

                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao buscar contratos");
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
                        this.$emit('alerta-erro', error, "Erro ao listar cliente");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
        cancelar : function(){
            const vm = this;
            vm.novo = {
                cliente: {
                    cod_cliente: -1,
                    nom_cliente: ''
                },
                cod_contrato: -1,
                num_contrato: '',
                nom_contrato: '',   
                des_contrato: '',   
                dta_inicio: 0,
                dta_fim: null,
                ind_ativo: null,
            };
            vm.fechaModal();
        },
        inserir: function(){
            const vm = this;

            if(vm.dta_inicio != null){
                vm.novo.dta_inicio = createDateFromSQLString(vm.dta_inicio);
            }
            if(vm.dta_fim != null){
                vm.novo.dta_fim = createDateFromSQLString(vm.dta_fim);
            }
            
            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

            if(vm.cod_contrato > 0){
                this.$emit('edita-contrato', vm.novo);
            }
            else{
                this.$emit('cria-contrato', vm.novo);
            }
            
            vm.novo = {
                cliente: {
                    cod_cliente: -1,
                    nom_cliente: ''
                },
                cod_contrato: -1,
                num_contrato: '',
                nom_contrato: '',   
                des_contrato: '',   
                dta_inicio: 0,
                dta_fim: null,
                ind_ativo: null,
            };
            vm.fechaModal();
        }
    },
    created: function() {
        const vm = this;

        vm.buscaCliente();
        if(vm.cod_contrato > 0){
            vm.buscaContrato();
        }
    }
}
</script>
