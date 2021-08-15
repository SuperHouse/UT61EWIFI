<template>
  <div id="container" class="lcd">
    <header class="header">
      <a
        href="https://www.uni-trend.com/uploadfile/cloud/English%20manual/General%20Meters/UT61%20English%20Manual.pdf"
        target="_blank"
      >
        <img
          :src="`data:image/png;base64,${utlogo}`"
          alt=""
          class="header__unit"
        />
      </a>
      <a
        href="https://www.superhouse.tv/product/ut61e-multimeter-wifi-interface/"
        target="_blank"
      >
        <img
          :src="`data:image/png;base64,${uttext}`"
          alt=""
          class="header__ut16e"
        />
      </a>
    </header>
    <div
      :class="`Meter-Wrapper ${
        (isBooted && !isConnected) || (mode === 'continuity' && value === 0)
          ? 'c-level'
          : ''
      }`"
    >
      <div class="Meter-Wrapper__inner">
        <div class="Meter-Top-Bar monospace">
          <div :class="`Meter-Top-Bar__left ${isConnected ? '' : 'hide-item'}`">
            {{ currentType }}
          </div>
          <div
            class="Meter-Top-Bar__centre"
            :class="isConnected ? '' : 'hide-item'"
          >
            <svg
              :class="onHold ? 'full-item' : ''"
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M94 15H6V85H94V15ZM32 27H18V73H32V53L68 53V73H82V27H68V47L32 47V27Z"
                :fill="onHold ? '#ce1729' : 'black'"
              />
            </svg>
            <svg
              :class="mode === 'diode' ? 'full-item' : ''"
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="46.9459"
                width="83"
                height="5.10811"
                :fill="mode === 'diode' ? 'white' : 'black'"
              />
              <rect
                x="70.6735"
                y="22.2568"
                width="53.6351"
                height="5.08163"
                transform="rotate(90 70.6735 22.2568)"
                :fill="mode === 'diode' ? 'white' : 'black'"
              />
              <path
                d="M74.9082 49.5L27.9031 76.7798L27.9031 22.2202L74.9082 49.5Z"
                :fill="mode === 'diode' ? 'white' : 'black'"
              />
            </svg>
            <svg
              :class="mode === 'continuity' ? 'full-item' : ''"
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.188 50.5C67.188 60.9059 63.2075 70.6144 55.9819 77.84L60.1419 82C68.4795 73.6653 73.072 62.4769 73.072 50.5C73.0691 38.5231 68.4795 27.3347 60.1419 19L55.9819 23.16C63.2075 30.3855 67.188 40.0941 67.188 50.5ZM42.7488 67.1841C51.7925 58.1404 51.7925 42.8596 42.7488 33.8159L38.5888 37.9759C45.376 44.7631 45.376 56.2369 38.5888 63.0241L42.7488 67.1841Z"
                :fill="mode === 'continuity' ? 'white' : 'black'"
              />
              <path
                d="M26 50.5C26 53.7496 28.6344 56.384 31.884 56.384C35.1336 56.384 37.768 53.7496 37.768 50.5C37.768 47.2504 35.1336 44.616 31.884 44.616C28.6344 44.616 26 47.2504 26 50.5Z"
                :fill="mode === 'continuity' ? 'white' : 'black'"
              />
              <path
                d="M51.616 75.3217C65.0727 61.8708 65.0727 39.1321 51.616 25.6813L47.456 29.8413C58.6562 41.0415 58.6562 59.9615 47.456 71.1617L51.616 75.3217Z"
                :fill="mode === 'continuity' ? 'white' : 'black'"
              />
            </svg>
          </div>
          <div
            :class="`Meter-Top-Bar__right ${isConnected ? '' : 'hide-item'}`"
          >
            {{ displayUnit }}
          </div>
        </div>
        <div class="Meter-Value D7MBI">
          <span>{{ displayString }}</span>
        </div>
        <div :class="`Meter-Range monospace ${isConnected ? '' : 'hide-item'}`">
          {{ range == "manual" ? "MANU" : range }}
        </div>
        <svg
          id="low-battery"
          :class="lowBattery ? 'full-item' : ''"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="13"
            y="30"
            width="74"
            height="2"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="14"
            y="74"
            width="73"
            height="2"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="14"
            y="30"
            width="46"
            height="2"
            transform="rotate(90 14 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="89"
            y="30"
            width="46"
            height="2"
            transform="rotate(90 89 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="24"
            y="24"
            width="15"
            height="1"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="24"
            y="25"
            width="15"
            height="1"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="24"
            y="30"
            width="5"
            height="1.25"
            transform="rotate(-90 24 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="25"
            y="30"
            width="5"
            height="1.25"
            transform="rotate(-90 25 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="37.75"
            y="30"
            width="5"
            height="1.25"
            transform="rotate(-90 37.75 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="37"
            y="30"
            width="5"
            height="1.25"
            transform="rotate(-90 37 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="67"
            y="24"
            width="11"
            height="1"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="68"
            y="25"
            width="9"
            height="1"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="67"
            y="30"
            width="5"
            height="1"
            transform="rotate(-90 67 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="68"
            y="30"
            width="5"
            height="1"
            transform="rotate(-90 68 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="77"
            y="30"
            width="5"
            height="1"
            transform="rotate(-90 77 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="76"
            y="30"
            width="5"
            height="1"
            transform="rotate(-90 76 30)"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <path
            d="M76 32V74H36L76 32Z"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
          <rect
            x="76"
            y="32"
            width="11"
            height="42"
            :fill="lowBattery ? '#ce1729' : 'black'"
          />
        </svg>
        <a href="https://www.superhouse.tv/" target="_blank">
          <img
            class="logo-superhouse"
            :src="`data:image/png;base64,${logo}`"
            alt=""
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script src="./lcd.js"></script>

<style scoped src="./fonts.css"></style>
<style scoped src="./lcd.css"></style>