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
        @paste="childPaste($event, idx)"
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
const CMD = 91;

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
    pasteDelayMs: {
      type: Number,
      default: 0,
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
    /**
     * Set multiple OTP input value sequentially, auto focus on last reachable input.
     * Use this inside keyup with single input may prevent LEFT_ARROW, BACKSPACE to take effect
     */
    setOtpValue(data, startIdx = 0) {
      if (!data) {
        return;
      }

      // Focus on startIdx
      this.$refs.inputs[startIdx].select();
      this.populateNext(data, startIdx);
    },
    populateNext(data, idx) {
      // set the value to model and element as well
      const el = this.$refs.inputs[idx];
      this.otp[idx] = el.value = data[0];
      data = data.substring(1);

      // Emit change each update
      // this give user a better change recognition
      this.$emit("change", this.getOtpValue());

      if (idx < this.length - 1) {
        // Not the last input, then focus to next input
        this.$refs.inputs[idx + 1].select();

        if (data.length) {
          setTimeout(() => {
            // Update next input with the data
            this.populateNext(data, idx + 1);
          }, this.pasteDelayMs);
        }
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
        event.keyCode === CTRL ||
        event.keyCode === 224
      ) {
        return;
      }

      if (event.keyCode === ENTER) {
        // complete on Enter
        this.$emit("complete", this.getOtpValue());
      }

      const value = event.target.value;
      const count = value.length;

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
      } else if (
        event.keyCode !== BACKSPACE &&
        event.keyCode !== LEFT_ARROW &&
        count === 1 &&
        idx < this.length - 1
      ) {
        this.$refs.inputs[idx + 1].select();
      }

      // If the target is populated to quickly, count can be > 1
      if (count > 1) {
        // set multiple value with effects
        this.setOtpValue(value, idx);
      } else {
        this.otp[idx] = value;
        this.$emit("change", this.getOtpValue());
      }

      this.lastKey = event.keyCode;
    },
    childPaste(event, idx) {
      event.preventDefault();
      const value = event.clipboardData.getData("text/plain");

      // set multiple value with effects
      this.setOtpValue(value, idx);
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
