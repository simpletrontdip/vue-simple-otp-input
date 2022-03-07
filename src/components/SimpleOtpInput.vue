<template>
  <div class="simple-otp-input">
    <div v-for="(_, idx) in length" :key="idx" class="single-input-container">
      <input
        ref="inputs"
        :value="otp[idx]"
        :autocomplete="idx === 0 ? 'one-time-code' : 'off'"
        :type="type"
        inputmode="numeric"
        :class="['otp-single-input', inputClasses]"
        @focus="childFocus($event, idx)"
        @keyup="childKeyUp($event, idx)"
      />
      <slot name="extra" :idx="idx" :otp="otp" :length="length"></slot>
    </div>
  </div>
</template>

<script>
const BACKSPACE = 8;
const LEFT_ARROW = 37;
const SHIFT = 16;
const CTRL = 17;
const ALT = 18;
const TAB = 9;
const ENTER = 13;
const CMD = 224;

export default {
  name: "SimpleOtpInput",
  emits: ["change", "complete"],
  props: {
    length: {
      type: Number,
      default: 6,
    },
    value: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    inputClasses: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      otp: this.value ? Array.from(this.value) : new Array(this.length).fill(),
      lastKey: null,
    };
  },
  methods: {
    getOtpValue() {
      return this.otp.map((item) => item || " ").join("");
    },
    setOtpValue(data, startIdx = 0) {
      if (!data || data.length === 1) {
        return;
      }

      this.populateNext(data, startIdx);
    },
    populateNext(data, idx) {
      // set the value to model and element as well
      const el = this.$refs.inputs[idx];
      this.otp[idx] = el.value = data[0];
      data = data.substring(1);

      if (idx < this.length - 1 && data.length) {
        // Do the same with the next element and next data
        this.populateNext(data, idx + 1);
      }
    },
    childFocus(_e, idx) {
      if (idx === 0) {
        return;
      }

      // If value of input 1 is empty, focus it.
      if (this.$refs.inputs[0].value === "") {
        this.$refs.inputs[0].focus();
      }

      // If value of a previous input is empty, focus it.
      if (this.$refs.inputs[idx - 1].value === "") {
        this.$refs.inputs[idx - 1].focus();
      }
    },
    childKeyUp(event, idx) {
      // Ignore system modifiers keys
      if (
        event.keyCode === SHIFT ||
        event.keyCode === TAB ||
        event.keyCode === CMD ||
        event.keyCode === ALT ||
        event.keyCode === CTRL
      ) {
        return;
      }

      if (event.keyCode === ENTER) {
        // complete on Enter
        this.$emit("complete", this.getOtpValue());
      }

      if (event.keyCode === LEFT_ARROW && idx > 0) {
        // Left arrow, go to the previous field.
        this.$refs.inputs[idx - 1].select();
      } else if (
        event.keyCode === BACKSPACE &&
        idx > 0 &&
        (!this.otp[idx + 1] || this.lastKey === BACKSPACE)
      ) {
        // Backspace, only go to prev field if the next field is empty or they type it twice
        this.$refs.inputs[idx - 1].select();
      } else if (event.keyCode !== BACKSPACE && idx < this.length - 1) {
        this.$refs.inputs[idx + 1].select();
      }

      // If the target is populated to quickly, value length can be > 1
      if (event.target.value.length > 1) {
        this.setOtpValue(event.target.value, idx);
      } else {
        this.otp[idx] = event.target.value;
      }

      this.lastKey = event.keyCode;
      this.$emit("change", this.getOtpValue());
    },
  },
};
</script>
<style scoped>
.simple-otp-input {
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-single-input {
  padding: 4px;
  width: 2em;
  height: 2em;
  text-align: center;
}

.single-input-container {
  position: relative;
  margin: 2px;
}
</style>
