<template>
<div class="hello">
  <div v-transfer-dom>
      <confirm v-model="show"
      :title="('确定要删除吗？')"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide">
      </confirm>
    </div>
    <x-header style="background-color:white;">我的订单</x-header>
    <div class="order_detail_warp"  style="border:none" v-for="item in order_list" @click="detail(item)">
      <div class="order_detail_content" style="border:none">
        <div class="pro_img_box">
          <div class="pro_img">
            <img :src="item.img_url" alt="">
          </div>
        </div>
        <ul class="order_detail_name">
          <li>{{item.product_name}}</li>
          <li>规格：{{item.product_specification}}</li>
        </ul>
        <ul class="order_detail_price order_state">
          <li>{{item.order_status}}</li>
          <li>*{{item.product_count}}</li>
          <li>￥{{item.order_amount/100}}</li>
        </ul>
      </div>
      <div style="width:100%;background-color:white;overflow:hidden">
        <ul class=" order_list_but" style="border:none">
          <li v-show="item.show_left" @click.stop="del(item)">{{item.but_left}}</li>
          <li v-show="item.show_right" @click.stop="GoodsReceipt(item.but_right,item.id,item.product_id)">{{item.but_right}}</li>
        </ul>
      </div>
    </div>
</div>   
</template>
<script>

import { XHeader, TransferDom , XTextarea, Group, XInput ,Alert,Actionsheet,Confirm} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    XTextarea,
    Actionsheet,
    Group,
    XInput,
    Alert,
    Confirm
  },
  created(){
    // this.$vux.alert.show({
    //     title: 'VUX is Cool',
    //     content: 'Do you agree?',
    //     onShow () {
    //       console.log('i')
    //     },
    //     onHide () {
    //       console.log('i')
    //     }
    //   })
    
    this.initial()
  },
   methods: {
     onCancel () {
      console.log('on cancel')
    },
    onConfirm (msg) {
      console.log('on confirm')
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/del.do',{
        userid:this.$route.query.userid,
        orderid:this.delorder
      },{emulateJSON:true}).then(function(data){
        this.initial()
        },function(error){})
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    },
    initial(){
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryOrderList.do',{
      userid:this.$route.query.userid
    },{emulateJSON:true}).then(function(data){
      for(var i=0;i<data.body.data.length;i++){
          data.body.data[i].show_left=true
          data.body.data[i].show_right=true
        switch(data.body.data[i].order_status){
          case 0:
          data.body.data[i].order_status='待支付';
          data.body.data[i].but_left='删除订单';
          data.body.data[i].but_right='立即支付';
          break;
          case 1:
          data.body.data[i].order_status='已支付待发货';
          data.body.data[i].show_left=false;
          data.body.data[i].but_right='申请退货';
          break;
          case 2:
          data.body.data[i].order_status='已发货';
          data.body.data[i].show_left=false;
          data.body.data[i].but_right='确认收货';
          break;
          case 3:
          data.body.data[i].order_status='已收货待评论';
          data.body.data[i].but_left='删除订单';
          data.body.data[i].but_right='评论';
          break;
          case 4:
          data.body.data[i].order_status='申请退换货';
          data.body.data[i].show_left=false;
            if(data.body.data[i].cancel_status=="0"){
                data.body.data[i].but_right='审核中...';
            }else if(data.body.data[i].cancel_status=="1"){
                data.body.data[i].but_right='上传退货物流';
            }else if(data.body.data[i].cancel_status=="2"){
                data.body.data[i].but_right='退货失败';
            }
          
          break;
          case 5:
          data.body.data[i].order_status='退货';
          data.body.data[i].show_left=false;
          data.body.data[i].but_right='已退货';
          break;
          case 6:
          data.body.data[i].order_status='已评论';
          data.body.data[i].but_left='删除订单';
          data.body.data[i].but_right='申请退货';
          break;
          case 7:
          data.body.data[i].order_status='退换货中';
          data.body.data[i].show_left=false;
          data.body.data[i].show_right=false;
          data.body.data[i].but_right='退换货中';
          this.classA=true
          break;
        }
      }
      this.order_list=data.body.data
    },function(error){})
    },
    detail(All){
      this.$router.push({path:'/Order_detail',query:{userid:this.$route.query.userid,orderid:All.id}})
    },
    del(All){
      this.delorder=All.id
      this.show=true
      // this.$http.post(this.getHostUrl()+'/webapp/mallOrder/del.do',{
      //   userid:this.$route.query.userid,
      //   orderid:All.id
      // },{emulateJSON:true}).then(function(data){
      //   this.initial()
      //   },function(error){})
    },
    GoodsReceipt(name,id,productid){
      if(name=="确认收货"){
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/receive.do',{
        userid:this.$route.query.userid,
        orderid:id,
        orderStatus:3
        },{emulateJSON:true}).then(function(data){
        this.initial()
        },function(error){})
      }else if(name=="申请退货"){
        this.$router.push({path:'/Return_goods',query:{userid:this.$route.query.userid,orderid:id}})
      }else if(name=="评论"){
        this.$router.push({path:'/evaluate',query:{userid:this.$route.query.userid,orderid:id,productid:productid}})
      }else if(name=="上传退货物流"){
        this.$router.push({path:'/Return_goods_wl',query:{userid:this.$route.query.userid,orderid:id}})
      }
    }
  },
  data () {
    return {
      value:'',
      order_list:'',
      show: false,
      delorder:''
      //show_left:true,
      //show_right:true
    }
  }
}
</script>
<style>
.toggle{
  display: none
}
@import 'css/style.css'
</style>
