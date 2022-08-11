import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/vue";
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

      const inputs = screen.queryAllByRole("textbox");
      expect(inputs.length).toBe(6);

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should forward `inputClasses`, `type` to inner inputs", () => {
      wrapper = render(SimpleOtpInput, {
        props: {
          inputClasses: "some-class or-more-class",
          type: "number",
        },
      });

      const inputs = document.querySelectorAll("input");
      expect(inputs.length).toBe(6);

      inputs.forEach((el) => {
        expect(el.classList).toContain("some-class");
        expect(el.classList).toContain("or-more-class");
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

        const inputs = screen.queryAllByRole("textbox");
        expect(inputs.length).toBe(length);

        inputs.forEach((el, idx) => {
          expect(el.value).toBe(value.charAt(idx));
        });

        cleanup();
        wrapper.unmount();
      });
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

      await fireEvent.update(input, "123");
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(3);
      });
    });

    it("should emit `complete` on last input update or 'enter' key", async () => {
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

      await fireEvent.update(input, "123456");
      await waitFor(() => {
        expect(handleComplete).toHaveBeenCalledTimes(1);
      });

      await fireEvent.keyUp(input, { keyCode: 13 });
      await waitFor(() => {
        expect(handleComplete).toHaveBeenCalledTimes(2);
      });
    });

    it("should support v-model", async () => {
      wrapper = render({
        data() {
          return { otp: "" };
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

      // update from input
      await fireEvent.update(input, "123");
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe("123");
      });

      // set from outside
      await fireEvent.click(button);
      await waitFor(() => {
        expect(output.innerHTML.trim()).toBe("654321");
      });
    });
  });
});
