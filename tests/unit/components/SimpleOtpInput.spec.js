import { render, screen, cleanup } from "@testing-library/vue";
import { mount } from "@vue/test-utils";

import SimpleOtpInput from "@/components/SimpleOtpInput";

const randomText = (length) => {
  return Math.random()
    .toString()
    .substring(2, 2 + length);
};

describe("SimpleOtpInput", () => {
  afterEach(cleanup);

  describe("contents", () => {
    it("should render correct default", () => {
      const wrapper = render(SimpleOtpInput);

      const inputs = screen.queryAllByRole("textbox");
      expect(inputs.length).toBe(6);

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should forward `inputClasses`, `type` to inner inputs", () => {
      const wrapper = render(SimpleOtpInput, {
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

        render(SimpleOtpInput, {
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
    });
  });
});
