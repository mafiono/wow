<template>
  <div class="category-placeholder">
    <content-placeholders>
      <content-placeholders-text class="heading" :lines="1" />
      <content-placeholders-text v-if="text" class="description" :lines="1" />
    </content-placeholders>
    <thumbnails-grid-placeholder :items="items"></thumbnails-grid-placeholder>
    <content-placeholders>
      <content-placeholders-text v-if="button" class="placeholder-button" :lines="1" />
    </content-placeholders>
  </div>
</template>

<script>
import ThumbnailsGridPlaceholder from '@/components/placeholders/ThumbnailsGridPlaceholder.vue';

export default {
  props: {
    text: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Number,
      required: true,
    },
    button: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ThumbnailsGridPlaceholder,
  },
};
</script>
