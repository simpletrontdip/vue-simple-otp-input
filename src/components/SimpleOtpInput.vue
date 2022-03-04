<template>
  <div class="simple-otp-input">
    <input
      v-for="(_, idx) in length"
      :key="idx"
      ref="inputs"
      :value="otp[idx]"
      :autocomplete="idx === 0 ? 'one-time-code' : 'off'"
      :type="type"
      maxlength="1"
      :class="['otp-single-input', inputClasses]"
      @focus="childFocus($event, idx)"
      @keyup="childKeyUp($event, idx)"
    />
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
    };
  },
  methods: {
    otpValue() {
      return this.otp.map((e) => e || " ").join("");
    },
    splitValue(e, startIdx = 0) {
      const data = e.data || e.target.value;
      if (!data || data.length === 1) {
        return;
      }

      this.populateNext(e.target, data, startIdx);
    },
    populateNext(el, data, idx) {
      // set the value to model and element as well
      this.otp[idx] = el.value = data[0];
      data = data.substring(1);

      if (idx < this.length - 1 && data.length) {
        // Do the same with the next element and next data
        this.populateNext(this.$refs.inputs[idx + 1], data, idx + 1);
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
    childKeyUp(e, idx) {
      // Ignore system modifiers keys
      if (
        e.keyCode === SHIFT ||
        e.keyCode === TAB ||
        e.keyCode === CMD ||
        e.keyCode === ALT ||
        e.keyCode === CTRL
      ) {
        return;
      }

      if (e.keyCode === ENTER) {
        // complete
        this.$emit("complete", this.otpValue());
      }

      // On Backspace or left arrow, go to the previous field.
      if ((e.keyCode === BACKSPACE || e.keyCode === LEFT_ARROW) && idx > 0) {
        this.$refs.inputs[idx - 1].select();
      } else if (e.keyCode !== BACKSPACE && idx < this.length - 1) {
        this.$refs.inputs[idx + 1].select();
      }

      // If the target is populated to quickly, value length can be > 1
      if (e.target.value.length > 1) {
        this.splitValue(e, idx);
      } else {
        this.otp[idx] = e.target.value;
      }

      this.$emit("change", this.otpValue());
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
  margin: 2px;
}
</style>
