'use strict';

function cs142MakeMultiFilter(originalArray){
    var currentArray = originalArray;

    function arrayFilterer(filterCriteria, callback){
        if(filterCriteria === undefined){
            return currentArray;
        }
        currentArray = currentArray.filter(filterCriteria);
        if (typeof callback === "function"){
            callback.call(originalArray, currentArray);
        }
        return arrayFilterer;
    }
    return arrayFilterer;
}