function t(t){return t&&t.__esModule?t.default:t}var e;e=function(t){if("undefined"==typeof document)throw new Error("document-ready only runs in the browser");var e=document.readyState;if("complete"===e||"interactive"===e)return setTimeout(t,0);document.addEventListener("DOMContentLoaded",(function(){t()}))};const i=(t,e)=>(t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y);function n(t){const e=t.canvas.width,i=t.canvas.height,n=t.getImageData(0,0,e,i).data;let s=0,h=0,o=0;for(let t=0;t<e;t++)for(let c=0;c<i;c++)0!==n[4*(t+e*c)+3]&&(s+=t,h+=c,o+=1);return{center:{x:s/o,y:h/o},area:o}}class s{drawing=!1;color="lightblue";lastPoint={x:0,y:0};stickLengthSq=.5;actRadiusSq=3600;dragged=t=>{if(this.drawing&&t.isPrimary){i(this.lastPoint,{x:t.offsetX,y:t.offsetY})>this.stickLengthSq&&(this.lastPoint.x=t.offsetX,this.lastPoint.y=t.offsetY,this.path.push({x:this.lastPoint.x,y:this.lastPoint.y}),this.draw())}};pointedDown=t=>{if(t.isPrimary){i(this.lastPoint,{x:t.offsetX,y:t.offsetY})>this.actRadiusSq&&(this.path=[],this.clear()),this.drawing=!0}};pointedUp=()=>{this.drawing=!1;const t=this.path[0],e=this.path[this.path.length-1];i(t,e)<this.actRadiusSq&&(this.color="olive",this.draw(),this.deactivate())};clear=()=>{this.path=[],this.ctx.clearRect(0,0,this.cnv.width,this.cnv.width)};draw=()=>{this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height),this.ctx.beginPath(),this.ctx.moveTo(this.path[0].x,this.path[0].y);for(let t=1;t<this.path.length;t++)this.ctx.lineTo(this.path[t].x,this.path[t].y);this.ctx.strokeStyle="black",this.ctx.lineWidth=2,this.ctx.fillStyle=this.color,this.ctx.fill("evenodd"),"olive"===this.color&&this.ctx.closePath(),this.ctx.stroke();const t=n(this.ctx).center;this.ctx.beginPath(),this.ctx.arc(t.x,t.y,5,0,2*Math.PI,!1),this.ctx.fillStyle="red",this.ctx.fill(),this.ctx.stroke()};constructor(t,e){this.ctx=t,this.cnv=t.canvas,this.path=e,this.w=this.cnv.width,this.h=this.cnv.height}activate(){this.path=[],this.color="lightblue",this.cnv.addEventListener("pointermove",this.dragged),this.cnv.addEventListener("pointerdown",this.pointedDown),this.cnv.addEventListener("pointerup",this.pointedUp),this.cnv.addEventListener("pointerout",this.pointedUp)}deactivate(){this.cnv.removeEventListener("pointermove",this.dragged),this.cnv.removeEventListener("pointerdown",this.pointedDown),this.cnv.removeEventListener("pointerup",this.pointedUp),this.cnv.removeEventListener("pointerout",this.pointedUp)}}t(e)((function(){const t=document.getElementById("drawApp"),e=document.getElementById("canvas"),i=e.getContext("2d",{willReadFrequently:!0});console.log("width: ",e.width),console.log("height: ",e.height);const n=new s(i,[]);n.activate(),t.addEventListener("fullscreenchange",(function(){t!==document.fullscreenElement&&(e.width=800,e.height=800)}),!1),document.getElementById("appBtn")?.addEventListener("click",(()=>{const i=screen.width,n=screen.height;e.width=Math.max(i,n),e.height=Math.min(i,n),t.requestFullscreen().then((()=>screen.orientation.lock("landscape"))).then((t=>{console.log(t)}),(t=>{console.log(t)})).catch((t=>{alert(`An error occurred while trying to switch into fullscreen mode: ${t.message} (${t.name})`)}))})),document.getElementById("drawButton")?.addEventListener("click",(()=>{n.clear(),n.activate()}))}));
//# sourceMappingURL=index.8d74658b.js.map
