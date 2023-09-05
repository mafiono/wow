<template>
  <div class="lobby--main--category" :class="{ prevDisabled, nextDisabled }">
    <slot name="title">
      <div v-if="category" class="category-title-flex">
        <div class="category-title-flex-left">
          <slot name="titleline"><h4><span v-html="category.name"></span> <span class="standout">({{ category.count }})</span></h4></slot>
          <p class="category-subtitle" v-if="category.subtitle">{{ category.subtitle }}</p>
        </div>
        <div class="category-title-flex-right">
          <div v-if="category.featured_games && category.featured_games.length > 7" class="snap-nav">
            <button class="snap-nav-arrow snap-nav-arrow--prev" @click="handlePrev" :class="{ 'disabled': prevDisabled }"
              type="button" aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false">
                <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
              </svg>
            </button>
            <button class="snap-nav-arrow snap-nav-arrow--next" @click="handleNext" :class="{ 'disabled': nextDisabled }"
              type="button" aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false">
                <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
              </svg>
            </button>
          </div>
          <Button v-if="category.slug && category.count > 6" type="primary" class="mt-single" tag="router-link"
            :to="{ name: 'Lobby', query: { category: category.slug } }">
            View all
          </Button>
        </div>
      </div>
    </slot>
    <thumbnails-grid :games="showGames" ref="snap"></thumbnails-grid>
    <slot name="banner"></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ThumbnailsGrid from '@/components/molecules/ThumbnailsGrid.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  components: {
    ThumbnailsGrid,
    Button,
  },
  props: ['category', 'title', 'games'],
  data() {
    return {
      scrollLeft: null,
    };
  },
  computed: {
    ...mapGetters([
      'featuredGamesByCategory',
      'playerData',
      'sweep',
    ]),
    showGames() {
      if (this.games) {
        return this.games;
      }
      return this.featuredGamesByCategory(this.category.id);
    },
    prevDisabled() {
      if (!this.scrollLeft || (this.scrollLeft && this.scrollLeft < 20)) {
        return true;
      }
      return false;
    },
    nextDisabled() {
      if (this.scrollLeft && this.scrollLeft >= this.scrollWidth - this.clientWidth) {
        return true;
      }
      return false;
    },
    scrollWidth() {
      return this.$refs.snap.$el.scrollWidth;
    },
    clientWidth() {
      return this.$refs.snap.$el.clientWidth;
    },
  },
  methods: {
    handleScroll(event) {
      this.scrollLeft = event.target.scrollLeft;
    },
    handleNext() {
      this.$refs.snap.$el.scrollTo({ left: this.scrollLeft + 100, behavior: 'smooth' });
    },
    handlePrev() {
      this.$refs.snap.$el.scrollTo({ left: this.scrollLeft - 100, behavior: 'smooth' });
    },
  },
  created() {
    //
  },
  mounted() {
    this.$refs.snap.$el.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    this.$refs.snap.$el.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
