<template>
  <div class="lobby--main">
    <template
      v-if="(lobbyCategories.length > 0 && allFeaturedGames.length > 0)">
      <!-- Popular games -->
      <!-- <div class="lobby--main--category" v-if="mostPopularGamesWithInfo.length > 0">
        <h4><span>Hot</span> <span class="standout">({{ mostPopularGamesCount }})</span></h4>
        <thumbnails-grid :games="mostPopularGamesWithInfo"></thumbnails-grid>
      </div> -->
      <!-- My Favorite games -->
      <lobby-main-cat-single v-if="favoriteGamesWithInfo.length > 0" :games="favoriteGamesWithInfo" :category="{
        name: 'My Favorites',
        count: favoriteGamesCount,
        featured_games: favoriteGamesWithInfo,
      }" :key="`favgames-${favoriteGamesCount}`">
      </lobby-main-cat-single>
      <!-- Recently Played games -->
      <lobby-main-cat-single v-if="recentlyPlayedGamesWithInfo.length > 0" :games="recentlyPlayedGamesWithInfo" :category="{
        name: 'Recently Played',
        count: recentlyPlayedGamesCount,
        featured_games: recentlyPlayedGamesWithInfo,
      }">
      </lobby-main-cat-single>
      <!-- Categories loop -->
      <template v-if="!isSearch">
        <lobby-main-cat-single v-for="(category, index) in lobbyCategories" :key="`lobby-${category.id}`" :category="category">
          <template #banner v-if="enablePaymentsBanner && $route.name === 'Lobby' && index === 0 && playerData && playerData.registrationStatus === 'PLAYER'">
            <div @click="$router.push({ name: 'BuyCoins' })" class="buy-coins-banner">
              <img src="https://cdn2.wowvegas.com/assets/wow-vegas-trustly-banner-1288x180-dark-1.png" alt="" class="buy-coins-banner-img-desktop" />
              <img src="https://cdn2.wowvegas.com/assets/wow-vegas-trustly-banner-mobile-414x233-1.jpg" alt="" class="buy-coins-banner-img-mobile" />
            </div>
          </template>
          <template #banner v-else-if="enablePaymentsBanner && $route.name === 'Lobby' && index === 3 && sweep">
            <div @click="$router.push({ name: 'Jackpots' })" class="buy-coins-banner">
              <img src="https://cdn2.wowvegas.com/assets/wow-vegas-jackpots-lobby-banner-1288x180-1-1.png" alt="" class="buy-coins-banner-img-desktop" />
              <img src="https://cdn2.wowvegas.com/assets/wow-vegas-daily-prize-drops-2023-mobile-414x233-1.png" alt="" class="buy-coins-banner-img-mobile" />
              <Button
                type="secondary"
                class="jackpots-banner-playnow"
                tag="router-link"
                :to="{ name: 'Jackpots' }"
              >
                Play Now
              </Button>
            </div>
          </template>
        </lobby-main-cat-single>
      </template>
    </template>
    <template v-else>
      <category-section-placeholder :items="6"></category-section-placeholder>
      <category-section-placeholder :items="12" :button="true"></category-section-placeholder>
      <category-section-placeholder :items="6" :button="true"></category-section-placeholder>
      <category-section-placeholder :items="6" :button="true"></category-section-placeholder>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import ThumbnailsGrid from '@/components/molecules/ThumbnailsGrid.vue';
import LobbyMainCatSingle from '@/components/organisms/LobbyMainCatSingle.vue';
import CategorySectionPlaceholder from '@/components/placeholders/CategorySectionPlaceholder.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  components: {
    // ThumbnailsGrid,
    LobbyMainCatSingle,
    Button,
    CategorySectionPlaceholder,
  },
  data() {
    return {
      enablePaymentsBanner: true,
    };
  },
  computed: {
    ...mapGetters([
      'lobbyCategories', // Get all the categories that are visible in lobby
      'featuredGamesByCategory', // Ten games grouped by category
      'allFeaturedGames',
      'mostPopularGamesWithInfo', // Get popular games with info
      'mostPopularGamesCount', // Get popular games count
      'recentlyPlayedGamesWithInfo', // Get popular games with info
      'recentlyPlayedGamesCount', // Get popular games count
      'favoriteGamesWithInfo',
      'favoriteGamesCount',
      'playerData',
      'sweep',
    ]),
    currentCategorySlug() {
      return this.$route.query.category;
    },
    isSearch() {
      return typeof this.$route.query.search !== 'undefined';
    },
  },
  methods: {
    initPage() {
      if (!this.currentCategorySlug) {
        if (!this.mostPopularGamesWithInfo.length) {
          this.$store.dispatch('getMostPopularGames');
        }
        if (!this.recentlyPlayedGamesWithInfo.length) {
          this.$store.dispatch('getRecentlyPlayedGames');
        }
        if (!this.favoriteGamesWithInfo.length) {
          this.$store.dispatch('getFavoriteGames');
        }
      }
    },
  },
  created() {
    this.initPage();
  },
};
</script>

<style>
.buy-coins-banner {
  margin-top: 40px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.buy-coins-banner-img {
  display: block;
  max-width: 100%;
  height: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 900px;
}
.pay-logos {
  display: flex;
  align-items: center;
}
img.pay-logos-trustly {
  height: 67px;
  margin-top: -5px;
  margin-right: 7%;
}
.category-subtitle {
  margin-top: -0.7em;
  margin-bottom: 1.2em;
  color: #c8c8c8;
  font-size: 13px;
  /* text-transform: uppercase; */
}
.buy-coins-banner-img-desktop,
.buy-coins-banner-img-mobile {
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.buy-coins-banner-img-mobile,
.button.jackpots-banner-playnow {
  display: none;
}
.lobby--main--category .buy-coins-banner .button {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.category-title-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category-title-flex-right .button {
  margin-top: 0 !important;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  background: transparent;
  border: 1px solid #fff;
  letter-spacing: 2px;
}

/* Snap nav */
button.snap-nav-arrow {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 8px;
  border: 1px solid;
  height: 29px;
  transition: 0.2s opacity ease-in-out;
}
.snap-nav {
  display: flex;
  margin-bottom: 1rem;
  height: 30px;
  align-items: center;
  margin-right: 1rem;
}
.category-title-flex-right {
  display: flex;
  align-items: center;
}
button.snap-nav-arrow svg {
  fill: #fff;
  transition: fill 0.2s linear;
  filter: drop-shadow(1px 3px 6px black);
  width: .8rem;
  height: auto;
}
button.snap-nav-arrow.snap-nav-arrow--prev svg {
  transform: rotate(180deg);
}
button.snap-nav-arrow.snap-nav-arrow--prev {
  border-right: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
button.snap-nav-arrow.snap-nav-arrow--next {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
button.snap-nav-arrow.disabled {
  cursor: pointer;
  pointer-events: none;
  opacity: .5;
}
/* Snap nav end */
@media (max-width: 991px) {
  img.pay-logos-trustly {
    height: 40px;
  }
  .buy-coins-banner {
    padding-left: 0;
    padding-right: 0;
  }
}
@media (max-width: 768px) {
  .pay-logos {
    flex-direction: column;
  }
  img.pay-logos-trustly {
    margin-left: 0;
    margin-right: auto;
    height: 55px;
    margin-bottom: 5px;
    margin-top: 0;
  }
  .buy-coins-banner-img-mobile {
    display: block;
  }
  .buy-coins-banner-img-desktop {
    display: none;
  }
  .buy-coins-banner {
    margin-top: 25px;
  }
  .button.jackpots-banner-playnow {
    display: block;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .category-title-flex-right .button {
    font-size: 0.70rem;
    letter-spacing: 2px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 0.24rem 0.5rem;
  }
  .snap-nav {
    display: none;
  }
}
</style>
