/*
 * Created by Stefan Korecko, 2016-18
 */

/**
 * Všeobecná metóda pre vykonanie asynchrónnych http požiadaviek.
 * @param method - metóda (operácia) požiadavky. prípustné hodnoty: "GET", "POST", "PUT", "DELETE"
 * @param url - URL požiadavky
 * @param contentType - hodnoty pre hlavičku Content-Type, napr. "application/x-www-form-urlencoded", "application/json",  "application/json; charset=UTF-8"
 * @param data2send - údaje, ktoré sa majú odoslať na server pri metóde (operácii)POST alebo PUT
 * @param responseHandler - funkcia, ktorá sa volá keď je požiadavka vybavená. Má spracovať odpoveď pre prípad úspechu aj neúspechu.
 *                         parametre: objekt požiadavky (obsahuje aj prijatú odpoveď), paramObj
 * @param paramObj - objekt s dalsimi parametrami pre responseHandler
 *
 * Executes XMLHttpRequest request and processes the response.
 * Also works with old browsers (IE 5, 6)
 * @param method - request method. Possible values: "GET", "POST", "PUT", "DELETE"
 * @param url - URL of the request
 * @param contentType - value for the Content-Type header, e.g. "application/x-www-form-urlencoded", "application/json",  "application/json; charset=UTF-8"
 * @param data2send - data to be sent to theserver. Used for the POST or PUT methods.
 * @param responseHandler - function called after the response of the request is received. Should handle both the successful and unsuccessful request execution.
 *                         parameters: request object (including the received response), paramObj
 * @param paramObj - an object with additional responseHandler parameters
 *
 */
function AJAXCall(method, url, contentType, data2send, responseHandler, paramObj){

    //1.Kontrola parametra method a ci su dane udaje pre POST resp. PUT
    //1.Check input parameters
    if(method!=="GET" && method!=="POST"  && method!=="PUT"  && method!=="DELETE") return;
    if(method!=="GET" && method!=="DELETE" && (data2send===undefined || data2send===null)) return;

    //2.Vytvorenie XMLHttpRequest objektu. Stacilo by aj xhr = new XMLHttpRequest(); (IE6 a starsie uz asi naozaj nikto nepouziva)
    //2. Create XMLHttpRequest object
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');

    //3.inicializacia poziadavky
    //3.Request initialisation
    xhr.open(method, url, true);

    //4.nastavenie Content-Type hlavicky (ak bola uvedena)
    //4.Set Content-Type header
    if(contentType){
        xhr.setRequestHeader("Content-Type", contentType);
    }

    //5.nastavenie spracovania odpovede
    //5.Set response processing
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) { // 4 = XMLHttpRequest.DONE
            responseHandler && responseHandler(xhr,paramObj);};  //we can also use xhr.addEventListener("readystatechange",function, false)
        }

    //6.odoslanie poziadavky
    //6.Send the request
    if(method!=="GET" && method!=="DELETE")
        xhr.send(data2send);
    else
        xhr.send();

}

/**
 * Metóda pre vykonanie asynchrónnych http požiadaviek typu GET
 * @param url - URL požiadavky
 * @param successHandler - funkcia, ktorá sa volá keď je požiadavka úspešne vybavená. Má spracovať odpoveď.
 *                         parametre: objekt požiadavky (obsahuje aj prijatú odpoveď), paramObj
 * @param errorHandler - funkcia, ktorá sa volá keď požiadavka nie je úspešne vybavená. Má spracovať chybu.
 *                         parametre: ako successHandler
 * @param paramObj - objekt s dalsimi parametrami pre handler-y
 *
 * Executes XMLHttpRequest GET request and processes the response
 * This version also works with old browsers (IE 5, 6)
 * @param url - URL of the request
 * @param successHandler - function, which processes the data object, obtained from the response in the JSON format.
 *                         This object is the parameter of that function
 * @param errorHandler - function, which is called when error occurs.
 *                       Its parameter is the error status number
 * @param paramObj - an object with additional handler parameters
 *
 */
function AJAXGetCall(url, successHandler, errorHandler, paramObj){

    AJAXCall("GET", url, "", null,
        function(xhr,paramObj) {
            if (xhr.status === 200) { //uspesne vybavena GET poziadavka
                successHandler && successHandler(xhr,paramObj);
            } else {
                errorHandler && errorHandler(xhr,paramObj);
            }
        },
        paramObj);


}

