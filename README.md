# simple-otp-input

Simple but effective Otp input (for Vue2 only)

- Auto focus next box while typing
- Handle copy/paste nicely
- Handle mobile auto complete nicely
- Handle delete, arrow keys correctly
- Support both controlled/uncontrolled in components

# Why?

This is a simple to do, but also hard to make it work correctly and handle all the case for otp.
Based on my expericences with the existing libs, I created this to handle all my needs. Hope it helps you as well.

# Install

# Demo

Look at the App.vue for more detail

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
      <label>With event</label>
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
