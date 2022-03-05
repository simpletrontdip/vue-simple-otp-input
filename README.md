# simple-otp-input

Simple but effective Otp input (for Vue2 only)

- Auto focus next box while typing
- Handle copy/paste nicely
- Handle mobile auto complete nicely
- Handle delete, arrow keys correctly
- Support both controlled/uncontrolled in components

# Why?

This is simple to do, but also hard to make it work correctly and handle all the case for otp.
Based on my expericences with the existing libs, I created this to handle all my needs. Hope it helps you as well.

Video for autofill in mobile page (from a friend)

https://user-images.githubusercontent.com/20158564/156875581-425dc90a-b534-4b4b-9ba9-7e72a044d2cf.MP4

# Install

```
yarn add vue-simple-otp-input
```

```js
import { SimpleOtpInput } from "vue-simple-otp-input";
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
```
