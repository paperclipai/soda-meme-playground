'use strict';
const memes=[
['brain-tabs','Brain rot','my brain has 47 tabs open and one is playing music','Lavender frog overwhelmed by floating browser tabs'],
['social-battery','Social life','social battery: 1% • charger: staying home','Cat lying beside a phone, plugged into a charger'],
['tiny-task','Work & study','me preparing emotionally to send one email','Tiny hamster facing a gigantic envelope'],
['fridge','Daily chaos','checking the fridge like the plot has developed','Raccoon studying an almost empty fridge'],
['calendar','Work & study','how is next week already making demands','Duck running away from a calendar'],
['laundry','Daily chaos','the chair has been promoted to wardrobe','Blue creature perched on a laundry mountain'],
['wifi','Brain rot','the wifi is down. i have become a historical figure','Pigeon raising a router to the sky'],
['budget','Daily chaos','financially in my look but don’t touch era','Pig displaying a single coin on a cushion'],
['group-chat','Social life','i leave the group chat for 8 minutes and miss 3 seasons','Frog surrounded by phones spilling from a mailbox'],
['sleep','Daily chaos','tired all day. suddenly a visionary at 1:43 am','Wide awake moon drinking espresso'],
['outside','Brain rot','touching grass. is there a tutorial','Alien examining a blade of grass'],
['loading','Work & study','locked in. buffering. still technically locked in','Snail in racing goggles on a treadmill'],
['email','Work & study','just circling back to my last remaining brain cell','Octopus tangled in office envelopes'],
['coffee','Daily chaos','not a morning person. a morning beverage person','Tiny sun sitting in a coffee cup'],
['plans','Social life','love being invited. huge fan of the cancellation','Cat in a party hat hiding in a box'],
['algorithm','Brain rot','my algorithm knows a version of me i have never met','Goblin feeding a phone into a slot machine'],
['deadline','Work & study','the deadline is a suggestion with consequences','Hamster blocking a giant tomato with a spoon'],
['password','Brain rot','new password cannot be one of your 19 previous personalities','Raccoon guarding a tiny chest with giant padlocks'],
['snack','Daily chaos','a little treat has become the entire business model','Crowned frog holding one potato chip'],
['existential','Social life','went for cereal. left with questions about my lore','Ghost contemplating cereal in a grocery aisle']
].map(([id,topic,caption,alt])=>({id,topic,caption,alt}));
const $=s=>document.querySelector(s);let likes=new Set();let storageWorks=true;
try{const stored=JSON.parse(localStorage.getItem('soda-likes-v1')||'[]');if(Array.isArray(stored))likes=new Set(stored.filter(id=>memes.some(m=>m.id===id)));}catch{storageWorks=false;}
let active='All moods',savedOnly=false,order=[...memes],current=null,previewImage=null,paintVersion=0;
const topics=['All moods','Daily chaos','Brain rot','Social life','Work & study'];
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),2800);}
function render(){
 $('#filters').replaceChildren(...topics.map(topic=>{const b=document.createElement('button');b.className='filter'+(topic===active?' active':'');b.textContent=topic;b.setAttribute('aria-pressed',String(topic===active));b.onclick=()=>{active=topic;render()};return b;}));
 const shown=order.filter(m=>(active==='All moods'||m.topic===active)&&(!savedOnly||likes.has(m.id)));
 $('#count').textContent=`${shown.length} / 20 moods${savedOnly?' · liked':''}`;$('#like-count').textContent=likes.size;$('#saved').setAttribute('aria-pressed',String(savedOnly));$('#saved').style.background=savedOnly?'#d6ef85':'';
 $('#grid').replaceChildren(...shown.map(m=>{const article=document.createElement('article');article.className='meme';article.innerHTML=`<div class="meme-image"><img src="assets/${m.id}.webp" alt="${m.alt}" loading="lazy" width="640" height="640"><span class="tag">${m.topic}</span></div><p class="meme-caption"></p><div class="card-actions"><button class="like" aria-label="Like meme" aria-pressed="false">♡</button><button class="remix">Remix caption ↗</button></div>`;article.dataset.id=m.id;article.querySelector('.meme-caption').textContent=m.caption;const like=article.querySelector('.like');like.textContent=likes.has(m.id)?'♥':'♡';like.setAttribute('aria-label',`${likes.has(m.id)?'Unlike':'Like'}: ${m.caption}`);like.setAttribute('aria-pressed',String(likes.has(m.id)));like.onclick=()=>{likes.has(m.id)?likes.delete(m.id):likes.add(m.id);try{localStorage.setItem('soda-likes-v1',JSON.stringify([...likes]));}catch{storageWorks=false;}render();if(!storageWorks)toast('Likes work here, but browser storage is unavailable.');};article.querySelector('.remix').onclick=()=>openEditor(m);return article;}));
 $('#empty').hidden=shown.length>0;
}
$('#saved').onclick=()=>{savedOnly=!savedOnly;render();$('#feed').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
$('#show-all').onclick=()=>{active='All moods';savedOnly=false;render();};
$('#shuffle').onclick=()=>{const previous=order.map(m=>m.id).join();for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}if(previous===order.map(m=>m.id).join())order.push(order.shift());render();toast('Fresh chaos, coming right up.');};
async function openEditor(m){current=m;previewImage=null;$('#caption').value=m.caption;$('#download-status').textContent='';$('#download').disabled=true;$('#editor').showModal();drawPreview();const img=new Image();img.onload=()=>{if(current?.id===m.id){previewImage=img;drawPreview();$('#download').disabled=false;}};img.onerror=()=>{$('#download-status').textContent='Image could not load. Close and try again.';};img.src=`assets/${m.id}.webp`;}
function wrap(ctx,text,width){const lines=[];let line='';for(const word of text.trim().split(/\s+/)){for(const part of word.match(/.{1,24}/gu)||['']){const test=line?line+' '+part:part;if(ctx.measureText(test).width>width&&line){lines.push(line);line=part;}else line=test;}}if(line)lines.push(line);return lines;}
function drawPreview(){const canvas=$('#preview'),ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1080,1350);if(previewImage)ctx.drawImage(previewImage,0,0,1080,1000);else{ctx.fillStyle='#e7e1d7';ctx.fillRect(0,0,1080,1000);}const caption=$('#caption').value;$('#chars').textContent=`${caption.length}/150`;let fontSize=54,lines;do{ctx.font=`700 ${fontSize}px Arial`;lines=wrap(ctx,caption,960);if(lines.length*fontSize*1.17<=235)break;fontSize-=2;}while(fontSize>=26);ctx.fillStyle='#242922';ctx.textAlign='center';ctx.textBaseline='middle';lines.forEach((line,i)=>ctx.fillText(line,540,1020+(260-lines.length*fontSize*1.17)/2+fontSize*.6+i*fontSize*1.17));ctx.textAlign='left';ctx.font='bold 24px Arial';ctx.fillText('soda ✳',35,1314);ctx.textAlign='right';ctx.font='18px Arial';ctx.fillText('freshly unserious · AI-made art',1045,1314);paintVersion++;}
$('#caption').addEventListener('input',drawPreview);
const remixes=['emotionally available for snacks only','the plot thickens. i take a nap.','currently running on vibes and one unread notification','my comfort zone has excellent wifi','in my side quest era. main quest unclear.','the situation is giving loading screen','mentally at the little treat department'];let remixIndex=0;
$('#surprise').onclick=()=>{$('#caption').value=remixes[remixIndex++%remixes.length];drawPreview();};
$('#download').onclick=()=>{if(!previewImage)return;drawPreview();$('#preview').toBlob(blob=>{if(!blob){$('#download-status').textContent='Download failed. Please try again.';return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`soda-${current.id}-remix.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#download-status').textContent='PNG ready. Check your browser downloads.';},'image/png');};
$('#close').onclick=()=>$('#editor').close();$('#editor').addEventListener('click',e=>{if(e.target===$('#editor')){const r=$('#editor').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#editor').close();}});
render();
