/*
 * Created by Stefan Korecko, 2016-18
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Kód, ktorý sa vykoná pri načítaní skriptu
//Code executed when the script is loaded

console.log("Zacinam stahovat zoznam clankov / Starting articles download ...");


//Výpis prvých maximálne articlesPerPage článkov
//Write first articlesPerPage articles to html
writeArticles2Html(0, articlesPerPage, server, 'clanky', 'navigacia');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funkcie
//functions




/**
 * Zapíše autorov a názvy článkov do daného html elementu
 * Mustache sablona sa nacitava so samostatneho subora templates/listOfArticles.mst
 * @param articles  - pole objektov s článkami
 * @param articlesElmId - Id elementu do ktorého sa články majú vypísať
 * @param startIndex - index (poradové číslo článku od 0) od ktorého sa články vypisujú
 *
 * Writes authors and article names to an html element
 * The mustache template is from a separate file, templates/listOfArticles.mst
 * @param articles - array of objects with articles
 * @param articlesElmId - Id of the element to which the articles are to be added
 * @param startIndex - the article sequence number (from 0) from which articles are written
 */
function renderListOfArticles(articles, articlesElmId, startIndex){
    var articlesElm=document.getElementById(articlesElmId);
    if(articlesElm){
        mrenderObjectWithTemplateFromFile(articles, "templates/listOfArticles.mst", articlesElmId);
    }
}




/**
 * Zapíše údaje o článkoch do elementu s id articlesElmId
 * HTML kód pre navigáciu negeneroje (je potrebné doplniť)
 * @param startIndex - index (poradové číslo čláanku od 0) od ktorého sa články vypisujú
 * @param max - maximálny počet článkov.
 * @param server - doménové meno servera odkiaľ sa majú údaje stiahnuť.
 * @param articlesElmId - Id elementu do ktorého sa články majú vypísať
 *
 * Writes articles data to the HTML element with id=articlesElmId
 * Does not generete an HTML code of the navigation (needs to be added)
 * The mustache template is from a separate file, templates/listOfArticles.mst
 * @param startIndex - the article sequence number (from 0) from which articles are written
 * @param max - maximum number of articles.
 * @param server - domain name of the server with the article database
 * @param articlesElmId - Id of the element to which the articles are to be added
 */
function writeArticles2Html(startIndex, max, server, articlesElmId){
    var restURL ="http://"+server+"/api/article/?max="+max+"&offset="+startIndex;
    AJAXGetCall(restURL,
        function(xhr){
            var JSONObj = JSON.parse(xhr.responseText);
            renderListOfArticles(JSONObj, articlesElmId, startIndex, max)
        },
        function(xhr){
            errorAlert("Načitanie článkov zlyhalo.\nArticles download failed.",xhr);
        }
    );
}

