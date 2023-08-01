var t={};"use strict";t=function(t){if("undefined"==typeof document)throw Error("document-ready only runs in the browser");var e=document.readyState;if("complete"===e||"interactive"===e)return setTimeout(t,0);document.addEventListener("DOMContentLoaded",function(){t()})};const e=(t,e)=>(t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y);class i{constructor(t,i){this.drawing=!1,this.color="lightblue",this.lastPoint={x:0,y:0},this.stickLengthSq=.5,this.actRadiusSq=3600,this.dragged=t=>{if(this.drawing&&t.isPrimary){let i=e(this.lastPoint,{x:t.offsetX,y:t.offsetY});i>this.stickLengthSq&&(this.lastPoint.x=t.offsetX,this.lastPoint.y=t.offsetY,this.path.push({x:this.lastPoint.x,y:this.lastPoint.y}),this.draw())}},this.pointedDown=t=>{if(t.isPrimary){let i=e(this.lastPoint,{x:t.offsetX,y:t.offsetY});i>this.actRadiusSq&&(this.path=[],this.clear()),this.drawing=!0}},this.pointedUp=()=>{this.drawing=!1;let t=this.path[0],i=this.path[this.path.length-1];e(t,i)<this.actRadiusSq&&(this.color="olive",this.draw(),this.deactivate())},this.clear=()=>{this.path=[],this.ctx.clearRect(0,0,this.cnv.width,this.cnv.width)},this.draw=()=>{this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height),this.ctx.beginPath(),this.ctx.moveTo(this.path[0].x,this.path[0].y);for(let t=1;t<this.path.length;t++)this.ctx.lineTo(this.path[t].x,this.path[t].y);this.ctx.strokeStyle="black",this.ctx.lineWidth=2,this.ctx.fillStyle=this.color,this.ctx.fill("evenodd"),"olive"===this.color&&this.ctx.closePath(),this.ctx.stroke();let t=function(t){let e=t.canvas.width,i=t.canvas.height,s=t.getImageData(0,0,e,i).data,n=0,h=0,o=0;for(let t=0;t<e;t++)for(let c=0;c<i;c++)0!==s[4*(t+e*c)+3]&&(n+=t,h+=c,o+=1);let c=n/o,a=h/o;return{center:{x:c,y:a},area:o}}(this.ctx).center;this.ctx.beginPath(),this.ctx.arc(t.x,t.y,5,0,2*Math.PI,!1),this.ctx.fillStyle="red",this.ctx.fill(),this.ctx.stroke()},this.ctx=t,this.cnv=t.canvas,this.path=i,this.w=this.cnv.width,this.h=this.cnv.height}activate(){this.path=[],this.color="lightblue",this.cnv.addEventListener("pointermove",this.dragged),this.cnv.addEventListener("pointerdown",this.pointedDown),this.cnv.addEventListener("pointerup",this.pointedUp),this.cnv.addEventListener("pointerout",this.pointedUp)}deactivate(){this.cnv.removeEventListener("pointermove",this.dragged),this.cnv.removeEventListener("pointerdown",this.pointedDown),this.cnv.removeEventListener("pointerup",this.pointedUp),this.cnv.removeEventListener("pointerout",this.pointedUp)}}(function(t){return t&&t.__esModule?t.default:t})(t)(function(){let t=document.getElementById("drawApp"),e=document.getElementById("canvas"),s=e.getContext("2d",{willReadFrequently:!0});console.log("width: ",e.width),console.log("height: ",e.height);let n=new i(s,[]);n.activate(),t.addEventListener("fullscreenchange",function(){t!==document.fullscreenElement&&(e.width=800,e.height=800)},!1),document.getElementById("appBtn")?.addEventListener("click",()=>{let i=screen.width,s=screen.height;e.width=Math.max(i,s),e.height=Math.min(i,s),t.requestFullscreen().then(()=>screen.orientation.lock("landscape")).then(t=>{console.log(t)},t=>{console.log(t)}).catch(t=>{alert(`An error occurred while trying to switch into fullscreen mode: ${t.message} (${t.name})`)})}),document.getElementById("drawButton")?.addEventListener("click",()=>{n.clear(),n.activate()})});
//# sourceMappingURL=index.9c3df253.js.map
