<template>
  <div>
      <x-header style="background-color:white;">申请退货</x-header>
      <div class="start">
        <selector placeholder="退货类型" style="text-align:left" v-model="demo01" title="选择退货类型" name="district" :options="list"></selector>
        <!--<x-input title="运单号码" style="text-align:left"  v-model="maskValue"  ></x-input>-->
        <x-textarea :max="200" v-model="demo02" :placeholder="('退货原因...')"></x-textarea>
      </div>
      <div class="sub_eval">
        <button @click="submit">提交</button>
      </div>  
  </div>
</template>
<script>
import { XHeader, TransferDom,Rater, Cell,XTextarea, Group, XInput ,Selector} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Rater,
    Cell,
    XTextarea, Group, XInput ,Selector
  },
  created(){
    
  },
  methods: {
    submit(){
      if(this.demo01==""||this.demo02==""){
        this.$vux.alert.show({
            title: '提示',
            content: '请填写退货原因及类型'})
      }else{
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/tuiHuo.do',{
        userid:this.$route.query.userid,
        orderid:this.$route.query.orderid,
        orderStatus:4,
        cancelType:this.demo01,
        cancelMemo:this.demo02
      },{emulateJSON:true}).then(function(data){
        this.$router.go(-1)
        },function(error){})
      }
    }
  },
  data () {
    return {
      demo1: false,
      data5: 3,
      demo01:'',
      demo02:'',
      //maskValue:'',
      list: [{key: '1', value: '退货不退款'}, {key: '2', value: '退货退款'}, {key: '3', value: '换货'}],
    }
  }
}
</script>

<style>
.vux-label{
  text-align: left !important;
}
@import 'css/style.css'
</style>