<template>
<div class="hello">
    <x-header style="background-color:white;">确认订单</x-header>
    <div class="address_def" v-if="addressDefault" @click="address">添加收货地址+</div>
    <div class="address_box" v-if="!addressDefault"  @click="address">
      <div class="address_icon">
      <div class="product_address"><img src="./images/address.png" alt=""></div>
      </div>
      <ul class="address_content">
        <li>
          <ul class="address_name">
            <li>收货人：{{addressList.contact}}</li>
            <li>{{addressList.contact_mobile}}</li>
          </ul>
        </li>
        <li>收获地址：{{addressList.address}}</li>
      </ul>
      <div class="detail_icon">
          <div class="address_detail"><img src="./images/gg.png" alt=""></div>
      </div>
    </div>
    <div class="order_detail_warp">
      <div class="order_detail_title">企福宝</div>
      <div class="order_detail_content">
        <div class="pro_img_box">
          <div class="pro_img">
            <img :src="product.img_url" alt="">
          </div>
        </div>
        <ul class="order_detail_name">
          <li>{{product.product_name}}</li>
          <li>规格：{{this.$route.query.productSpecification}}</li>
        </ul>
        <ul class="order_detail_price">
          <li>￥{{price/100}}</li>
          <li>*{{this.$route.query.Count}}</li>
        </ul>
      </div>
      <ul class="express">
        <li>配送方式</li>
        <li>快递免邮</li>
      </ul>
      <div class="textarea">
          <x-textarea :title="('给商家留言:')" v-model="memo" :placeholder="('选填:填写内容已和卖家协商确认')" :show-counter="false" :rows="1" autosize style="color:black;
          font-weight:normal;padding-left:0.2rem;font-size:1.4rem;height:3rem;line-height:3rem"></x-textarea>
      </div>
      <div class="real_price_box">
        <ul class="real_price">
          <li>共<span>{{this.$route.query.Count}}</span>件商品&nbsp;&nbsp;</li>
          <li>合计：￥{{(price*this.$route.query.Count)/100}}</li>
        </ul>
      </div>
    </div>
    <div class="price_footer">
      <ul class="submit_price">
        <li>合计：<span>￥{{(price*this.$route.query.Count)/100}}</span></li>
        <li @click="submit_order">提交订单</li>
      </ul>
    </div>
</div>   
</template>
<script>
import back from '../back'
import { XHeader, TransferDom , XTextarea, Group, XInput} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    XTextarea,
    Group,
    XInput
  },
   methods: {
    
  },
  data () {
    return {
      addressDefault:true,
      value:'',
      price:'',
      flag:'',
      memo:'',
      product:'',
      addressList:'',
      addressid:'',
      defaultAddress:[]
    }
  },
  created(){
    this.$http.post(this.getHostUrl()+'/webapp/mallOrder/product_detail.do',{
      userid:this.$route.query.userid,
      id:this.$route.query.id
    },{emulateJSON:true}).then(function(data){
      this.product=data.body.data
      this.price=data.body.data.price
    },function(error){})
    this.addressShow()
  },
  methods:{
    submit_order(){
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/finshOrder.do',{//完成预下单
        userid:this.$route.query.userid,
        id:this.$route.query.id,
        addressId:this.addressid
      },{emulateJSON:true}).then(function(data){

            this.$http.post(this.getHostUrl()+'/webapp/mallOrder/createOrder.do',{//创建下单
              userid:this.$route.query.userid,
              productId:this.$route.query.id,
              addressId:this.addressid,
              orderno:new Date().getTime(),
              productCount:this.$route.query.Count,
              productSpecification:this.$route.query.productSpecification,
              memo:this.memo
            },{emulateJSON:true}).then(function(data){
              this.$router.push({path:'/MyorderList',query:{userid:this.$route.query.userid,orderid:data.data.orderId}})
            },function(error){})

      },function(error){})
      //this.$router.push({path:'/MyorderList'})
    },
    address(){
      this.$router.push({path:'/Address',query:{userid:this.$route.query.userid}})
    },
    addressShow(){
      if(this.$store.state.author==""){
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryAllAddress.do',{
          userid:this.$route.query.userid
        },{emulateJSON:true}).then(function(data){
          for(var i=0;i<data.body.data.length;i++){
              if(data.body.data==""){
                this.addressDefault=true
              }else{
                if(data.body.data[i].address_default==1){
                  this.addressDefault=false
                  this.addressList=data.body.data[i]
                  this.addressid=data.body.data[i].id
                }
              }
          }
        },function(error){})
      }else{
        this.addressDefault=false
          this.addressList=this.$store.state.author
          this.addressid=this.$store.state.author.id
      }
    }
  }
}
</script>
<style>
@import 'css/style.css'
</style>
