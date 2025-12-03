"use strict";exports.id=511,exports.ids=[511],exports.modules={40511:(e,t,i)=>{i.r(t),i.d(t,{W3mTransactionsView:()=>s});var r=i(50861),o=i(22490);i(77838),i(52113);let l=(0,r.AH)`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`,s=class extends r.WF{render(){return(0,r.qy)`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};s.styles=l,s=function(e,t,i,r){var o,l=arguments.length,s=l<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(l<3?o(s):l>3?o(t,i,s):o(t,i))||s);return l>3&&s&&Object.defineProperty(t,i,s),s}([(0,o.EM)("w3m-transactions-view")],s)}};