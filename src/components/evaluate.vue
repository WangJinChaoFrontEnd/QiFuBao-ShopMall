<template>
  <div>
      <x-header style="background-color:white;">发表评价</x-header>
      <div class="start">
        <cell title="商品评价">
          <rater v-model="data5" star="☻" active-color="#FF9900" :margin="4"></rater>
        </cell>
      </div>
      <div>
        <group>
          <x-textarea  v-model="data6" :max="200" :placeholder="('宝贝满足你的期待吗？说说它的优点和美中不足吧')"></x-textarea>
        </group>
      </div>
      <div class="sub_eval">
        <button @click="submit">提交</button>
      </div>  
  </div>
</template>
<script>
import { XHeader, TransferDom,Rater, Cell,XTextarea, Group, XInput } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Rater,
    Cell,
    XTextarea, Group, XInput 
  },
  methods: {
    submit(){
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/addComment.do',{
        userid:this.$route.query.userid,
        orderid:this.$route.query.orderid,
        productId:this.$route.query.productid,
        start:this.data5,
        comment:this.data6
      },{emulateJSON:true}).then(function(data){
        this.$vux.alert.show({
            title: '提示',
            content: '评价成功'})
            this.$router.go(-1)
        },function(error){})
    }
  },
  data () {
    return {
      demo1: false,
      data5: 3,
      data6:''
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