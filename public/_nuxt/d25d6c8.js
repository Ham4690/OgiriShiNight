(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{274:function(t,e,n){var content=n(277);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(64).default)("1b7833da",content,!0,{sourceMap:!1})},276:function(t,e,n){"use strict";n(274)},277:function(t,e,n){var o=n(63)(!1);o.push([t.i,'.container{margin:0 auto;min-height:100vh;display:flex;justify-content:center;align-items:center;text-align:center}.title{font-family:"Quicksand","Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;display:block;font-weight:300;font-size:100px;color:#35495e;letter-spacing:1px}.subtitle{font-weight:300;font-size:42px;color:#526488;word-spacing:5px;padding-bottom:15px}.links{padding-top:15px}.anslink{color:#35495e}',""]),t.exports=o},281:function(t,e,n){"use strict";n.r(e);var o=n(61),r=n(79),c={name:"HomePage",components:{},data:function(){return{isAuth:!1,user:{uid:"",displayName:"",photoURL:""}}},mounted:function(){var t=this;o.a.auth().onAuthStateChanged((function(e){return t.isAuth=!!e}))},created:function(){var t=this;if(localStorage.getItem("accessToken")){var e=localStorage.getItem("uid");r.b.collection("users").doc(e).get().then((function(e){e.exists?(console.log("Document data:",e.data()),t.user=e.data(),t.isAuth=!0):console.log("No such document!")})).catch((function(t){console.log("Error getting document:",t)}))}},methods:{googleAuth:function(){var t=this,e=new o.a.auth.GoogleAuthProvider;o.a.auth().signInWithPopup(e).then((function(e){t.isAuth=!0,localStorage.setItem("accessToken",e.credential.accessToken),localStorage.setItem("uid",e.user.uid),t.user={uid:e.user.uid,displayName:e.user.displayName,photoURL:e.user.photoURL},r.b.collection("users").doc(e.user.uid).set({displayName:e.user.displayName,photURL:e.user.photoURL}).then((function(){console.log("Document successfully written!")})).catch((function(t){console.error("Error writing document: ",t)})),console.log("firestoreに保存したにゃ")})).catch((function(t){console.log(t)}))},signOut:function(){o.a.auth().signOut(),localStorage.removeItem("accessToken"),localStorage.removeItem("uid")}}},l=(n(276),n(59)),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",[n("h1",{staticClass:"title"},[t._v("ogiri-shi-night")]),t._v(" "),t.isAuth?n("div",[t.isAuth?n("nuxt-link",{staticClass:"anslink",attrs:{to:"/answer"}},[n("b-button",{attrs:{variant:"outline-danger"}},[t._v(" play ")])],1):t._e()],1):t._e(),t._v(" "),n("div",{staticClass:"links"},[n("a",{staticClass:"button--green",attrs:{href:"https://nuxtjs.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        Documentation\n      ")]),t._v(" "),n("a",{staticClass:"button--grey",attrs:{href:"https://github.com/nuxt/nuxt.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        GitHub\n      ")]),t._v(" "),t.isAuth?n("button",{staticClass:"button--grey",attrs:{href:"",target:"_blank",rel:"noopener noreferrer"},on:{click:t.signOut}},[t._v("\n        signOut\n      ")]):n("button",{staticClass:"button--green",attrs:{target:"_blank",rel:"noopener noreferrer"},on:{click:t.googleAuth}},[t._v("\n        signIn\n      ")])]),t._v(" "),t.isAuth?n("h3",[t._v("Hi, "+t._s(t.user.displayName))]):n("h3",[t._v("Who are you?")])])])}),[],!1,null,null,null);e.default=component.exports}}]);