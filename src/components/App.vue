<template>
  <div>
    <span>{{title}}</span>
  </div>
</template>

<script>
  export default {
    data: () => ({
      title: 'Vue'
    })
  };
</script>

<!-- all other components should be `scoped` -->
<style lang='postcss'>
  @import '../index.css';
</style>
