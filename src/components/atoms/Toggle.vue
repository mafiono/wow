<template>
  <div class="toggle">
    <input
      v-bind:checked="value"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.checked)"
      type="checkbox" :id="id" />
    <label class="label" :for="id"></label>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    id: String,
  },
};
</script>