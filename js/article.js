/*
 * Created by Stefan Korecko, 2016-18
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kód, ktorý sa vykoná pri načítaní skriptu
// Code executed when the script is loaded

var artId = queryString2obj().id;
var restURL ="http://"+server+"/api/article/"+artId;
localStorage.setItem("id",artId);
writeArticle2Html(restURL,"article",artId);
toogle();
var startIndexComment=0;
var commentPerPage=2;

window.removeEventListener('scroll',scrolling);
window.addEventListener('scroll',scrol);

function scrol(ev) {
   // console.log("window.innerHeight: "+window.innerHeight + "window.pageYOffset: " + window.pageYOffset+ "document.body.offsetHeight: "+document.body.offsetHeight);
    if ((window.innerHeight + window.pageYOffset+1) >= document.body.offsetHeight ) {
        console.log("scroliiiingggggggg");
        // alert("you're at the bottom of the page");
        writeComment2Html(startIndexComment, ++commentPerPage, server, 'comment');
    }
}


function writeComment2Html(start, commentPerPage, server, commentsElmId){
    var artId = queryString2obj().id;

    if (isFinite(artId)){
        var restURL ="http://"+server+"/api/article/"+artId+"/comment/?max="+ commentPerPage + "&offset="+ start;
        console.log(restURL);
        getJSONAllBr(restURL,
            function(comment){ mrenderObjectWithTemplateFromFile(comment, "templates/comments.mst", commentsElmId);},
            function(status){errorDialog(status)});
    }
}


//Pridanie funkcionality pre kliknutie na tlacidla
document.getElementById("btArtList").addEventListener("click", function(){
    window.location.href='html/vypisClankov.html';
});
document.getElementById("btUpdate").addEventListener("click", function(){
    window.location.href='formular.html?id='+artId;
});
document.getElementById("btDelete").addEventListener("click", function(){
    deleteArticle(restURL);
});


/**
 * ako v predchadzajucich prikladoch
 * as in the previous examples
 */
function writeArticle2Html(sourceURL,articleElmId, articleId) {
    if (isFinite(articleId)) {
        AJAXGetCall(sourceURL,
            function (xhr) {
                mrenderObjectWithTemplateFromFile(JSON.parse(xhr.responseText), "templates/article.mst", articleElmId);
            },
            function (xhr) {
                errorAlert("Načitanie článku zlyhalo (article loading failed).",xhr);
            }
        );
    }
}


/**
 * Vymazanie článku aj s komentármi
 * @param articleId - id článku na vymazanie
 *
 * Deletes an article, including its comments
 * @param articleId - id of the article to be deleted
 */
function deleteArticle(sourceURL){
    if(window.confirm("Do you really wish to delete the article, including its comments?")) {

        AJAXCall('DELETE', sourceURL,
            "", null,
            function (xhr) {
                var status = xhr.status;
                console.log(status + " " + xhr.statusText + " " + xhr.responseText);
                if (status == 204) { //204 = no content
                   // window.alert("Článok úspešne vymazaný (article successfully deleted).");
                    window.location.href = "html/vypisClankov.html";
                }
                else{
                    errorAlert("Vymazanie neúspešné (delete failed).",xhr);
                }
            }
        );
    }
}

function toogle(){
    var x = document.getElementById("myDiv");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

}

