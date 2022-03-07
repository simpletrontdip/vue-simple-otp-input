(function(t){function e(e){for(var s,r,u=e[0],l=e[1],p=e[2],c=0,f=[];c<u.length;c++)r=u[c],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&f.push(i[r][0]),i[r]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(t[s]=l[s]);a&&a(e);while(f.length)f.shift()();return o.push.apply(o,p||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],s=!0,u=1;u<n.length;u++){var l=n[u];0!==i[l]&&(s=!1)}s&&(o.splice(e--,1),t=r(r.s=n[0]))}return t}var s={},i={app:0},o=[];function r(e){if(s[e])return s[e].exports;var n=s[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=s,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=e,u=u.slice();for(var p=0;p<u.length;p++)e(u[p]);var a=l;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},3070:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);var s=n("2b0e"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("h4",[t._v("Vue SimpleOtpInput")]),n("section",{staticClass:"story"},[n("label",[t._v("Default otp input")]),n("SimpleOtpInput")],1),n("section",{staticClass:"story"},[n("label",[t._v("Password type input")]),n("SimpleOtpInput",{attrs:{type:"password",length:4}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With inital value")]),n("SimpleOtpInput",{attrs:{value:"123456"}})],1),n("section",{staticClass:"story"},[n("label",[t._v("With events")]),n("SimpleOtpInput",{attrs:{type:"password",length:4},on:{change:t.handleChange,complete:t.handleComplete}}),n("div",[n("strong",[t._v("Draft")]),t._v(" "+t._s(t.otp))]),n("div",[n("strong",[t._v("Submitted")]),t._v(" "+t._s(t.submittedOtp))])],1),n("section",{staticClass:"story"},[n("label",[t._v("With extra slot to create border effect")]),n("SimpleOtpInput",{staticClass:"otp-with-effect",attrs:{inputClasses:"input-with-effect",pasteDelayMs:192},scopedSlots:t._u([{key:"extra",fn:function(){return[n("span",{staticClass:"focus-border"},[n("i")])]},proxy:!0}])})],1)])},o=[],r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"simple-otp-input"},t._l(t.length,(function(e,s){return n("div",{key:s,staticClass:"single-input-container"},[n("input",{ref:"inputs",refInFor:!0,class:["otp-single-input",t.inputClasses],attrs:{autocomplete:0===s?"one-time-code":"off",type:t.type,inputmode:"numeric"},domProps:{value:t.otp[s]},on:{focus:function(e){return t.childFocus(e,s)},keyup:function(e){return t.childKeyUp(e,s)}}}),t._t("extra",null,{idx:s,otp:t.otp,length:t.length})],2)})),0)},u=[],l=8,p=37,a=16,c=17,f=18,h=9,d=13,y=224,v={name:"SimpleOtpInput",emits:["change","complete"],props:{length:{type:Number,default:6},value:{type:String,default:""},type:{type:String,default:"text"},inputClasses:{type:String,default:void 0},pasteDelayMs:{type:Number,default:0}},data:function(){return{otp:this.value?Array.from(this.value):new Array(this.length).fill(),lastKey:null}},methods:{getOtpValue:function(){return this.otp.map((function(t){return t||" "})).join("")},setOtpValue:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t&&1!==t.length&&this.populateNext(t,e)},populateNext:function(t,e){var n=this,s=this.$refs.inputs[e];this.otp[e]=s.value=t[0],t=t.substring(1),s.select(),this.$emit("change",this.getOtpValue()),e<this.length-1&&t.length&&setTimeout((function(){n.populateNext(t,e+1)}),this.pasteDelayMs)},childFocus:function(t,e){0!==e&&(""===this.$refs.inputs[0].value&&this.$refs.inputs[0].focus(),""===this.$refs.inputs[e-1].value&&this.$refs.inputs[e-1].focus())},childKeyUp:function(t,e){if(t.keyCode!==a&&t.keyCode!==h&&t.keyCode!==y&&t.keyCode!==f&&t.keyCode!==c){t.keyCode===d&&this.$emit("complete",this.getOtpValue());var n=t.target.value,s=n.length;t.keyCode===p&&e>0||t.keyCode===l&&e>0&&(!this.otp[e+1]||this.lastKey===l)?this.$refs.inputs[e-1].select():t.keyCode!==l&&1===s&&e<this.length-1&&this.$refs.inputs[e+1].select(),s>1?this.setOtpValue(n,e):(this.otp[e]=n,this.$emit("change",this.getOtpValue())),this.lastKey=t.keyCode}}}},g=v,m=(n("8fb4"),n("2877")),b=Object(m["a"])(g,r,u,!1,null,"23a713b6",null),O=b.exports,C={name:"App",components:{SimpleOtpInput:O},data:function(){return{otp:"",submittedOtp:""}},methods:{handleChange:function(t){this.otp=t,console.log("Changed",t)},handleComplete:function(t){this.submittedOtp=t,console.log("Submitted",t)}}},_=C,S=(n("034f"),Object(m["a"])(_,i,o,!1,null,null,null)),w=S.exports;s["a"].config.productionTip=!1,new s["a"]({render:function(t){return t(w)}}).$mount("#app")},"85ec":function(t,e,n){},"8fb4":function(t,e,n){"use strict";n("3070")}});
//# sourceMappingURL=app.b8a45c19.js.map