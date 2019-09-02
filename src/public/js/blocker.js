 // Import Vue
 import Vue from 'vue';
 import App from './app.vue'

 /**
  * Block Page
  */

// Request Block List from PopUp through Background.js/Bus
chrome.extension.sendRequest({method: "blockList"}, function(data) {

    // Objectify Data
    var blockList = JSON.parse(data);

    // Get Current Page URL
    var currentURL = window.location.href

    // Search if Item current URL is in the Block List
    var result = blockList.filter(function (obj) {
        return obj.URL === currentURL;
    })[0];

    // Curren URL in Block List, Show Block Screem
    if(result != undefined){

        // Create Vue App Element
        var app = document.createElement('div');
        app.id = 'waver-block';
        document.body.appendChild(app);

        /**
         * Init Vue for Blocker View
         */
        var app = new Vue({
            el: '#waver-block',
            render: h => h(App)
        })
    } 
});
