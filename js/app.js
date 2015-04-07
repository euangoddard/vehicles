!function(e){"use strict";e.module("vehicles.constants",[]).constant("VEHICLES",["bike","boat","bus","car","helicopter","lorry","moped","motorbike","plane","rocket","ship","submarine","train","van"])}(window.angular,window._),function(e){"use strict";var n=e.module("speech",[]);n.factory("Speech",["$log","$q",function(e,n){var t=("speechSynthesis"in window,[]);speechSynthesis.onvoiceschanged=function(){t=speechSynthesis.getVoices()};var r=function(n){var r=function(e){return e.lang===n},i=t.filter(r),o=i.slice(-1)[0];return o||e.warn('Could not select voice for "%s"',n),o},i={say:function(e){var t=new SpeechSynthesisUtterance(e),i=n(function(e,n){t.onend=e,t.onerror=n}),c=r(o);return c?t.voice=c:t.lang=o,speechSynthesis.speak(t),i}},o=null;return Object.defineProperty(i,"language",{get:function(){return o},set:function(e){o=e},enumerable:!0,configurable:!0}),i}])}(window.angular,window._),function(e){"use strict";var n=e.module("storage",[]),t=function(n){return function(){return{get:function(t){var r=n.getItem(t);return r?e.fromJson(r):r},put:function(t,r){n.setItem(t,e.toJson(r))},remove:function(e){n.removeItem(e)},clear:function(){n.clear()}}}};n.factory("LocalStore",t(localStorage)),n.factory("SessionStore",t(sessionStorage))}(window.angular,window._),function(e,n){"use strict";var t=["red","pink","indigo","purple","blue","light-blue","teal","green","light-green","orange","deep-orange","brown","grey"],r=e.module("vehicles.directives",["vehicles.constants","speech","storage"]);r.directive("vehicles",function(){var e=function(e){return{name:e,id:n.uniqueId(),is_selected:!1,is_winner:!1}},r=["${name}, can you find the ${vehicle}?","${name}, where is the ${vehicle}?"],i=n.map(r,n.template),o=n.template("Try again. Where's the ${vehicle}?");return{templateUrl:"/partials/vehicles.html",controller:["$scope","$attrs","VEHICLES","Speech",function(r,c,a,l){var s=this;s.init=function(){s.theme=n.sample(t),s.rows=r.$eval(c.rows),s.columns=r.$eval(c.columns);for(var i=n.sample(a),o=n.difference(a,[i]),l=[],u=s.rows*s.columns,h=u-1;h>0;h--)l.push(n.sample(o));var m=n.map(l,e);s.selected_vehicle=e(i),m.push(s.selected_vehicle),m=n.shuffle(m),s.vehicles=n.chunk(m,s.columns),s.speak_clue()},s.speak_clue=function(){var e=n.sample(i);l.say(e({name:r.game_controller.name,vehicle:s.selected_vehicle.name}))},s.guess=function(e){e.is_selected||(e.id===s.selected_vehicle.id?(e.is_winner=!0,l.say("Thats right!").then(function(){r.game_controller.advance_level()})):(e.is_selected=!0,l.say(o({vehicle:s.selected_vehicle.name}))))},s.init()}],controllerAs:"vehicles_controller"}}),r.directive("nameCapture",function(){return{templateUrl:"/partials/name_capture.html",controller:["$scope","SessionStore",function(e,n){e.name=n.get("player.name")||null,e.is_submitted=!1,this.read_name=function(){n.put("player.name",e.name),e.game_controller.set_name(e.name),e.is_submitted=!0}}],controllerAs:"name_controller"}}),r.directive("endGame",function(){return{templateUrl:"/partials/end.html"}})}(window.angular,window._),function(e,n){"use strict";var t=e.module("vehicles",["ngAnimate","speech","vehicles.directives"]);t.config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}]),t.run(["Speech",function(e){e.language="en-GB",e.say("")}]),t.controller("GameController",["$scope","Speech","$interval",function(e,n){var t=this;t.set_name=function(e){t.name=e,n.say("Hello "+e+". Let's play!").then(function(){t.advance_level()})};var r=[];t.levels=[],t.advance_level=function(){t.levels.shift();var e=r.shift();e?t.levels.push(e):t.is_complete=!0},t.restart=function(){t.name=null,t.is_complete=!1,r=i()},t.restart()}]);var r=4,i=function(){var e=[];return n.range(1,r+1).forEach(function(t){n.range(1,r+1).forEach(function(n){e.push({rows:t,columns:n})})}),e.sort(function(e,n){return o(e)-o(n)}),e},o=function(e){var t=n.values(e),r=n.reduce(t,function(e,n){return e*n});return r}}(window.angular,window._);