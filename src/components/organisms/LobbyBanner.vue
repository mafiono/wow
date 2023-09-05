<template>
  <div class="banner-lobby-c">
    <router-link v-if="lobbyBanners.length === 1" :to="destination(lobbyBanners[0])" class="banner-lobby-single" :class="lobbyBanners[0].customClass">
      <img :src="lobbyBanners[0].desktop_image" alt="" class="banner-lobby-desktop" />
      <img :src="lobbyBanners[0].mobile_image_new" alt="" class="banner-lobby-mobile" />
    </router-link>
    <section v-else class="splide" aria-label="Lobby Banners">
      <div class="splide__track">
        <ul class="splide__list">
          <li v-for="(banner, index) in lobbyBanners" :key="`banner-${index}`" class="splide__slide">
            <router-link :to="destination(banner)" :class="{ disabled: !banner.destination }">
              <img :src="banner.desktop_image" alt="" class="banner-lobby-desktop" />
              <img :src="banner.mobile_image_new" alt="" class="banner-lobby-mobile" />
            </router-link>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Splide from '@splidejs/splide';

export default {
  data() {
    return {
      bannerNo: 0,
    };
  },
  components: {
    //
  },
  computed: {
    ...mapGetters([
      'playerData',
      'lobbyBanner',
      'jackpotsLobbyBanner',
      'ftpNotLobbyBanner',
      'sweep',
    ]),
    lobbyBanners() {
      if (this.playerData && this.sweep && !this.playerData.madeDeposit && (this.$route.query.category || this.$route.name === 'Jackpots')) {
        return this.jackpotsLobbyBanner;
        // return [
        //   {
        //     desktop_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-welcome-offer-590x280-desktop.png',
        //     desktop_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-lobby-welcome-offer-desktop-ftp.jpg',
        //     mobile_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-lobby-welcome-offer-mobile.png',
        //     mobile_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-welcome-offer-mobile-new-1.png',
        //     conditions: ['madeDepositNo', 'sweep', 'statusPlayer'],
        //     show_in_jackpots_lobby: false,
        //     destination: 'page',
        //     game: false,
        //     bonusid: '48',
        //     page: '/buy-coins',
        //     customClass: 'ftp-thinga',
        //   },
        //   {
        //     desktop_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-free-to-play-banner-590x280-desktop.png',
        //     desktop_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-free-to-play-banner-desktop-1.jpg',
        //     mobile_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-free-to-play-green-mobile-1.png',
        //     mobile_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-free-to-play-green-mobile.png',
        //     conditions: ['sweep'],
        //     show_in_jackpots_lobby: false,
        //     destination: 'page',
        //     game: false,
        //     bonusid: '48',
        //     page: '/sweepstakes-rules',
        //     customClass: 'ftp-thinga',
        //   },
        //   {
        //     desktop_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-refer-a-friend-590x280-desktop.png',
        //     desktop_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-lobby-refer-a-friend-desktop.jpg',
        //     mobile_image_new: 'https://cdn2.wowvegas.com/assets/wowvegas-lobby-refer-a-friend-mobile-amended.png',
        //     mobile_image: 'https://cdn2.wowvegas.com/assets/wow-vegas-refer-a-friend-mobile-amended.png',
        //     conditions: ['sweep'],
        //     show_in_jackpots_lobby: false,
        //     destination: 'page',
        //     game: false,
        //     bonusid: '',
        //     page: '/profile/refer-a-friend',
        //     customClass: 'ftp-thinga',
        //   },
        // ];
      }
      // if (this.$route.name === 'Jackpots') {
      //   return this.jackpotsLobbyBanner;
      // }
      return this.lobbyBanner.filter((x) => !!x.desktop_image);
    },
    isMobile() {
      return window.screen.width <= 760;
    },
  },
  methods: {
    destination(banner) {
      if (banner.customClass && banner.customClass === 'ftp-thinga') {
        return { path: banner.page };
      }
      if (this.$route.name === 'Jackpots') {
        return { path: '#' };
      }
      if (banner.destination === 'game' && banner.game) {
        return { name: 'Play', params: { slug: banner.game.post_name } };
      }
      if (banner.destination === 'coinPackage' && banner.bonusid) {
        return { name: 'BuyCoins', query: { package: banner.bonusid } };
      }
      if (banner.destination === 'page' && banner.page) {
        return { path: banner.page };
      }
      return { path: '#' };
    },
  },
  mounted() {
    if (this.lobbyBanners && this.lobbyBanners.length > 1) {
      new Splide('.splide', {
        type: 'loop',
        autoplay: true,
        perMove: 1,
        perPage: 2,
        // gap: 5,
        pagination: false,
        padding: { left: 0, right: 100 },
        breakpoints: {
          991: {
            perPage: 1,
          },
          1199: {
            padding: { left: 0, right: 0 },
          },
        },
      }).mount();
    }
  },
};
</script>

<style lang="scss">
.banner-lobby-mobile {
  display: none;
}
.splide__track {
  margin: 0 -1rem;
}
.splide__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}
.splide__slide a.disabled {
  pointer-events: none;
  cursor: default;
}
.splide__arrow svg {
  fill: #fff;
  height: 2.5em;
  transition: fill .2s linear;
  width: 2.5em;
  filter: drop-shadow(1px 3px 6px black);
}
.splide__pagination {
  bottom: -2rem;
}
img.banner-lobby-desktop,
img.banner-lobby-mobile {
  border-radius: 4px;
}
.splide__pagination__page {
  background: #585858;
  margin: 3px;
}
.splide__pagination__page.is-active {
  background: #fff;
}
a.banner-lobby-single {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 700px;
  max-width: 100%;
}
a.banner-lobby-single.ftp-thing {
  width: 100%;
}
@media (min-width: 1199px) {
  .splide__track:after {
    position: absolute;
    right: 0rem;
    width: 1rem;
    background: linear-gradient(270deg, $black, transparent);
    content: "";
    top: 0;
    bottom: 0;
  }
}
@media (min-width: 768px) {
  .splide__arrow--next {
    right: -3em;
  }
  .splide__arrow--prev {
    left: -3em;
  }
  .splide__slide>a {
    flex: 1;
  }
  .splide__slide {
    padding: 0 4px;
  }
  .splide__track {
    margin: 0 -4px;
  }
  img.banner-lobby-desktop {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .banner-lobby-c {
    margin-bottom: 1.5rem;
  }
  .splide__pagination {
    bottom: -1.7rem;
  }
  .banner-lobby-mobile {
    display: block;
  }
  .banner-lobby-desktop {
    display: none;
  }
  .splide__arrow--next {
    right: -1.2em;
  }
  .splide__arrow--prev {
    left: -1.2em;
  }
  .splide__arrow svg {
    height: 1.3em;
    width: 1.3em;
    filter: drop-shadow(1px 3px 6px black);
  }
}
/* @media (max-width: 575px) {
  .banner-lobby-c {
    margin-left: -1rem;
    margin-right: -1rem;
  }
} */
</style>
