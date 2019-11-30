/*
 * Created by Stefan Korecko, 2016-18
 */




/**
 * Sparsuje query string do objektu
 * Pozor! Ak je viac položiek s rovnakým menom, uloží sa do príslušnej položky iba posledná.
 * @returns objekt s query string
 *
 * Parses the query string to an object
 * Beware! If there are more items with the same name, it takes the last one only.
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