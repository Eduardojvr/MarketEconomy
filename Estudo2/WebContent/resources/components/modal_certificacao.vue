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
                        <slot name="body">
                        	<form  id="form-modal" class="needs-validation" novalidate>
	                            <div class="form-group">
	                                <label for="empresa" class="label-required">Empresa certificadora</label>
	                                <select class="form-control" id="empresa" required v-model="novo.cod_empresa">
                                        <option disabled selected value="-1">
                                            Selecione a empresa certificadora
                                        </option>
                                        <option v-bind:value="option.cod_empresa" v-for="(option, index) in listaEmpresa">
                                            {{ option.nom_empresa }}
                                        </option>
	                                </select>
	                                <div class="invalid-feedback">
								        Selecione uma empresa certificadora
								    </div>
	                            </div>
	                            <div class="form-group row">
	                                <div class="col-sm-6">
	                                    <label for="num_certificacao" class="label-required">Número</label>
	                                    <input class="form-control" id="num_certificacao" placeholder="Número do certificado" required type="text" v-model="novo.num_certificacao"/>
	                                    <div class="invalid-feedback">
								        	Escreva o número do certificado
								    	</div>
	                                </div>
	                                <div class="col-sm-6">
	                                    <label for="nom_certificacao" class="label-required">Nome</label>
	                                    <input class="form-control" id="nom_certificacao"  placeholder="Nome do certificado" required type="text" v-model="novo.nom_certificacao"/>
	                                    <div class="invalid-feedback">
									        Escreva o nome do certificado
									    </div>
	                                </div>
	                            </div>
	                            <div class="form-group">
	                                <label for="descricao">Descrição</label>
	                                <textarea class="form-control" id="descricao" placeholder="Descreva em poucas palavras o que este certificado garante" rows="3" v-model="novo.des_certificacao" ></textarea>
	                            </div>
                        	</form>
                            <div class="form-group" id="botoes-criacao">
                                <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="inserirCertificacao()">Salvar</button>
                                <button type="button" class="btn btn-sm btn-danger" id="cancela-novo" @click="cancelaCertificacao()">Cancelar</button>
                            </div>
                        </slot>
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
    props: ['cod_certificacao', 'titulo'],
    data: function() {
        return {
            novo:{
                cod_empresa: -1,
                cod_certificacao: 0,
                des_certificacao:"",
                num_certificacao:"",
                nom_certificacao:"",
                ind_manual:  true,
                ind_temporario: true,
                dth_registro: 0
            },
            listaEmpresa: []
        }
    },
    methods: {
        fechaModal : function(){
            this.$emit('fecha-modal-certificacao');
        },
        buscaEmpresas : function(){
            const vm = this;

            iniciaLoader("loader-primario");
            axios.get("../../rs/empresa/listar")
                .then(response => {
                    vm.listaEmpresa = response.data;
                }).catch(function (error) {
                    if(error.response.status === 403)
                        window.location = "/";
                    else
                        this.$emit('alerta-erro', error, "Erro ao listar empresas");
                }).finally(function(){
                    encerraLoader("loader-primario");

                });
            },
        cancelaCertificacao: function(){
            const vm = this;
            novo = {
                cod_empresa: -1,
                cod_certificacao: 0,
                des_certificacao:"",
                num_certificacao:"",
                nom_certificacao:"",
                ind_manual:  true,
                ind_temporario: true,
                dth_registro: 0
            };
            vm.fechaModal();
        },
        inserirCertificacao: function(){
            const vm = this;
            
            var data = new Date();
            vm.novo.dth_registro = data.getTime();

            if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

            if(vm.cod_certificacao > 0){
                this.$emit('edita-certificacao', vm.novo);
            }
            else{
                this.$emit('cria-certificacao', vm.novo);
            }

            vm.novo = {
                cod_empresa: -1,
                cod_certificacao: 0,
                des_certificacao:"",
                num_certificacao:"",
                nom_certificacao:"",
                ind_manual:  true,
                ind_temporario: true,
                dth_registro: 0
            };
            vm.fechaModal();
        },
        buscaCertificacao: function(){
            const vm = this;
            iniciaLoader("loader-primario");
           
            axios.get("../../rs/certificacao/buscar?cod=" + vm.cod_certificacao)
                   .then(response => {
                    vm.novo = response.data;
                }).catch(function (error) {
                    if(error.response.status === 403)
                       window.location = "/";
                    else
                       this.$emit('alerta-erro', error, "Erro ao buscar certificacao");
               }).finally(function(){
                encerraLoader("loader-primario");
               });
        }
    },
    created: function() {
        const vm = this;

        vm.buscaEmpresas();
        if(vm.cod_certificacao > 0){
            vm.buscaCertificacao();
        }
    }
}
</script>
