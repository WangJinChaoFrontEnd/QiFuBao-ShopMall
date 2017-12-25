<template>
  <div>
    <group>
      <x-switch :title="('Toggle')" v-model="show"></x-switch>
    </group>
   
    <div v-transfer-dom>
      <confirm v-model="show"
      :title="('Confirm deleting the item')"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide">
        <p style="text-align:center;">{{ ('Are you sure?') }}</p>
      </confirm>
    </div>
    <br>
    
    
    
    
    
  </div>
</template>



<script>
import { Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    Group,
    XSwitch,
    XButton
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    onCancel () {
      console.log('on cancel')
    },
    onConfirm (msg) {
      console.log('on confirm')
      if (msg) {
        alert(msg)
      }
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    }
  }
}
</script>