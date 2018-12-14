<template>
    <div>
        <h4>Ações</h4>
        <div class="table-responsive-sm">
            <div class="row">
                <div class="col" style="display: flex; flex-direction: column; width: fit-content;">
                    <button v-bind:class="btn[0]" v-on:click="atualizarSituacao(2)" :disabled="disabled[0]">
                        Solicitar emissão ao Adm.
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col" style="display: flex; flex-direction: column; width: fit-content;">
                    <button v-bind:class="btn[1]" v-on:click="fazerAcao" :disabled="disabled[1]">
                        Foi emitida pelo Adm.
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col" style="display: flex; flex-direction: column; width: fit-content;">
                    <button v-bind:class="btn[2]" v-on:click="fazerAcao" :disabled="disabled[2]">
                        Foi paga pelo cliente
                    </button>
                </div>
                <div class="col" style="display: flex; flex-direction: column; width: fit-content;">
                    <button v-bind:class="btn[2]" v-on:click="fazerAcao" :disabled="disabled[2]">
                        Cancelada
                    </button>
                </div>
                <div class="col" style="display: flex; flex-direction: column; width: fit-content;">
                    <button v-bind:class="btn[2]" v-on:click="fazerAcao" :disabled="disabled[2]">
                        Não será paga pelo cliente
                    </button>
                </div>  
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        data: function() {
            return {
                codNF: 0,
                btn: [],
                disabled: [false, false, false],
            }
        },

        methods: {
            atualizarSituacao: function(novoCodSituacao){
                const vm = this;
                iniciaLoader("loader-primario"); 

                axios.get("../rs/nf/atualiza-situacao/" + vm.codNF + "/" + novoCodSituacao)
                .then(response => {
                    this.$emit('mostraAlertaMensagem', "Situação atualizada com sucesso");
                }).catch(function (error) {
                    this.$emit('alerta-erro', error , "Erro ao atualizar situacao");
                }).finally(function() {
                    encerraLoader("loader-primario");
                });
            },
            fazerAcao: function(){
                const vm = this;
                iniciaLoader("loader-primario");   
                // Chama funcao aqui e insere controle de pagamento novo
                this.$emit('alerta-erro', 'Erro!', "Ação não implementada");
                encerraLoader("loader-primario"); //desativar loader da página principal
            },
            defineCodNF: function(codNF){
                const vm = this;

                vm.codNF = codNF;
            },
            defineBotoes: function(cod_situacao){
                const vm = this;
                let btn_primary = [false, false, false];
                let btn_secondary = [false, false, false];
                let btn_success = [false, false, false];

                for(let i = 0; i < 3; i++){
                    if(cod_situacao > 3 || i < cod_situacao - 1){
                        btn_success[i] = true;
                        vm.disabled[i] = true;
                    }
                    else if(i == cod_situacao - 1){
                        btn_primary[i] = true;
                    }
                    else{
                        btn_secondary[i] = true;
                        vm.disabled[i] = true;
                    }

                    vm.btn.push({
                            'botaoVisualizar' : true,
                            'btn': true,
                            'btn-sm' : true,
                            'btn-primary': btn_primary[i],
                            'btn-secondary': btn_secondary[i],
                            'btn-success': btn_success[i]
                        });
                }
                console.log(vm.btn);
            }
        }
    }

</script>
