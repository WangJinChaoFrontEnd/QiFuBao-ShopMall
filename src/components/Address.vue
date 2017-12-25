<template>
<div class="hello">
    <x-header style="background-color:white;">收货列表</x-header>
    <div style="padding-bottom:8rem">
    <div v-for="item in addressList" style="margin-top:.5rem" @click="changeAddress(item)">
        <div class="order_address">
          <ul>
            <li>{{item.contact}}</li>
            <li>{{item.contact_mobile}}</li>
          </ul>
          <ul style="padding-bottom:.4rem">
            <li>{{item.address}}</li>
          </ul>
        </div>
        <!-- <div class="address_set">
            <ul class="address_default">
              <li><check-icon :value.sync="item.address_default"  type="plain"></check-icon></li>
              <li><span class="active_default_old" :class="item.address_default?'active_default':'active_default_old'">设为默认</span></li>
            </ul>
            <div class="set_button">
              <ul>
                <li>编辑</li>
              </ul>
              <ul>
                <li>删除</li>
              </ul>
            </div>
        </div> -->
    </div>
    </div>
    <router-link :to="{path:'/New_Address',query:{userid:this.$route.query.userid}}" class="address_footer">
      <span>+</span>&nbsp;
      新建收货地址
    </router-link>
</div>   
</template>
<script>
import myback from '../back'
import { XHeader, TransferDom , CheckIcon} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    CheckIcon
  },
  methods: {
    
  },
  data () {
    return {
      demo1: false,
      addressList:""
    }
  },
  created(){
    this.$http.post(this.getHostUrl()+'/webapp/mallOrder/queryAllAddress.do',{
      userid:this.$route.query.userid
    },{emulateJSON:true}).then(function(data){
      this.addressList=data.body.data
      for(var i=0;i<this.addressList.length;i++){
        if(this.addressList[i].address_default==0){
          this.addressList[i].address_default=false
        }else{
          this.addressList[i].address_default=true
        }
      }
    },function(error){})
  },
  methods:{
    changeAddress(all){
      this.$store.state.author=all
      this.$router.go(-1)
    }
  }
}
</script>
<style>

@import 'css/style.css'
</style>
