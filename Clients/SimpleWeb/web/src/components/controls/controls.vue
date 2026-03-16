<template>
  <div class="controls">
    <button type="button">-</button>
    <button type="button" v-if="$platform == 'nodered'">-</button>

    <a :href="page == 'graph' ? '?page=meter' : '?page=graph'">{{ page == 'graph' ? 'Meter' : 'Graph' }}</a>

    <button type="button" @click="toggleTheme()" class="toggle-theme">
      {{ $theme.name }}
    </button>

    <button type="button" v-if="$platform != 'nodered'">Settings</button>
  </div>
</template>

<script src="./controls.js"></script>

<style scoped>
.controls {
  display: flex;
  flex-wrap: nowrap;
}
.controls a,
.controls button {
  min-height: 6vw;
  color: var(--control-text-color);
  font-family: inherit;
  font-size: 2vw;
  margin: 0 0 0 var(--default-spacing);
  cursor: pointer;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-basis: 0;
  flex-grow: 1;
  background: var(--control-background);
  border: 0;
  border-radius: 0.75vw;
}
.controls button:first-child {
  margin-left: 0;
}
.controls button:active {
  box-shadow: inset 0 0 10px black;
}
</style>