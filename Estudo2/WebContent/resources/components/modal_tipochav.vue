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
				                        <label for="nom_chav" class="label-required">Nome</label>
				                        <input class="form-control" id="nom_chav" placeholder="Nome do tipo" required type="text" v-model="novo.nom_tipo_chav"/>
				                        <div class="invalid-feedback">
								        	Escreva o nome do tipo
								    	</div>
				                    </div>
				                    <div class="form-group">
				                        <label for="descricao">Descrição</label>
				                        <textarea class="form-control" id="descricao" rows="3" placeholder="Descreva em poucas palavras o que este tipo de competência indica" v-model="novo.des_tipo_chav" ></textarea>
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
        props: ['cod_tipo_chav', 'titulo'],
        data: function() {
            return {
                novo:{
                        cod_tipo_chav: -1,
                        nom_tipo_chav: '',
                        des_tipo_chav: ''
                }
            }
        },
        methods: {
            fechaModal : function(){
                this.$emit('fecha-modal-tipochav');
            },
            cancelar: function(){
                const vm = this;
                vm.novo = {
                    cod_tipo_chav: -1,
                    nom_tipo_chav: '',
                    des_tipo_chav: ''
                };
                vm.fechaModal();
            },
            salvar: function(){
                const vm = this;
                
                if(!todosCamposRequiredForamPreenchidos("form-modal")){
            		return ;
            	}
                if(vm.cod_tipo_chav > 0){
                    this.$emit('edita-tipochav', vm.novo);
                }
                else{
                    this.$emit('cria-tipochav', vm.novo);
                }
                
                vm.novo = {
                    cod_tipo_chav: -1,
                    nom_tipo_chav: '',
                    des_tipo_chav: ''
                };
                vm.fechaModal();
            },
            buscaTipo(){
                const vm = this;
    
                iniciaLoader("loader-primario");
                
                axios.get("../../rs/tipochav/buscar?cod=" + vm.cod_tipo_chav)
                    .then(response => {
                        vm.novo = response.data;
                    }).catch(function (error) {
                        if(error.response.status === 403)
                            window.location = "/";
                        else
                            this.$emit('alerta-erro', error, "Erro ao buscar tipo de chave");
                    }).finally(function(){
                        encerraLoader("loader-primario");
    
                    });
            },
        },
        created: function() {
            const vm = this;
            
            if(vm.cod_tipo_chav > 0){
                vm.buscaTipo();
            }
        }
    }
    </script>
