<template>
<div class="hello">
 
    <x-header style="background-color:white;">商品详情</x-header>
    <swiper loop auto  :list="demo06_list"  @on-index-change="demo06_onIndexChange"></swiper>
    <div class="product_text">{{detail.product_name}}</div>
    <div class="price_box">
      <ul class="price">
        <li>￥{{detail.price/100}}</li>
        <li>￥{{detail.price_old/100}}</li>
      </ul>
    </div>
    <div class="icon_Quality_box">
      <ul class="icon_Quality">
        <li><icon type="success-circle"></icon></li>
        <li>正品保证</li>
      </ul>
      <ul class="icon_Quality">
        <li><icon type="success-circle"></icon></li>
        <li>厂家发货&售后</li>
      </ul>
    </div>
    <div class="Specif" @click="show">  
      <div>选择商品规格</div>
      <div><img src="./images/gg.png"></div>
    </div>
    <div class="product_detail_box">
        <div class="product_detail_title">
          <div>商品详情</div>
        </div>
        <div class="product_detail_content">
          <div v-html="content"></div>
        </div><!--商品详情内容-->
        <div class="footer_box">
          <ul>
            <li class="kf">
              <dl>
                <dt><a :href="taobaoke_url"><img src="./images/kf.png" alt=""></a></dt>
                <dd><a :href="taobaoke_url">联系客服</a></dd>
              </dl>
            </li>
            <li class="phone">
              <dl>
                <dt><a :href="'tel:'+office_phone"><img src="./images/phone.png" alt=""></a></dt>
                <dd><a :href="'tel:'+office_phone">客服电话</a></dd>
              </dl>
            </li>
            <li  @click="show">立即购买</li>
          </ul>
        </div>
    </div>
     <!--商品属性弹出框-->
    <div v-transfer-dom>
      <popup v-model="show3" style="overflow:visible;font-weight:normal;padding-bottom:5rem">
        <div class="popup2">
            <div class="pro_pho_warp">
              <div class="pro_pho_box">
                  <div class="pro_pho"><img :src="detail.img"></div>
              </div>
              <ul class="pro_name">
                <li>￥{{detail.price/100}}</li>
                <li></li>
                <li>{{detail.product_name}}</li>
              </ul>
            </div>
            <div style="width:100%;overflow:hidden;">
              <div class="data_sty">
                <div v-for="item in guige">
                  <div class="pro_gg_tit">{{item.prop_name}}</div>
                  <div style="width:96%;margin:auto;padding:.5rem 2%;">
                    {{demo5}} 
                    <checker  type="radio" :radio-required='false' default-item-class="demo5-item" selected-item-class="demo5-item-selected">
                      <checker-item type="radio" v-for="(items,index) in item.arr" style="margin-top:.4rem" :key="items" :value="items" @on-item-click="onItemClick(item.arr,index)">{{items}}</checker-item>
                    </checker>
                  </div>
                </div>
                <group style="margin-top:-1.8rem;width:96%">
                    <x-number title="购买数量" :value="1" :min="1" @on-change="change" style="height:30px;width:98%;padding:1rem 2%;font-size:1.4rem;"></x-number>
                </group>
              </div>
            </div>
            <li  class="submit_buy" @click="buy">立即购买</li>
        </div>
      </popup>
    </div>
    <!--END-->
</div>
</template>
<script>
import { XHeader, TransferDom , Swiper , Box, Icon, Popup,  ChinaAddressData , Group, XNumber,  Divider , Checker, CheckerItem} from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Swiper,
      Box,
      Icon,
      XNumber,
      Group,
      Divider,
      Checker,
      CheckerItem
    },
    created(){
      this.$http.post(this.getHostUrl()+'/webapp/mallOrder/product_detail.do',{
              userid:this.$route.query.userid,
              id:this.$route.query.id
            },{emulateJSON:true}).then(function(data){
              this.detail=data.body.data
              data.body.data.img=data.body.data.img_url
              this.demo06_list.push(data.body.data)
              this.guige=data.body.data.guiGe
              this.office_phone=data.body.data.office_phone
              this.taobaoke_url=data.body.data.taobaoke_url
              this.content=data.body.data.content
              for(var i=0;i<data.body.data.guiGe.length;i++){
                data.body.data.guiGe[i].arr=data.body.data.guiGe[i].prop_value.split(",")
              }
            },function(error){})
            
    },
   methods: {
    demo06_onIndexChange (index) {
      this.demo06_index = index
    },
    show(){
      this.show3=true
    },
    buy(){
      this.productSpecification=''
      for(var i=0;i<this.aaArr.length;i++){
        this.productSpecification+=","+this.aaArr[i]
      }
      if(this.productSpecification.indexOf("undefined")>0||this.productSpecification.indexOf("undefined")<0){
        this.$vux.alert.show({
            title: '提示',
            content: '请选择规格'})
      }else{
        this.$router.push({path:'/Product_order',query:{userid:this.$route.query.userid,id:this.$route.query.id,productSpecification:this.productSpecification,Count:this.Count}})
      }
    },
    change (val) {
      this.Count=val
    },
    onItemClick(val,index){
       for(var i=0;i<this.guige.length;i++){
         this.guige[i].index=i
       }
       for(var j=0;j<this.guige.length;j++){
         if(this.guige[j].arr==val){
            if(this.aaArr[j]==undefined||this.aaArr[j]!=val[index]){
              this.aaArr[j]=val[index]
            }else{
              this.aaArr[j]=undefined
            }
         }
       }
       this.aaArr.length=this.guige.length
    }
  },
  data () {
    return {
      detail:{},
      show3:false,
      demo06_list: [],
      guige:[],
      aaArr:[],
      productSpecification:'',
      Specification:[],
      radio_r:false,
      demo5:'',
      content:'',
      Count:1,
      taobaoke_url:'',
      office_phone:''
    }
  }
}
</script>
<style>
a{
  color:#666;
  text-decoration: none
}
@import 'css/style.css'
</style>
