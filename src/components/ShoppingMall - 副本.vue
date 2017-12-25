<template>
  <div class="hello">
  <loading v-model="showLoading" :text="loadText" position="fixed" style="z-index: 100"></loading>
      <toast v-model="showPositionValue" type="text" :time="800" is-show-mask text="暂无更多数据" :position="position">{{ ('Basic Usage') }}</toast>
      <!--以下是分类导航-->
     <transition name="slide-fade">
      <div class="classification_box" v-show="subitemsExpanded" >
        <dl>
                <dd @click="fication(0)">全部</dd>
          </dl>
          <dl v-for="tit in titles">
                <dt>{{tit.kind_name}}</dt>
                <dd  v-for="tithild in tit.data" @click="fication(tithild.id)">{{tithild.kind_name}}{{tithild.id}}</dd>
          </dl>
      </div>
      </transition>
      <div class="menu_fl"  v-on:click="subitemsExpanded=!subitemsExpanded">
        <div class="menu_fl_text">分类</div>
      </div>
      <!--以下是商品-->
      <v-loadmore v-if="shop_show"  :bottom-method="loadBottom" :bottom-all-loaded="allUseLoad" :bottomPullText="bottomText" ref="loadmore">
      <div class="box2">
      <div class="content_product_warp" v-on:click="subitemsExpanded=false">
          <ul class="content_product_box" v-for="item in list" key="" @click="locat(item.id)">
            <li class="project_img"><img :src="item.img_url"></li>
            <li class="project_text">{{item.product_name}}</li>
            <li class="project_price">
                <span>￥{{item.price/100}}&nbsp;<a style="color:green;font-size:10px;">会员:￥{{item.price_members/100}}</a></span>
                <span>●●●</span>
            </li>
          </ul>

      </div>
          <!-- <divider v-if="show">我是有底线的</divider>
          <load-more tip="loading" class='scrol' v-if="none"></load-more>
          <div v-if="sp" class="sp_text">暂无商品</div> -->
      </div>



    </v-loadmore>
    <div v-if="sp" class="sp_text">暂无商品</div>
  </div>
</template>

<script>
import {Loadmore} from 'mint-ui';
import { Toast, Scroller, Divider, Spinner, XButton, Group, Cell, LoadMore , Loading} from 'vux'
import { Alert, XSwitch,  TransferDomDirective as TransferDom } from 'vux'
import help from '../help'
export default {
  name:'app',
  components:{
    Scroller,
    Divider,
    Spinner,
    XButton,
    Group,
    Loading,
    Cell,
    Toast,
    'v-loadmore':Loadmore ,
    LoadMore
  },
 data () {
  return {
   list:[],
   titles:[],
   userid:this.$route.query.userid,
   subitemsExpanded: false,
   showList1: true,
    onFetching: false,
      scrollTop: 0,
      ProLen:'',
      sp:false,
      touch:0,
      Alert,
      kidd:0,
      Fleng:0,
      shop_show:true,
      showLoading: false,
      showErrDialog:false,
      errDialogText:'',
      loadText: 'Loading',
      bottomText: '上拉加载更多...',
        allUseLoad:false,
      none:false,
      show:true,
      pageNum:1,
      position: 'default',
      showPositionValue: false,
      mounted_Pro:0,
      Url:'/include/webapp/mall/product_detail.jsp?'
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
    mounted:function(){//首页加载.
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
            this.$http.post(this.getHostUrl()+'/webapp/mallForOrder/queryMallProduct.do',
              {userid:this.$route.query.userid,kindid:0,partnersid:0,productname:"",producttype:-1,start:1,membersflag:0,luckyflag:0},
              {emulateJSON:true}).then(function(data){
                this.mounted_Pro=data.body.data.length;
                console.log(data)
                if(this.mounted_Pro==0){
                  this.none_pro=false
                  this.sp=true
                  this.shop_show=false
                }else{
                  this.shop_show=true
                  this.list=data.body.data
                }
              }),
      //分类
      this.$http.post(this.getHostUrl()+'/webapp/mallForOrder/queryMallKind.do').then(function(data){
            this.titles=data.body.data
    },function(error){
        this.$vux.alert.show({
                                      title: '提示',
                                      content: '加载错误！'
                                    })
    })
  },

   methods:{
    showPosition (position) {
      this.position = position
      this.showPositionValue = true
    },
    showPluginAuto () {
      this.showPlugin()
      setTimeout(() => {
        this.$vux.alert.hide()
      }, 3000)
    },
    locat:function (id) {
      window.location.href=this.getShopUrl()+this.Url+'id='+id+'&userid='+this.$route.query.userid+'&srctype=app&integral=0'
    },
    fication:function (Kid) {//分类
      /*window.location.href=this.shopUrl+'kindid='+Kid+'&userid='+this.$route.query.userid+'&partnersid=0'+'&productname='+'producttype=-1'+'&srctype=app'*/
      this.kidd=Kid
      this.pageNum=1;
      this.$http.post(this.getHostUrl()+'/webapp/mallForOrder/queryMallProduct.do',
      {userid:this.$route.query.userid,kindid:this.kidd,partnersid:0,productname:"",producttype:-1,start:this.pageNum,membersflag:0,luckyflag:0},
      {emulateJSON:true}).then(function(data){
        this.Fleng=data.body.data.length;
        this.allUseLoad=false;
        this.bottomText="上拉加载更多";
        if(this.Fleng==0){
          this.sp=true
          this.shop_show=false
          this.subitemsExpanded=false
        }else{
          this.list=data.body.data
          this.sp=false
          this.shop_show=true
          this.subitemsExpanded=false
        }
        /*this.subitemsExpanded=false*/
      })

    },
  loadBottom() {//下拉事件
      ++this.pageNum;
      this.$http.post
            (this.getHostUrl()+'/webapp/mallForOrder/queryMallProduct.do',
              {userid:this.$route.query.userid,kindid:this.kidd,partnersid:0,productname:"",producttype:-1,start:this.pageNum,membersflag:0,luckyflag:0},
              {emulateJSON:true}).then(function(data){
//加载方法
            if(this.pageNum>1&&data.body.data.length<1){
                this.showPosition('bottom')
                this.allUseLoad=true
                this.bottomText=""
                this.$refs.loadmore.onBottomLoaded();
            }else{
                setTimeout(() => {
              var list2=data.body.data
              for(var i=0;i<list2.length;i++){
                               this.list.push(list2[i])
                        }
                        this.$refs.loadmore.onBottomLoaded();
            }, 2000)
            }

// 加载方法结束
            },function(error){
                this.$vux.alert.show({
                                      title: '提示',
                                      content: '加载错误！'
                                    })
            })
                          /*}*/



    }
 }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*初始化以及淘宝首页*/
.scrol{
  height: 3rem
}
.vux-divider{
  font-size: .8rem;
}
.weui-loadmore{
  margin-top: -1rem
}
body,html{
  font-size: 62.5%;
}
.hello{
  overflow: hidden;
  position: relative;
}
.classification_box{
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 50%;
  background-color: white;
  color: #999;
  z-index: 1;
  overflow:auto;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter,.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.project_adress{
  overflow: hidden;
  width: 96%;
  padding: 0 2%;
  height: 2.2rem;
  line-height: 2.2rem;
  margin-top: .4rem
}
.project_price{
  width: 96%;
  padding: 0 2%;
  overflow: hidden;
  height: 2rem;
  line-height: 2rem;
  margin-top: .4rem
}
.project_price span{

  float: left;
}
.project_price span:last-child{
  float: right;
  width: 15%;
  text-align: right;
  color: #999;
  font-size: .4rem
}
.project_price span:first-child{
  width: 85%;
  color: #ff5306;
  font-size: 10px
}

.project_adress span{
  display: block;
}
.project_adress span:nth-child(1){
  float: left;
  width: 2.2rem;
  height: 1.2rem;
  border-radius: .2rem;
  border:solid .05rem #ffb30f;
  color: #ffb30f;
  text-align: center;
  line-height: 1.2rem;
  margin-top: .4rem
}
.project_adress span:nth-child(2){
  float: right;

  color: #999
}
ul {
  list-style-type: none;
  padding: 0;
  margin:0
}

li {
  display: inline-block;
}
.active{
  color: #43bd6f
}
body{
  padding: 0;
  margin:0;
}
.content_product_box{
  width: 48%;
  margin:0 1%;
  font-size: .8rem;
  text-align: left;
  background-color: white;
  float: left;
  margin-bottom: .4rem
}
.content_product_warp{
  width: 100%;
  padding:1% 0;
  background-color: #efeef4;
  overflow: hidden;
}


.content_product_warp .project_img img{
  width: 100%;
  height: 14rem
}
.project_img{
  width: 100%
}
@media (max-width: 1920px){
.content_product_warp .project_img img{
  width: 100%;
  height: 22rem
}
}
@media (max-width: 768px){
.content_product_warp .project_img img{
  width: 100%;
  height: 18rem
}
}
@media (max-width: 414px){
.content_product_warp .project_img img{
  width: 100%;
  height: 10.2rem
}
}
@media (max-width: 330px){
.content_product_warp .project_img img{
  width: 100%;
  height: 10.5rem
}
}
.project_text{
  height: 37px;
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
width: 96%;
  padding: 0 2%;
  margin-top: .5rem
}
.menu_fl{
  width: 2.5rem;
  height: 2.5rem;
  /*background-color: #43bd6f;*/
  border-radius: 10rem;
  color: white;
  text-align: center;
  font-size: .5rem;
  position: fixed;
  top: 55%;
  left: 0;
  z-index: 2;
  /*background-image: url(images/ic_launcher.png);*/
  background-size: 100%
}
.menu_fl_text{
  width: 2.5rem;
  height:1.2rem;
  border-radius: 200px;
  background-color: #43bd6f;
  margin: auto;
  position: absolute;
  bottom: -20px;
  line-height: 1.2rem;
}
.classification_box dl{
  font-size: .9rem;
  overflow: hidden;
}
dl,dd,dt{
  padding: 0;
  margin:0;
}
.classification_box dt{
  width: 96%;
  height: 2rem;
  background-color: #f0f0f0;
  color: #666;
  line-height: 2rem;
  text-align: left;
  padding-left: 4%
}
.classification_box dd{
  width: 45%;
  height: 1.8rem;
  border:solid 1px #e6e6e6;
  line-height: 1.8rem;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 4px;
  float: left;
  margin:5px 0 5px 5px;
}

</style>
