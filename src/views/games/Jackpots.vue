<template>
  <section class="container lobby lobby-jackpots">
    <lobby-banner v-if="(enableCarousel && lobbyBanner && lobbyBanner.length) || (sweep && ftpNotLobbyBanner && ftpNotLobbyBanner.length)"
      :key="`lbbanner-${lobbyBanner.length}`"></lobby-banner>
    <div v-if="!isSearch" class="horizontal-menu-c">
      <horizontal-menu></horizontal-menu>
    </div>
    <div class="lobby--main">
      <div class="jackpot-heading">
        <h3><small>Welcome to the</small>Prize Drops lobby</h3>
        <p>Here you will find all our daily and weekly prize drops along with the slot games to play for each prize</p>
      </div>
      <template v-if="(jackpotLobbyCategories.length > 0 && allFeaturedGames.length > 0)">
        <lobby-main-cat-single v-for="category in jackpotLobbyCategories" :key="`jackpot-${category.id}`" :category="category" :games="jackpotsFeaturedGamesByCategory(category.id)"></lobby-main-cat-single>
      </template>
      <template v-else>
        <category-section-placeholder :items="6"></category-section-placeholder>
        <category-section-placeholder :items="6"></category-section-placeholder>
        <category-section-placeholder :items="6"></category-section-placeholder>
        <category-section-placeholder :items="6"></category-section-placeholder>
      </template>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import LobbyBanner from '@/components/organisms/LobbyBanner.vue';
import LobbyMainCatSingle from '@/components/organisms/LobbyMainCatSingle.vue';
import CategorySectionPlaceholder from '@/components/placeholders/CategorySectionPlaceholder.vue';
import HorizontalMenu from '@/components/organisms/HorizontalMenu.vue';

export default {
  data() {
    return {
      enableCarousel: false,
    };
  },
  components: {
    LobbyBanner,
    LobbyMainCatSingle,
    CategorySectionPlaceholder,
    HorizontalMenu,
  },
  computed: {
    ...mapGetters([
      'jackpotLobbyCategories', // Get all the categories that are visible in lobby
      'jackpotsFeaturedGamesByCategory', // Ten games grouped by category
      'allFeaturedGames',
      'mostPopularGamesWithInfo', // Get popular games with info
      'mostPopularGamesCount', // Get popular games count
      'recentlyPlayedGamesWithInfo', // Get popular games with info
      'recentlyPlayedGamesCount', // Get popular games count
      'favoriteGamesWithInfo',
      'favoriteGamesCount',
      'playerData',
      'sweep',
      'lobbyBanner',
      'ftpNotLobbyBanner',
    ]),
    isSearch() {
      return typeof this.$route.query.search !== 'undefined';
    },
  },
  methods: {
    //
  },
  async created() {
    //
  },
  watch: {
    //
  },
};
</script>

<style>
.jackpot-heading {
  margin: 6px 0 22px;
  padding: 1rem;
  background: #151516;
  border: 2px solid #ffc058;
  border-radius: 4px;
}
.jackpot-heading h3 {
  margin-bottom: 0.8rem;
}
.jackpot-heading h3 small {
  display: block;
  font-size: 70%;
  margin-bottom: 3px;
}
.jackpot-heading p {
  font-size: 13px;
  margin-bottom: 0;
}
@media (min-width: 768px) {
  .jackpot-heading {
    margin: 45px 0 -10px;
    padding: 1.5rem;
  }
  .jackpot-heading p {
    font-size: 15px;
  }
}
@media (max-width: 768px) {
  .jackpot-heading {
    margin: 1rem 0 2rem;
  }
}
</style>
