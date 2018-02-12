<template>
  <div class="TvT">
    <template>
      <Breadcrumb>
        <BreadcrumbItem v-for="item in sCrumbs" :to="item.url">{{item.value}}</BreadcrumbItem>
      </Breadcrumb>
    </template>
  </div>
</template>
<script>
export default {
  name: 'crumbs',
  props: {
    sCrumbs: Array
  },
  data: function data () {
    return {

    }
  }
}
</script>
<style>
</style>
