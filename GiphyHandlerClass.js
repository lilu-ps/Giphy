import { clickHandler } from "./script.js";


import * as CONSTANTS from "./config.js";
export class GiphyHandler{
    constructor(api_key) {
        this.api_key = api_key;
    }

  
    async search(url, value){
        let bigDiv = document.getElementById("giphy-items");
        bigDiv.innerHTML = "";
        const giphyQuery = url + "q=" + value + "&api_key=" + this.api_key;
        const response = fetch(giphyQuery);
        (await response).json().then(function(json){
            var len = Math.min(10, json.data.length)
            for (var i = 0; i < len; i++){
                let curUrl = json.data[i].images.original.url;

               let width = json.data[i].images.fixed_height_small_still.width;
               let inner = '<img src="' + curUrl + '">';
               let item = document.createElement("div");
               item.setAttribute('class', 'giphy-item');
               item.setAttribute('value', curUrl);
               item.style = "width:" + width + ";";
               item.innerHTML = inner;
               bigDiv.append(item);
            }
        });
    }

    /*
     * Adds a single button to the previously searched button list. First
     * the function checks if the input value is either in the local storage 
     * button list or the default list. If not, then the button is added.
    */
    async addButton(){
        let filterKey = document.getElementById("input").value;
        if (filterKey === "") return;
        var buttons = JSON.parse(localStorage.getItem('buttonList')) || [];

        document.getElementById("input").value = "";
        if (buttons.includes(filterKey) || CONSTANTS.defaultList.includes(filterKey)) return;

        this.addButtonWithVal(filterKey);
        this.addButtonToStorage(filterKey);
        // this.search("https://api.giphy.com/v1/gifs/search?",filterKey);
    }
    
    /*
     * Given the value for the button, the function creates new element div,
     * with a class name 'old-search-item', also creates new button with the given
     * value and another delete button. Both of those buttons are added to 
     * old-search-item and the old-search-item itself is added to button-list div.
     */
    async addButtonWithVal(filterKey){
        let item = document.createElement("div");
        item.setAttribute('class', 'old-search-item');
    
        let butt = document.createElement("BUTTON");
        butt.innerHTML = filterKey;
        butt.style.marginRight = "6px";
        butt.value = filterKey;
        butt.setAttribute('id', filterKey);
        butt.addEventListener("click",function(){
            clickHandler(butt.value, filterKey);
        }, false);
    
        let xbutton = document.createElement("BUTTON");
        xbutton.setAttribute('class', 'delete-button');
        xbutton.innerHTML = 'x';
        xbutton.value = "delete";
        let xButtonId = filterKey + "-id";
        xbutton.setAttribute('id', xButtonId)
        xbutton.addEventListener("click",function(){
            clickHandler(xbutton.value, xButtonId);
        }, false);
    
        item.appendChild(butt);
        item.appendChild(xbutton);
    
        document.getElementById("button-list").append(item);
    }
    
    
    /*
     * Adds the value of the new button of the buttonList that is saved in localStorage.
     * This way, when the site is refreshed, all the additional buttons will appear.
     */
    async addButtonToStorage  (buttonVal) {
        var buttons = JSON.parse(localStorage.getItem('buttonList')) || [];
        buttons.push(buttonVal);
        localStorage.setItem('buttonList', JSON.stringify(buttons));
    } 
    
    //Adds listeners to search and trending buttons
    async _addListenersToSearchAndTrend(){
        let search = document.getElementById("submit-id");
        search.addEventListener("click",function(){
            clickHandler(search.value, "submit-id");
        }, false);

        let trend = document.getElementById("trend-id");
        trend.addEventListener("click",function(){
            clickHandler(trend.value, "trend-id");
        }, false);
    }

    /*
     * Goes through the buttonList in the local storage and adds
     * buttons with given values.
     */
    async addButtonFromStorage(){
        this._addListenersToSearchAndTrend();
  
        var buttons = JSON.parse(localStorage.getItem('buttonList')) || [];
        buttons = CONSTANTS.defaultList.concat(buttons);

        var length = buttons.length;
        for (var i = 0; i < length; i++){
            var curVal = buttons[i];
            this.addButtonWithVal(curVal);
        }
    }
    
    async handleClick(url, value){
        giphHandlr.search(url, value);
    }

    /*
     * When red x button is clicked on top of some old search button,
     * the function removes that said old search button (from the local storage as well).
     */
    async removeButton(value, id){
        let buttonId = id.substring(0, id.length - 3);
        var mainButton = document.getElementById(buttonId);
        mainButton.parentNode.removeChild(mainButton);
        let buttons = JSON.parse(localStorage.getItem('buttonList')) || [];

        let indexInList = buttons.indexOf(buttonId);
        if (indexInList !== -1){
            buttons.splice(indexInList, 1);
            localStorage.setItem('buttonList', JSON.stringify(buttons));
        }

        var xbutton = document.getElementById(id);
        xbutton.parentNode.removeChild(xbutton);
    }
}