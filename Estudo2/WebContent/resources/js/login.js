var login = new Vue({
	el : '#login',
	data : {
		dto : {
			login : '',
			senha : ''
    },
    msgErro : ''
	},
  methods: {
    login : function(event) {
  	  if (event) {
  		  event.preventDefault();
  	  }
  	  iniciaLoader("loader-primario");
	  
  	  var btn = document.getElementById("btn-login");
      btn.disabled = true;
        
  	  axios.post('rs/auth/login', this.dto)
  		  .then(function (response) {
  			  mockDB();
  			  window.location = "pages/inicio.html";
  			  return false;
  		  })
  		  .catch(function (error) {
		      if (error != null && error != undefined &&
		              error.response != null && error.response != undefined) {
    			  if(error.response.status == 412){
    			      login.msgErro = "Preencha o login e a senha";
    			  }
				  if(error.response.status == 500){
				      login.msgErro = "Login ou senha inválidos";
    			  }
				  if(error.response.status == 406){
				    login.msgErro = "Usuário não autorizado";
    			  }
		      } else {
		        login.msgErro = "Erro interno do servidor";
		      }
		      
		      btn.disabled = false;
		      encerraLoader("loader-primario");
  		  })
    	  .finally(function () {
    		  
		    })
      }
    }
});

//por alguma razão o vue não está instanciando corretamente o menuHeader, 
//só consigo acessar as funções dele via javascript dessa maneira abaixo.
function logout(){
  if(menuHeader!=null){
    menuHeader.logout();
  }
}