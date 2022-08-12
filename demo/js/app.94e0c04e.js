(function(t){function e(e){for(var i,u,a=e[0],l=e[1],p=e[2],c=0,h=[];c<a.length;c++)u=a[c],Object.prototype.hasOwnProperty.call(s,u)&&s[u]&&h.push(s[u][0]),s[u]=0;for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(t[i]=l[i]);r&&r(e);while(h.length)h.shift()();return o.push.apply(o,p||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],i=!0,a=1;a<n.length;a++){var l=n[a];0!==s[l]&&(i=!1)}i&&(o.splice(e--,1),t=u(u.s=n[0]))}return t}var i={},s={app:0},o=[];function u(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.m=t,u.c=i,u.d=function(t,e,n){u.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},u.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},u.t=function(t,e){if(1&e&&(t=u(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)u.d(n,i,function(e){return t[e]}.bind(null,i));return n},u.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return u.d(e,"a",e),e},u.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},u.p="";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],l=a.push.bind(a);a.push=e,a=a.slice();for(var p=0;p<a.length;p++)e(a[p]);var r=l;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},"56d7":function(t,e,n){"use strict";n.r(e);var i=n("2b0e"),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("h4",[t._v("Vue SimpleOtpInput")]),n("section",{staticClass:"story"},[n("label",[t._v("Default otp input")]),n("SimpleOtpInput")],1),n("section",{staticClass:"story"},[n("label",[t._v("Password type input")]),n("SimpleOtpInput",{attrs:{type:"password",length:4}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With inital value")]),n("SimpleOtpInput",{attrs:{value:"123456"}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With events")]),n("SimpleOtpInput",{attrs:{type:"password",length:4},on:{change:t.handleChange,complete:t.handleComplete}}),n("div",[n("strong",[t._v("Draft")]),t._v(" "+t._s(t.otp))]),n("div",[n("strong",[t._v("Submitted")]),t._v(" "+t._s(t.submittedOtp))])],1),n("section",{staticClass:"story"},[n("label",[t._v("Lazy v-model ")]),n("button",{on:{click:t.setLazyCodeValue}},[t._v("Randomize code value")]),n("SimpleOtpInput",{staticClass:"otp-with-effect",attrs:{inputClasses:"input-with-effect"},model:{value:t.lazyCode,callback:function(e){t.lazyCode=e},expression:"lazyCode"}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With extra slot to create border effect")]),n("SimpleOtpInput",{staticClass:"otp-with-effect",attrs:{inputClasses:"input-with-effect",pasteDelayMs:192},scopedSlots:t._u([{key:"extra",fn:function(){return[n("span",{staticClass:"focus-border"},[n("i")])]},proxy:!0}])})],1)])},o=[],u="Backspace",a="ArrowLeft",l="Shift",p="Ctrl",r="Alt",c="Tab",h="Enter",f=91,d=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",i=Math.max(e-t.length,0);return Array.from(t).concat(new Array(i).fill(n)).slice(0,e)},m={name:"SimpleOtpInput",emits:["input","change","complete"],props:{length:{type:Number,default:6},value:{type:String,default:""},type:{type:String,default:"text"},inputClasses:{type:String,default:void 0},pasteDelayMs:{type:Number,default:0}},data:function(){return{otp:d(this.value,this.length),lastKey:null}},computed:{otpValue:function(){return this.otp.map((function(t){return t||" "})).join("")}},watch:{value:function(t){t!==this.otpValue&&(this.otp=d(t,this.length))}},methods:{emitChange:function(){this.$emit("change",this.otpValue),this.$emit("input",this.otpValue)},emitComplete:function(){this.$emit("complete",this.otpValue)},emitEvents:function(t){this.emitChange(),t===this.length-1&&this.emitComplete()},focusInput:function(t){this.$refs.inputs[t].focus(),this.$refs.inputs[t].select()},getOtpValue:function(){return this.otpValue},setOtpValue:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t&&(this.focusInput(e),this.populateNext(t,e))},populateNext:function(t,e){var n=this;this.$refs.inputs[e].value=t[0],this.$set(this.otp,e,t[0]),t=t.substring(1),this.emitEvents(e),e<this.length-1&&(this.focusInput(e+1),t.length&&setTimeout((function(){n.populateNext(t,e+1)}),this.pasteDelayMs))},childFocus:function(t,e){0!==e&&""!==this.$refs.inputs[0].value?""===this.$refs.inputs[e-1].value&&this.focusInput(e-1):this.focusInput(0)},childKeyUp:function(t,e){var n=t.keyCode,i=t.key;if(i!==l&&i!==c&&i!==r&&i!==p&&n!==f&&224!==n){i===h&&this.emitComplete();var s=t.target.value,o=s.length;i===a&&e>0?this.focusInput(e-1):o||!(e>0)||this.otp[e+1]&&this.lastKey!==i?i!==u&&i!==a&&1===o&&e<this.length-1&&this.focusInput(e+1):this.focusInput(e-1),o>1&&this.setOtpValue(s,e),this.lastKey=i}},childPaste:function(t,e){t.preventDefault();var n=t.clipboardData.getData("text/plain");this.setOtpValue(n,e)},childInput:function(t,e){var n=t.target.value,i=n.length;i>1?this.setOtpValue(n,e):(this.$set(this.otp,e,n),this.emitEvents(e))}},render:function(){var t=this,e=arguments[0],n=this.$props,i=n.type,s=n.length,o=n.inputClasses,u=this.$scopedSlots.extra,a=this.$data.otp;return e("div",{class:"simple-otp-input"},[a.map((function(n,l){return e("div",{key:l,class:"single-input-container"},[e("input",{ref:"inputs",refInFor:!0,domProps:{value:n},attrs:{autocomplete:0===l?"one-time-code":"off",type:i,inputmode:"number"===i?"numeric":void 0,"data-testid":"otp-single-input-".concat(l)},class:["otp-single-input",o],on:{focus:function(e){return t.childFocus(e,l)},keyup:function(e){return t.childKeyUp(e,l)},paste:function(e){return t.childPaste(e,l)},input:function(e){return t.childInput(e,l)}}}),u&&u({otp:a,idx:l,length:s})])}))])}},v=(n("d904"),{name:"App",components:{SimpleOtpInput:m},data:function(){return{otp:"",submittedOtp:"",lazyCode:""}},methods:{handleChange:function(t){this.otp=t,console.log("Changed",t)},handleComplete:function(t){this.submittedOtp=t,console.log("Submitted",t)},setLazyCodeValue:function(){this.lazyCode=Math.random().toString().substring(2,8),console.log("Lazy code",this.lazyCode)}}}),y=v,g=(n("034f"),n("2877")),b=Object(g["a"])(y,s,o,!1,null,null,null),C=b.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(C)}}).$mount("#app")},"85ec":function(t,e,n){},d904:function(t,e,n){}});
//# sourceMappingURL=app.94e0c04e.js.map