<template>
  <div class="header">
    <img alt="Vue logo" src="../assets/casaba_logo.png">
    <h3>{{ title }}</h3>
  </div>
</template>
<script>
export default {
  name: 'SeaHeader',
  props: ['title']
}
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
}
img {
  width: 40px;
  height: 40px;
  margin: 6px 20px;
}
</style>
