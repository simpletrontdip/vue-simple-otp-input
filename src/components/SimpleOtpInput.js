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
  emits: ["update", "change", "complete"],
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
  computed: {
    otpValue() {
      return this.otp.map((item) => item || " ").join("");
    },
  },
  watch: {
    value(val) {
      if (val !== this.otpValue) {
        this.otp = Array.from(this.value);
      }
    },
  },
  methods: {
    emitChange() {
      // this give user a better change recognition
      this.$emit("change", this.otpValue);
      // mimicking event.target.value to support v-model
      this.$emit("input", this.otpValue);
    },
    emitComplete() {
      this.$emit("complete", this.otpValue);
    },
    emitEvents(idx) {
      this.emitChange();

      if (idx === this.length - 1) {
        // emit events on last index
        this.emitComplete();
      }
    },
    getOtpValue() {
      return this.otpValue;
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
      this.$refs.inputs[idx].value = data[0];
      this.$set(this.otp, idx, data[0]);

      data = data.substring(1);

      // Emit change each input update
      this.emitEvents(idx);

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
      let { keyCode } = event;

      // Ignore system modifiers keys
      if (
        keyCode === SHIFT ||
        keyCode === TAB ||
        keyCode === CMD ||
        keyCode === ALT ||
        keyCode === CTRL ||
        keyCode === 224
      ) {
        return;
      }

      if (keyCode === ENTER) {
        // complete on Enter
        this.emitComplete();
      }

      const value = event.target.value;
      const count = value.length;

      if (keyCode === LEFT_ARROW && idx > 0) {
        // Left arrow, go to the previous field.
        this.$refs.inputs[idx - 1].select();
      } else if (
        // XXX count == 0 => we are deleting input content
        // This handles virtual keyboard better
        !count &&
        idx > 0 &&
        (!this.otp[idx + 1] || this.lastKey === keyCode)
      ) {
        // Backspace, only go to prev field if the next field is empty or they type it twice
        this.$refs.inputs[idx - 1].select();
      } else if (
        keyCode !== BACKSPACE &&
        keyCode !== LEFT_ARROW &&
        count === 1 &&
        idx < this.length - 1
      ) {
        this.$refs.inputs[idx + 1].select();
      }

      if (count > 1) {
        // set multiple value with effects
        // The single char should be handled by Input
        this.setOtpValue(value, idx);
      }

      this.lastKey = keyCode;
    },
    childPaste(event, idx) {
      event.preventDefault();
      const value = event.clipboardData.getData("text/plain");

      // set multiple value with effects
      this.setOtpValue(value, idx);
    },
    childInput(event, idx) {
      // handle paste on Chrome
      const value = event.target.value;
      const count = value.length;

      // If the target is populated to quickly, count can be > 1
      if (count > 1) {
        // set multiple value with effects
        this.setOtpValue(value, idx);
      } else {
        // update single value
        this.$set(this.otp, idx, value);
        // Emit change for this
        this.emitEvents(idx);
      }
    },
  },

  render() {
    const { type, length, inputClasses } = this.$props;
    const { extra } = this.$scopedSlots;
    const { otp } = this.$data;

    return (
      <div class="simple-otp-input">
        {otp.map((number, idx) => (
          <div key={idx} class="single-input-container">
            <input
              ref="inputs"
              refInFor
              value={number}
              autocomplete={idx === 0 ? "one-time-code" : "off"}
              type={type}
              inputmode={type === "number" ? "numeric" : undefined}
              class={["otp-single-input", inputClasses]}
              onFocus={(event) => this.childFocus(event, idx)}
              onKeyup={(event) => this.childKeyUp(event, idx)}
              onPaste={(event) => this.childPaste(event, idx)}
              onInput={(event) => this.childInput(event, idx)}
            />
            {extra && extra({ otp, idx, length })}
          </div>
        ))}
      </div>
    );
  },
};
