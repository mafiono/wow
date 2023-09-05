<template>
  <div class="pop-up-wrapper">
    <div class="pop-up pop-up--date">
      <div class="enter-date">
        <div>
          <h5>Enter date</h5>
          <p>Choose a date on which you would like to return to WOW Vegas.</p>
        </div>
        <FormInput v-model="timeoutDate" placeholder="DD/MM/YYYY" type="date" initial-view="day" :open-on="new Date()"></FormInput>
      </div>
      <div class="options">
        <Button type="primary" @click="checkDate">Timeout</Button>
        <Button type="secondary" @click="$emit('cancelled')">Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';
import FormInput from '@/components/atoms/FormInput.vue';

export default {
  data() {
    return {
      timeoutDate: null,
    };
  },
  components: {
    Button,
    FormInput,
  },
  methods: {
    checkDate() {
      const today = new Date();
      const selectedDate = new Date(this.timeoutDate);
      if (!this.timeoutDate) {
        this.$noty.error('Date cannot be empty.');
      } else if (selectedDate < today) {
        this.$noty.error('Date cannot be in the past.');
      } else {
        const diff = this.getDiffDates(today, selectedDate);
        this.$emit('confirmed', diff);
      }
    },
  },
  mixins: ['getDiffDates'],
};
</script>
