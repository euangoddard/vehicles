!function(e){"use strict";e.module("vehicles.constants",[]).constant("VEHICLES",["bus","car","lorry","plane","tractor","van"])}(window.angular,window._),function(e){"use strict";var n=e.module("speech",[]);n.factory("Speech",["$log","$q",function(e,n){var t=("speechSynthesis"in window,[]);speechSynthesis.onvoiceschanged=function(){t=speechSynthesis.getVoices()};var r=function(n){var r=function(e){return e.lang===n},c=t.filter(r),i=c.slice(-1)[0];return i||e.warn('Could not select voice for "%s"',n),i},c={say:function(e){var t=new SpeechSynthesisUtterance(e),c=n(function(e,n){t.onend=e,t.onerror=n}),l=r(i);return l?t.voice=l:t.lang=i,speechSynthesis.speak(t),c}},i=null;return Object.defineProperty(c,"language",{get:function(){return i},set:function(e){i=e},enumerable:!0,configurable:!0}),c}])}(window.angular,window._),function(e,n){"use strict";var t=["red","pink","indigo","purple","blue","light-blue","teal","green","light-green","orange","deep-orange","brown","grey"],r=e.module("vehicles.directives",["vehicles.constants","speech"]);r.directive("vehicles",function(){var e=function(e){return{name:e,id:n.uniqueId(),is_selected:!1}},r=["${name}, can you find the ${vehicle}?","${name}, where is the ${vehicle}?"],c=n.map(r,n.template);return{templateUrl:"/partials/vehicles.html",controller:["$scope","$attrs","VEHICLES","Speech",function(r,i,l,a){var s=this;s.init=function(){s.theme=n.sample(t),s.rows=r.$eval(i.rows),s.columns=r.$eval(i.columns);for(var c=n.sample(l),a=n.difference(l,[c]),o=[],u=s.rows*s.columns,h=u-1;h>0;h--)o.push(n.sample(a));var v=n.map(o,e);s.selected_vehicle=e(c),v.push(s.selected_vehicle),v=n.shuffle(v),s.vehicles=n.chunk(v,s.columns),s.speak_clue()},s.speak_clue=function(){var e=n.sample(c);a.say(e({name:r.game_controller.name,vehicle:s.selected_vehicle.name}))},s.guess=function(e){e.is_selected||(e.is_selected=!0,e.id===s.selected_vehicle.id?a.say("Thats right!").then(function(){r.game_controller.advance_level()}):a.say("Try again"))},s.init()}],controllerAs:"vehicles_controller"}}),r.directive("nameCapture",function(){return{templateUrl:"/partials/name_capture.html",controller:["$scope",function(e){e.name=null,e.is_submitted=!1,this.read_name=function(){e.game_controller.set_name(e.name),e.is_submitted=!0}}],controllerAs:"name_controller"}}),r.directive("endGame",function(){return{templateUrl:"/partials/end.html"}})}(window.angular,window._),function(e,n){"use strict";var t=e.module("vehicles",["ngAnimate","speech","vehicles.directives"]);t.run(["Speech",function(e){e.language="en-GB",e.say("")}]),t.controller("GameController",["$scope","Speech","$interval",function(e,n){var t=this;t.set_name=function(e){t.name=e,n.say("Hello "+e+". Let's play!").then(function(){t.advance_level()})};var c=[];t.levels=[],t.advance_level=function(){t.levels.shift();var e=c.shift();e?t.levels.push(e):t.is_complete=!0},t.restart=function(){t.name=null,t.is_complete=!1,c=r()},t.restart()}]);var r=function(){var e=[];return n.range(1,4).forEach(function(t){n.range(1,4).forEach(function(n){e.push({rows:t,columns:n})})}),e.sort(function(e,n){return c(e)-c(n)}),e},c=function(e){var t=n.values(e),r=n.reduce(t,function(e,n){return e*n});return r}}(window.angular,window._);