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
				                        <label for="tipo" class="label-required">Tipo de Competência</label>
				                            <select class="form-control" id="empresa" required v-model="novo.tipo_chav.cod_tipo_chav">
				                                <option disabled selected value="-1">
				                                    Selecione o tipo
				                                </option>
				                                <option v-bind:value="option.cod_tipo_chav" v-for="(option, index) in listaTipoChav">
				                                    {{ option.nom_tipo_chav }}
				                                </option>
				                            </select>
				                            <div class="invalid-feedback">
								        		Selecione um tipo de competência
								    		</div>
				                    </div>
				                    <div class="form-group">
				                        {{novo.tipo_chav.des_tipo_chav}}
				                    </div>
				                    <div class="form-group">
				                        <label for="nom_chav" class="label-required">Nome</label>
				                        <input class="form-control" id="nom_chav" placeholder="Nome da competência" required type="text" v-model="novo.nom_chav"/>
				                        <div class="invalid-feedback">
							        		Escreva o nome da competência
							    		</div>
				                    </div>
				                    <div class="form-group">
				                        <label for="descricao">Descrição</label>
				                        <textarea class="form-control" id="descricao" rows="3" placeholder="Descreva em poucas palavras o que esta competência indica" v-model="novo.des_chav" ></textarea>
				                    </div>

				                    <div class="form-group" id="botoes-criacao">
				                        <button type="button" class="btn btn-sm btn-primary" id="registra-novo" @click="inserirChav()">Salvar</button>
				                        <button type="button" class="btn btn-sm btn-danger" id="cancela-novo" @click="cancelaChav()">Cancelar</button>
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
        props: ['cod_chav', 'titulo'],
        data: function() {
            return {
                novo:{
                    tipo_chav: {
                        cod_tipo_chav: -1,
                        nom_tipo_chav: '',
                        des_tipo_chav: ''
                    },
                    cod_chav: 0,
                    nom_chav: '',
                    des_chav: '',
                    ind_temporario: true,
                    dth_registro: ''
                },
                listaTipoChav: []
            }
        },
        methods: {
            fechaModal : function(){
                this.$emit('fecha-modal-chav');
            },
            buscaTipoChav : function(){
                const vm = this;
    
                iniciaLoader("loader-primario");
                
                axios.get("../../rs/chav/listar")
                    .then(response => {
                        vm.listaTipoChav = response.data;
                    }).catch(function (error) {
                        if(error.response.status === 403)
                            window.location = "/";
                        else{
                            this.$emit('alerta-erro', error, "Erro ao buscar tipos de chaves");
                        }
                    }).finally(function(){
                        encerraLoader("loader-primario");
    
                    });
            },
            cancelaChav : function(){
                const vm = this;
                vm.novo = {
                    tipo_chav: {
                        cod_tipo_chav: -1,
                        nom_tipo_chav: '',
                        des_tipo_chav: ''
                    },
                    cod_chav: 0,
                    nom_chav: '',
                    des_chav: '',
                    ind_temporario: true,
                    dth_registro: ''
                }
                vm.fechaModal();
            },
            inserirChav: function(){
                const vm = this;
                
                var data = new Date();
                vm.novo.dth_registro = data.getTime();

                if(!todosCamposRequiredForamPreenchidos("form-modal")){
            		return ;
            	}
                
                if(vm.cod_chav > 0){
                    this.$emit('edita-chav', vm.novo);
                }
                else{
                    this.$emit('cria-chav', vm.novo);
                }
                
                vm.novo = {
                    tipo_chav: {
                        cod_tipo_chav: -1,
                        nom_tipo_chav: '',
                        des_tipo_chav: ''
                    },
                    cod_chav: 0,
                    nom_chav: '',
                    des_chav: '',
                    ind_temporario: true,
                    dth_registro: ''
                }
                vm.fechaModal();
            },
            buscaChav(){
                const vm = this;
    
                iniciaLoader("loader-primario");
                
                axios.get("../../rs/chav/buscar?cod=" + vm.cod_chav)
                    .then(response => {
                        vm.novo = response.data;
                    }).catch(function (error) {
                        if(error.response.status === 403)
                            window.location = "/";
                        else
                            this.$emit('alerta-erro', error, "Erro ao buscar chave");
                    }).finally(function(){
                        encerraLoader("loader-primario");
    
                    });
            },
        },
        created: function() {
            const vm = this;
            
            vm.buscaTipoChav();
            if(vm.cod_chav > 0){
                vm.buscaChav();
            }
        }
    }
    </script>
