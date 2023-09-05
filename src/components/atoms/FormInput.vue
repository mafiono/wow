<template>
  <input
    v-if="type == `search`"
    :type="type"
    :placeholder="placeholder"
    class="input"
    :class="{'is-fullwidth': expanded}"
    :readonly="disable"
    v-bind:value="value"
    v-debounce:500ms="emitEvent"
    v-on:keydown="$emit('searchkeydown')"
  />
  <div v-else-if="type == `checkbox`">
    <label class="checkbox-label">
      <input
        :type="type"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.checked)"
      />
      <span class="checkmark"></span>
      <span v-html="name"></span>
    </label>
  </div>
  <!-- Inputs with labels -->
  <div v-else>
    <label v-if="name" class="label">
      {{ name }}
    </label>
    <Datepicker
      v-if="type == `date`"
      :placeholder="placeholder"
      format="dd MMM yyyy"
      :input-class="{'is-fullwidth': true, 'input': true,'white': isWhite }"
      v-bind:value="value"
      v-on:input="dateEvent($event)"
      :initialView="initialView"
      :disabled="disable"
      :open-date="openOn"
    ></Datepicker>
    <div v-else-if="type == `countrySelect`" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <country-select
        v-bind:value="value"
        :country="value"
        v-on:input="$emit('input', $event)"
        :whiteList="whiteList"
        :disabled="disable"
        :disablePlaceholder="true"
        topCountry="US"
        class="input country-select" />
    </div>
    <div v-else-if="type == `regionSelect`" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <region-select
        v-bind:value="value"
        :region="value"
        defaultRegion="US"
        v-on:input="$emit('input', $event)"
        class="input country-select"
        placeholder="Select State"
        :blackList="blackList"
        :disablePlaceholder="false"
        :disabled="disable"
        :country="countryRegions" />
    </div>
    <div v-else-if="type == `gender`" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
        class="input"
        v-bind:value="value"
        :disabled="disable"
        v-on:change="genderEvent($event)"
      >
        <option value="" disabled>Select gender</option>
        <option value="F">Female</option>
        <option value="M">Male</option>
      </select>
    </div>
    <div v-else-if="type == `expiryMonth`" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
          class="input"
          v-bind:value="value"
          :disabled="disable"
          v-on:change="expiryMonthEvent($event)"
        >
          <option value="" disabled> Month</option>
          <option v-for="m in 12" :key="m" :value="pad(m)">{{ pad(m) }}</option>
        </select>
    </div>
    <div v-else-if="type == `expiryYear`" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
        class="input"
        v-bind:value="value"
        :disabled="disable"
        v-on:change="expiryYearEvent($event)"
      >
        <option value="" disabled>Year</option>
        <option v-for="m in 50" :key="m" :value="2021 + m">{{ 2021 + m }}</option>
      </select>
    </div>
    <div v-else-if="type === 'identityDocumentSelect'" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
        class="input"
        :value="value"
        :disabled="disable"
        @input="documentEvent($event)"
      >
        <option value="" disabled>Select document to upload</option>
        <option value="PASSPORT">Passport</option>
        <option value="DRIVING_LICENSE">Driving License</option>
        <option value="IDENTITY_CARD">Identity Document</option>
      </select>
    </div>
    <div v-else-if="type === 'addressDocumentSelect'" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
        class="input"
        :value="value"
        :disabled="disable"
        @input="documentEvent($event)"
      >
        <option value="" disabled>Select document to upload</option>
        <option value="UTILITY_BILL">Utility Bill</option>
        <option value="BANK_STATEMENT">Bank Statement</option>
      </select>
    </div>
    <div v-else-if="type === 'additionalDocumentSelect'" class="select-wrapper" :class="{ 'sel-disabled': disable }">
      <select
        class="input"
        :value="value"
        :disabled="disable"
        @input="documentEvent($event)"
      >
        <option value="" disabled>Select document to upload</option>
        <option value="PASSPORT">Passport</option>
        <option value="DRIVING_LICENSE">Driving License</option>
        <option value="IDENTITY_CARD">Identity Document</option>
        <option value="UTILITY_BILL">Utility Bill</option>
        <option value="BANK_STATEMENT">Bank Statement</option>
      </select>
    </div>
    <input
      v-else
      :type="type"
      :placeholder="placeholder"
      :name="name"
      class="input"
      :class="{'is-fullwidth': expanded, 'white': isWhite }"
      :readonly="disable"
      :disabled="disable"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      v-on:keyup.enter="$emit('keyup', $event.target.value)"
      v-on:focus="$emit('focus', $event.target.value)"
      v-on:blur="$emit('blur', $event.target.value)"
    />
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  props: {
    type: {
      type: String,
      default: 'text',
      validator(value) {
        // The type must match one of these values
        return ['text', 'email', 'password', 'date', 'checkbox', 'countrySelect', 'regionSelect',
          'gender', 'search', 'identityDocumentSelect', 'addressDocumentSelect', 'additionalDocumentSelect', 'expiryMonth', 'expiryYear'].indexOf(value) !== -1;
      },
    },
    value: {},
    name: String,
    placeholder: String,
    expanded: Boolean,
    disable: Boolean,
    debounce: Boolean,
    isWhite: Boolean,
    whiteList: Array,
    blackList: Array,
    countryRegions: String,
    openOn: {
      type: Date,
      default: () => new Date(1990, 1, 1),
    },
    openOnExpiryDate: {
      type: Date,
      default: () => new Date(2021, 1, 1),
    },
    initialView: {
      type: String,
      default: 'year',
    },
  },
  components: {
    Datepicker,
  },
  methods: {
    dateEvent(date) {
      this.$emit('input', date);
    },
    documentEvent(event) {
      this.$emit('input', event.target.value);
    },
    genderEvent(event) {
      const index = event.target.options.selectedIndex;
      const genderValue = event.target.options[index].value;
      this.$emit('input', genderValue);
    },
    emitEvent(val, event) {
      this.$emit('input', event.target.value);
    },
    pad(d) {
      return (d < 10) ? `0${d.toString()}` : d.toString();
    },
    expiryMonthEvent(event) {
      const index = event.target.options.selectedIndex;
      const monthValue = event.target.options[index].value;
      this.$emit('input', monthValue);
    },
    expiryYearEvent(event) {
      const index = event.target.options.selectedIndex;
      const yearValue = event.target.options[index].value;
      this.$emit('input', yearValue);
    },
  },
  mixins: ['dateToString'],
};
</script>
