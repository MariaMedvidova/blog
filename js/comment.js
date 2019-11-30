var artId = queryString2obj().id;
var restURL ="http://"+server+"/api/article/"+artId;



function updateComment(id){
    window.location.href='article.html?id='+artId+'&idComment='+id;
}

/**
 * Vymazanie článku aj s komentármi
 * @param articleId - id článku na vymazanie
 *
 * Deletes an article, including its comments
 * @param articleId - id of the article to be deleted
 */
function deleteComment(id){
    var sourceURL ="http://"+server+"/api/comment/"+id;
    if(window.confirm("Do you really wish to delete comment?")) {

        AJAXCall('DELETE', sourceURL,
            "", null,
            function (xhr) {
                var status = xhr.status;
                console.log(status + " " + xhr.statusText + " " + xhr.responseText);
                if (status == 204) { //204 = no content
                   // window.alert("Comment successfully deleted).");
                    window.location.href = "article.html?id="+artId;
                }
                else{
                    errorAlert("Delete failed",xhr);
                }
            }
        );
    }
}

