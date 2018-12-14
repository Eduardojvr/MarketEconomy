var loaderSemaforo = 0;

function iniciaLoader(s){
    var focus = s + "-focus";
    var loader = document.getElementById(s);
    
    loaderSemaforo++;
    
    checkVisibilityNone(loader);
    loader = document.getElementById(focus);
    checkVisibilityNone(loader);
}

function encerraLoader(s){
    var focus = s + "-focus";
    var loader = document.getElementById(s);
    
    if(loaderSemaforo > 0){
    	loaderSemaforo--;
    }
    
    if(loaderSemaforo == 0){
    	checkVisibilityInline(loader);
    	loader = document.getElementById(focus);
    	checkVisibilityInline(loader);
    }
}

function checkVisibilityNone(loader){
    if(loader && (loader.style.display == "" || loader.style.display == "none")){
        loader.style.display = "inline";
    }
}

function checkVisibilityInline(loader){
    if(loader && loader.style.display == "inline"){
        loader.style.display = "none";
    }
}