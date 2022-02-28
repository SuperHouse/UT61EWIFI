<template>
  <header class="header">
    <div>
        <a href="https://www.uni-trend.com/uploadfile/cloud/English%20manual/General%20Meters/UT61%20English%20Manual.pdf" target="_blank">
          <img :src="`data:image/png;base64,${$srcs.utlogo}`" alt="" />
        </a>
    </div>
    <div>
        <a href="https://www.superhouse.tv/" target="_blank">
          <img :src="`data:image/png;base64,${$srcs.shlogo}`" alt="" class="logo-superhouse" />
        </a>
    </div>
    <div>
        <a href="https://www.superhouse.tv/product/ut61e-multimeter-wifi-interface/" target="_blank">
          <img :src="`data:image/png;base64,${$srcs.uttext}`" alt="" />
        </a>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.header img {
  width: auto;
  height: 6vw;
}
.header img.logo-superhouse {
  height: 5vw;
}
.cls-1 {
  fill: #fff;
}
.cls-2 {
  font-size: 35px;
  font-family: Roboto-Bold, Roboto;
  font-weight: 700;
}
.cls-3 {
  letter-spacing: -0.03em;
}
</style>