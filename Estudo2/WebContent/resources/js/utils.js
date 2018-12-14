Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function createDateFromSQLString(s){
	var data = s.split("-");
	return new Date(parseInt(data[0]), parseInt(data[1]) - 1, parseInt(data[2]));
}

function longToStringData(num){
    var data = new Date(num);
    return data.toLocaleDateString();
}

function longToStringDataInputDate(num){
    var m = new Date(num);
    var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);
    return dateString;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function queryParameters(query) {
    var keyValuePairs = query.split(/[&?]/g);
    var params = {};
    for (var i = 0, n = keyValuePairs.length; i < n; ++i) {
        var m = keyValuePairs[i].match(/^([^=]+)(?:=([\s\S]*))?/);
        if (m) {
            var key = decodeURIComponent(m[1]);
            (params[key] || (params[key] = [])).push(decodeURIComponent(m[2]));
        }
    }
    return params;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year,month,day,].join('-');
}

function formatDateDMY(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [day,month,year].join('/')
}

function formatDateDMYHM(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
        hour = '' + d.getHours();
        minute = '' + d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    
    return [[day,month,year].join('/') , [hour, minute].join(':')].join(' ');
}


function isNullUndefined(a){
    return (a === null || a === undefined);
}

function hasChild(parent, childEL){
    if(isNullUndefined(parent))
        return -1;
    if(isNullUndefined(parent.$children))
        return -1;
    if(parent.$children.length === 0)
        return -1;
    var children = parent.$children;
    for(var i=0;i<children.length;++i){
        if(!isNullUndefined(children[i].$el) && !isNullUndefined(children[i].$el.id)){
            if(children[i].$el.id === childEL)
                return i;
        }
    }
    return -1;
}

function todosCamposRequiredForamPreenchidos(form){
	var campos = document.getElementById(form).querySelectorAll("[required]");
	var tam = campos.length;
	var formValido = true;
	
	for(var i = 0; i < tam; i++){
		var x = campos[i];
		x.classList.remove("was-validated");
		x.classList.remove("is-invalid");
		
		x.classList.add('was-validated');
		var valido = true;
		if(x.tagName === "SELECT"){
			if(parseInt(x.value) == -1){
				valido = false;
			}
		}
		else if(x.tagName === "INPUT"){
			if(x.type == "text" || x.type == "date" || x.type == "number"){
				if(x.value === "") {
					valido = false;
				}
			}
		}
		else if(x.tagName === "TEXTAREA"){
			if(x.value === "") {
				valido = false;
			}
		}
		if(!valido){
			x.classList.add('is-invalid');
			formValido = false;
		}
	}
	
	return formValido;
}

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

function orderPendenciasByDtaInclusao(pendencias){
	pendencias = pendencias.sort(function(a, b){
		return a.dtaInclusao - b.dtaInclusao;
	});
	
	return pendencias;
}
