<template>
    <nav id="header_sistemas" class="navbar fixed-top navbar-light bg-light shadow-sm p-3 mb-5 align-items-start">

        <!-- logo do sistema   -->
        <div class="navbar-brand">
            <a href="/sgh/pages/index.html">
                <img  id="logo_listemas" alt="" v-bind:src="caminho_relativo + icone" />
            </a>
            <h1 class="navbar-text"> Sistema de Gestão Hepta </h1>
        </div>
        <!-- /logo do sistema   -->

        <!-- menu do sistema   -->
        <div id="menu_sistema" class="navbar navbar-expand-lg navbar-light bg-light col">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse  nav-pills" id="navbarNav">

                <ul v-if="vis === 'geral'" class="navbar-nav">
                    <li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Início' }">
                        <a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Início' }" href="/sgh/pages/geral/geral.html">Início</a>
                    </li>
                    <li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Solicitação' }">
                        <a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Solicitação' }" href="/sgh/pages/geral/abertura_vaga.html">Solicitar nova de abertura de vaga</a>
                    </li>
                </ul>

                <ul v-if="vis === 'gpc'" class="navbar-nav">
                    <li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Início' }">
                        <a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Início' }" href="/sgh/pages/gpc/gpc.html">Início</a>
                    </li>
                    <li v-bind:class="{'nav-item' : true, 'dropdown' : true, 'active' : ativo == 'CHAVE' }">
                        <a class="nav-link dropdown-toggle" href="#" id="chave" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          CHAVE
                        </a>
                        <div class="dropdown-menu" aria-labelledby="chave">
                            <a class="dropdown-item" href="/sgh/pages/gpc/tipochav.html">Gerenciar tipos de CHAVEs</a>
                            <a class="dropdown-item" href="/sgh/pages/gpc/chav.html">Gerenciar CHAVEs</a>
                        </div>
                    </li>
                    <li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Cargo' }">
                        <a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Cargo' }" href="/sgh/pages/gpc/cargo.html">Cargo</a>
                    </li>
                    <li v-bind:class="{'nav-item' : true, 'dropdown' : true, 'active' : ativo == 'Cliente' }">
                        <a class="nav-link dropdown-toggle" href="#" id="cliente" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Cliente
                        </a>
                        <div class="dropdown-menu" aria-labelledby="cliente">
                            <a class="dropdown-item" href="/sgh/pages/gpc/cliente.html">Gerenciar clientes</a>
                            <a class="dropdown-item" href="/sgh/pages/gpc/contrato.html">Gerenciar contratos</a>
                        </div>
                    </li>
                   
                     <li v-bind:class="{'nav-item' : true, 'dropdown' : true, 'active' : ativo == 'Certificação' }">
                        <a class="nav-link dropdown-toggle" href="#" id="certificacao" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Certificação
                        </a>
                        <div class="dropdown-menu" aria-labelledby="certificacao">
                            <a class="dropdown-item" href="/sgh/pages/gpc/certificacao.html">Gerenciar certificações</a>
                            <a class="dropdown-item" href="/sgh/pages/gpc/empresa.html">Gerenciar empresas certificadoras</a>
                        </div>
                    </li>
                </ul>

            </div>
        </div>
        <!-- /menu do sistema   -->

        <!-- Elenco de sistemas   -->
        <ul id="sistemas" class="nav nav-pills navbar-light bg-light">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle " data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-th"></i>
                </a>
                <div id="grid_sistemas" class="dropdown-menu" >
                    <h5 class="text-center">Sistemas Hepta</h5>
                    <div class="row  align-items-center text-center">
                        <div class="col">
                            <a href="#"><img alt="" v-bind:src="caminho_relativo + 'resources/img/IconeSistemas_hepta.png'" class="img-thumbnail"></a>
                            <span>Financeiro</span>
                        </div>
                        <div class="col">
                            <a href="#"><img alt="" v-bind:src="caminho_relativo + 'resources/img/header_adm.png'" class="img-thumbnail"></a>
                            <span>Administrativo</span>
                        </div>
                        <div class="col">
                            <a href="/sgh/gpc/"><img alt="" v-bind:src="caminho_relativo + 'resources/img/header_gpc.png'" class="img-thumbnail"></a>
                            <span>GPC</span>
                        </div>
                        
                        <div class="w-100"></div>

                        <div class="col">
                            <a href="/sgh/geral/"><img alt="" v-bind:src="caminho_relativo + 'resources/img/header_geral.png'" class="img-thumbnail"></a>
                            <span>Geral</span>
                        </div>
                        
                        <div class="col">
                            <a href="https://bot.hepta.com.br:3000/"><img alt="" v-bind:src="caminho_relativo + 'resources/img/projetos/botIcon01.svg'" class="img-thumbnail"></a>
                            <span>Suporte</span>
                        </div>
                        <div class="col">
                             <a href="http://auditoria.hepta.com.br"><img alt="" v-bind:src="caminho_relativo + 'resources/img/projetos/auditoria-icon.png'" class="img-thumbnail"></a>
                            <span>Auditoria</span>
                        </div>

                        <div class="w-100"></div>

                        <div class="col">
                            <a href="#"><img alt="" v-bind:src="caminho_relativo + 'resources/img/projetos/cp-icon.png'" class="img-thumbnail" class="img-thumbnail"></a>
                            <span>Pagamentos</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- fim Elenco de sistemas   -->

        <!-- Menu Usuário  -->
        <ul id="menu_user" v-if="nomeCompleto !== ''" class="nav nav-pills float-right">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-user"></i>
                </a>
                <div id="grid_user" class="dropdown-menu">
                    <span class="dropdown-item">{{nomeCompleto}}</span>
                    <div role="separator" class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#three" @click="logout">
                        sair 
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </li>
        </ul>
        <!-- /Menu Usuário  -->

        <!-- Logo Hepta  -->
        <div id="logo_hepta" class="navbar-brand">
            <img alt="" v-bind:src="caminho_relativo + 'resources/img/logo_hepta-sistemas.png'"
                style="vertical-align: middle; border-style: none; height: 50px;">
        </div>
        <!-- /Logo Hepta  -->
    </nav>
<!-- Fim Header genérico -->
</template>
<script>
    module.exports = {
        props: ['caminho_relativo', 'icone', 'ativo'],
        data: function() {
            return {
                nomeCompleto:'',
                vis: ''
            }
        },
        methods: {
            buscaNomeCompleto(){
                const vm = this;
                 
                axios.get('/sgh/rs/auth/buscaNomeCompleto')
                    .then(function (response) {
                        vm.nomeCompleto = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    }).finally(function(){
                        
                    });
            },
            logout() {
                axios.get('/sgh/rs/auth/logout')
                    .then(function (response) {
                        window.location = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            },
            getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        },
        /* ON LOAD */
        created: function() {
            const vm = this;
            var path = window.location.pathname;

            vm.buscaNomeCompleto();

            if(path.includes("geral/")){
                vm.vis = "geral";
            }
            else if(path.includes("gpc/")){
                vm.vis = "gpc";
            }
            else if(path.includes("financeiro/")){
                vm.vis = "financeiro";
            }
            else{
                vm.vis = "index";
            }
        }
    }

</script>
