<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view></router-view>
    </transition>
    <footer-bar></footer-bar>
  </section>
</template>

<script>
import { FooterBar } from './index'
export default {
  name: 'AppMain',
  components: {
    FooterBar
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
