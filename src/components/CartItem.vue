<template>
  <div>
    <h3 class="code">商品编号: {{product.code}}</h3>
    <div class="actions">
      <button>-</button>
      <span>数量 {{product.amount}}</span>
      <button @click="() => $store.dispatch('increment')">+</button>
    </div>
    <div>{{ $store.state.count }}</div>
  </div>
</template>
<script>
export default {
  name: 'CartItem',
  props: {
    product: {},
  },
}
</script>
