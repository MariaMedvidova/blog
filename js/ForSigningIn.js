/*function showSingIn(){
    var x = document.getElementById("blabla");
    x.style.display = "block";
}

function hideSingIn(){
    var x = document.getElementById("blabla");
    x.style.display = "none";
}

function showSingOut(){
    var x = document.getElementById("signOutFb");
    x.style.display = "block";

}

function hideSignOut(){
    var x = document.getElementById("signOutFb");
    x.style.display = "none";
}*/

function signInFB()
{
    localStorage.loggedOut = 'in';
    var nameInput = document.getElementById("author");
    if (nameInput)
    {
        FB.api('/me', function(response) {
            document.getElementById("author").value = response.name;
        });
    }
    fBut();
    signOutFBShow();
    /*hideSingIn();
    showSingOut*/
}

function signOutFB() {
    localStorage.loggedOut = 'out';
    var nameInput = document.getElementById("author");
    if (nameInput)
    {
        document.getElementById("author").value = "";
    }
    fBut();
    signOutFBShow();
    //signOutFBShow();
    //toogleButton();
    /*singInShow();
    hideSignOut();
    showSingIn();*/
}

function checkFacebookLogin()
{
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            signInFB();
        }
        else
        {
            initiateFBLogin();
        }
    });
}
function initiateFBLogin()
{
    FB.login(function(response) {
        signInFB();
    }, {scope: 'public_profile'});
}


function fBut() {
    document.getElementById("fbbutton").classList.toggle("hidden");
}

function signOutFBShow()
{
    document.getElementById("signOutFb").classList.toggle("hidden");
}

function fbDiv() {
    document.getElementById("fbook").classList.toggle("hidden");
}