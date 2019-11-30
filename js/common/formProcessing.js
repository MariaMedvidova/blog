/*
 * Created by Stefan Korecko, 2016-18
 */

/**
 *
 * Pomocná funkcia pre addTrmSrtVal2ObjIfNotEmpty(...) a form2trimmedStringsObject(...).
 * Ak element elmWVal má atribút value, vráti jeho hodnotu po prevode na reťazec a aplikácii funkcie trim().
 * Ak ho nemá alebo elmWVal neexistuje, vráti prázdny reťayec.
 * @param elmWVal - element, ktorého hodnota sa spracuváva.
 * @returns {String} - viď. všeobecný popis funkcie
 *
 * A helper function for addTrmSrtVal2ObjIfNotEmpty(...) and form2trimmedStringsObject(...).
 * If the element elmWVal has the value attribute, it returns converted to a trimmed string.
 * If there is no value attribute or elmWVal doesn't exist, it returns an empty string.
 * @param elmWVal - element, which value is processed
 * @returns {String} - see above
 *
 */
function elmValue2TrimmedString(elmWVal){
    if(elmWVal && elmWVal.value!==undefined && elmWVal.value!==null)
        return elmWVal.value.toString().trim();
    else
        console.log(elmWVal.name+" nema value");
    return "";
}

/**
 * Pomocná funkcia pre form2trimmedStringsObject(...). Pridá hodnotu elmWVal.value k objektu obj ako reťazec, ale len v prípade, že
 * nebude po aplikácii funkcie trim() prázdny. Meno novej položky bude elmWVal.name.
 * Ak už položka s týmto menom existuje, prepíše ju.
 * Funkcia  trim() odstráni biele znaky na začiatku a konci reťazca
 * @param elmWVal - formulárový prvok, ktorý v sebe má danú hodnotu, ktorá sa má pridať
 * @param obj - objekt, ku ktorému sa hodnota má pridať ako nová položka
 *
 * A helper function for form2trimmedStringsObject(...). It adds the value elmWVal.value to the object obj as a string
 * but only if the value will not be an empty string after applying the trim() function. The nema of the new item will be  elmWVal.name.
 * If the item already exists, it is rewritten.
 * @param elmWVal - form element that includes a value that should be added.
 * @param obj - object to which the value should be added as a new item (string).
 */
function addTrmSrtVal2ObjIfNotEmpty(elmWVal, obj){
    if(elmWVal  && elmWVal.value!==undefined && elmWVal.value!==null){ //ak daný element existuje a má atribút value
        var valTrimmed= elmValue2TrimmedString(elmWVal); //valTrimmed = val skonvertovaná na reťazec a s odstránenými bielimi znakmi na začiatku a konci
        if(valTrimmed.length>0){ //ak reťazec nie je prázdny (stačilo dať aj if(valTrimmed), ale takto je to jasnejšie)
            obj[elmWVal.name]=valTrimmed;
        }
    } else console.log("XXX");
}

/**
 * Spracuje údaje z formulára do podoby objektu, kde
 *  - meno položky     = hodnota vlastnosti 'name' daného prvku formulára
 *  - hodnota položky  = hodnota vlastnosti 'value' daného prvku formulára ako reťazec
 *                       s dstránenými bielymi znakmi na začiatku a konci
 * Ak hodnota nebola zadaná alebo je prázdny reťazec alebo obsahuje iba biele znaky, daná položka v objekte nebude.
 * POZOR: funkcia predpokladá JEDINEČNÉ MENÁ PRVKOV FORMULÁRA. Ak je viac prvkov s tým istým menom, do objektu sa uloží
 *        iba hodnota posledného z nich.
 * @param form - DOM objekt formulára
 * @returns {{}} objekt s údajmi z formulára
 *
 * Processes form data to an object, where
 *  - an item name   = value of the 'name' attribute of the given form element
 *  - an item value  = value of the 'value' attribute of the given form element as a trimmed string
 *  If the value is not set or reduces to an empty string after trimming, the given item will not be added to the object.
 * Warning! If there are multiple form items with the same id, only the last one is added into the corresponding item of the object.
 * @param form - DOM object of the form
 * @returns {{}} object with the form data
 */
function form2trimmedStringsObject(form){
    if (!form || form.nodeName !== "FORM") {
        return;
    }
    var i, j, dataObj = {};
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue; //prejdem na koniec cyklu
        }
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'checkbox':
                    case 'radio':
                        if (form.elements[i].checked) {
                            addTrmSrtVal2ObjIfNotEmpty(form.elements[i],dataObj);
                        }
                        break;
                    default: //ostatne: text, hidden, password, ...
                        addTrmSrtVal2ObjIfNotEmpty(form.elements[i],dataObj);
                        break;
                }
                break;
            case 'TEXTAREA':
                addTrmSrtVal2ObjIfNotEmpty(form.elements[i],dataObj);
                break;
            case 'SELECT':
                switch (form.elements[i].type) {
                    case 'select-one':
                        addTrmSrtVal2ObjIfNotEmpty(form.elements[i],dataObj);
                        //dataObj[form.elements[i].name] = form.elements[i].value;
                        break;
                    case 'select-multiple':
                        var selected=[];
                        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                            if (form.elements[i].options[j].selected) {
                                var selValue=elmValue2TrimmedString(form.elements[i].options[j]);
                                if(selValue.length>0) selected.push(selValue);
                            }
                            dataObj[form.elements[i].name] = selected;
                        }
                        break;
                }
                break;
        }
    }
    return dataObj;
}