<template>
  <div>
      <x-header style="background-color:white;">上传退货物流</x-header>
      <div class="start">
        <selector placeholder="选择物流" style="text-align:left" v-model="demo01" title="选择物流" name="district" :options="list" @on-change="changename"></selector>
        <x-input title="运单号码" style="text-align:left"  v-model="demo02"  ></x-input>
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
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/listWuLiuCom.do').then(function(data){
        for(var i=0;i<data.body.data.length;i++){
          data.body.data[i].key=data.body.data[i].id
          data.body.data[i].value=data.body.data[i].wuliu_name
          delete data.body.data[i].id
          delete data.body.data[i].wuliu_name
          this.list=data.body.data
        }
        //this.list=data.body.data
        },function(error){})
  },
  methods: {
    changename(data){
      for(var i=0;i<this.list.length;i++){
        if(this.list[i].key==data){
          this.demo01name=this.list[i].value
        }
      }
    },
    submit(){
      if(this.demo01==""||this.demo02==""){
        this.$vux.alert.show({
            title: '提示',
            content: '请填写退货物流和订单号'})
      }else{
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/payOrder.do',{
        userid:this.$route.query.userid,
        orderid:this.$route.query.orderid,
        orderStatus:7,
        wlOrderno:this.demo02,
        wlName:this.demo01name,
        wlId:this.demo01,
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
      demo01name:'',
      list:[]
      //maskValue:'',
      //list: [{key: '1', value: '退货不退款'}, {key: '2', value: '退货退款'}, {key: '3', value: '换货'}],
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