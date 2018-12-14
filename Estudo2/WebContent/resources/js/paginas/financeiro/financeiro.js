var resultado = new Vue({
    el : '#containerFinanceiro',
    data : {
    },
    mounted: function(){
    	
    },
    methods: {
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
        iniciaLoader("loader-primario");
        vm.sghToken = vm.getCookie("sghToken");
        
        if (!vm.sghToken) { // Token expirou
            window.location.replace("../errorPage.html");
        } else {
            // Seta header default de todos os proximos requests
            axios.defaults.headers.post['authorization'] = vm.sghToken;
            axios.defaults.headers.get['authorization'] = vm.sghToken;
            vm.buscaGrupoUsuario();
        }
    }
});