<template>
  <div id="app">
    <loading v-model="showLoading" :text="loadText" position="fixed" style="z-index:99999"></loading>
    <router-view></router-view>
  
  </div>
</template>

<script>
import {  Loading} from 'vux'
import help from './help'
export default {
  name: 'app',
  components:{
    Loading
  },
  data(){
    return{
      showLoading: false,
      loadText: 'Loading'
    }
  },
   created() {
            help.$on('toggleLoading', (show) => {
                this.showLoading = show;
            });
            help.$on('toggleErrDialog', (show,errcode) => {
                if(errcode==200)
                  show=false;
                this.showErrDialog=show;
                if(errcode==404){
                  this.errDialogText="请求找不到";
                }
                if(errcode==403){
                  this.errDialogText="请求未授权";
                }
                if(errcode==500){
                  this.errDialogText="处理失败";
                }
            });
        },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%
}
body{
  margin: 0;
  padding: 0;
  background-color: #f6f2f1;
}

</style>
