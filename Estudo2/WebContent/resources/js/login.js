var login = new Vue({
    el : '#containerLogin',
    data : {
        dto : {
            login : '',
            senha : '',
            nome : '',
            id : ''
        }, 
        msgErro : ''
    },
    methods: {
        login(event) {
            const vm = this;
            if (event) {
                event.preventDefault();
            }
            iniciaLoader("loader-primario");

            var btn = document.getElementById("btn-login");
            btn.disabled = true;

            axios.post('rs/auth/login', this.dto)
            .then(function (response) {
                if(!response || !response.headers || !response.headers["grupo"]) {
                    login.msgErro = "Erro interno do servidor";
                    return;
                } else {
                    vm.setCookie("sghGrupo", response.headers["grupo"], 90);
                    window.location = "pages/index.html";
                }
            })
            .catch(function (error) {
            	btn.disabled = false;
            	encerraLoader("loader-primario");
            	
                if (error != null && error != undefined &&
                    error.response != null && error.response != undefined) {
                    if(error.response.status == 412)
                        login.msgErro = "Preencha o login e a senha";
                    if(error.response.status == 403)
                        login.msgErro = "Usuário não autorizado";
                    if(error.response.status == 500)
                        login.msgErro = "Login ou senha inválidos";
                    if(error.response.status == 406)
                        login.msgErro = "Usuário não autorizado";
                } else {
                    login.msgErro = "Erro interno do servidor";
                }
            })
            .finally(function () {
            	
            })
        },
        setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
    }
});