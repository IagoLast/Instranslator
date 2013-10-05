var disabled = true;
var baseURL= "http://translate.google.com/translate_a/t?client=t&sl=en&tl=es&hl=en&sc=2&ie=UTF-8&oe=UTF-8&pc=1&oc=1&otf=1&ssel=0&q=";
document.onmouseup = main;

document.addEventListener('keydown', function(event) {
    if(event.shiftKey && event.keyCode == 37) {
        disabled = false;
        plotDiv("translation Enabled");
        window.setTimeout(deleteDiv,1000);
    }
    else if(event.shiftKey && event.keyCode == 39) {
        disabled = true;
        plotDiv("translation Disabled");
        setTimeout(deleteDiv,1000);
    }
});

function getSelectedText() {
        var text = "";
        if (typeof window.getSelection != "undefined") {
            text = window.getSelection().toString();
        } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
        return text;
    }
    
    function main() {
        var selectedText = getSelectedText();
        if(disabled){
            return;
        }
        if (selectedText) {
            translate(selectedText);
        }else{
            document.getElementById("instranslator").remove();
        }
    }

    function translate(words){
        serverResponse = ajaxRequest(words);
        var twoFields = words.split(" ").length < 2; 
        content = processText(serverResponse,twoFields);
        plotDiv(content);
    }

    function ajaxRequest(words){
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", baseURL+words, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText;
        return serverResponse;
    }

    function processText(response,twoFields){
        var translation= "";
        response = response.replace(/\d+/g, '');
        response = response.split("]");
        var word = response[0];
        var alternatives = response[1];
        word = word.replace(/\[/g, '');
        word = word.replace(/\"/g, '');
        word = word.split(",");
        word = word[0];
        translation += word+". ";
        if(twoFields){
            var alternatives = response[2];
            alternatives = alternatives.replace(/\[/g, '');
            alternatives = alternatives.replace(/\"/g, '');
            alternatives = alternatives.replace(/\,,/g, '');
            alternatives = alternatives.replace(",", '');
            alternatives = alternatives.replace(",", ': ');
            translation += alternatives+".";
        }
        return translation;
    }

    function plotDiv(text){
        deleteDiv();
        var div =document.createElement("div");
        var center=document.createElement("center");
        div.id="instranslator";
        div.style.top="0px";
        div.style.left="0px";
        div.style.position="fixed";
        div.style.background="white";
        div.style.width = "100%";
        div.style.zIndex="1500";
        div.style.textTransform="capitalize";
        var content = document.createTextNode(text);
        center.appendChild(content);
        div.appendChild(center);
        document.body.appendChild(div);
    }

    function deleteDiv(){
        var div = document.getElementById("instranslator");
        if (div != null ){
            div.remove();
        }
    }


