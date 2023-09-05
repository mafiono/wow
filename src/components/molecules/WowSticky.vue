<template>
  <div class="sticky-nav">
    <div class="container">
      <div class="sticky-nav-flex">
        <router-link :to="{ name: 'Lobby' }" class="sticky-nav-item">
          <svg height="512pt" viewBox="0 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'icon'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M249.7 211h11.456l-5.726-11.453zm0 0M271 421h30v91h-30zm0 0M211 421h30v91h-30zm0 0M255.43 95.246c-23.48 18.707-58.86 43.293-58.86 63.18 0 11.222 7.532 22.574 21.93 22.574 2.71 0 10.973 0 18.223-10.867l18.84 10.926 18.601-10.84C281.414 181 289.633 181 292.344 181c14.398 0 21.93-11.352 21.93-22.574-.004-19.262-26.954-37.637-58.844-63.18zm0 0"/><path d="M421 166C421 75.02 346.98 0 256 0S91 75.02 91 166v45H0v301h181V391h150v121h181V211h-91zM91 421H61v-60h30zm0-90H61v-60h30zm60 90h-30v-60h30zm0-90h-30v-60h30zm180 30H181v-30h150zm0-60H181v-30h150zm-36.328-90.043L309.699 241H201.156l15.028-30.043c-28.008-1.187-49.614-23.836-49.614-52.531 0-37.797 38.93-61.149 79.395-94.07l9.465-7.676 9.46 7.675c40.59 33.02 79.383 56.457 79.383 94.07-.003 28.684-21.609 51.329-49.601 52.532zM391 421h-30v-60h30zm0-90h-30v-60h30zm60 90h-30v-60h30zm0-150v60h-30v-60zm0 0"/></svg>
          <p class="sticky-nav-item-label">Lobby</p>
        </router-link>
        <router-link v-if="sweep" :to="{ name: 'Jackpots' }" class="sticky-nav-item sticky-nav-item--jackpots">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'icon'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.352 2C11.84 2 8.637 3.16 6.743 4.109c-.171.085-.33.17-.48.25-.293.16-.544.31-.743.441l2.155 3.172 1.014.404c3.964 2 9.28 2 13.245 0l1.15-.597L25.124 4.8a12.06 12.06 0 00-1.315-.744C21.924 3.118 18.8 2 15.352 2zm-5.011 3.59a19.118 19.118 0 01-2.257-.566C9.858 4.236 12.503 3.4 15.352 3.4c1.973 0 3.839.401 5.382.91-1.808.255-3.738.686-5.577 1.218-1.447.418-3.138.373-4.816.063zm12.414 3.94l-.19.096c-4.362 2.2-10.146 2.2-14.507 0l-.18-.092C1.325 16.722-3.676 30 15.351 30c19.026 0 13.903-13.526 7.403-20.47zM14.543 16a1.556 1.556 0 100 3.111v-3.11zm1.556-1.556v-.777h-1.556v.777a3.111 3.111 0 100 6.223v3.112a1.556 1.556 0 01-1.467-1.037.778.778 0 00-1.467.518 3.112 3.112 0 002.934 2.074v.778H16.1v-.778a3.111 3.111 0 100-6.223v-3.11c.677 0 1.253.43 1.468 1.036a.777.777 0 101.466-.518 3.112 3.112 0 00-2.934-2.075zm0 6.223v3.112a1.555 1.555 0 100-3.112z" fill="#2B8ACF"/></svg>
          <p class="sticky-nav-item-label">Prize Drops</p>
        </router-link>
        <router-link :to="{ name: 'BuyCoins' }" class="sticky-nav-item sticky-nav-item--buy-coins">
          <svg height="512pt" viewBox="0 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'icon'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M136 512c74.441 0 135-61.559 135-136s-60.559-135-135-135S0 301.559 0 376s61.559 136 136 136zm0-121c-24.813 0-45-20.188-45-45 0-19.531 12.578-36.023 30-42.238V271h30v32.762c17.422 6.215 30 22.707 30 42.238h-30c0-8.277-6.723-15-15-15s-15 6.723-15 15 6.723 15 15 15c24.813 0 45 20.188 45 45 0 19.531-12.578 36.023-30 42.238V482h-30v-33.762c-17.422-6.215-30-22.707-30-42.238h30c0 8.277 6.723 15 15 15s15-6.723 15-15-6.723-15-15-15zm0 0M241 136c0 22.102 5.844 42.672 15.3 61.105l49.31-36.097c-2.805-7.86-4.61-16.196-4.61-25.008s1.805-17.148 4.61-25.008L256.3 74.895C246.845 93.328 241 113.898 241 136zm0 0M331 136c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm0 0M391 0v62.52c15.7 3.199 29.46 11.46 39.941 22.816l48.254-35.324C457.473 23.984 426.425 3.984 391 0zm0 0M446.39 110.992c2.805 7.86 4.61 16.195 4.61 25.008s-1.805 17.148-4.61 25.008l49.31 36.097C505.155 178.672 512 158.102 512 136s-6.844-42.672-16.3-61.105zm0 0M391 269.484c35.426-3.984 66.473-21.468 88.195-47.496l-48.254-35.324C420.461 198.02 406.7 206.281 391 209.48zm0 0M361 209.48c-15.7-3.199-29.46-11.46-39.941-22.816l-48.254 35.324c21.722 26.028 52.77 43.512 88.195 47.496zm0 0M321.059 85.336C331.539 73.98 345.3 65.719 361 62.52V0c-35.426 3.984-66.473 23.984-88.195 50.012zm0 0M406 376h-15v-30l-90 60 90 60v-30h15c57.988 0 106-47.012 106-105v-30h-31c0 41.422-33.578 75-75 75zm0 0M106 136h15v30l90-60-90-60v30h-15C48.012 76 0 123.012 0 181v30h30c0-41.422 34.578-75 76-75zm0 0"/></svg>
          <p class="sticky-nav-item-label">Buy Coins</p>
        </router-link>
        <router-link v-if="sweep" :to="{ name: 'Lobby', query: { category : 'classic-slots' } }" class="sticky-nav-item">
          <svg height="512pt" viewBox="-16 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'icon'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M120 150c22.91 0 43.09-6.254 59.754-14.234-16.918 31.832-27.055 68.68-29.066 106.68C83.043 249.706 30 306.456 30 376c0 74.441 60.559 136 135 136 22.934 0 44.902-6.46 64.605-17.27C199.04 464.766 180 422.086 180 376s19.04-87.766 49.605-117.73c-15.171-8.325-31.703-13.985-48.964-16.184 6.523-106.023 86.593-193.477 189.832-209.434C344.18 69.566 330 113.613 330 159.86v82.657C262.684 250.09 210 306.69 210 376c0 74.441 60.559 136 135 136s135-61.559 135-136c0-69.309-52.684-125.91-120-133.484v-82.657c0-50.714 19.746-98.394 55.605-134.254L441.211 0H405c-70.453 0-134.305 28.73-180.504 75.074C212.367 63.43 173.476 30 120 30 56.719 30 13.418 77.152 11.324 79.16L0 90l11.324 10.84C13.418 102.848 56.72 150 120 150zm225 181c-24.813 0-45 20.188-45 45h-30c0-41.352 33.648-75 75-75zm-180 0c-24.813 0-45 20.188-45 45H90c0-41.352 33.648-75 75-75zm0 0"/></svg>
          <p class="sticky-nav-item-label">Slots</p>
        </router-link>
        <router-link :to="{ name: 'Lobby', query: { search : '' } }" class="sticky-nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'icon'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><g id="search_svg__Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="search_svg__Icon-/-Search" fill="#fff" fill-rule="nonzero"><path d="M12 0a8 8 0 11-4.905 14.32l-5.388 5.387a1 1 0 01-1.497-1.32l.083-.094 5.386-5.388A8 8 0 0112 0zm0 2a6 6 0 100 12 6 6 0 000-12z" id="search_svg__Search"/></g></g></svg>
          <p class="sticky-nav-item-label">Search</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    sweep() {
      return this.$store.getters.sweep;
    },
  },
};
</script>

<style lang="scss">
@media (max-width: 767px) {
  div#app.loggedin {
    padding-bottom: 40px;
  }
}
.sticky-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  transition: .1s padding-bottom ease-in-out;
  padding-bottom: calc(env(safe-area-inset-bottom, 0) / 2);
  background: $black;
  border-top: 2px solid rgb(223 223 223 / 20%);
  z-index: 9;
  @media (min-width: 768px) {
    display: none !important;
  }
  .container {
    padding: 0;
  }
}
.sticky-nav-flex {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.sticky-nav-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  position: relative;
  text-decoration: none;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 60%;
    background: rgb(223 223 223 / 20%);
    right: 0;
    top: 20%;
  }
  .icon {
    width: 22px;
    height: 22px;
    margin-bottom: 2px;
    fill: #0089e9;
    g#search_svg__Icon-\/-Search {
      fill: #0089e9;
    }
  }
  .sticky-nav-item-label {
    font-size: 8px;
    text-transform: uppercase;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
  }
}
.page-play .sticky-nav {
  display: none !important;
}
.page-play div#app {
  padding-bottom: 0 !important;
}
.sticky-nav-item--buy-coins {
  background: linear-gradient(180deg, #FFC758, #FF834D);
  transform: scale(1.1);
  transform-origin: bottom;
  border: 1px solid #ffa100;
  box-shadow: 0px -2px 11px #ffc457bd;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  margin-left: 5px;
  .sticky-nav-item-label {
    font-size: 9px;
  }
  // margin-right: 5px;
}
.sticky-nav-item--jackpots:after {
  display: none;
}
.sticky-nav-item.sticky-nav-item--buy-coins svg.icon {
  fill: #fff;
}
.sticky-nav-item.sticky-nav-item--buy-coins:after {
  display: none;
}
.sticky-nav-item--buy-coins p.sticky-nav-item-label {
  font-weight: 800;
}
a.sticky-nav-item.router-link-exact-active:not(.sticky-nav-item--buy-coins) {
  p {
    color: #ffbb56;
    font-weight: 800;
  }
  svg {
    fill: #ffbb56;
  }
  path {
    fill: #ffbb56;
  }
}
</style>
