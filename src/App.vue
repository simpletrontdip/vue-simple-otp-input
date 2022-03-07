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
    <section class="story">
      <label>With extra slot to create border effect</label>
      <SimpleOtpInput
        class="otp-with-effect"
        inputClasses="input-with-effect"
        :pasteDelayMs="192"
      >
        <template v-slot:extra>
          <span class="focus-border">
            <i></i>
          </span>
        </template>
      </SimpleOtpInput>
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

.otp-with-effect .single-input-container {
  border-radius: 3px;
  overflow: hidden;
}

.input-with-effect {
  outline: none;
  border-width: 1px;
  border-radius: 3px;
}

.input-with-effect:focus {
  border-color: transparent;
}

.input-with-effect ~ .focus-border:before,
.input-with-effect ~ .focus-border:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 2px;
  background-color: green;
  transition: 0.1s;
  transition-delay: 0.2s;
}
.input-with-effect ~ .focus-border:after {
  top: auto;
  bottom: 0;
  right: auto;
  left: 0;
  transition-delay: 0.6s;
}
.input-with-effect ~ .focus-border i:before,
.input-with-effect ~ .focus-border i:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 0;
  background-color: green;
  transition: 0.1s;
}
.input-with-effect ~ .focus-border i:after {
  left: auto;
  right: 0;
  top: auto;
  bottom: 0;
  transition-delay: 0.2s;
}
.input-with-effect:focus ~ .focus-border:before,
.input-with-effect:focus ~ .focus-border:after {
  width: 100%;
  transition: 0.1s;
  transition-delay: 0.3s;
}
.input-with-effect:focus ~ .focus-border:after {
  transition-delay: 0.1s;
}
.input-with-effect:focus ~ .focus-border i:before,
.input-with-effect:focus ~ .focus-border i:after {
  height: 100%;
  transition: 0.1s;
}
.input-with-effect:focus ~ .focus-border i:after {
  transition-delay: 0.2s;
}
</style>
