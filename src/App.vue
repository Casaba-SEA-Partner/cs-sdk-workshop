<template>
  <div id="app">
    <sea-header title="Casaba SEA"/>
    <cart />
  </div>
</template>

<script>
import Cart from './components/Cart.vue'
import SeaHeader from './components/SeaHeader'

export default {
  name: 'app',
  components: {
    SeaHeader,
    Cart
  }
}
</script>

<style>
@import "style/cart/base.css";
@import "style/cart/cart.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
