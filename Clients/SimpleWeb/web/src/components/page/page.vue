<template>
  <div class="pages">
    Change page:
    <span :style="`color: ${$theme.primary}`">{{ $page.name }}</span>
    <div class="select-page">
      <div
        v-for="pageIndex in $pages.length"
        v-bind:key="pageIndex"
        :class="$pageIndex === pageIndex - 1 ? 'active' : ''"
        @click="changePage(pageIndex - 1)"
        :style="`border-color: ${
          $pageIndex === pageIndex - 1 ? $theme.primary : $theme.secondary
        }; color: ${
          $pageIndex === pageIndex - 1 ? $theme.primary : $theme.secondary
        }`"
      >
        {{ $pages[pageIndex-1].name }}
      </div>
    </div>
  </div>
</template>

<script src="./page.js"></script>

<style scoped>
.pages {
  width: 100%;
}
.select-page {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.select-page > div {
  height: 25px;
  line-height: 25px;
  padding: 5px;
  border: 5px solid #888888;
  color: #888888;
  border-radius: 15px;
  margin: 10px;
  cursor: pointer;
}
.select-page > div:hover {
  border: 5px solid #ffffff;
  color: #ffffff;
}
.select-page > div.active {
  border: 5px solid #ce1729;
  color: #ce1729;
}
.pages > .cH {
  color: #ce1729;
}
</style>