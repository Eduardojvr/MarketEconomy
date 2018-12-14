/**
 * FUNCAO DO MENU
 */

var logout = new Vue({
	el : '#menu',
	data : {},
	methods: {
		logout() {
			axios.get('/rs/auth/logout')
				.then(function (response) {})
				.catch(function (error){})
				.finally(function() {
					localStorage.clear()
					window.location = response.data;
				}
			);
		}
	}
});

/**
 * MENSAGENS DE ALERTA
 */

var alerta = new Vue({
	el : '#alerta',
	data : {
		dispensaAlertaSeg: 10,
		alertCountDown: 0,
		msgCountDown: 0,
		tituloErro: '',
		mensagemErro: '',
		mensagemSucesso: ''
	},
	methods: {
		alertCountDownChanged (alertCountDown) {
			this.alertCountDown = alertCountDown;
		},
		msgCountDownChanged (msgCountDown) {
			this.msgCountDown = msgCountDown;
		},
		mostraErro(error, msg) {
			var titulo = "Erro! ";
			if (error != null && error != undefined && 
					error.response != null && error.response != undefined) {
				var status = error.response.status;
				if (status == 403 || status == 412 || status == 404) {
					if(typeof error.response.data.includes === 'function') {
						if (!error.response.data.includes("html")) {
							titulo += error.response.data;
						}
					}
				} else if (error.response.status == 500) {
					titulo = "Erro interno do servidor";
				}
			} else {
				titulo = "Erro!";
			}
			this.tituloErro = titulo;
			this.mensagemErro = msg;
			this.alertCountDown = this.dispensaAlertaSeg;
		},
		mostraErroSimples(titulo, msg) {
			this.tituloErro = titulo;
			this.mensagemErro = msg;
			this.alertCountDown = this.dispensaAlertaSeg
		},
		mostraMsg(msg) {
			this.mensagemSucesso = msg;
			this.msgCountDown = this.dispensaAlertaSeg
		}
	}
});

/**
 * UTILS
 */

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
function getParams(item){
	const urlParams = (new URL(window.location)).searchParams;
	return urlParams.get(item);
}
function orderPendenciasByDtaInclusao(pendencias){
	pendencias = pendencias.sort(function(a, b){
		return a.dtaInclusao - b.dtaInclusao;
	});
	
	return pendencias;
}
function setEstado(pendencia){
	let today = new Date();
	today.setHours(0, 0, 0, 0);
	
	if(pendencia.dtaResolucao){
		//pedencia resolvida
		pendencia.estado = '\u2705'
	}
	else if(pendencia.dtaLimite < today){
		//pedencia vencida
		pendencia.estado = '\u2757'
	}
	else{
		//pedencia pedente
		pendencia.estado = '\u26A1';
	}
}
/**
 * TEMPLATES
 */

Vue.component('footer-padrao', {
	template: 
	'<footer>'+
		'<div class="footerSpacing"></div>' +
		'<div id="footer" class="footer">' +
			'<span> Criado por: Hepta Tecnologia </span>' +
		'</div>' +
	'</footer>'
})