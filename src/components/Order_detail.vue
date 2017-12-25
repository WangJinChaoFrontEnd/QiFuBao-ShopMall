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
    <x-header style="background-color:white;">订单详情</x-header>
    <div class="order_address">
      <ul>
        <li>姓名：{{content.contact}}</li>
        <li>电话：{{content.contact_mobile}}</li>
      </ul>
      <ul>
        <li>地址：{{content.address}}</li>
      </ul>
    </div>
    <div style="padding-bottom:8rem">
      <div class="order_detail_warp"  style="border:none">
        <div class="order_detail_content" style="border:none">
          <div class="pro_img_box">
            <div class="pro_img">
              <img :src="content.img_url" alt="">
            </div>
          </div>
          <ul class="order_detail_name">
            <li>{{content.product_name}}</li>
            <li>规格：{{content.product_specification}}</li>
          </ul>
          <ul class="order_detail_price order_state">
            <li>{{content.order_status}}</li>
            <li>*{{content.product_count}}</li>
            <li>￥{{content.order_amount/100}}</li>
          </ul>
        </div>
        <div style="width:100%;background-color:white;">
          <ul class="order_num">
            <li>订单编号:</li>
            <li>{{content.orderno}}</li>
          </ul>
          <ul class="order_num">
            <li>下单时间:</li>
            <li>{{content.ctime}}</li>
          </ul>
          <ul class="order_num">
            <li>备注:</li>
            <li>{{content.memo}}</li>
          </ul>
        </div>
      </div>
      <!--发货-->
        <div style="width:98%;padding:0 1%;background-color:white;margin-top:.5rem" v-show="fahuo">
          <ul class="order_num">
            <li>物流名称:</li>
            <li>{{content.wl_name}}</li>
          </ul>
          <ul class="order_num">
            <li>物流订单编号:</li>
            <li>{{content.wl_orderno}}</li>
          </ul>
        </div>
        <!--退货-->
        <div style="width:98%;padding:0 1%;background-color:white;margin-top:.5rem" v-show="tuihuo">
          <ul class="order_num">
            <li>退货物流名称:</li>
            <li>{{content.cancel_wl_name}}</li>
          </ul>
          <ul class="order_num">
            <li>退货订单编号:</li>
            <li>{{content.cancel_wl_orderno}}</li>
          </ul>
        </div>
      <div class="contact_box">
        <div class="content_kf">
          <ul class="contact">
            <li>联系客服</li>
          </ul>
        </div>
        <div class="content_kf " style="border:none">
          <ul class="contact contact_phone">
            <li>拨打电话</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="order_but_box">
      <button class="del" v-show="content.show_left" @click="del(content)">{{content.but_left}}</button>
      <button class="pay" v-show="content.show_right" @click="sh(content.but_right,content.id,content.product_id)">{{content.but_right}}</button>
    </div>
</div>   
</template>
<script>
import { XHeader, TransferDom , XTextarea, Group, XInput,Confirm} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    XTextarea,
    Group,
    XInput,
    Confirm
  },
  created(){
    this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryOrder.do',{
      userid:this.$route.query.userid,
      orderid:this.$route.query.orderid
    },{emulateJSON:true}).then(function(data){
      //for(var i=0;i<data.body.data.length;i++){
          data.body.data.show_left=true
          data.body.data.show_right=true
        switch(data.body.data.order_status){
          case 0:
          data.body.data.order_status='待支付';
          data.body.data.but_left='删除订单';
          data.body.data.but_right='立即支付';
          this.fahuo=false;
          this.tuihuo=false;
          break;
          case 1:
          data.body.data.order_status='已支付待发货';
          data.body.data.show_left=false;
          data.body.data.but_right='申请退货';
          this.fahuo=true;
          this.tuihuo=false;
          break;
          case 2:
          data.body.data.order_status='已发货';
          data.body.data.show_left=false;
          data.body.data.but_right='确认收货';
          this.fahuo=true;
          this.tuihuo=false;
          break;
          case 3:
          data.body.data.order_status='已收货待评论';
          data.body.data.but_left='删除订单';
          data.body.data.but_right='评论';
          this.fahuo=true;
          this.tuihuo=false;
          break;
          case 4:
          data.body.data.order_status='申请退换货';
          data.body.data.show_left=false;
          if(data.body.data.cancel_status=="0"){
                data.body.data.but_right='审核中...';
            }else if(data.body.data.cancel_status=="1"){
                data.body.data.but_right='上传退货物流';
            }else if(data.body.data.cancel_status=="2"){
                data.body.data.but_right='退货失败';
            }
          this.fahuo=true;
          this.tuihuo=true;
          break;
          case 5:
          data.body.data.order_status='退货';
          data.body.data.show_left=false;
          data.body.data.but_right='已退货';
          this.fahuo=true;
          this.tuihuo=true;
          break;
          case 6:
          data.body.data.order_status='已评论';
          data.body.data.but_left='删除订单';
          data.body.data.but_right='申请退货';
          this.fahuo=true;
          this.tuihuo=false;
          break;
          case 7:
          data.body.data.order_status='退换货中';
          data.body.data.show_left=false;
          data.body.data.but_right='退换货中';
          this.fahuo=true;
          this.tuihuo=true;
          break;
        }
      //}
      this.content=data.body.data
    },function(error){})
  },
   methods: {
     onCancel () {
      console.log('on cancel')
    },
    onConfirm (msg) {
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/del.do',{
        userid:this.$route.query.userid,
        orderid:this.delorder
      },{emulateJSON:true}).then(function(data){
        this.$router.go(-1)
        },function(error){})
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    },
    del(All){
      this.delorder=All.id
      this.show=true
    },
    
    sh(All,id,productid){
      if(All=="确认收货"){
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/receive.do',{
        userid:this.$route.query.userid,
        orderid:id,
        orderStatus:3
        },{emulateJSON:true}).then(function(data){
        this.$router.go(-1)
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
      content:'',
      show: false,
      fahuo:true,
      tuihuo:true,
      delorder:''
    }
  }
}
</script>
<style>
@import 'css/style.css'
</style>
