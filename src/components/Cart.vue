<template>
  <div class="page-cart">
    <div class="title">总价 0</div>
    <div class="list">
      <div v-for="product in cartProducts" class="product">
        <h3 class="code">商品编号: {{product.code}}</h3>
        <div class="actions">
          <button>-</button>
          <span>数量 {{product.amount}}</span>
          <button>+</button>
        </div>
      </div>
    </div>
    <div class="bottom-action">
      <button class="btn" @click="toggleCart">添加商品</button>
    </div>
    <div :class="['popup', {'active' : shouldShowCart}]">
      <div class="backdrop" @click="toggleCart"></div>
      <form class="popup-content">
        <h3>添加商品</h3>
        <input type="text" autofocus placeholder="请输入商品编号">
        <button class="btn" type="submit">确定</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data: function () {
    return {
      shouldShowCart: false,
      cartProducts: [
        {
          code: 'KD100013',
          amount: 1,
        },
      ],
    }
  },
  methods: {
    toggleCart: function () {
    },
  },
}
</script>

<style scoped>

</style>
