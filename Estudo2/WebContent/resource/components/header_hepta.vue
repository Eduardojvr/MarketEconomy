<template>
    <nav id="header_sistemas" class="navbar fixed-top navbar-light bg-light shadow-sm p-3 mb-5 align-items-start">

        <!-- logo do sistema   -->
        <div class="navbar-brand">
            <a href="../pages/inicio.html">
                <img  id="logo_listemas" alt="" src="../resources/img/headerIcon.png" />
            </a>
            <h1 class="navbar-text"> Controle de Pagamento </h1>
        </div>
        <!-- /logo do sistema   -->

        <!-- menu do sistema   -->
        <div id="menu_sistema" class="navbar navbar-expand-lg navbar-light bg-light col">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse  nav-pills" id="navbarNav">
            	<ul class="navbar-nav">
					<li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Início' }">
						<a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Início' }" href="inicio.html"> Inicio</a>
					</li>
					<li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Controle de Pagamentos' }">
						<a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Controle de Pagamentos' }" href="meus-controles.html">Controles de Pagamentos</a>
					</li>
					<li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Notas Fiscais' }">
						<a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Notas Fiscais' }" href="minhas-notas.html"></i>Notas Fiscais</a>
					</li>
					<li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Consultas e Relatórios' }">
						<a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Consultas e Relatórios' }" href="consultas-relatorios.html">Consultas e Relatórios</a>
					</li>
					<li v-bind:class="{'nav-item' : true, 'active' : ativo == 'Ajuda' }">
						<a v-bind:class="{'nav-link' : true, 'p-2': true, 'active' : ativo == 'Ajuda' }" href="ajuda.html">Ajuda</a>
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
                            <a href="#"><img alt="" v-bind:src="caminho_relativo + 'resources/img/IconeSistemas_hepta.png'" class="img-thumbnail"></a>
                            <span>Administrativo</span>
                        </div>
                        <div class="col">
                            <a href="/sgh/gpc/"><img alt="" v-bind:src="caminho_relativo + 'resources/img/projetos/sgh_gpc.png'" class="img-thumbnail"></a>
                            <span>GPC</span>
                        </div>
                        
                        <div class="w-100"></div>

                        <div class="col">
                            <a href="/sgh/geral/"><img alt="" v-bind:src="caminho_relativo + 'resources/img/IconeSistemas_hepta.png'" class="img-thumbnail"></a>
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
        props: ['caminho_relativo', 'ativo'],
        data: function() {
            return {
                nomeCompleto:''
            }
        },
        methods: {
            buscaNomeCompleto(){
                const vm = this;
                 
                axios.get('../rs/auth/buscaNomeCompleto')
                    .then(function (response) {
                        vm.nomeCompleto = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    }).finally(function(){
                        
                    });
            },
            logout() {
                axios.get('../rs/auth/logout')
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

            vm.buscaNomeCompleto();
        }
    }

</script>
