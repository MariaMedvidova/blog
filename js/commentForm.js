var form = document.getElementById("AddComment");
var commentId = queryString2obj().idComment;
var artId = queryString2obj().id;
var server="wt.kpi.fei.tuke.sk";

if (isFinite(commentId)) {
    console.log("edit comment "+commentId);
    AJAXGetCall("http://"+server+"/api/comment/"+commentId,
        function(xhr){
            var comment=JSON.parse(xhr.responseText);
            console.log(article);
            document.getElementById("author").value=comment.author;
            document.getElementById("text").value=comment.text;
        },
        function(xhr){
            errorAlert("Comment loading failed",xhr);
        }
    );
    toogle();
}

//Pridanie funkcionality pre kliknutie na tlacidlo "Ulož článok / Save article"
form.addEventListener("submit", function(event){  //tu potrebujem aj objekt s udalosťou, aby som (here I also need the event object)
    event.preventDefault(); //zrušil pôvodné spracovanie udalosti (to cancel the default event handling)
    if (isFinite(commentId)) {
        prepareAndSendArticle(form,"PUT","http://"+server+"/api/comment/"+commentId);
    }else{
        prepareAndSendArticle(form,"POST","http://"+server+"/api/article/"+artId+"/comment");
    }
});

/**
 * Spracuje údaje o článku z formulára a odošle na uloženie na server
 * @param form - formulár s článkom
 * @param method - metóda, "POST" (pridanie článku) alebo "PUT" (úprava článku)
 * @param restURL - url zdroja na serveri
 *
 * Processes article data from the form and sends them to the server.
 * @param form - article form
 * @param method - method, "POST" (add article) or "PUT" (edit article)
 * @param restURL - url of the resource at the server
 */
function prepareAndSendArticle(form, method, restURL) {
    //1. Uloží údaje z formulára do objektu
    //1. Puts form data to the object data
    var data = form2trimmedStringsObject(form);
    console.log("prepareAndSendArticle> Data from the form in the data object:");
    console.log(JSON.stringify(data));

    console.log("prepareAndSendArticle> Form data successfully converted to:");
    console.log(JSON.stringify(data));

    //3.Kontrola, či boli zadané povinné polia
    //3.Required/format validation
    if(!data.author){ //this is just for sure
       // alert("Comment author has to be entered and has to contain readable characters only.");
        return;
    }
    if(!data.text){ //this is important, checks whether the user entered only white space characters.
      //  alert("Comment content has to be entered and has to contain readable characters only");
        return;
    }

    console.log("prepareAndSendArticle> Form data validated.");


    //4. odoslanie údajov
    //4. sending the data
    if(window.confirm("Do you really wish to upload the comment?")){
        AJAXCall(method, restURL,
            "application/json;charset=UTF-8",
            JSON.stringify(data),
            function(xhr){
                var status=xhr.status;
                if(status==200 || status==201){ //Spracovanie úspešné. Údaje boli zapísané (successful processing and upload)
                    var response=JSON.parse(xhr.responseText);
                    if(response.id){
                        console.log(response.id);
                        window.location.href="article.html?id="+artId;
                    }
                    console.log("Spracovanie úspešné. Údaje boli zapísané");
                }else if(status==202){ //Spracovanie úspešné. Údaje sa zapisujú (successful processing but upload not finished)
                    window.location.href="../html/vypisClankov.html";
                }
                else{
                    errorAlert("Comment uploading failed",xhr);

                }
                console.log(status+" "+xhr.statusText+" "+xhr.responseText);
            }
        );
    }
}
