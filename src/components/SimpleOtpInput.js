const BACKSPACE = "Backspace";
const DELETE = "Delete";
const LEFT_ARROW = "ArrowLeft";
const RIGHT_ARROW = "ArrowRight";
const UP_ARROW = "ArrowUp";
const DOWN_ARROW = "ArrowDown";
const SHIFT = "Shift";
const CTRL = "Ctrl";
const ALT = "Alt";
const TAB = "Tab";
const ENTER = "Enter";

const CMD_CODE = 91;
const OS_CODE = 224;
const UNDEFINED_CODE = 229;

const fillArrToLength = (str, len, val = "") =>
  // fill all then slice later
  Array.from(str).concat(new Array(len).fill(val)).slice(0, len);

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
      type: [String, Array, Object],
      default: undefined,
    },
    pasteDelayMs: {
      type: Number,
      default: 0,
    },
    withWebOtp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      otp: fillArrToLength(this.value, this.length),
      lastKey: null,
      ac: null,
    };
  },
  computed: {
    otpValue() {
      return this.otp.map((item) => item || " ").join("");
    },
    lastFocusable() {
      for (let idx = this.length; idx > 0; idx--) {
        if (this.otp[idx - 1]) {
          return idx;
        }
      }
      return 0;
    },
    inputAttrs() {
      return this.type === "number"
        ? {
            inputmode: "numeric",
            min: "0",
            max: "9",
          }
        : {};
    },
  },
  mounted() {
    if (!this.value) {
      this.setupSmsOtp();
    }
  },
  watch: {
    value(val) {
      if (val !== this.otpValue) {
        this.otp = fillArrToLength(val, this.length);
      }
    },
  },
  methods: {
    setupSmsOtp() {
      // listen for Chrome SMS Otp API
      if (!this.withWebOtp || !("OTPCredential" in window)) {
        return;
      }

      this.ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: this.ac.signal,
        })
        .then((otp) => {
          this.setOtpValue(otp.code);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.ac = null;
        });
    },
    emitChange() {
      // this give user a better change recognition
      this.$emit("change", this.otpValue);
      // mimicking to support v-model
      this.$emit("input", this.otpValue);
    },
    emitComplete() {
      this.$emit("complete", this.otpValue);

      if (this.ac) {
        this.ac.abort();
      }
    },
    emitEvents(idx, deleting) {
      this.emitChange();

      if (!deleting && idx === this.length - 1) {
        // emit events on last index if not deleting
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
      if (idx > this.lastFocusable) {
        this.focusInput(this.lastFocusable);
      } else {
        // select input content
        this.$refs.inputs[idx].select();
      }
    },
    childKeyUp(event, idx) {
      const { keyCode, key } = event;

      if (
        // Ignore system modifiers keys
        key === SHIFT ||
        key === TAB ||
        key === ALT ||
        key === CTRL ||
        keyCode === CMD_CODE ||
        keyCode === OS_CODE ||
        keyCode === UNDEFINED_CODE ||
        // ignore default keys for number input
        key === UP_ARROW ||
        key === DOWN_ARROW
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
      } else if (key === RIGHT_ARROW && idx < this.length - 1) {
        // Right arrow, go to the next field.
        this.focusInput(idx + 1);
      } else if (
        key !== BACKSPACE &&
        key !== DELETE &&
        key !== LEFT_ARROW &&
        count === 1 &&
        idx < this.length - 1
      ) {
        this.focusInput(idx + 1);
      }

      this.lastKey = key;
    },
    childBeforeInput(event, idx) {
      // XXX This happens before the change on `@input`, so the value hasn't been updated
      // fallback for keyUp on Android Chrome, hopefully can handle backspaces better
      const { inputType } = event;

      if (inputType === "deleteContentBackward") {
        // We will do the deletion here, regardless the selection range
        this.$set(this.otp, idx, "");
        // Emit the change
        this.emitChange(idx);

        if (inputType === this.lastInputType && idx > 0) {
          // back to previous field if repeated
          setTimeout(() => {
            // make sure we did not double delete, because of next `@input`
            this.focusInput(idx - 1);
          });
        }
      }

      this.lastInputType = inputType;
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

      // If the target is populated too quickly, count can be > 1
      if (count > 1) {
        // set multiple value with effects
        this.setOtpValue(value, idx);
      } else {
        // update single value
        this.$set(this.otp, idx, value);
        // Emit change for this
        this.emitEvents(idx, !count);
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
              {...{ attrs: this.inputAttrs }}
              class={["otp-single-input", inputClasses]}
              onFocus={(event) => this.childFocus(event, idx)}
              onKeyup={(event) => this.childKeyUp(event, idx)}
              onPaste={(event) => this.childPaste(event, idx)}
              onInput={(event) => this.childInput(event, idx)}
              onBeforeinput={(event) => this.childBeforeInput(event, idx)}
              data-testid={`otp-single-input-${idx}`}
            />
            {extra && extra({ otp, idx, length })}
          </div>
        ))}
      </div>
    );
  },
};
