// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VRouter from 'vue-router'
import VueResource from 'vue-resource'
import router from './router/index'
import myutil from './util'
import myhelp from './help'
import Vuex from 'vuex'
import store from './vuex/store'
import { Alert, Group, XSwitch, Cell, TransferDomDirective as TransferDom } from 'vux'
Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VRouter)
import  { AlertPlugin } from 'vux'
Vue.use(AlertPlugin)
Vue.use(myutil);
Vue.use(Vuex);
/* eslint-disable no-new */
export default {
  name: 'app'
}
Vue.http.interceptors.push((request, next) => {
    // this.showLoading = true;
    myhelp.$emit('toggleLoading', true)
    next((response) => {
        /*this.showLoading = false*/
        myhelp.$emit('toggleLoading', false);

        if(!response.ok){
            myhelp.$emit('toggleErrDialog',true,response.status);
        }
        return response
    });
});
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
