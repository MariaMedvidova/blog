/*
 * Created by Stefan Korecko, 2016-18
 */

/**
 * Zobrazí vyskakovacie okno s chybovým hlásením
 * @param message - text chybovej správy, ktorý sa má vypísať prvý
 * @param xhrObj - objekt xhttp požiadavky (typ XMLHttpRequest alebo jqXHR)
 *
 * Displays dialog with an error message
 * @param message - error message text, which should be displayed first
 * @param xhrObj  - xhttp request object (XMLHttpRequest or jqXHR type)
 */
function errorAlert(message,xhrObj){
    window.alert(message+"\nChyba (error): "+ xhrObj.status + " (" + xhrObj.statusText + ")");
}
