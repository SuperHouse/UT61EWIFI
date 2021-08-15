<template>
  <lcd />
</template>

<script>
import lcd from './components/lcd.vue'

export default {
  name: 'App',
  components: {
    lcd
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
