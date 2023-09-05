<template>
  <div class="grid-thumbnails">
    <div v-for="n in items" :key="n" class="game-thumbnail">
      <div class="thumbnail-square-loader">
        <content-placeholders>
            <content-placeholders-img />
        </content-placeholders>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Number,
      required: true,
    },
  },
};
</script>
