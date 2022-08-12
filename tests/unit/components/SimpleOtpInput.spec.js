import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/vue";
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

      await user.type(input, "123");
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
    });

    it("should support v-model", async () => {
      const user = userEvent.setup();
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
      wrapper = render(SimpleOtpInput, {
        props: {
          value: "123",
          length: 6,
        },
      });

      const inputs = document.querySelectorAll("input");
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

      // value now empty
      await wrapper.updateProps({
        value: "",
      });

      await user.click(inputs[5]);
      expect(document.activeElement).toEqual(inputs[0]);
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

      const inputs = document.querySelectorAll("input");

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
      const inputs = document.querySelectorAll("input");

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

      // 4 -{backspace}-> 3
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
      const inputs = document.querySelectorAll("input");

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
});
