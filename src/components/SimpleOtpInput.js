const BACKSPACE = "Backspace";
const LEFT_ARROW = "ArrowLeft";
const SHIFT = "Shift";
const CTRL = "Ctrl";
const ALT = "Alt";
const TAB = "Tab";
const ENTER = "Enter";

const CMD_CODE = 91;

const fillArrToLength = (str, len, val = "") => {
  const remain = Math.max(len - str.length, 0);
  return Array.from(str).concat(new Array(remain).fill(val)).slice(0, len);
};

export default {
  name: "SimpleOtpInput",
  emits: ["input", "change", "complete"],
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
      otp: fillArrToLength(this.value, this.length),
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
        this.otp = fillArrToLength(val, this.length);
      }
    },
  },
  methods: {
    emitChange() {
      // this give user a better change recognition
      this.$emit("change", this.otpValue);
      // mimicking to support v-model
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
    focusInput(idx) {
      // some browsers do `focus` on `select`, but we call both for certainity
      this.$refs.inputs[idx].focus();
      this.$refs.inputs[idx].select();
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
      this.focusInput(startIdx);
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
        this.focusInput(idx + 1);

        if (data.length) {
          setTimeout(() => {
            // Update next input with the data
            this.populateNext(data, idx + 1);
          }, this.pasteDelayMs);
        }
      }
    },
    childFocus(_e, idx) {
      // If value of input 1 is empty, focus it.
      if (idx === 0 || this.$refs.inputs[0].value === "") {
        this.focusInput(0);
        return;
      }

      // If value of a previous input is empty, focus it.
      if (this.$refs.inputs[idx - 1].value === "") {
        this.focusInput(idx - 1);
      }
    },
    childKeyUp(event, idx) {
      let { keyCode, key } = event;

      // Ignore system modifiers keys
      if (
        key === SHIFT ||
        key === TAB ||
        key === ALT ||
        key === CTRL ||
        keyCode === CMD_CODE ||
        keyCode === 224
      ) {
        return;
      }

      if (key === ENTER) {
        // complete on Enter
        this.emitComplete();
      }

      const value = event.target.value;
      const count = value.length;

      if (key === LEFT_ARROW && idx > 0) {
        // Left arrow, go to the previous field.
        this.focusInput(idx - 1);
      } else if (
        // XXX count == 0 => we are deleting input content
        // This handles virtual keyboard better
        !count &&
        idx > 0 &&
        (!this.otp[idx + 1] || this.lastKey === key)
      ) {
        // Backspace, only go to prev field if the next field is empty or they type it twice
        this.focusInput(idx - 1);
      } else if (
        key !== BACKSPACE &&
        key !== LEFT_ARROW &&
        count === 1 &&
        idx < this.length - 1
      ) {
        this.focusInput(idx + 1);
      }

      if (count > 1) {
        // set multiple value with effects
        // The single char should be handled by Input
        this.setOtpValue(value, idx);
      }

      this.lastKey = key;
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
              data-testid={`otp-single-input-${idx}`}
            />
            {extra && extra({ otp, idx, length })}
          </div>
        ))}
      </div>
    );
  },
};
