(this["webpackJsonpreact-typescript-starter-pack"]=this["webpackJsonpreact-typescript-starter-pack"]||[]).push([[0],{19:function(e,a,t){},25:function(e,a,t){},27:function(e,a,t){"use strict";t.r(a);var r=t(0),n=t.n(r),c=t(7),l=t.n(c),o=(t(19),t(4)),u=t(5),s=(t(25),t(31)),O=t(14),i=t.n(O),f="RETURN_STATE",b="VALUE_CHANGES",d="DELETE_ROW",j="ADD_ROW",y=function(e){return e.arrayOfCells},p=function(e){return[e.arrayOfAverage,e.arrayOfSum]},h=function(e){return e.x},v=t(1);function m(e,a){return Math.floor(Math.random()*(a-e))+e}function g(e){for(var a=[],t=0;t<e;t+=1)a.push({id:Object(s.a)(),value:m(1,300)});return a}var x=function(){var e=Object(o.b)(),a=Object(o.c)(y),t=Object(o.c)(p),n=Object(o.c)(h),c=Object(r.useState)([]),l=Object(u.a)(c,2),O=l[0],x=l[1],A=Object(r.useState)(null),E=Object(u.a)(A,2),M=E[0],C=E[1];return Object(r.useEffect)((function(){var a,t=m(1,100),r=m(1,100);a=t>r?m(r,t):m(t,r);var n=new Array(2),c=[],l=[];c.length=r,c.fill(0),l.length=t,l.fill(0);for(var o=0;o<t;o+=1)n[o]=g(r);console.log(l);for(var u=0;u<n[0].length-1;u+=1)for(var s=0;s<n.length-1;s+=1)c[u]+=n[s][u].value,l[s]+=n[s][u].value,s+1===t&&(c[s]=Math.round(c[s]/t*100)/100);e({type:f,payload:[t,r,a,n,c,l]})}),[]),Object(r.useEffect)((function(){console.log(t)})),Object(v.jsxs)("div",{className:"starter",children:[Object(v.jsx)("table",{className:"table",children:a.map((function(r,c){return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("tr",{children:r.map((function(l,o){return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("td",{className:"cell",style:{background:null!==M&&c===M[0]?"linear-gradient(90deg, rgba(255,177,0,1) ".concat(Math.round(l.value/100/M[1]*100),"%, rgba(255,255,255,1) ").concat(Math.round(l.value/100/M[1]*100),"%)"):"white"},children:Object(v.jsx)("button",{type:"button",className:i()("button",{button_close_value:null!==O&&O.some((function(e){return e===l.id}))}),onClick:function(){e({type:b,payload:[c,o]})},onMouseOver:function(){for(var e=[],t=0;e.length<=n+1&&(a.forEach((function(a){return a.find((function(a){a.value-t===l.value&&e.push(a.id),a.value+t===l.value&&e.push(a.id)}))})),-1e3!==(t-=1));)x(e)},onMouseOut:function(){x(null)},onFocus:function(){x(null)},children:null!==M&&M[0]===c?Math.round(l.value/100/M[1]*100):l.value})},l.id),o===r.length-1&&Object(v.jsx)("td",{children:Object(v.jsx)("button",{type:"button",onMouseOver:function(){var e=t[1][c]/100;C([c,e])},onMouseOut:function(){C(null)},onClick:function(){e({type:d,payload:c})},children:t[1][c]})})]})}))},Object(s.a)()),c===t[1].length-1&&Object(v.jsx)("tr",{children:t[0].map((function(e){return Object(v.jsx)("td",{children:e},e)}))})]})}))}),Object(v.jsx)("button",{type:"button",onClick:function(){e({type:j,payload:[]})},children:"Add single row"})]})},A=t(3),E=t(2),M=t(30),C={m:0,n:0,x:0,arrayOfCells:[],arrayOfAverage:[],arrayOfSum:[]},S=Object(M.a)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:C,a=arguments.length>1?arguments[1]:void 0,t=Object(E.a)(e.arrayOfCells),r=Object(E.a)(e.arrayOfAverage),n=Object(E.a)(e.arrayOfSum),c=[];switch(a.type){case f:return Object(A.a)(Object(A.a)({},e),{},{m:a.payload[0],n:a.payload[1],x:a.payload[2],arrayOfCells:a.payload[3],arrayOfAverage:a.payload[4],arrayOfSum:a.payload[5]});case b:return t[a.payload[0]][a.payload[1]].value+=1,n[a.payload[0]]+=1,r[a.payload[1]]=(r[a.payload[1]]*e.m+1)/e.m,Object(A.a)(Object(A.a)({},e),{},{arrayOfCells:Object(E.a)(t),arrayOfAverage:Object(E.a)(r),arrayOfSum:Object(E.a)(n)});case d:return t[a.payload].forEach((function(a,t){return c.push(100*Math.floor((r[t]*e.m-a.value)/(e.m-1))/100)})),t.splice(a.payload,1),n.splice(a.payload,1),Object(A.a)(Object(A.a)({},e),{},{m:e.m-1,arrayOfCells:Object(E.a)(t),arrayOfSum:Object(E.a)(n),arrayOfAverage:[].concat(c)});case j:return Object(A.a)(Object(A.a)({},e),{},{m:e.m+1,arrayOfCells:[].concat(Object(E.a)(t),[a.payload])});default:return e}}));l.a.render(Object(v.jsx)(n.a.StrictMode,{children:Object(v.jsx)(o.a,{store:S,children:Object(v.jsx)(x,{})})}),document.getElementById("root"))}},[[27,1,2]]]);
//# sourceMappingURL=main.749054e0.chunk.js.map