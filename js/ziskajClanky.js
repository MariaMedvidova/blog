
//Kód, ktorý sa vykoná pri načítaní skriptu:

//var startIndex=0;
//localStorage.setItem( "startIndex", "0");
//localStorage.setItem( "id", "7966");
//var articlesPerPage=2;      //Počet naraz zobrazených článkov
//var server="wt.kpi.fei.tuke.sk";        //Doménové meno servera s databázou článkov

var startIndexComment=0;
var commentPerPage=2;


writeArticles2Html(Number(localStorage.getItem("startIndex")), articlesPerPage, server, 'clanky', 'navigacia');  //Výpis prvých článkov a vytvorenie navigačného panela
writeArticle2Html("article");
writeComment2Html(startIndexComment,commentPerPage, "comment");

//console.log("som na clanku s ID="+ localStorage.getItem("id"));

if (localStorage.getItem("id")){
    console.log("som na clanku s ID="+ localStorage.getItem("id"));

    // var url ="http://"+server+"/api/article/?max=1&offset=9";           ///////na ziskanie total count clankov
    // getJSONAllBr(url,
    //     function(JSONObj){getCountArticle(JSONObj)},
    //     function(status){errorDialog(status)}
    // );
    //
    // console.log("pocet clankov je: "+Math.ceil(Number(localStorage.getItem("countArticle"))/100));
    //////prechadzam clanok po clanku a hladam ten s mojim ID
    // for(var i=0; i<Math.ceil(Number(localStorage.getItem("countArticle"))/100); i++){
    //     var j=i*100;
    //     url ="http://"+server+"/api/article/?max=100&offset="+j;
    //     console.log(url);
    //     if(Number(localStorage.getItem("startIndex"))>0 && Number(localStorage.getItem("startIndex"))<300){
    //
    //         localStorage.setItem("startIndex", Number(localStorage.getItem("startIndex"))+(i*100));
    //         break;
    //     }
    //     getJSONAllBr(url,
    //         function(JSONObj){s(JSONObj,localStorage.getItem("id"))},
    //         function(status){errorDialog(status)}
    //     );
    // }

    url ="http://"+server+"/api/article/?max=100";
    getJSONAllBr(url,
                 function(JSONObj){s(JSONObj,localStorage.getItem("id"))},
                function(status){errorDialog(status)}
            );

    //
    // if(localStorage.getItem("startIndex")=="0"){
    //     console.log("som tu");
    //     url ="http://"+server+"/api/article/?max=100&offset=800";
    //     console.log(url);
    //
    //     getJSONAllBr(url,
    //         function(JSONObj){s(JSONObj,localStorage.getItem("id"))},
    //         function(status){errorDialog(status)}
    //     );
    //
    //     var number = Number(localStorage.getItem("startIndex"))+800;
    //     console.log("vysnene ciiislo jeeee: "+number);
    //     localStorage.setItem("startIndex",number);
    // }

    console.log("nasla som poradie:"+localStorage.getItem("startIndex")+" svojho clanku s id:"+localStorage.getItem("id"));
}

window.addEventListener('scroll',scrolling);
//
// function getCountArticle(articles){
//     localStorage.setItem("countArticle",articles.meta.totalCount);
// }



//pride mi tu objekt so 100 clankami
function s(articles,id){
    console.log(id);
     for(var i=0; i<articles.articles.length; i++) {
         //console.log(i);
        // console.log("som v cykle "+i+"mam id: "+ articles.articles[i].id+ "a hladam id: "+ id);
         if(id == articles.articles[i].id) {
            localStorage.setItem("startIndex",i);
            return;
         }
     }
    //localStorage.setItem("startIndex",0);
}

window.addEventListener('scroll',scrolling);

function scrolling(ev) {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
       // alert("you're at the bottom of the page");
        writeArticles2Html(Number(localStorage.getItem("startIndex")), ++articlesPerPage, server, 'clanky', 'navigacia');
    }
}

function addScroll() {
    writeArticles2Html(Number(localStorage.getItem("startIndex")), articlesPerPage, server, 'clanky', 'navigacia');
    window.addEventListener('scroll',scrolling);
}

function getData() {
    window.removeEventListener('scroll',scrolling);
    var author = document.getElementById("author").value;
    var title = document.getElementById("title").value;
    var content = document.getElementById("content").value;
    var tag = document.getElementById("tag").value;
    var dFrom = document.getElementById("dFrom").value;
    var dTo = document.getElementById("dTo").value;
    var uFrom = document.getElementById("uFrom").value;
    var uTo = document.getElementById("uTo").value;

    var restURL ="http://"+server+"/api/article?max=100&"
    var count=0;

    if(author !== "") {restURL += "author=" + author; count++; }
    if(title !== "") { if(count==0)restURL += "title=" + title;
                      else restURL += "&title=" + title;
    }
    if(content !== "") {
        if(count==0) restURL += "content=" + content;
        else restURL += "&content=" + content;
    }
    if(tag !== "") {
        if(count==0) restURL += "tag=" + tag;
        else restURL += "&tag=" + tag;
    }
    if(dFrom !== ""){
        if(count==0) restURL += "fromDate=" + dFrom;
        else restURL += "&fromDate=" + dFrom;
    }
    if(dTo !== ""){
        if(count==0) restURL += "toDate=" + dTo;
        else restURL += "&toDate=" + dTo;
    }
    if(uFrom !== ""){
        if(count==0) restURL += "updatedFromDate=" + uFrom;
        else restURL += "&updatedFromDate=" + uFrom;
    }
    if(uTo !== ""){
        if(count==0) restURL += "updatedToDate=" + uTo;
        else restURL += "&updatedToDate=" + uTo;
    }

    console.log(restURL);
    getJSONAllBr(restURL,
           function(JSONObj){renderListOfArticles(JSONObj, 'clanky', 'navigacia', 0, 100)},
            function(status){errorDialog(status)});

   // var message = "user entered this value: " + a + " " + b + " " + c + " " + d+  " " + e ;
    //alert(message);
}

document.addEventListener("click", //radsej takto ako do document.onclick, lebo to by vyradilo iné listenery
    function(udalost){
        if(!udalost.target.matches("#menuCl, #menuClNazov")) skriMenu();
    });

function nextPage() {
    var x = Number(localStorage.getItem("startIndex"));
    localStorage.setItem("startIndex" , x+articlesPerPage);
    console.log("som v nextpage");
    writeArticles2Html(Number(localStorage.getItem("startIndex")),articlesPerPage,server,'clanky','navigacia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previousPage() {
    var x = Number(localStorage.getItem("startIndex"));
    localStorage.setItem("startIndex" , x-articlesPerPage);
    writeArticles2Html(Number(localStorage.getItem("startIndex")),articlesPerPage,server,'clanky','navigacia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Vráti HTML kód pre navigačnú časť stránky
 * @param startIndex - index prvého zo zobrazených článkov
 * @param articlesCount - počet vypísaných článkov
 * @param articlesTotalCount  - celkový počet článkov v databáze servra
 * @returns {string} - HTML kód pre navigačnú časť stránky

 * Creates and returns HTML code for the navigation part of the page
 * @param startIndex - index of the first of the displayed articles
 * @param articlesCount - number of displayed articles
 * @param articlesTotalCount  - total count of articles in the server database
 * @returns {string} - HTML code for the navigation part of the page

 */
function navHtml(startIndex, articlesCount, articlesTotalCount){
    var htmlCode="";
    if(articlesCount>0){
        htmlCode+="(Displaying articles  "+(startIndex+1)+" to "+(startIndex+articlesCount)+" " +
            "from "+ articlesTotalCount  +" articles.) <br /> <br />";
        htmlCode+="<hr> ";
    }
   // htmlCode+=" <button onclick=\"writeArticles2Html("+startIndex+
       // ", articlesPerPage, server, 'clanky', 'navigacia')\">" + "Načítaj znova / Reload</button>";

    if (startIndex>0)
        htmlCode+= Mustache.render(document.getElementById("listOfArticlesMTemplate").innerHTML,{ previous_button: true } );
      // htmlCode+="<button class=\"PpohybTlacidla\" onclick=\"previousPage()\" >Previous</button>";

    if (startIndex<articlesTotalCount-articlesCount)
        htmlCode+= Mustache.render(document.getElementById("listOfArticlesMTemplate").innerHTML, { next_button: true });
       // htmlCode+="<button onclick=\"nextPage()\" class=\"NpohybTlacidla\">Next</button>";

    return htmlCode;
}

/**
 * Vráti HTML kód so zoznamom článkov, získaného z objektu articles
 * @param articles  - JSON objekt s článkami
 * @returns {string} - HTML kód pre časť stránky s článkami
 *
 * Creates and returns HTML code with the list of articles, obtained from the object articles
 * @param articles  - JSON object with articles
 * @returns {string} - HTML code with the list of articles
 */
function articlesHtml(articles){
    var count;
    var htmlCode="";
    if(count===articles.articles.length){ //ak su nejake clanky (if there are some articles)
        for(var i=0; i<count; i++)
            htmlCode+="<p class=\"textClanok\">"+articles.articles[i].author+": "+articles.articles[i].title+" </p>";      //author, dateCreated, lastUpdated, title,tags,id,imageLink
    }
    return htmlCode;
}

/**
 * Zapíše autorov a názvy článkov do daného html elementu
 * @param articles  - JSON objekt s článkami
 * @param articlesElmId - Id elementu do ktorého sa články majú vypísať
 * @param navElmId - Id elementu ktorý má obsahovať navigačné linky
 * @param startIndex - index (poradové číslo čláanku od 0) od ktorého sa články vypisujú
 * @param max - maximálny počet článkov.
 *
 * Writes authors and names of articles to a html element
 * @param articles  - JSON object with articles
 * @param articlesElmId - id of the html element to which the authors and names are written
 * @param navElmId - id of the html element with the navigation part
 * @param startIndex - index of the first article that is displayed. Articles are indexed from 0.
 * @param max - maximum number of the displayed articles.
 */
function JSON2Html(articles, articlesElmId, navElmId, startIndex, max){
    var articlesElm=document.getElementById(articlesElmId);
    var navElm=document.getElementById(navElmId);
    if(articlesElm&&navElm){
        articlesElm.innerHTML=articlesHtml(articles);
        navElm.innerHTML=navHtml(startIndex, articles.articles.length,articles.meta.totalCount);
    }
}

/**
 * Vykona XMLHttpRequest GET ziadost a spracuje odpoved v podobe objektu ziskaneho z odpovede v JSON formate.
 * Tato verzia je funkcna aj pre starsie prehliadace (IE 5, 6)
 * (povodny kod prevzaty z: https://mathiasbynens.be/notes/xhr-responsetype-json).
 * @param url - URL ziadosti
 * @param successHandler - funkcia, ktora spracuje objekt data, ziskany z odpovede v JSON formate.
 *                         Tento objekt by mal byt parametrom funkcie
 * @param errorHandler - funkcia, ktora sa vola, ked dojde k chybe.
 *                       Jej parametrom by malo byt cislo so statusom odpovede
 *
 * Executes XMLHttpRequest GET request and processes the response in the form of an object in the JSON format.
 * This version also works with old browsers (IE 5, 6)
 * (based on the code from: https://mathiasbynens.be/notes/xhr-responsetype-json).
 * @param url - URL of the request
 * @param successHandler - function, which processes the data object, obtained from the response in the JSON format.
 *                         This object is the parameter of that function
 * @param errorHandler - function, which is called when error occurs.
 *                       Its parameter is the error status number
 */
function getJSONAllBr(url, successHandler, errorHandler){
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() { //alternativne mozem pouzit (alternatively we can use) xhr.addEventListener("readystatechange",funkcia, false),
        // ale tu je pouzita anonymna funkcia a bolo by to iba neprehladnejsie (but here we use an anonymous function)
        var status;
        var data;
        if (xhr.readyState === 4) { // DONE, alternativne sa da pouzit (alternatively we can use) XMLHttpRequest.DONE
            status = xhr.status;
            if (status === 200) { //uspesne vybavena poziadavka (succesfully processed request)
                data = JSON.parse(xhr.responseText);

                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
}

var isWeakView = false;
function turnWeb(button){
    var nadpis = document.getElementById("nadpis");
    var sidebar_list = document.getElementById("sidebar_list");

    if (isWeakView){        //vetva na vratenie povodneho vzhladu
        button.style.background = "darksalmon";
        button.style.fontSize = "20px";
        document.body.style.backgroundImage =  'url(../pictures/background4.jpg)';
        blok.style.background = "antiquewhite";
        document.body.style.fontSize = "15px";
        sidebar_list.style.display = "block";

        nadpis.style.color="black";
        nadpis.style.fontSize = "xx-large";

        isWeakView=false;
    }
    else {      //vetva na upravu vzhladu pre slabo vidiacich
        button.style.background = "#1E5600";
        button.style.fontSize = "25px";
        document.body.style.background = "#90BA00";
        blok.style.background = "#357900";
        document.body.style.fontSize = "40px";
        sidebar_list.style.display = "none";

        nadpis.style.color="darkgreen";
        nadpis.style.fontSize = "70px";

        isWeakView=true;
    }
}

function zobrazAleboSkriMenu(){
    document.getElementById("menuCl").classList.toggle("zobraz");
}

function skriMenu() {
    var menuClElmCList=document.getElementById("menuCl").classList;
    if(menuClElmCList.contains("zobraz")) menuClElmCList.remove("zobraz");
}

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
    getTextFromUrl(
        templateFileUrl,

        {
            idOfTargetElm:targetElmId,
            data2Render:dataObject
        },

        function(template, paramObj){
            var targetElm = document.getElementById(paramObj.idOfTargetElm);
            if(targetElm) targetElm.innerHTML = Mustache.render(template, paramObj.data2Render);
        },

        function(errCode, paramObj){
            var targetElm = document.getElementById(paramObj.idOfTargetElm);
            if(targetElm) targetElm.innerHTML = "Error, code="+errCode;
        }
    );
}

/**
 * Vykona XMLHttpRequest GET ziadost a spracuje odpoved v podobe objektu ziskaneho z odpovede v JSON formate.
 * Tato verzia je funkcna pre novsie prehliadace, ktore poznaju hodnotu "json" pre XMLHttpRequest.responseType
 * (povodny kod prevzaty z: https://mathiasbynens.be/notes/xhr-responsetype-json).
 * @param url - URL ziadosti
 * @param successHandler - funkcia, ktora spracuje objekt data, ziskany z odpovede v JSON formate. Tento objekt by mal byt parametrom funkcie
 * @param errorHandler - funkcia, ktora sa vola, ked dojde k chybe. Jej parametrom by malo byt cislo so statusom odpovede
 *
 *
 * Executes XMLHttpRequest GET request and processes the response in the form of an object in the JSON format.
 * This version works with modern browsers, which know the value "json" of the XMLHttpRequest.responseType
 * (based on the code from: https://mathiasbynens.be/notes/xhr-responsetype-json).
 * @param url - URL of the request
 * @param successHandler - function, which processes the data object, obtained from the response in the JSON format.
 *                         This object is the parameter of that function
 * @param errorHandler - function, which is called when error occurs.
 *                       Its parameter is the error status number
 *
 */
function getJSONModernBr(url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            successHandler && successHandler(xhr.response);
        } else {
            errorHandler && errorHandler(status);
        }
    };
    xhr.send();
};

/**
 * Vykona XMLHttpRequest GET ziadost a spracuje odpoved v podobe retazca (typ DOMString).
 * Pouziva sa na ziskanie Mustache sablony, ktora je v samostatnom subore.
 * Tato verzia je funkcna aj pre starsie prehliadace (IE 5, 6)
 * Je to vlastne funkcia getJSONAllBr bez spracovania odpovede z JSON retazca na JavaScript objekt.
 * @param url - URL ziadosti
 * @param paramObj - objekt s dalsimi parametrami pre handler-y
 * @param successHandler - funkcia, ktora spracuje retazec ziskany z odpovede. Retazec je jej prvym parametrom. Druhym je objekt s nastaveniami a udajmi spracovania.
 * @param errorHandler - funkcia, ktora sa vola, ked dojde k chybe. Jej parametrami su cislo chyby a  objekt s nastaveniami a udajmi spracovania.
 *
 * Executes XMLHttpRequest GET request and processes the response in the form of a string (DOMString type).
 * It is used to get Mustache templates from separate files.
 * This version also works with old browsers (IE 5, 6)
 * It's like the function getJSONAllBr, but without processing the response to JSON.
 * @param url - URL of the request
 * @param paramObj - object with additional parameters for handlers
 * @param successHandler - function, which processes the string, obtained from the response. The string is its first parameter. The second parameter is an object with processing settings and data.
 * @param errorHandler   - function, which is called when error occurs.
 *                       Its parameters are the error status number and the object with processing settings and data.
 *
 */
function getTextFromUrl(url, paramObj, successHandler, errorHandler){
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() { //alternatively you can use xhr.addEventListener("readystatechange",function, false),
        var status;
        var data;
        if (xhr.readyState === 4) { // DONE, alternatively you can use XMLHttpRequest.DONE
            status = xhr.status;
            if (status === 200) { //successfully executed request
                successHandler && successHandler(xhr.responseText,paramObj);
            } else {
                errorHandler && errorHandler(status,paramObj);
            }
        }
    };
    xhr.send();


};

/**
 * Zapíše autorov a názvy článkov do daného html elementu
 * @param articles  - pole objektov s článkami
 * @param articlesElmId - Id elementu do ktorého sa články majú vypísať
 * @param navElmId - Id elementu ktorý má obsahovať navigačné linky
 * @param startIndex - index (poradové číslo čláanku od 0) od ktorého sa články vypisujú
 * @param max - maximálny počet článkov.
 *
 * Writes authors and article names to the html element
 * @param articles - array of objects with articles
 * @param articlesElmId - Id of the element to  the articles are to be added
 * @param navElmId - Id of the element to which the navigation links are to be added
 * @param startIndex - the article sequence number (from 0) from which articles are written
 * @param max - maximum number of articles.
 */
function renderListOfArticles(articles, articlesElmId, navElmId, startIndex, max){
    var articlesElm=document.getElementById(articlesElmId);
    var navElm=document.getElementById(navElmId);
    if(articlesElm&&navElm){
        mrenderObjectWithTemplateFromElm(articles, "listOfArticlesMTemplate", articlesElmId);
       // navElm.innerHTML = Mustache.render(document.getElementById("listOfArticlesMTemplate").innerHTML, { next_button: true });
        navElm.innerHTML=navHtml(startIndex, articles.articles.length,articles.meta.totalCount);
    }
}

/**
 * otvori dialogove okno s chybovym hlasenim
 * @param status -  hodnota XMLHttpRequest.status
 *
 * Opens a dialog window with an error message
 * @param status -  value os XMLHttpRequest.status
 */
function errorDialog(status){
    window.alert("Chyba pri načítaní údajov zo servera.\nStatus= "+status);
}

/**
 * Sparsuje query string do objektu
 * Pozor! Ak je viac položiek s rovnakým menom, uloží sa do príslušnej položky iba posledná.
 * @returns objekt s query string
 *
 * Parses the query string to an object
 * Beware! If there are more items with the same name, it takes the last one.
 * @returns the object with the parsed query string
 */
function queryString2obj(){
//modified code from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    var urlParams = {},
        match,
        pl     = /\+/g, // Regex for replacing addition symbol with a space:
                        // / - the beginning and the end of the expression
                        // g - modifier to perform a global match (i.e. find all matches instead of the first match only).
                        // \+ - symbol "+"
        search = /([^&=]+)=?([^&]*)/g,// [^&=] - complemented character set: any character except of "&" and "="
                                      // [^&] - complemented character set: any character except of "&"
                                      // + -  the preceding expression 1 or more times
                                      // ? -  the preceding expression 0 or 1 time
                                      // * -  the preceding expression 0 or more times

        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

/**
 * Writes article data to the element with id=articlesElmId and HTML code for the navigation part to the element with id=navElmId
 * @param startIndex - index of the first article that is displayed. Articles are indexed from 0
 * @param max - maximum number of the displayed articles
 * @param server - domain name of the server with the article database
 * @param articlesElmId - id of the html element to which the authors and names of the articles are written
 * @param navElmId - id of the html element with the navigation part
 */
function writeArticles2Html(startIndex, max, server, articlesElmId, navElmId){
    var restURL ="http://"+server+"/api/article/?max="+max+"&offset="+startIndex;
    console.log(restURL);
    getJSONAllBr(restURL,
        function(JSONObj){renderListOfArticles(JSONObj, articlesElmId, navElmId, startIndex, max)},
        function(status){errorDialog(status)});
}

/**
 * Zapíše údaje o článku do elementu s id=articleElmId.
 * @param articleElmId - Id elementu do ktorého sa článok má vypísať
 *
 * Writes article data to the element with id=articleElmId.
 * @param articleElmId - id of the html element to which the article data are written
 */
function writeArticle2Html(articleElmId){
    var artId = queryString2obj().id;

    if (isFinite(artId)){
        var restURL ="http://"+server+"/api/article/"+artId;
        console.log(restURL);
        getJSONAllBr(restURL,
            function(article){ mrenderObjectWithTemplateFromFile(article, "templates/article.mst", articleElmId);},
            function(status){errorDialog(status)});
    }

}

function writeComment2Html(startIndexComment,commentPerPage, commentsElmId){
    var artId = queryString2obj().id;

    if (isFinite(artId)){
        var restURL ="http://"+server+"/api/article/"+artId+"/comment/?max="+ commentPerPage + "&offset="+ startIndexComment;
        console.log(restURL);
        getJSONAllBr(restURL,
            function(comment){ mrenderObjectWithTemplateFromFile(comment, "templates/comments.mst", commentsElmId);},
            function(status){errorDialog(status)});
    }
}

