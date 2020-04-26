import * as CONSTANTS from "./config.js";
import { GiphyHandler } from "./GiphyHandlerClass.js";
//global variable for GiphyHandler class
let giphHandlr; 
/*
    By default, it is fired when the entire page loads,
    including its content, meaning that 5 default buttons 
    and some others from the local storage will be added to the old-search-buttons div
*/
window.onload = function(){
    // localStorage.removeItem('buttonList');
    giphHandlr  = new GiphyHandler(CONSTANTS.API_KEY);
    giphHandlr.addButtonFromStorage();
}

/*
    Handler click for every button, differs them from one another
    with their values and calls a function appropriate for the said value
*/
export function clickHandler(value, id){
    if (value === "Submit"){
        value = document.getElementById("input").value;
        giphHandlr.addButton();
        giphHandlr.search(CONSTANTS.URL, value);
    } else if (value === "trending"){
        giphHandlr.search(CONSTANTS.TRENDING_URL, value);
    } else if (value === "delete"){
        giphHandlr.removeButton(value, id);
    } else{
        giphHandlr.search(CONSTANTS.URL, value);
    }
}

 

