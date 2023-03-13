import { render, cleanup, fireEvent, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";

import SimpleOtpInput from "@/components/SimpleOtpInput";

const randomText = (length) => {
  return Math.random()
    .toString()
    .substring(2, 2 + length);
};

describe("SimpleOtpInput", () => {
  describe("contents", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should render correct default", () => {
      wrapper = render(SimpleOtpInput);

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render `inputClasses`, `type` correctly to inner inputs", () => {
      wrapper = render(SimpleOtpInput, {
        props: {
          inputClasses: "some-class or-more-class",
          type: "number",
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      inputs.forEach((el) => {
        expect(el.classList).toContain("some-class");
        expect(el.classList).toContain("or-more-class");
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render `inputProps`, correctly to inner inputs", () => {
      wrapper = render(SimpleOtpInput, {
        props: {
          type: "number",
          inputProps: {
            pattern: "[0-9]*",
            type: "text",
          },
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      inputs.forEach((el) => {
        // `inputProps` override default `type`, to allow fully customized
        expect(el.getAttribute("type")).toBe("text");
        expect(el.getAttribute("pattern")).toBe("[0-9]*");
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render correctly with `length` and `value`", () => {
      [4, 5, 6, 7].forEach((length) => {
        const value = randomText(length);

        const wrapper = render(SimpleOtpInput, {
          props: {
            length,
            value,
          },
        });

        const inputs = document.querySelectorAll("input.otp-single-input");
        expect(inputs.length).toBe(length);

        inputs.forEach((el, idx) => {
          expect(el.value).toBe(value.charAt(idx));
        });

        cleanup();
        wrapper.unmount();
      });
    });

    it("should render correctly `withExtraSpan`", () => {
      const length = 6;
      const value = randomText(length);

      wrapper = render(SimpleOtpInput, {
        props: {
          length,
          value,
          withExtraSpan: true,
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(length);

      inputs.forEach((el, idx) => {
        expect(el.value).toBe(value.charAt(idx));
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render slot `extra` correctly", () => {
      const value = "SimpleOtpInput";

      const wrapper = mount(SimpleOtpInput, {
        attachTo: document.body,
        propsData: {
          value,
          length: value.length,
        },
        scopedSlots: {
          extra({ otp, idx }) {
            const text = otp[idx];
            return (
              <span class="extra-slot">
                <i>{{ text }}</i>
              </span>
            );
          },
        },
      });

      expect(wrapper.text().replaceAll(" ", "")).toBe(value);
      expect(wrapper.html()).toMatchSnapshot();

      wrapper.destroy();
    });
  });

  describe("events", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should emit `change` on every update", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      wrapper = render({
        template: `<SimpleOtpInput @change="handleChange" />`,
        components: {
          SimpleOtpInput,
        },
        methods: {
          handleChange,
        },
      });

      const input = document.querySelector("input");

      await user.click(input);
      await user.keyboard("123");

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(3);
      });
    });

    it("should emit `complete` on last input update or 'enter' key", async () => {
      const user = userEvent.setup();
      const handleComplete = jest.fn();

      wrapper = render({
        template: `<SimpleOtpInput @complete="handleComplete" />`,
        components: {
          SimpleOtpInput,
        },
        methods: {
          handleComplete,
        },
      });

      const input = document.querySelector("input");

      await user.type(input, "123456");
      await waitFor(() => {
        expect(handleComplete).toHaveBeenCalledTimes(1);
      });

      await user.type(input, "{enter}");
      await waitFor(() => {
        expect(handleComplete).toHaveBeenCalledTimes(2);
      });

      // focus on last input
      await user.click(
        document.querySelector("[data-testid=otp-single-input-5]")
      );

      // change on last input
      await user.keyboard("{backspace}");
      await waitFor(() => {
        // but complete should not trigger
        expect(handleComplete).toHaveBeenCalledTimes(2);
      });
    });

    it("should support v-model", async () => {
      const user = userEvent.setup();
      wrapper = render({
        data() {
          return { otp: "a c " };
        },
        template: `<div>
          <SimpleOtpInput v-model="otp" />
          <div data-testid="output">{{ otp }}</div>
          <button data-testid="button" @click="setOtpValue">Update</button>
        </div>`,
        components: {
          SimpleOtpInput,
        },
        methods: {
          setOtpValue() {
            this.otp = "654321";
          },
        },
      });

      const input = document.querySelector("input");
      const output = document.querySelector("[data-testid='output']");
      const button = document.querySelector("[data-testid='button']");

      // string value should accept spaces
      expect(output.innerHTML.trim()).toBe("a c");

      // update from input
      // XXX `userEvent.type` will send key by key of an input,
      // but here we want a race-condition when user type fast enough set long text to 1 input
      await fireEvent.update(input, "123");
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe("123");
      });

      // set from outside
      await user.click(button);
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe("654321");
      });
    });
  });

  describe("accessibilities", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should auto focus on first empty input", async () => {
      const user = userEvent.setup();
      let value = "123";
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "123",
          length: 6,
        },
        listeners: {
          change(val) {
            value = val;
          },
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      // it's OK to focus first input
      await user.click(inputs[0]);
      expect(document.activeElement).toEqual(inputs[0]);

      // focus on first empty input
      await user.click(inputs[3]);
      expect(document.activeElement).toEqual(inputs[3]);

      // focus change to first empty input
      await user.click(inputs[5]);
      expect(document.activeElement).toEqual(inputs[3]);

      // 4 (empty) -> (backspace)x2 -> 3 --> (backspace)x3 -> 1 empty
      await user.keyboard(
        "{backspace}{backspace}{backspace}{backspace}{backspace}"
      );

      await waitFor(() => {
        expect(value.trim()).toBe("");
      });

      await user.click(inputs[5]);
      expect(document.activeElement).toEqual(inputs[0]);

      // enter something
      await user.keyboard("1234");
      await waitFor(() => {
        expect(value.trim()).toBe("1234");
      });

      await user.click(inputs[2]);
      // 3 -> (backspace)x2 -> 2 -> (backspace)x2 -> 1 empty
      await user.keyboard("{backspace}{backspace}{backspace}{backspace}");

      await waitFor(() => {
        expect(value).toBe("   4  ");
      });

      // can focus on any input before input 5 even if they are empty
      await user.click(inputs[2]);
      expect(document.activeElement).toEqual(inputs[2]);

      await user.click(inputs[1]);
      expect(document.activeElement).toEqual(inputs[1]);

      await user.click(inputs[4]);
      expect(document.activeElement).toEqual(inputs[4]);

      // this still not focusable
      await user.click(inputs[5]);
      expect(document.activeElement).toEqual(inputs[4]);
    });

    it("should auto focus next input while typing", async () => {
      const user = userEvent.setup({
        skipClick: true,
        skipHover: true,
      });

      let value = "";
      const handleComplete = jest.fn();

      wrapper = render(SimpleOtpInput, {
        props: {
          length: 4,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
          complete: handleComplete,
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");

      // click on first input
      await user.click(inputs[0]);

      // start typing
      await user.keyboard("1");
      expect(value.trim()).toBe("1");

      await user.keyboard("2");
      expect(value.trim()).toBe("12");

      await user.keyboard("3");
      expect(value.trim()).toBe("123");

      await user.keyboard("4");
      expect(value.trim()).toBe("1234");

      // handle complete has been called
      expect(handleComplete).toHaveBeenCalledWith("1234");
    });

    it("should handle `arrows/backspace` keys nicely", async () => {
      const user = userEvent.setup();

      let value = "1234";
      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          length: 4,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });
      const inputs = document.querySelectorAll("input.otp-single-input");

      // focus first input
      await user.click(inputs[0]);
      expect(document.activeElement).toEqual(inputs[0]);

      // 1 -{right}-> 2
      await user.keyboard("{arrowright}");
      expect(document.activeElement).toEqual(inputs[1]);

      // 2 -{right}-> 3
      await user.keyboard("{arrowright}");
      expect(document.activeElement).toEqual(inputs[2]);

      // 3 -{left}-> 2
      await user.keyboard("{arrowleft}");
      expect(document.activeElement).toEqual(inputs[1]);

      // 2 -"A"-> 3
      await user.keyboard("A");
      expect(value.trim()).toBe("1A34");
      expect(document.activeElement).toEqual(inputs[2]);

      // 2 -"B"-> 4
      await user.keyboard("B");
      expect(value.trim()).toBe("1AB4");
      expect(document.activeElement).toEqual(inputs[3]);

      // 4 -{backspace}-> 4
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("1AB");
      expect(document.activeElement).toEqual(inputs[3]);

      // 4 -{backspace}-> 3 (double backspaces)
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("1AB");
      expect(document.activeElement).toEqual(inputs[2]);

      // 3 -{backspace}{backspace}-> 1
      await user.keyboard("{backspace}{backspace}");
      expect(value.trim()).toBe("1");
      expect(document.activeElement).toEqual(inputs[0]);

      // 1 -{backspace}-> 1 (cleared field)
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("");
      expect(document.activeElement).toEqual(inputs[0]);

      // 1 -"ABCD"-> 4
      await user.keyboard("ABCD");
      expect(document.activeElement).toEqual(inputs[3]);

      // click at 3rd
      await user.click(inputs[2]);
      expect(document.activeElement).toEqual(inputs[2]);

      // 3 -{backspace}-> 3 (cleared field)
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("AB D");
      expect(document.activeElement).toEqual(inputs[2]);

      // 3 -{backspace}-> 2 (because double backspace typed)
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("AB D");
      expect(document.activeElement).toEqual(inputs[1]);

      // 2 -{backspace}-> 1 (cleared field 2)
      await user.keyboard("{backspace}");
      expect(value.trim()).toBe("A  D");
      expect(document.activeElement).toEqual(inputs[0]);
    });

    it("should tolorate `delete/backspace` keys with false selectd range", async () => {
      const user = userEvent.setup();
      let value = "123";
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "123",
          length: 6,
        },
        listeners: {
          change(val) {
            value = val;
          },
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      await user.click(inputs[1]);
      // intentionally unselect the default range, put cursor at the start, now backspace won't work by default
      inputs[1].setSelectionRange(0, 0);

      await user.keyboard("{backspace}");
      await waitFor(() => {
        expect(value).toBe("1 3   ");
      });

      await user.keyboard("{backspace}");
      expect(document.activeElement).toBe(inputs[0]);
    });

    it("should not interfere system default binding", async () => {
      const user = userEvent.setup();
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "1234",
          length: 4,
        },
      });
      const inputs = document.querySelectorAll("input.otp-single-input");

      // focus on first input
      await user.click(inputs[0]);

      // 1 -{tab}{tab}-> 3
      await user.keyboard("{tab}{tab}");
      expect(document.activeElement).toBe(inputs[2]);

      // 2 -{shift-tab}-> 1
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(inputs[1]);
    });

    it("should not change focus on up/down arrow keys", async () => {
      const user = userEvent.setup();
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "15",
          length: 2,
          type: "number",
        },
      });
      const inputs = document.querySelectorAll("input.otp-single-input");

      // focus on first input
      await user.click(inputs[0]);

      // 1 -{arrowup}{arrowup}-> 1 (value = 3)
      await user.keyboard("{arrowup}{arrowup}");
      expect(document.activeElement).toBe(inputs[0]);
      // XXX some dom won't handle this, so we won't test
      // expect(document.activeElement.value).toBe("3");

      // 1 -{tab}-> 2
      await user.keyboard("{tab}");
      expect(document.activeElement).toBe(inputs[1]);

      // 2 -{arrowdown}{arrowdown}-> 2
      await user.keyboard("{arrowdown}{arrowup}{arrowdown}{arrowdown}");
      expect(document.activeElement).toBe(inputs[1]);
      // XXX some dom won't handle this, so we won't test
      // expect(document.activeElement.value).toBe("3");
    });
  });

  describe("for Android Chrome", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it('should have correct inputmode and type for "number"', () => {
      const mockUserAgent = jest.spyOn(navigator, "userAgent", "get");
      mockUserAgent.mockReturnValue("Android Chrome");
      wrapper = render(SimpleOtpInput, {
        props: {
          inputClasses: "some-class or-more-class",
          type: "number",
        },
      });

      const inputs = document.querySelectorAll("input.otp-single-input");
      expect(inputs.length).toBe(6);

      inputs.forEach((el) => {
        expect(el.classList).toContain("some-class");
        expect(el.classList).toContain("or-more-class");
      });

      expect(wrapper.html()).toMatchSnapshot();
      mockUserAgent.mockClear();
    });

    it("should detect backward deletion and move focus backward", async () => {
      const mockUserAgent = jest.spyOn(navigator, "userAgent", "get");
      const user = userEvent.setup();
      mockUserAgent.mockReturnValue("Android Chrome");

      let value = "1234";
      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          length: 4,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });
      const inputs = document.querySelectorAll("input.otp-single-input");

      // focus first input
      await user.click(inputs[2]);
      expect(document.activeElement).toEqual(inputs[2]);

      await user.keyboard("{backspace}");
      expect(document.activeElement).toEqual(inputs[1]);
      expect(value).toBe("12 4");

      // await user.keyboard("{backspace}");

      await user.keyboard("A");
      expect(document.activeElement).toEqual(inputs[2]);
      expect(value).toBe("1A 4");

      await user.keyboard("{backspace}{backspace}{backspace}");
      expect(document.activeElement).toEqual(inputs[0]);
      expect(value).toBe("   4");

      mockUserAgent.mockClear();
    });
  });

  describe("pasting", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should handle paste content nicely", async () => {
      const user = userEvent.setup();

      let value = "";
      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          length: 4,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });
      const inputs = document.querySelectorAll("input.otp-single-input");

      // focus first input
      await user.click(inputs[0]);
      await user.paste("ABCD");

      await waitFor(() => {
        expect(value.trim()).toBe("ABCD");
        expect(document.activeElement).toBe(inputs[3]);
      });

      // paste invalid value -> nothing change
      await user.paste();
      expect(value.trim()).toBe("ABCD");

      // focus on 2nd input
      await user.click(inputs[1]);
      await user.paste("ABCD");

      await waitFor(() => {
        expect(value.trim()).toBe("AABC");
        expect(document.activeElement).toBe(inputs[3]);
      });
    });
  });

  describe("webOtp", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    const makeMockNavigatorCreds = ({ code, error, timeout }) => ({
      get({ otp, signal }) {
        expect(otp).toEqual({ transport: ["sms"] });
        expect(signal).toBeDefined();

        if (error) {
          return Promise.reject(error);
        }

        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                type: "otp",
                code,
              }),
            timeout || 0
          )
        );
      },
    });

    const setupFakeWebOtp = (params) => {
      const originalNavigatorCreds = window.navigator.credentials;

      window.OTPCredential = true;
      window.navigator.credentials = makeMockNavigatorCreds(params);

      return () => {
        delete window.OTPCredential;
        window.navigator.credentials = originalNavigatorCreds;
      };
    };

    it("do nothing when WebOtp is not supported", () => {
      const isSupported = "OTPCredential" in window;
      expect(isSupported).toBeFalsy();

      wrapper = render({
        mounted() {
          // no AbortController is created
          expect(this.$refs.otpInstance.ac).toBeFalsy();
        },
        template: `<div>
          <SimpleOtpInput ref="otpInstance" />
        </div>`,
        components: {
          SimpleOtpInput,
        },
      });
    });

    it("setup sms otp correctly otherwise", async () => {
      const spiedAbort = jest.spyOn(AbortController.prototype, "abort");
      const cleanupFn = setupFakeWebOtp({ code: "333333" });

      let value = null;
      wrapper = render(SimpleOtpInput, {
        props: {
          withWebOtp: true,
        },
        listeners: {
          complete: (val) => {
            value = val;
          },
        },
      });

      // value is empty at first
      expect(value).toBeFalsy();

      await waitFor(() => {
        // the mock sms otp returned
        expect(value).toBe("333333");
        expect(spiedAbort).toHaveBeenCalledTimes(0);
      });

      cleanupFn();
    });

    it("handle user rejection error nicely", async () => {
      const spiedAbort = jest.spyOn(AbortController.prototype, "abort");
      const cleanupFn = setupFakeWebOtp({ error: "Action cancelled by user" });
      const user = userEvent.setup();

      let value = null;
      wrapper = render(SimpleOtpInput, {
        props: {
          withWebOtp: true,
        },
        listeners: {
          complete: (val) => {
            value = val;
          },
        },
      });

      // value is empty at first
      expect(value).toBeFalsy();

      await waitFor(() => {
        // the mock sms otp rejected
        expect(value).toBeFalsy();
        expect(spiedAbort).toHaveBeenCalledTimes(0);
      });

      // enter something after error
      await user.click(document.querySelector("input"));
      await user.paste("111111");

      await waitFor(() => {
        // input should work as usual
        expect(value).toBe("111111");
      });

      cleanupFn();
    });

    it("listener can be canceled when user complete it manually", async () => {
      const spiedAbort = jest.spyOn(AbortController.prototype, "abort");
      const cleanupFn = setupFakeWebOtp({ code: "333333", timeout: 2000 });

      const user = userEvent.setup();

      let value = null;
      wrapper = render(SimpleOtpInput, {
        props: {
          withWebOtp: true,
        },
        listeners: {
          complete: (val) => {
            value = val;
          },
        },
      });

      // value is empty at first
      expect(value).toBeFalsy();
      await user.click(document.querySelector("input"));
      await user.paste("111111");

      await waitFor(() => {
        // the mock sms otp is aborted before returning
        expect(value).toBe("111111");
        expect(spiedAbort).toHaveBeenCalledTimes(1);
      });

      cleanupFn();
    });
  });

  describe("focus grabber", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should render hidden input correctly", async () => {
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "1234",
          withFocusGrabber: true,
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
      const hiddenInput = document.querySelector("input.hidden-otp-input");

      expect(hiddenInput).toBeDefined();
    });

    it("should handle input events correctly", async () => {
      const user = userEvent.setup();
      let value = "";

      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          withFocusGrabber: true,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });

      const hiddenInput = document.querySelector("input.hidden-otp-input");
      const inputs = document.querySelectorAll("input.otp-single-input");

      await user.click(hiddenInput);
      // real focus to hidden input
      expect(document.activeElement).toEqual(hiddenInput);
      // but active style should be input 0
      expect(inputs[0].classList).toContain("active");

      await user.keyboard("123");
      expect(value).toBe("123   ");

      // now active element is moved
      expect(document.activeElement).toBe(inputs[3]);
      // input value should be cleared
      expect(hiddenInput.value).toEqual("");

      await user.paste("45");
      expect(value).toBe("12345 ");
    });

    it("should handle paste event correctly", async () => {
      const user = userEvent.setup();
      let value = "";

      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          withFocusGrabber: true,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });

      const hiddenInput = document.querySelector("input.hidden-otp-input");
      const inputs = document.querySelectorAll("input.otp-single-input");

      await user.click(hiddenInput);
      // real focus to hidden input
      expect(document.activeElement).toEqual(hiddenInput);
      // but active style should be input 0
      expect(inputs[0].classList).toContain("active");

      await user.paste("123");
      await waitFor(() => {
        expect(value).toBe("123   ");
      });

      // now active element is moved
      expect(document.activeElement).toBe(inputs[3]);
      // input value should be cleared
      expect(hiddenInput.value).toEqual("");

      await user.paste("45");
      expect(value).toBe("12345 ");
    });

    it("should auto blur when input is empty", async () => {
      const user = userEvent.setup();
      let value = "";

      wrapper = render(SimpleOtpInput, {
        props: {
          value,
          withFocusGrabber: true,
        },
        listeners: {
          change: (val) => {
            value = val;
          },
        },
      });

      const hiddenInput = document.querySelector("input.hidden-otp-input");
      const inputs = document.querySelectorAll("input.otp-single-input");

      await user.click(hiddenInput);
      // real focus to hidden input
      expect(document.activeElement).toEqual(hiddenInput);
      // but active style should be input 0
      expect(inputs[0].classList).toContain("active");

      await user.keyboard("123");
      expect(value).toBe("123   ");

      // now active element is moved
      expect(document.activeElement).toBe(inputs[3]);
      // input value should be cleared
      expect(hiddenInput.value).toEqual("");

      await user.keyboard(
        "{backspace}{backspace}{backspace}{backspace}{backspace}"
      );
      await waitFor(() => {
        expect(value.trim()).toBe("");
      });

      // firstly, it should be focus to input[0]
      expect(document.activeElement).toBe(inputs[0]);
      await waitFor(
        () => {
          // it should blur
          expect(document.activeElement !== inputs[0]).toBeTruthy();
        },
        {
          timeout: 2000,
        }
      );
    });
  });

  describe("instance api (not recommended, use v-model instead)", () => {
    let wrapper;

    afterEach(() => {
      wrapper && wrapper.unmount();
      cleanup();
    });

    it("should support `getOtpValue`", async () => {
      const user = userEvent.setup();
      const expectedOtpValue = randomText(6);

      wrapper = render({
        data() {
          return {
            expectedOtpValue,
            outputOtpValue: "",
          };
        },
        template: `<div>
          <SimpleOtpInput ref="otpInstance" :value="expectedOtpValue" />
          <div data-testid="output">{{ outputOtpValue }}</div>
          <button data-testid="button" @click="calulateOtpValue">Calculate</button>
        </div>`,
        components: {
          SimpleOtpInput,
        },
        methods: {
          calulateOtpValue() {
            this.outputOtpValue = this.$refs.otpInstance.getOtpValue();
          },
        },
      });

      const output = document.querySelector("[data-testid='output']");
      const button = document.querySelector("[data-testid='button']");

      await user.click(button);
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe(expectedOtpValue);
      });
    });

    it("should support `setOtpValue`", async () => {
      const user = userEvent.setup();
      const expectedOtpValue = randomText(6);

      wrapper = render({
        data() {
          return {
            expectedOtpValue,
            outputOtpValue: "",
          };
        },
        template: `<div>
          <SimpleOtpInput ref="otpInstance" v-model="outputOtpValue" />
          <div data-testid="output">{{ outputOtpValue }}</div>
          <button data-testid="button" @click="setOtpValue">Update</button>
        </div>`,
        components: {
          SimpleOtpInput,
        },
        methods: {
          setOtpValue() {
            this.$refs.otpInstance.setOtpValue(this.expectedOtpValue);
          },
        },
      });

      const output = document.querySelector("[data-testid='output']");
      const button = document.querySelector("[data-testid='button']");

      await user.click(button);
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe(expectedOtpValue);
      });
    });
  });
});
