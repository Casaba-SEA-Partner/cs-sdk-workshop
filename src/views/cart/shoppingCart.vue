<template>
  <cafe-responsive>
    <cp-cartDetail v-show="!isEmpty" @empty="emptyFn" />
    <div v-show="isEmpty">empty cart</div>
  </cafe-responsive>
</template>
<script>
import cpCartDetail from '@/views/cart/cp-cartDetail.vue'

export default {
  name: 'ShoppingCart',
  title() {
    return 'Kidz 购物车'
  },
  components: {
    cpCartDetail,
  },
  data() {
    return {
      isEmpty: false, // 如果购物车是空的 就展示 空的组件
    }
  },
  computed: {},
  mounted() {},
  methods: {
    emptyFn(bool) {
      this.isEmpty = bool
    },
  },
}
</script>
