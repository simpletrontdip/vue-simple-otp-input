# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.9.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.9.0-alpha.2...v1.9.0) (2023-03-13)

## [1.9.0-alpha.2](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.9.0-alpha.1...v1.9.0-alpha.2) (2023-01-05)


### Features

* add with-extra-span flag, simplify the extra content setup ([d7730fb](https://github.com/simpletrontdip/vue-simple-otp-input/commit/d7730fb1172067c6db5b3cc78129f44159459992))

## [1.9.0-alpha.1](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.9.0-alpha.0...v1.9.0-alpha.1) (2023-01-04)

## [1.9.0-alpha.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.8.0...v1.9.0-alpha.0) (2023-01-04)


### Features

* add hidden input to capture auto-suggestion event in ios devices ([ada654c](https://github.com/simpletrontdip/vue-simple-otp-input/commit/ada654c3d04b35cf9c57adf412221e2da6a14413))

## [1.8.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.7.0...v1.8.0) (2023-01-04)


### Features

* cannonically handle empty value, improve UX ([2c2d982](https://github.com/simpletrontdip/vue-simple-otp-input/commit/2c2d9826cefc6803f9d08de7d8a7159991c137a4))

## [1.7.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.6.0...v1.7.0) (2022-09-14)


### Features

* add `inputProps` to custom input deeper ([109d3c0](https://github.com/simpletrontdip/vue-simple-otp-input/commit/109d3c0363597de0f5edc703844ba8ca22b959c5))

## [1.6.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.5.3...v1.6.0) (2022-09-06)


### Features

* replace empty cell by a space, allow android devices to fire event correctly ([c7d89e5](https://github.com/simpletrontdip/vue-simple-otp-input/commit/c7d89e5c4becc99bead51476fc6dbbd2bdfbead2))

### [1.5.3](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.5.2...v1.5.3) (2022-08-31)

### [1.5.2](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.5.1...v1.5.2) (2022-08-30)


### Features

* **events:** utilize beforeinput event to handle backspace event better in android ([e626162](https://github.com/simpletrontdip/vue-simple-otp-input/commit/e62616248868b26b4199f9bc260b9a521b176d48))

### [1.5.1](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.5.0...v1.5.1) (2022-08-29)


### Features

* tolorate user error for not deleting out-range, refine focusable logic ([15cae8d](https://github.com/simpletrontdip/vue-simple-otp-input/commit/15cae8d8b88c59a42204a829e4504faa5fca0abc))

## [1.5.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.4.0...v1.5.0) (2022-08-25)


### Features

* setup WebOtp when applicable, handle auto completion in Android devices ([998e86f](https://github.com/simpletrontdip/vue-simple-otp-input/commit/998e86f2f73aeee342d93dc0b052b832f94cc460))

## [1.4.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.3.0...v1.4.0) (2022-08-19)


### Features

* improve events, only back if type backspace twice ([4447c75](https://github.com/simpletrontdip/vue-simple-otp-input/commit/4447c755ddd0a664035a0d3d596fb64f308f1e88))

## [1.3.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.2.0...v1.3.0) (2022-08-17)


### Features

* handle up/down key without changing focus, support input type=number ([10ad892](https://github.com/simpletrontdip/vue-simple-otp-input/commit/10ad89210bdaf143a3fac27c701b5bb4e9a2f774))

## [1.2.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.1.0...v1.2.0) (2022-08-16)


### Features

* **bundle:** move vue to peerDependencies to avoid unnecessary installing, update docs ([108ad8a](https://github.com/simpletrontdip/vue-simple-otp-input/commit/108ad8a5bfb0a1ee7b6ee9926f55afdabeb93db8))

## [1.1.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v1.0.0...v1.1.0) (2022-08-13)


### Features

* **doc:** add code coverage badges ([c624f82](https://github.com/simpletrontdip/vue-simple-otp-input/commit/c624f8215a926c6679fea9874ea9fa0484b79268))

## [1.0.0](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.16...v1.0.0) (2022-08-12)


### Features

* handle keyboard nicely while `key` instead of keyCode, robus focus+select for testing ([9827386](https://github.com/simpletrontdip/vue-simple-otp-input/commit/9827386fb07c83edebf363c653ae082b6b7256b7))
* **test:** add basic tests for content section ([04f3c9f](https://github.com/simpletrontdip/vue-simple-otp-input/commit/04f3c9f0cca8162c20b92082e609196933da1336))
* **test:** add test with tabbing, check the system modifier cases ([307b1bb](https://github.com/simpletrontdip/vue-simple-otp-input/commit/307b1bbd5668d726f0d51d8b47aa434d258f39f3))
* **test:** add tests for events handling logic ([cfcefae](https://github.com/simpletrontdip/vue-simple-otp-input/commit/cfcefaef0eace6c72b3fe2d99cc2a65e6b47be81))
* **test:** add tests for instance methods, not sure why ([4cac7d4](https://github.com/simpletrontdip/vue-simple-otp-input/commit/4cac7d48c84e6a752164d85ee6a4b5ba555c8614))
* **test:** add tests for pasting events ([8512409](https://github.com/simpletrontdip/vue-simple-otp-input/commit/8512409dcf6bf496c474ef5ec0294332c555242a))
* **test:** separate sfc into 3 files to get better coverage report ([7023bcb](https://github.com/simpletrontdip/vue-simple-otp-input/commit/7023bcbd7235c177d8f139f156c48014c165d0f8))
* **test:** utilize userEvent to test keyboard event nicer ([f34cb06](https://github.com/simpletrontdip/vue-simple-otp-input/commit/f34cb06266aff06d0799398392e3fac59887ea82))

### [0.1.16](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.15...v0.1.16) (2022-08-10)


### Bug Fixes

* **event:** update inner otp by $set to trigger reactivity ([ce42b5c](https://github.com/simpletrontdip/vue-simple-otp-input/commit/ce42b5c5e2a73e3587a2eeefe771c2ea3c91ee77))

### [0.1.15](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.14...v0.1.15) (2022-08-10)


### Features

* emit update event, watch value to support v-model ([6c79c64](https://github.com/simpletrontdip/vue-simple-otp-input/commit/6c79c64601a29eb5919a3a08714f63f9b09b14fe))

### [0.1.14](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.13...v0.1.14) (2022-03-16)


### Features

* **chrome:** add input event handler, to better support chome auto suggestion event ([147986d](https://github.com/simpletrontdip/vue-simple-otp-input/commit/147986d97624ae309dba13de20b8d2144ed52f94))

### [0.1.13](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.12...v0.1.13) (2022-03-07)


### Features

* handle paste event on child, better support mobile device paste ([28cc9b3](https://github.com/simpletrontdip/vue-simple-otp-input/commit/28cc9b325de4a4f1397422ca07ef3cb4fbee9eb4))

### [0.1.12](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.11...v0.1.12) (2022-03-07)


### Features

* add extra slot to allow component to customize input effect ([985cb35](https://github.com/simpletrontdip/vue-simple-otp-input/commit/985cb35ea9d1fa66342086489ead3ca20ddfee31))
* add pasteDelayMs to allow updating value in a more realistic way ([f9c964b](https://github.com/simpletrontdip/vue-simple-otp-input/commit/f9c964b036517da13185a5377c559200efe8d527))
* **demo:** update demo for border effect with paste delay ([006c2dd](https://github.com/simpletrontdip/vue-simple-otp-input/commit/006c2dd674da63eb5cee436bef2f8f585ab52f12))
* **docs:** update example code, extra props, slot to documentation ([11a8b7e](https://github.com/simpletrontdip/vue-simple-otp-input/commit/11a8b7eb90c3ca69a6c07cc63c8bd369c955d648))

### [0.1.11](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.10...v0.1.11) (2022-03-07)


### Features

* **docs:** add props and events table ([761a277](https://github.com/simpletrontdip/vue-simple-otp-input/commit/761a277dab92d4f941dc3f743b415fc1ddbea016))
* **UX:** better handling backspace key, allow editing 1 specific box ([81d16b4](https://github.com/simpletrontdip/vue-simple-otp-input/commit/81d16b4d9d92194dcce9f56755477474beaec9b7))

### [0.1.10](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.9...v0.1.10) (2022-03-05)


### Features

* **readme:** add video for autofill demonstration ([a08eb3e](https://github.com/simpletrontdip/vue-simple-otp-input/commit/a08eb3ef1ff8fe1bb9833a3e1b300cf401048c92))

### [0.1.9](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.8...v0.1.9) (2022-03-05)


### Features

* **build:** exclude core js from babel buid, reduce bundle size ([6327dac](https://github.com/simpletrontdip/vue-simple-otp-input/commit/6327dac069466e0d0d2c3a2f8a521d3de4401385))

### [0.1.8](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.7...v0.1.8) (2022-03-05)

### [0.1.7](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.6...v0.1.7) (2022-03-05)

### [0.1.6](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.5...v0.1.6) (2022-03-05)

### [0.1.5](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.4...v0.1.5) (2022-03-05)


### Features

* **page:** Update demo page ([fd16d2c](https://github.com/simpletrontdip/vue-simple-otp-input/commit/fd16d2cb123706d18466fc8313188d8611fef7ce))

### [0.1.4](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.3...v0.1.4) (2022-03-05)


### Features

* **build:** add conventional commit linter ([d1c1795](https://github.com/simpletrontdip/vue-simple-otp-input/commit/d1c17956d429f266bdb780fe59af9583b0ef1ce1))

### [0.1.3](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.2...v0.1.3) (2022-03-05)

### [0.1.2](https://github.com/simpletrontdip/vue-simple-otp-input/compare/v0.1.1...v0.1.2) (2022-03-05)

### 0.1.1 (2022-03-05)
