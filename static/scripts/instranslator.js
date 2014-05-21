(function () {
    var disabled = true,
        BASE_URL = "http://translate.google.com/translate_a/t?client=t&sl=en&tl=es&hl=en&sc=2&ie=UTF-8&oe=UTF-8&pc=1&oc=1&otf=1&ssel=0&q=",
        KEY_RIGHT = 39,
        KEY_LEFT = 37;

    document.onmouseup = function () {
        var selectedText = getSelectedText();
        if (disabled) {
            return;
        }
        if (selectedText) {
            translate(selectedText);
        } else {
            document.getElementById("instranslator").remove();
        }
    };

    /**
     * Sets a listener on a key combination to enable translation.
    */
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.keyCode === KEY_LEFT) {
            disabled = false;
            plotDiv("translation Enabled");
            window.setTimeout(deleteDiv, 1000);
        }
        else if (event.shiftKey && event.keyCode === KEY_RIGHT) {
            disabled = true;
            plotDiv("translation Disabled");
            setTimeout(deleteDiv, 1000);
        }
    });

    function getSelectedText() {
        var text = "";
        if (window.getSelection !== "undefined") {
            text = window.getSelection().toString();
        } else if (document.selection !== "undefined" && document.selection.type === "Text") {
            text = document.selection.createRange().text;
        }
        return text;
    }
    

    function translate(words) {
        var twoFields; //True when we got more than 2 words to translate.
        twoFields = words.split(" ").length < 2;
        serverResponse = ajaxRequest(words);
        content = processText(serverResponse, twoFields);
        plotDiv(content);
    }

    function ajaxRequest(words) {
        var xhReq = new XMLHttpRequest(),
            serverResponse;
        xhReq.open("GET", BASE_URL + words, false);
        xhReq.send(null);
        serverResponse = xhReq.responseText;
        return serverResponse;
    }

    /**
    *   Gets the translated text and apply regex to clean the output.
    */
    function processText(response, twoFields) {
        var translation = "",
            word,
            alternatives;
        response = response.replace(/\d+/g, '');
        response = response.split("]");
        word = response[0];
        alternatives = response[1];
        word = word.replace(/\[/g, '');
        word = word.replace(/\"/g, '');
        word = word.split(",");
        word = word[0];
        translation += word + ". ";
        if (twoFields) {
            alternatives = response[2];
            alternatives = alternatives.replace(/\[/g, '');
            alternatives = alternatives.replace(/\"/g, '');
            alternatives = alternatives.replace(/\,,/g, '');
            alternatives = alternatives.replace(",", '');
            alternatives = alternatives.replace(",", ': ');
            translation += alternatives + ".";
        }
        return translation;
    }

    function plotDiv(text) {
        var div,
            center,
            content;
        deleteDiv();
        div = document.createElement("div");
        center = document.createElement("center");
        div.id = "instranslator";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.position = "fixed";
        div.style.background = "white";
        div.style.width = "100%";
        div.style.zIndex = "9999";
        div.style.textTransform = "capitalize";
        div.style.padding = "5px";
        content = document.createTextNode(text);
        center.appendChild(content);
        div.appendChild(center);
        document.body.appendChild(div);
    }

    function deleteDiv() {
        var div = document.getElementById("instranslator");
        if (div !== null) {
            div.remove();
        }
    }
})();