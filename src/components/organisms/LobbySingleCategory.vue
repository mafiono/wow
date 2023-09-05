<template>
  <div class="lobby--single">
    <div v-if="currentCategoryGames.length > 0" key="gamelist">
      <h4>{{ currentCategory.name }}</h4>
      <div v-html="currentCategory.content"></div>
      <template v-if="!loadingCatGames">
        <thumbnails-grid :games="currentCategoryGames"></thumbnails-grid>
        <Button
          v-if="showLoadMore"
          class="mt-single"
          type="primary"
          @click="loadMoreGames"
          :loading="loadingCatButton"
          ref="loadmore"
        >
          Load more
        </Button>
      </template>
    </div>
    <div v-else-if="noGames">
      <h4>{{ currentCategory.name }}</h4>
      There are no games to show.
    </div>
    <div v-else key="gamelist-placeholder">
      <category-section-placeholder button text :items="perPage"></category-section-placeholder>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ThumbnailsGrid from '@/components/molecules/ThumbnailsGrid.vue';
import Button from '@/components/atoms/Button.vue';
import CategorySectionPlaceholder from '@/components/placeholders/CategorySectionPlaceholder.vue';

export default {
  data() {
    return {
      loadingCatGames: false,
      loadingCatButton: false,
      page: 1,
      showLoadMore: true,
      perPage: 21,
      busy: false,
    };
  },
  components: {
    ThumbnailsGrid,
    Button,
    CategorySectionPlaceholder,
  },
  computed: {
    ...mapGetters([
      'currentCategoryGames', // Get all the games from one category
      'getCategoryBySlug', // Get category info using category wordpress slug
      'categoryGamesTotal', // Total games in the category
      'noGames',
    ]),
    currentCategorySlug() {
      return this.$route.query.category;
    },
    currentCategory() {
      return this.getCategoryBySlug(this.currentCategorySlug);
    },
  },
  methods: {
    async getGames(bigloader = true) {
      await this.$store.dispatch('getCategoryGames', {
        category: this.currentCategorySlug,
        page: this.page,
        perPage: this.perPage,
        bigloader,
      });
      const gamesCount = this.currentCategoryGames.length;
      // Hide or show Load More button
      if (gamesCount >= this.categoryGamesTotal) {
        this.showLoadMore = false;
      } else {
        this.showLoadMore = true;
      }
    },
    // Show more games
    async loadMoreGames(bigloader = true) {
      this.loadingCatButton = true;
      this.page += 1;
      await this.getGames(bigloader);
      this.loadingCatButton = false;
    },
    async initPage() {
      if (this.currentCategorySlug) {
        this.loadingCatGames = true;
        // Reset games and page to 1
        this.page = 1;
        await this.getGames();
        this.loadingCatGames = false;
      }
    },
    onScrollLoadMoreGames() {
      window.onscroll = () => {
        if (this.busy || this.loadingCatButton || this.loadingCatGames || !this.showLoadMore) {
          return;
        }
        const scrolledOffset = document.documentElement.scrollTop + window.innerHeight + 30;
        const loadmoreOffset = this.$refs.loadmore?.$el.offsetTop;
        if (scrolledOffset > loadmoreOffset) {
          this.busy = true;
          this.loadMoreGames(false);
          setTimeout(() => {
            this.busy = false;
          }, 500);
        }
      };
    },
  },
  created() {
    this.initPage();
  },
  mounted() {
    if (this.currentCategorySlug) {
      this.onScrollLoadMoreGames();
    }
  },
  destroyed() {
    window.onscroll = null;
  },
  watch: {
    $route() {
      this.initPage();
    },
  },
};
</script>
