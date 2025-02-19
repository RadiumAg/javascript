<template>
  <div>{{ message }}</div>
</template>

<script>
import Home from './Home.vue'

export default {
  data() {
    console.log('data')
    return {
      message: 'Hello Vue!',
    };
  },
};
</script>

<style lang="css" scoped></style>
