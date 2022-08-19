# simple-otp-input

![Coverage lines](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/simpletrontdip/vue-simple-otp-input/main/tests/coverage/badges/lines.json)
![Coverage functions](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/simpletrontdip/vue-simple-otp-input/main/tests/coverage/badges/functions.json)
![Coverage branches](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/simpletrontdip/vue-simple-otp-input/main/tests/coverage/badges/branches.json)
![Coverage statements](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/simpletrontdip/vue-simple-otp-input/main/tests/coverage/badges/statements.json)

Simple but effective Otp input (for Vue2 only)

- Auto focus next box while typing
- Handle copy/paste nicely
- Handle mobile auto complete nicely
- Handle delete, arrow keys correctly
- Support both controlled/uncontrolled in components
- Fully tested with real life usecases
- Zero dependencies, super small bundle size **~2.3kB gziped**

# Why?

This sounds simple to do, but hard to make it works correctly and handles all the cases for otp.
Based on my expericences with the existing libs, I created this to handle all my needs. Hope it helps you as well.

Video for autofill in mobile page (from friends)

| Safari                                                                                                                                                   | Chrome                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <video src="https://user-images.githubusercontent.com/20158564/156875581-425dc90a-b534-4b4b-9ba9-7e72a044d2cf.MP4" alt="Safari" style="max-width:300px"> | <video src="https://user-images.githubusercontent.com/20158564/159843487-a484a8d7-b130-47a2-8107-90c39211f082.MP4" alt="Chrome" style="max-width:300px"> |

Screen shot for tests and test coverage:

<img width="537" alt="Screen Shot 2022-08-16 at 10 48 25" src="https://user-images.githubusercontent.com/20158564/184794127-68ac676c-7430-4394-a356-e28d21e608f8.png">

# Install

```
yarn add vue-simple-otp-input
```

```js
import SimpleOtpInput from "vue-simple-otp-input";
```

# Demo

Look at the App.vue for more detail, or try it [here](https://simpletrontdip.github.io/vue-simple-otp-input/demo/)

```jsx
    <section class="story">
      <label>Default otp input</label>
      <SimpleOtpInput />
    </section>

    <section class="story">
      <label>Password type input</label>
      <SimpleOtpInput type="password" :length="4" />
    </section>

    <section class="story">
      <label>With inital value</label>
      <SimpleOtpInput value="123456" />
    </section>

    <section class="story">
      <label>With events</label>
      <SimpleOtpInput
        type="password"
        :length="4"
        @change="handleChange"
        @complete="handleComplete"
      />
      <div><strong>Draft</strong> {{ otp }}</div>
      <div><strong>Submitted</strong> {{ submittedOtp }}</div>
    </section>

    <section class="story">
      <label>Lazy v-model </label>
      <button @click="setLazyCodeValue">Randomize code value</button>
      <SimpleOtpInput v-model="lazyCode" />
    </section>

    <section class="story">
      <label>With extra slot to create border effect</label>
      <SimpleOtpInput
        class="otp-with-effect"
        inputClasses="input-with-effect"
        :pasteDelayMs="192"
      >
        <template v-slot:extra>
          <span class="focus-border">
            <i></i>
          </span>
        </template>
      </SimpleOtpInput>
    </section>
```

# Props

| Prop         | Default  | Description                                                                                                                 |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| length       | `6`      | Length of this otp input                                                                                                    |
| value        | `''`     | Value for this input, v-model is supported, in rare cases, you may need to use `setOtpValue` to force update internal state |
| type         | `'text'` | Html input type of each input, you may find `'password'` useful                                                             |
| inputClasses | `''`     | Inner input classess, allow you to fully control input styles                                                               |
| pasteDelayMs | `0`      | Delay for pasting content, we may want to let the animation to take effect on pasting                                       |

# Events

| Event    | Description                                         |
| -------- | --------------------------------------------------- |
| input    | Emit on every change on otp input, support v-model  |
| change   | Emit on every update on otp input                   |
| complete | Emit on key `enter`, emitted `otp` may not complete |

# Slots

- **extra**: extra content next to each input, prodived you `{ idx, otp, length }` to allow fully customization.
- You will find this helpful when adding separator between inputs, or adding some pseduo elements to get extra effect (e.g border on focus)

# Note

- To get default styling as the demo page, please import extra css file `vue-simple-otp-input/dist/vue-simple-otp-input.css` to your component.
- Or you can pasting its content there

```css
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
```

- Or just simply overriding it by your class name.
