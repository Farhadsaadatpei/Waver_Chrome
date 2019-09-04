<template>
    <div class="container">
        <h1>Waver <br>Blocked.</h1>
        <div v-if="currentItem != null">
            <h2>
            {{currentItem.Title}}
            </h2>
            {{currentItem.URL}} is blocked by Waver.
            <h2>
            Expire in 
            <countdown :time="currentItem.TimeStampEnd - new Date().getTime()">
                <template slot-scope="props">{{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}</template>
            </countdown>
            </h2>
        </div>
        
    </div>
</template>

<script>
import 'bootstrap-vue';
import 'bootstrap';

// Vendor
import Vue  from 'vue'
import VueCountdown from '@xkeshi/vue-countdown';
import BootstrapVue from 'bootstrap-vue'

Vue.component(VueCountdown.name, VueCountdown);
Vue.use(BootstrapVue)

export default {
    data: function(){
        return {
            currentItem: null,
        }
    },
    created: function(){
        // Get Store Data
        this.getCurrentURLStoredData();
    },
    methods: {
        getCurrentURLStoredData: function(){
            self = this
            chrome.extension.sendRequest({method: "blockList"}, function(data) {
                // Objectify Data
                var blockList = JSON.parse(data);

                // Get Blocked URL
                var url = new URL(window.location.href);
                var blockedURL = url.searchParams.get("blockedURL");

                // Search if Item current URL is in the Block List
                var result = blockList.filter(function (obj) {
                    return obj.URL === blockedURL;
                })[0];

                // Curren URL in Block List, Show Block Screem
                if(result != undefined){
                    self.currentItem = result
                } 
            });
        }
    }
}
</script>

<style lang="scss" scoped>

    /**
     * Colors
     */

    $navy-primary: #607d8b;
    $navy-light: #8eacbb;
    $navy-dark: #34515e;
    $red-primary: #d32f2f;
    $red-light: #ff6659;
    $red-dark: #9a0007;
    
    .container {
        opacity: 0.97;
        background: $navy-dark;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 3vh;
        margin: 0;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji" !important;
        font-size: 1rem !important;
        font-weight: 400 !important;
        color: #fff;
        text-align: left;
        z-index: 99999999999;

        h1{
            margin: 25px 0px;
            font-size: 74px;
            line-height: 72px;
        }
    }

</style>