<template>
<div class="box2">
  <toast v-model="showPositionValue" type="text" :time="800" width="15rem" is-show-mask text="暂无更多数据" :position="position">{{ ('Basic Usage') }}</toast>
  <loadmore style="font-size:14px"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoF"  :bottomPullText="bottomText">
          <ul class="header">
              <li @click="fenl"><img src="./images/classification.png" alt=""></li>
              <li><input type="text" placeholder="请输入需要搜索的内容" v-model="productname"><icon type="search"></icon></li>
              <li @click="serch"><img src="./images/right.png"></li>
          </ul>
          <div v-if="product_list.length>0" class="content_product_warp">
              <ul class="content_product_box" v-for="item in product_list" @click="product_detail(item)">
                <li class="project_img"><img :src="item.img_url"></li>
                <li class="project_text">{{item.product_name}}</li>
                <li class="project_price">
                    <span>￥{{item.price/100}}</span>
                    <span>{{item.price_old/100}}</span>
                </li>
              </ul>
          </div>
          <!--为空时-->
          <div class="content_product_warp_null" v-if="product_list==''" style="width:100%;text-align:center;line-height:10rem">
              <div>暂无商品</div>
          </div>
          </loadmore>
          <div v-transfer-dom>
            <popup v-model="show1" height="100%">
              <div class="fl_box">
                <div class="close_fl" @click="All">全部</div>
                <div class="fl_menu">
                  <ul class="menu_fl">
                    <li v-model="index" v-for="(item,index) in classification" key="" @click="isactive=index" :class="{fl_active:index==isactive}">{{item.kind_name}}</li>
                  </ul>
                </div>
                <div class="fl_content">
                  <swiper v-model="isactive"  :show-dots="false" height="800px">
                    <swiper-item v-for="(item, index) in classification" :key="index">
                      <div class="tab-swiper vux-center">
                        <div class="fe_detail">
                          <ul  v-for="itemC in item.data" @click="pro_chang(itemC)">
                            <li><img :src="itemC.kind_img" alt=""></li>
                            <li>{{itemC.kind_name}}</li>
                          </ul>
                        </div>
                      </div>
                    </swiper-item>
                  </swiper>
                </div>
              </div>
            </popup>
          </div>
      </div>
</template>
<script>
import { Loadmore } from 'mint-ui';
import { Box, Icon , TransferDom, Popup, Group,XSwitch, Swiper, SwiperItem , Toast ,AlertPlugin} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Box,
    Icon,
    Popup,
    Group,
    XSwitch,
    Swiper,
    Toast,
    SwiperItem,
    AlertPlugin,
    Loadmore
  },
  data () {
    return {
      show1: false,
      isactive:0,
      autoF:false,
      productname:'',
      product_list:[],
      product_list2:[],
      allLoaded:false,
      position: 'default',
      kindid:0,
      showPositionValue:false,
      classification:[],
      bottomText:'上拉加载更多',
      PageNum:1,
    }
    },
    created(){
      if(this.$route.query.userid==null||this.$route.query.userid.length<1){
          this.$vux.alert.show({
            title: '提示',
            content: '请求参数错误',
            onShow () {
            },
            onHide () {
            }
          });
          return;
        }
          this.Obtain()
        },
    methods:{
        Obtain(){
            this.PageNum=1
            this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryMallProduct.do',{
            userid:this.$route.query.userid,
            start:this.PageNum,
            kindid:this.kindid,
            product_type:-1,
            partnersid:0,
            productname:this.productname,
          },{emulateJSON:true}).then(function(data){
            this.product_list=[]
            this.product_list=data.body.data
            console.log(this.product_list)
          },function(error){})
        },
        showPosition (position) {
            this.position = position
            this.showPositionValue = true
          },
        loadBottom() {
          ++this.PageNum
          this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryMallProduct.do',{
            userid:this.$route.query.userid,
            start:this.PageNum,
            kindid:this.kindid,
            product_type:-1,
            partnersid:0,
            productname:this.productname,
          },{emulateJSON:true}).then(function(data){
            if(data.body.data.length<1){
              this.showPosition('bottom')
              this.showPositionValue=true
              this.bottomText=""
              this.allLoaded = true;
              this.$refs.loadmore.onBottomLoaded();
            }else{
              setTimeout(() => {
                this.product_list2=data.body.data
                for(var i=0;i<data.body.data.length;i++){
                  this.product_list.push(this.product_list2[i])
                }
                this.$refs.loadmore.onBottomLoaded();
              }, 2000);
            }
          },function(error){})
        },
        fenl(){
          this.show1=true
          this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryMallKind.do',{
            userid:this.$route.query.userid
          },{emulateJSON:true}).then(function(data){
            this.classification=data.body.data
          },function(error){})
        },
        pro_chang(all){
          this.kindid=all.id
          this.Obtain()
          this.show1=false
          this.allLoaded = false
        },
        All(){
          this.kindid=0
          this.Obtain()
          this.show1=false
          this.allLoaded = false
        },
        serch(){
          if(this.productname==''){
            this.$vux.alert.show({
            title: '提示',
            content: '请输入搜索内容 '})
          }else{
            this.Obtain()
            this.allLoaded = false
          }
        },
        product_detail(item){
          this.$router.push({path:'/Product_detail',query:{userid:this.$route.query.userid,id:item.id}})
        }
    }
}
</script>
<style>
 /* .router-link-active {
  background-color: #eee;
  color: #c10000
} */
@import 'css/style.css'
</style>
