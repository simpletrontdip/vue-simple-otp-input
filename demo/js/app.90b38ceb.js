(function(t){function e(e){for(var i,r,u=e[0],a=e[1],l=e[2],c=0,f=[];c<u.length;c++)r=u[c],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&f.push(o[r][0]),o[r]=0;for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&(t[i]=a[i]);p&&p(e);while(f.length)f.shift()();return s.push.apply(s,l||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],i=!0,u=1;u<n.length;u++){var a=n[u];0!==o[a]&&(i=!1)}i&&(s.splice(e--,1),t=r(r.s=n[0]))}return t}var i={},o={app:0},s=[];function r(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=i,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],a=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var p=a;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},"56d7":function(t,e,n){"use strict";n.r(e);var i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("h4",[t._v("Vue SimpleOtpInput")]),n("section",{staticClass:"story"},[n("label",[t._v("Default otp input")]),n("SimpleOtpInput")],1),n("section",{staticClass:"story"},[n("label",[t._v("Password type input")]),n("SimpleOtpInput",{attrs:{type:"password",length:4}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With inital value")]),n("SimpleOtpInput",{attrs:{type:"number",value:"123456"}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With events")]),n("SimpleOtpInput",{attrs:{type:"password",length:4},on:{change:t.handleChange,complete:t.handleComplete}}),n("div",[n("strong",[t._v("Draft")]),t._v(" "+t._s(t.otp))]),n("div",[n("strong",[t._v("Submitted")]),t._v(" "+t._s(t.submittedOtp))])],1),n("section",{staticClass:"story"},[n("label",[t._v("Lazy v-model ")]),n("button",{on:{click:t.setLazyCodeValue}},[t._v("Randomize code value")]),n("SimpleOtpInput",{model:{value:t.lazyCode,callback:function(e){t.lazyCode=e},expression:"lazyCode"}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With extra slot to create border effect")]),n("SimpleOtpInput",{staticClass:"otp-with-effect",attrs:{inputClasses:"input-with-effect",pasteDelayMs:192,withWebOtp:""},scopedSlots:t._u([{key:"extra",fn:function(){return[n("span",{staticClass:"focus-border"},[n("i")])]},proxy:!0}])})],1)])},s=[];function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l="Backspace",p="ArrowLeft",c="ArrowUp",f="ArrowDown",h="Shift",d="Ctrl",m="Alt",y="Tab",v="Enter",b=91,g=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return Array.from(t).concat(new Array(e).fill(n)).slice(0,e)},O={name:"SimpleOtpInput",emits:["input","change","complete"],props:{length:{type:Number,default:6},value:{type:String,default:""},type:{type:String,default:"text"},inputClasses:{type:String,default:void 0},pasteDelayMs:{type:Number,default:0},withWebOtp:{type:Boolean,default:!1}},data:function(){return{otp:g(this.value,this.length),lastKey:null,ac:null}},computed:{otpValue:function(){return this.otp.map((function(t){return t||" "})).join("")},inputAttrs:function(){return"number"===this.type?{inputmode:"numeric",min:"0",max:"9"}:{}}},mounted:function(){this.value||this.setupSmsOtp()},watch:{value:function(t){t!==this.otpValue&&(this.otp=g(t,this.length))}},methods:{setupSmsOtp:function(){var t=this;this.withWebOtp&&"OTPCredential"in window&&(this.ac=new AbortController,navigator.credentials.get({otp:{transport:["sms"]},signal:this.ac.signal}).then((function(e){t.setOtpValue(e.code)})).catch((function(t){console.log(t)})).finally((function(){t.ac=null})))},emitChange:function(){this.$emit("change",this.otpValue),this.$emit("input",this.otpValue)},emitComplete:function(){this.$emit("complete",this.otpValue),this.ac&&this.ac.abort()},emitEvents:function(t){this.emitChange(),t===this.length-1&&this.emitComplete()},focusInput:function(t){this.$refs.inputs[t].focus(),this.$refs.inputs[t].select()},getOtpValue:function(){return this.otpValue},setOtpValue:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t&&(this.focusInput(e),this.populateNext(t,e))},populateNext:function(t,e){var n=this;this.$refs.inputs[e].value=t[0],this.$set(this.otp,e,t[0]),t=t.substring(1),this.emitEvents(e),e<this.length-1&&(this.focusInput(e+1),t.length&&setTimeout((function(){n.populateNext(t,e+1)}),this.pasteDelayMs))},childFocus:function(t,e){0!==e&&""!==this.$refs.inputs[0].value?""===this.$refs.inputs[e-1].value&&this.focusInput(e-1):this.focusInput(0)},childKeyUp:function(t,e){var n=t.keyCode,i=t.key;if(i!==h&&i!==y&&i!==m&&i!==d&&n!==b&&224!==n&&i!==c&&i!==f){i===v&&this.emitComplete();var o=t.target.value,s=o.length;i===p&&e>0||!s&&e>0&&this.lastKey===i?this.focusInput(e-1):i!==l&&i!==p&&1===s&&e<this.length-1&&this.focusInput(e+1),s>1&&this.setOtpValue(o,e),this.lastKey=i}},childPaste:function(t,e){t.preventDefault();var n=t.clipboardData.getData("text/plain");this.setOtpValue(n,e)},childInput:function(t,e){var n=t.target.value,i=n.length;i>1?this.setOtpValue(n,e):(this.$set(this.otp,e,n),this.emitEvents(e))}},render:function(){var t=this,e=arguments[0],n=this.$props,i=n.type,o=n.length,s=n.inputClasses,r=this.$scopedSlots.extra,a=this.$data.otp;return e("div",{class:"simple-otp-input"},[a.map((function(n,l){return e("div",{key:l,class:"single-input-container"},[e("input",{ref:"inputs",refInFor:!0,domProps:{value:n},attrs:u(u({autocomplete:0===l?"one-time-code":"off",type:i},t.inputAttrs),{},{"data-testid":"otp-single-input-".concat(l)}),class:["otp-single-input",s],on:{focus:function(e){return t.childFocus(e,l)},keyup:function(e){return t.childKeyUp(e,l)},paste:function(e){return t.childPaste(e,l)},input:function(e){return t.childInput(e,l)}}}),r&&r({otp:a,idx:l,length:o})])}))])}},w=(n("d904"),{name:"App",components:{SimpleOtpInput:O},data:function(){return{otp:"",submittedOtp:"",lazyCode:""}},methods:{handleChange:function(t){this.otp=t,console.log("Changed",t)},handleComplete:function(t){this.submittedOtp=t,console.log("Submitted",t)},setLazyCodeValue:function(){this.lazyCode=Math.random().toString().substring(2,8),console.log("Lazy code",this.lazyCode)}}}),C=w,S=(n("034f"),n("2877")),j=Object(S["a"])(C,o,s,!1,null,null,null),_=j.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(_)}}).$mount("#app")},"85ec":function(t,e,n){},d904:function(t,e,n){}});
//# sourceMappingURL=app.90b38ceb.js.map