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
	                            <div class="form-group row">
	                                <label for="funcao-efetiva" class="col-sm-2 col-form-label label-required">
                                        Observação (aparece no site)
                                    </label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" id="funcao-efetiva" placeholder="Escreva a observação" required v-model="observacao">
                                        </textarea>
                                        <div class="invalid-feedback">
                                            Escreva a observação
                                        </div>
                                    </div>
	                            </div>
                                <div class="form-group row">
                                    <label for="data-admissao" class="col-sm-2 col-form-label label-required">
                                        Data prevista para o encerramento
                                    </label>
                                    <div class="col-sm-10">
                                        <input class="form-control" id="data-admissao" required type="date" v-model="data_encerramento"/>
                                        <div class="invalid-feedback">
                                            Selecione uma data prevista de encerramento
                                        </div>
                                    </div>
                                </div>
                        	</form>

                            <div class="form-group" id="botoes-criacao">
                                <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="aprovar()">Aprovar</button>
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
    props: ['cod_solicitacao','titulo'],
    data: function() {
        return {
            observacao:"",
            data_encerramento:"",
        }
    },
    methods: {
        fechaModal(){
            const vm = this;
            vm.$emit('fecha-modal-aprovar');
        },
        cancelar(){
            const vm = this;
            vm.fechaModal();
        },
        aprovar(){
            const vm = this;
            
            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return;
            }
    
            vm.$emit('cria-aprovar', {obs:vm.observacao, data:vm.data_encerramento, cod:vm.cod_solicitacao});
            
            vm.fechaModal();
        }
    },
    created() {
        const vm = this;
    }
}
</script>
