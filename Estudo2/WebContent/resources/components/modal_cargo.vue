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
							<h1>Inserir novo cargo</h1>
						</div>
					</div>

					<div class="modal-body">
						<div slot="body">
						<form  id="form-modal" class="needs-validation" novalidate>
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
									Escreva um nome para o cargo
								</div> 
							</div>
							<div class="form-group">
								<label for="vlr_salario" class="label-required">Salário fixo</label>
								<input type="text" class="form-control dinheiro" id="vlr_salario" placeholder="0,00" required />
								<div class="invalid-feedback">
									Escreva o salário
								</div> 
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
	props: ['cod_cliente'],
    data: function() {
        return {
            novo:{
	        	contrato: {
	        		cod_contrato: -1,
	        		num_contrato: '',
	        		nom_contrato: ''
	        	},
	        	cod_cargo: 0,
	        	nom_cargo: '',
	        	vlr_salario: 0,
	        	ind_temporario: true,
	        },
        	listaContrato: [],
        	cod_cliente: 0,
        }
    },
    methods: {
    	fechaModal : function(){
    		this.$emit('fecha-modal-cargo');
    	},
    	 buscaContrato(){
            const vm = this;
            iniciaLoader("loader-primario");
            
            axios.get("../../rs/contrato/listarPorCliente?cod=" + vm.cod_cliente)
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
	    cancelaCargo(){
        	const vm = this;
        	vm.novo = {
            	contrato: {
            		cod_contrato: 0,
            		num_contrato: '',
            		nom_contrato: ''
            	},
            	cod_cargo: 0,
            	nom_cargo: '',
            	vlr_salario: 0,
            	ind_temporario: true
            };
        	vm.fechaModal();
        },
	    inserirCargo: function(){
	    	const vm = this;
        	
        	vm.novo.vlr_salario = parseFloat($('#vlr_salario').cleanVal())/100;

        	if(!todosCamposRequiredForamPreenchidos("form-modal")){
            	return ;
            }

        	this.$emit('cria-cargo', vm.novo);
        	vm.novo = {
            	contrato: {
            		cod_contrato: 0,
            		num_contrato: '',
            		nom_contrato: ''
            	},
            	cod_cargo: 0,
            	nom_cargo: '',
            	vlr_salario: 0,
            	ind_temporario: true
            };
        	vm.fechaModal();
	    }
    },
    created: function() {
    	const vm = this;
    	if(vm.cod_cliente == null || vm.cod_cliente == -1){
    		this.$emit('alerta-erro', '', "Selecione o cliente primeiro");
    		vm.fechaModal();
    	}
    	else{
    		$(document).ready(function(){
			    $('#vlr_salario').mask("#.##0,00", {reverse: true, maxlength: false});
			});
    		$('body').on('focus', '.dinheiro', function(){
        		$(this).mask("#.##0,00", {reverse: true, maxlength: false});
    		});
    		
            vm.buscaContrato();
    	}
    	
    }
}
</script>
