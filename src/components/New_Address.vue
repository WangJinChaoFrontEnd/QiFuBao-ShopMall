<template>
  <div>
    <x-header style="background-color:white;">新建收货地址</x-header>
    <group title="">
      <x-input title="姓名" v-model="username" name="username" placeholder="请输入姓名" is-type="china-name"></x-input>
    </group>
    <group title="">
      <x-input title="手机号码" v-model="mobile"  name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
    </group>
    <group title="">
      <x-input title="邮编"  v-model="ZipCode" name="ZipCode" placeholder="6位邮政编码" :min="6" :max="6"></x-input>
    </group>
    <group>
      <x-textarea :max="200" v-model="address" name="description" :placeholder="('填写详细地址')"></x-textarea>
    </group>
    
    <div class="address_set" style="margin-top:2rem">
      <ul class="address_default">
        <li>&nbsp;&nbsp;&nbsp;&nbsp;<check-icon :value.sync="demo1"  type="plain"></check-icon></li>
        <li><span class="active_default_old" :class="demo1?'active_default':'active_default_old'">设为默认</span></li>
      </ul>
    </div>
    <div class="add_address_but">
      <button @click="submit">保存</button>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Cell, XHeader, TransferDom , CheckIcon , XAddress, ChinaAddressData , XTextarea} from 'vux'
export default {
  data () {
    return {
      username:'',
      address:'',
      mobile:'',
      ZipCode:'',
      demo1: false,
      addressData: ChinaAddressData
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    CheckIcon,
    XHeader, 
    XAddress,
    XTextarea,
    Cell
  },
  methods: {
    submit(){
      if(this.username==""||this.mobile==""||this.ZipCode==""||this.address==""){
        this.$vux.alert.show({
            title: '提示',
            content: '请输入详细信息'})
      }else{
        this.$http.post(this.getHostUrl()+'/webapp/mallOrder/insertAddress.do',{
            userid:this.$route.query.userid,
            address:this.address,
            contact:this.username,
            contact_mobile:this.mobile,
            postcode:this.ZipCode,
            address_default:this.demo1==true?1:0
          },{emulateJSON:true}).then(function(data){
            window.history.go(-1)
          },function(error){})
      }
    }
  }
}
</script>
<style scoped>

@import 'css/style.css'
</style>