<template>
  <div class="themes">
    Change theme:
    <span :style="`color: ${$theme.primary}`">{{ $theme.name }}</span>
    <div class="select-theme">
      <div
        v-for="themeIndex in $themes.length"
        v-bind:key="themeIndex"
        :class="$themeIndex === themeIndex - 1 ? 'active' : ''"
        @click="changeTheme(themeIndex - 1)"
        :style="`border-color: ${
          $themeIndex === themeIndex - 1 ? $theme.primary : $theme.secondary
        }; color: ${
          $themeIndex === themeIndex - 1 ? $theme.primary : $theme.secondary
        }`"
      >
        {{ themeIndex }}
      </div>
    </div>
  </div>
</template>

<script src="./theme.js"></script>

<style scoped>
.themes {
  width: 100%;
}
.select-theme {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.select-theme > div {
  width: 25px;
  height: 25px;
  line-height: 25px;
  border: 5px solid #888888;
  color: #888888;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
}
.select-theme > div:hover {
  border: 5px solid #ffffff;
  color: #ffffff;
}
.select-theme > div.active {
  border: 5px solid #ce1729;
  color: #ce1729;
}
.themes > .cH {
  color: #ce1729;
}
</style>