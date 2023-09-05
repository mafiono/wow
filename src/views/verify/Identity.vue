<template>
  <section class="upload-documents">
    <template v-if="playerData">
      <Sumsub />
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Sumsub from '@/components/organisms/Sumsub.vue';
// import FormInput from '@/components/atoms/FormInput.vue';
// import Button from '@/components/atoms/Button.vue';

export default {
  name: 'VerifyIdentity',
  components: {
    Sumsub,
    // Button,
    // FormInput,
  },
  data() {
    return {
      //
    };
  },
  validations: {},
  computed: {
    ...mapGetters(['playerData', 'sweep']),
  },
  created() {
    // this.$store.dispatch('enableLoader');
  },
  methods: {
  },
};
</script>

<style>
.message-below>p {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
div#sumsub-websdk-container {
  width: 700px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 768px) {
  div#sumsub-websdk-container {
    width: 600px;
  }
}
@media (max-width: 668px) {
  div#sumsub-websdk-container {
    width: 500px;
  }
}
@media (max-width: 568px) {
  div#sumsub-websdk-container {
    width: 400px;
  }
}
@media (max-width: 468px) {
  div#sumsub-websdk-container {
    width: 350px;
  }
}
@media (max-width: 379px) {
  div#sumsub-websdk-container {
    width: 100%;
  }
}
</style>
