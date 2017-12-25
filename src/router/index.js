import Vue from 'vue'
import Router from 'vue-router'
import ShoppingMall from '../components/ShoppingMall'
import Product_detail from '../components/Product_detail'
import detail from '../components/detail'
import Product_order from '../components/Product_order'
import MyorderList from '../components/MyorderList'
import Order_detail from '../components/Order_detail'
import Address from '../components/Address'
import New_Address from '../components/New_Address'
import evaluate from '../components/evaluate'
import Return_goods from '../components/Return_goods'
import Return_goods_wl from '../components/Return_goods_wl'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/ShoppingMall',
      component:ShoppingMall
    },
    {
      path: '/Return_goods',
      component: Return_goods
    },
    {
      path: '/Return_goods_wl',
      component: Return_goods_wl
    },
    {
      path: '/Address',
      component: Address
    },
    {
      path: '/evaluate',
      component: evaluate
    },
    {
      path: '/New_Address',
      component: New_Address
    },
    {
      path: '/Order_detail',
      component: Order_detail
    },
    {
      path: '/Product_detail',
      component: Product_detail
    },
    {
      path: '/Product_order',
      component: Product_order
    },
    {
      path: '/MyorderList',
      component: MyorderList
    },
    {
      path: '/detail',
      component: detail
    },
    {
      path:'*',
      redirect:'/ShoppingMall'
    }
  ]
})
