'use strict';

function Cs142TemplateProcessor(template){
    this.template = template;    
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){
    var res = this.template;

    for(var key in dictionary){
        var pattern = new RegExp('\{\{' + key + '\}\}','g');
        res = res.replace(pattern, dictionary[key]);  	
    }
        
    res = res.replace(/{{[^{}]*}}/g,'');       
       
    return res;
};