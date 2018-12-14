<template>
    <div id="alerta">
        <div v-if="exibeErro" role="alert" style="z-index: 9999" class="alert alert-danger  alert-dismissible fade show">
                    
            <h4 class="alert-heading">{{ tituloErro }}</h4>
            <p>{{ mensagemErro }}</p>
            
            <button type="button" data-dismiss="alert" aria-label="Close" class="close" @click="fecharAlerta">
                <span aria-hidden="true">×</span>
            </button>
        </div>

        <div v-if="exibeSucesso" role="alert" style="z-index: 9999" class="alert alert-success  alert-dismissible fade show">
                    
            <p>{{ mensagemSucesso }}</p>
            
            <button type="button" data-dismiss="alert" aria-label="Close" class="close" @click="fecharAlerta">
                <span aria-hidden="true">×</span>
            </button>
        </div>

</div>
</template>
<script>
    module.exports = {
        data: function() {
            return{
                dispensaAlertaSeg: 5,
                tituloErro: '',
                mensagemErro: '',
                mensagemSucesso: '',
                exibeErro: false,
                exibeSucesso: false
            }
        },
        methods: {
            mostraErro(error, msg) {
                const vm = this;

                var titulo = "Erro! ";
                if (error != null 
                    && error != undefined 
                    && error.response != null 
                    && error.response != undefined) {

                    var status = error.response.status;
                    if (status == 403 || status == 412 || status == 404) {
                    	titulo += error.response.data;
                    } else if (error.response.status == 500) {
                        titulo = "Erro interno do servidor";
                    }
                } else {
                    titulo = "Erro!";
                }
                
                vm.tituloErro = titulo;
                vm.mensagemErro = msg;
                vm.exibeErro = true;
            },
            mostraErroSimples(titulo, msg) {
                const vm = this;
                                
                vm.tituloErro = titulo;
                vm.mensagemErro = msg;
                vm.exibeErro = true;
            },
            mostraMsg(msg) {
                const vm = this;
     
                vm.mensagemSucesso = msg;
                vm.exibeSucesso = true;

            },
            fecharAlerta(){
                const vm = this;
                vm.exibeErro = false;
                vm.exibeSucesso = false;
            }
        }
    }
</script>