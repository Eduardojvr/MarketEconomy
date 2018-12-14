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
                            <h1>Inserir novo Curso</h1>
                        </div>
                    </div>

                    <div class="modal-body">
                        <div slot="body">
	                        <form  id="form-modal" class="needs-validation" novalidate>
				                <div class="form-group">
				                    <label for="tipo" class="label-required">Setor de formação</label>
				                        <select class="form-control" id="empresa" required v-model="novo.setor_curso_formacao.cod_setor">
				                            <option disabled selected value="-1">
				                                Selecione o setor
				                            </option>
				                            <option v-bind:value="option.cod_setor" v-for="(option, index) in listaSetor">
				                                {{ option.nom_setor }}
				                            </option>
				                        </select>
				                        <div class="invalid-feedback">
								        	Selecione o setor de formação
								    	</div>
				                </div>
				                <div class="form-group">
				                    <label for="nom_chav" class="label-required">Nome do curso</label>
				                    <input class="form-control" id="nom_chav" placeholder="Nome do curso de formação" required type="text" v-model="novo.nom_curso_formacao"/>
				                    <div class="invalid-feedback">
								        Escreva o nome do curso
								    </div>
				                </div>

				                <div class="form-group" id="botoes-criacao">
				                    <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="inserirCursoFormacao()">Salvar</button>
				                    <button type="button" class="btn btn-sm btn-danger" id="cancela-novo" @click="cancelaCursoFormacao()">Cancelar</button>
				                </div>
			            	</form>
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
    data: function() {
        return {
            novo:{
                setor_curso_formacao: {
                    cod_setor: -1,
                    nom_setor: ''
                },
                cod_curso_formacao: 0,
                nom_curso_formacao: '',
                ind_temporario: true
            },
            listaSetor: []
        }
    },
    methods: {
        fechaModal : function(){
            this.$emit('fecha-modal-curso');
        },
         buscaSetor(){
            const vm = this;

            iniciaLoader("loader-primario");
            
            axios.get("../../rs/cursoformacao/listar")
                .then(response => {
                    vm.listaSetor = response.data;
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao listar setor de formação");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
        },
        cancelaCursoFormacao(){
            const vm = this;
            vm.novo = {
                setor_curso_formacao: {
                    cod_setor: -1,
                    nom_setor: ''
                },
                cod_curso_formacao: 0,
                nom_curso_formacao: '',
                ind_temporario: true
            };
            vm.fechaModal();
        },
        inserirCursoFormacao: function(){
            const vm = this;
            
            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

            this.$emit('cria-curso', vm.novo);
            vm.novo = {
                setor_curso_formacao: {
                    cod_setor: -1,
                    nom_setor: ''
                },
                cod_curso_formacao: 0,
                nom_curso_formacao: '',
                ind_temporario: true
            };
            vm.fechaModal();
        }
    },
    created: function() {
       this.buscaSetor();
    }
}
</script>
