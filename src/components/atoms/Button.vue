<template>
  <component
    :is="computedTag"
    class="button"
    :class="[`button--${type}`, {
      'is-fullwidth': expanded,
      'is-loading': loading,
      'centred-mobile': centredMobile,
      'no-border': noBorder
    }]"
    v-bind="$attrs"
    :type="nativeType"
    v-on="$listeners"
    :style="`width:${width}px`"
  >
  <font-awesome-icon v-if="iconLeft" :icon="[iconStyle, iconLeft]" />
  <span v-if="label">{{ label }}</span>
  <span v-else-if="$slots.default">
    <slot />
  </span>
  <font-awesome-icon v-if="iconRight" :icon="[iconStyle, iconRight]" />
  </component>
</template>

<script>
// list of posible tags to use (optimised for future use with nuxt already lol :)
const defaultLinkTags = [
  'a',
  'button',
  'input',
  'router-link',
  'nuxt-link',
  'n-link',
  'RouterLink',
  'NuxtLink',
  'NLink',
];

export default {
  name: 'Button',
  inheritAttrs: false,
  props: {
    type: [String, Object],
    size: String,
    label: String,
    iconPack: String,
    iconLeft: String,
    iconRight: String,
    expanded: Boolean,
    loading: Boolean,
    noBorder: Boolean,
    centredMobile: Boolean,
    width: Number,
    nativeType: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].indexOf(value) >= 0, // only 3 values possible 'button', 'submit' or 'reset'
    },
    tag: {
      type: String,
      default: 'button',
      validator: (value) => defaultLinkTags.indexOf(value) >= 0, // validate if tag exists in list of possible tags above
    },
  },
  computed: {
    computedTag() {
      if (this.$attrs.disabled !== undefined && this.$attrs.disabled !== false) { // if disabled - always use <button> tag
        return 'button';
      }
      return this.tag;
    },
    iconStyle() {
      if (this.iconPack !== undefined && this.iconPack) {
        return this.iconPack;
      }
      return 'fas';
    },
  },
};
</script>
