/*
 * Created by Stefan Korecko, 2016-18
 */


/**
 * Do elementu s id=targetElmId vlozi HTML spracovane z udajov z dataObject podla sablony, ktora je v elemente s
 * id=templateElmId
 * @param dataObject - objekt s udajmi
 * @param templateElmId - objekt s Mustache sablonou
 * @param targetElmId - element kam sa ma vypisat vysledne html
 *
 * Inserts HTML code to the element with id=targetElmId. The HTML code is rendered by Mustache from data in dataObject
 * according to a template in the element with id=templateElmId
 * @param dataObject - object with data
 * @param templateElmId - object with the Mustache template
 * @param targetElmId - element, where the resulting HTML is written
 */
function mrenderObjectWithTemplateFromElm(dataObject,templateElmId,targetElmId){
    document.getElementById(targetElmId).innerHTML =
        Mustache.render(document.getElementById(templateElmId).innerHTML, dataObject);
}



/**
 * Do elementu s id=targetElmId vlozi HTML spracovane z udajov z dataObject podla sablony, ktora je v subore s
 * URL =templateFileUrl
 * @param dataObject - objekt s udajmi
 * @param templateFileUrl - URL subora s Mustache sablonou
 * @param targetElmId - element kam sa ma vypisat vysledne html
 *
 * Inserts HTML code to the element with id=targetElmId. The HTML code is rendered by Mustache from data in dataObject
 * according to a template in the file with URL =templateFileUrl
 * @param dataObject - object with data
 * @param templateFileUrl - URL of the file with the Mustache template
 * @param targetElmId - element, where the resulting HTML is written
 */
function mrenderObjectWithTemplateFromFile(dataObject,templateFileUrl,targetElmId){

    var targetElm = document.getElementById(targetElmId);
    if(targetElm){
        AJAXGetCall(templateFileUrl,

            function(xhr, paramObj){
                targetElm.innerHTML = Mustache.render(xhr.responseText, paramObj.data2Render);
            },

            function(xhr, paramObj){
                targetElm.innerHTML = "Chyba pri načítavaní šablony.<br>Chyba: "+xhr.status+" ("+xhr.statusText+")";
            },

            {
                data2Render:dataObject
            }
        );

    }
}

