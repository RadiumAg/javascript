<template>
  <div>{{ message }}</div>
</template>

<script>
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
