<template>
  <div>
    <!-- Search bar  -->
    <div class="lobby--icons-wrapper">
      <div class="lobby--icons" :class="{ 'has-value' : keyword }">
        <button class="searchButton" @click="toggleSearch">
          <Icon name="search" :height="20"></Icon>
        </button>
        <FormInput
          id="searchInput"
          ref="searchInput"
          @input="newSearch"
          @searchkeydown="startSearch"
          debounce
          v-model="keyword"
          type="search"
          placeholder="Search games"
          :class=" { 'expand-search': expandSearch, 'is-expanded': isExpanded, 'close-search': expandSearch == false}">
        </FormInput>
        <button class="closeSearch" @click="closeSearch">
          <span><font-awesome-icon :icon="['fas', 'times']" :style="{ color: 'white' }"/></span>
        </button>
      </div>
    </div>
    <!-- Search results -->
    <div class="lobby--search" v-if="showSearchPage">
      <h4>Search results</h4>
      <div v-if="searchReady">
        <template v-if="searchResults.length > 0">
          <thumbnails-grid :games="searchResults"></thumbnails-grid>
          <Button
            v-if="showLoadMoreResults"
            class="mt-double"
            type="primary"
            @click="showMoreResults"
            :loading="loadingSearchButton"
            >More results</Button
          >
        </template>
        <div v-else class="message">
          <p>We couldn’t find a match for <i>{{ keyword }}</i>. Please try another search.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import Icon from '@/components/atoms/Icon.vue';
import ThumbnailsGrid from '@/components/molecules/ThumbnailsGrid.vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      expandSearch: null,
      isExpanded: true,
      keyword: '',
      showSearchPage: false,
      showLoadMoreResults: false,
      page: 1,
      loadingSearchButton: false,
    };
  },
  components: {
    Button,
    ThumbnailsGrid,
    FormInput,
    Icon,
  },
  computed: {
    ...mapGetters([
      'searchResults',
      'searchResultsTotal',
      'searchReady', // True when Search api call is finished
    ]),
    searchQueryUrl() {
      return this.$route.query.search;
    },
    isMobile() {
      return window.screen.width <= 768;
    },
    isSearch() {
      return typeof this.$route.query.search !== 'undefined';
    },
  },
  methods: {
    closeSearch() {
      this.expandSearch = true;
      this.toggleSearch();
      if (this.isSearch) {
        const query = { ...this.$route.query };
        delete query.search;
        this.$router.replace({ query });
      }
    },
    toggleSearch() {
      if (this.expandSearch) {
        this.keyword = '';
        this.newSearch();
        this.isExpanded = false;
      } else {
        const v = this;
        setTimeout(() => {
          this.isExpanded = true;
          const input = v.$refs.searchInput.$el;
          this.$nextTick(() => input.focus());
        }, 350);
      }
      this.expandSearch = !this.expandSearch;
    },
    startSearch() {
      if (!this.showSearchPage) {
        this.showSearchPage = true;
        this.$emit('toggleShowSearchPage', true);
      }
    },
    newSearch() {
      this.page = 1;
      this.$store.dispatch('resetSearch');
      if (this.keyword !== '') {
        this.getSearchResults(1);
      } else {
        this.showSearchPage = false;
        this.$emit('toggleShowSearchPage', false);
      }
    },
    async getSearchResults(page) {
      const s = this.keyword;
      if (this.page === 1) {
        this.$store.dispatch('enableLoader');
      }
      await this.$store.dispatch('searchGame', { keyword: s, page });
      if (this.page === 1) {
        this.$store.dispatch('disableLoader');
      }
      const resultsCount = this.searchResults.length;
      if (resultsCount >= this.searchResultsTotal) {
        this.showLoadMoreResults = false;
      } else {
        this.showLoadMoreResults = true;
      }
    },
    async showMoreResults() {
      this.loadingSearchButton = true;
      this.page += 1;
      await this.getSearchResults(this.page);
      // Hide or show Load More button
      this.loadingSearchButton = false;
    },
  },
  created() {
    if (this.searchQueryUrl) {
      this.keyword = this.searchQueryUrl;
      this.startSearch();
      this.toggleSearch();
      this.newSearch();
    } else {
      this.toggleSearch();
      this.newSearch();
    }
  },
  mounted() {
    if (!this.searchQueryUrl) {
      const input = this.$refs.searchInput.$el;
      this.$nextTick(() => input.focus());
    }
  },
  watch: {
    keyword(value) {
      if (value === this.searchQueryUrl) {
        return;
      }
      this.$router.replace({ query: { search: value } });
    },
  },
};
</script>
