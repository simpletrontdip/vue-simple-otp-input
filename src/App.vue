<template>
  <div id="app">
    <h4>Vue SimpleOtpInput</h4>
    <section class="story">
      <label>Default otp input</label>
      <SimpleOtpInput />
    </section>
    <section class="story">
      <label>Password type input</label>
      <SimpleOtpInput type="password" :length="4" />
    </section>
    <section class="story">
      <label>With inital value</label>
      <SimpleOtpInput value="123456" />
    </section>

    <section class="story">
      <label>With events</label>
      <SimpleOtpInput
        type="password"
        :length="4"
        @change="handleChange"
        @complete="handleComplete"
      />
      <div><strong>Draft</strong> {{ otp }}</div>
      <div><strong>Submitted</strong> {{ submittedOtp }}</div>
    </section>
  </div>
</template>

<script>
import SimpleOtpInput from "./components/SimpleOtpInput.vue";

export default {
  name: "App",
  components: {
    SimpleOtpInput,
  },
  data() {
    return {
      otp: "",
      submittedOtp: "",
    };
  },
  methods: {
    handleChange(v) {
      this.otp = v;
      console.log("Changed", v);
    },
    handleComplete(v) {
      this.submittedOtp = v;
      console.log("Submitted", v);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.story {
  padding: 8px;
  margin-top: 24px;
}
</style>
