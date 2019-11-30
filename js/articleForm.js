
var form = document.getElementById("SKorFrm");
var artId = queryString2obj().id;
writeTag2Html("klucove_slova");


if (isFinite(artId)) {
    console.log("edit article "+artId);
    AJAXGetCall("http://"+server+"/api/article/"+artId,
        function(xhr){
            var article=JSON.parse(xhr.responseText);
            console.log(article);
            document.getElementById("author").value=article.author;
            document.getElementById("title").value=article.title;
            document.getElementById("imageLink").value=article.imageLink;
            document.getElementById("content").value=article.content;
            document.getElementById("tags").value=article.tags;
            document.getElementById("frmTitle").innerHTML="Uprav článok / Edit article";
        },
        function(xhr){
            errorAlert("Načitanie článku zlyhalo (article loading failed).",xhr);
        }
    );
    
}else{
    document.getElementById("frmTitle").innerHTML="Pridaj článok / Add article";
}

//Pridanie funkcionality pre kliknutie na tlacidlo "Späť / Back"
//Adding functionality for the button "Späť / Back"
document.getElementById("btBack").addEventListener("click", function(){
    window.history.back()
});

//Pridanie funkcionality pre kliknutie na tlacidlo "Ulož článok / Save article"
form.addEventListener("submit", function(event){  //tu potrebujem aj objekt s udalosťou, aby som (here I also need the event object)
    event.preventDefault(); //zrušil pôvodné spracovanie udalosti (to cancel the default event handling)
    if (isFinite(artId)) {
        prepareAndSendArticle(form,"PUT","http://"+server+"/api/article/"+artId);
    }else{
        prepareAndSendArticle(form,"POST","http://"+server+"/api/article");
    }

});

//Pridanie funkcionality pre kliknutie na tlacidlo "Nahraj obrázok / Upload image"
//document.getElementById("btShowFileUpload").addEventListener("click", function(){
   // document.getElementById('fsetFileUpload').classList.remove("skryty");
    //document.getElementById('btShowFileUpload').classList.add("skryty");
//});

//Pridanie funkcionality pre kliknutie na tlacidlo "Odošli obrázok na server / Send image to server"
//Adding functionality for the button "Odošli obrázok na server / Send image to server"
document.getElementById("btFileUpload").addEventListener("click", function(){
    uploadImg(
        document.getElementById('imageLink'),
        document.getElementById('flElm').files
    );
});

//Pridanie funkcionality pre kliknutie na tlacidlo "Zruš nahrávanie / Cancel uploading"
//Adding functionality for the button "Zruš nahrávanie / Cancel uploading"
//document.getElementById("btCancelFileUpload").addEventListener("click", function(){
   // document.getElementById('fsetFileUpload').classList.add("skryty");
   // document.getElementById('btShowFileUpload').classList.remove("skryty");
//});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funkcie
//functions

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

    //2.Modifies the data object to a form suitable for sending
    if(data.tags){  //if there is the item tags and it it not an empty string.
                    //If I just need to know whether there is the item tags, it is better to call
                    //Object.prototype.hasOwnProperty.call(data, 'tags')
                    //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        data.tags=data.tags.split(","); //zmeni retazec na pole. Oddelovac poloziek je ciarka.
        data.tags=data.tags.map(function(tag) {return tag.trim()}); //odstráni prázdne znaky na začiatku a konci každého kľúčového slova
    }

    console.log("prepareAndSendArticle> Form data successfully converted to:");
    console.log(JSON.stringify(data));

    //3.Kontrola, či boli zadané povinné polia
    //3.Required/format validation
    if(!data.title){ //this is just for sure
       // alert("Názov článku musí byť zadaný a musí obsahovať čitateľné znaky\nArticle title has to be entered and has to contain readable characters only.");
        return;
    }
    if(!data.content){ //this is important, checks whether the user entered only white space characters.
     //  alert("Obsah článku musí byť zadaný a musí obsahovať čitateľné znaky.\nArticle content has to be entered and has to contain readable characters only");
        return;
    }

    console.log("prepareAndSendArticle> Form data validated.");


    //4. odoslanie údajov
    //4. sending the data
    if(window.confirm("Skutočne si želáte článok zapísať do databázy?\nDo you really wish to upload the article?")){
        AJAXCall(method, restURL,
            "application/json;charset=UTF-8",
            JSON.stringify(data),
            function(xhr){
                var status=xhr.status;
                if(status==200 || status==201){ //Spracovanie úspešné. Údaje boli zapísané (successful processing and upload)
                    var response=JSON.parse(xhr.responseText);
                    if(response.id){
                        console.log(response.id);
                        window.location.href="article.html?id="+response.id;
                    }
                    console.log("Spracovanie úspešné. Údaje boli zapísané");
                }else if(status==202){ //Spracovanie úspešné. Údaje sa zapisujú (successful processing but upload not finished)
                    window.location.href="formular.html";
                }
                else{
                    errorAlert("Zapísanie článku zlyhalo (article uploading failed).",xhr);

                }
                console.log(status+" "+xhr.statusText+" "+xhr.responseText);
            }
        );
    }
}

/**
 * Uploads an image to the server
 * @param $imgLinkElement - id of the input type="url" element, where the link of the uploaded file will be added arter the upload
 * @param $fieldsetElement - id of the hideable fieldset element, which conains the controls for the file upload.
 * @param $btShowFileUploadElement - id of the button type="button" element, which shows or hides the fieldset
 * @param files - a FileList object with the image to be uploaded as the first item.
 */
function uploadImg(imgLinkElement, files) {
    if (files.length>0){
        var imgData = new FormData();
        imgData.append("file", files[0]); //beriem len prvy obrazok, ved prvok formulara by mal povolit len jeden
                                          //takes only the first file (image)
        //pozor:nezadavat content-type. potom to nepojde.
        //Beware: It doesn't work correctly if the content-type is set.
        AJAXCall("POST","http://"+server+"/api/fileUpload","",imgData,
            function(xhr){
                var status=xhr.status;
                if(status==200) { //Spracovanie úspešné. Súbor bol prijatý na server. (successful processing and file upload)
                    var resObj=JSON.parse(xhr.responseText);
                    if(resObj){
                        imgLinkElement.value=resObj.fullFileUrl;
                    }
                }else{
                    errorAlert("pracovanie neúspešné. Obrázok nebol uložený na serveri (image uploading failed).",xhr);
                }
            }
        );

    }else{
        window.alert("Vyberte súbor s obrázkom\nPlease, choose an image file.");
    }



}


//var url = "http://"+server+"/api/tag";

function writeTag2Html(tagElmId) {
    url = "http://wt.kpi.fei.tuke.sk/api/tag";
    getJSONAllBr(url,
        function (JSONObj) {s(JSONObj,tagElmId)},
        function (status) {errorDialog(status)});
}

function s(tags,tagElmId){
    var tagElm=document.getElementById(tagElmId);
   // var navElm=document.getElementById(navElmId);
    console.log(tags);
    console.log(tags.length);
    var htmlCode="<datalist id=\"keywords\">";
    for (var i=0; i<tags.length; i++) {
        htmlCode+="<option value="+tags[i].name+">";
    }
    htmlCode+=" </datalist>";
    if(tagElm){
        tagElm.innerHTML=htmlCode;
       // tagElm.innerHTML=tagHtml();
    }
}

// function tagHtml(){
//         var htmlCode="<datalist id=\"keywords\">";
//
//         htmlCode+="<option value=\"ESN\">\n" +
//             "        <option value=\"Erasmus\">";
//         htmlCode+=" </datalist>";
//
//         console.log(htmlCode);
//         return htmlCode;
// }

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