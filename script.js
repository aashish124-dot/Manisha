const MUSIC_START = 45;
const MUSIC_VOLUME = 35;
const VIDEO_ID = "ZJ34geQLtUE";

let player = null;
let musicStarted = false;

function loadYouTube() {
  if (window.YT && window.YT.Player) {
    createPlayer();
    return;
  }
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}
window.onYouTubeIframeAPIReady = createPlayer;

function createPlayer() {
  if (player) return;
  player = new YT.Player("ytPlayer", {
    height: "1", width: "1",
    videoId: VIDEO_ID,
    playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1, enablejsapi: 1 },
    events: {
      onReady: e => {
        e.target.setVolume(MUSIC_VOLUME);
        e.target.seekTo(MUSIC_START, true);
      }
    }
  });
}

function startMusic() {
  if (!player || !player.playVideo) return;
  try {
    player.setVolume(MUSIC_VOLUME);
    player.seekTo(MUSIC_START, true);
    player.playVideo();
    musicStarted = true;
    document.getElementById("musicBtn").classList.add("playing");
  } catch(e) {}
}

function toggleMusic() {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    document.getElementById("musicBtn").classList.remove("playing");
  } else {
    player.setVolume(MUSIC_VOLUME);
    if (!musicStarted) player.seekTo(MUSIC_START, true);
    player.playVideo();
    musicStarted = true;
    document.getElementById("musicBtn").classList.add("playing");
  }
}

loadYouTube();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.13});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const messageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const lines = entry.target.querySelectorAll(".message-line");
    lines.forEach((line, i) => setTimeout(() => line.classList.add("visible"), i * 430));
    messageObserver.unobserve(entry.target);
  });
}, {threshold:.15});

const messageSection = document.querySelector("#message");
if (messageSection) messageObserver.observe(messageSection);

function scrollToTarget(selector) {
  document.querySelector(selector)?.scrollIntoView({behavior:"smooth"});
}

document.getElementById("openBtn").addEventListener("click", () => {
  startMusic();
  scrollToTarget("#intro");
  burstConfetti(70);
});

document.querySelectorAll(".scroll-btn").forEach(btn => {
  btn.addEventListener("click", () => scrollToTarget(btn.dataset.target));
});

document.getElementById("musicBtn").addEventListener("click", toggleMusic);

document.querySelectorAll(".choice").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("gameResult").classList.add("show");
    burstConfetti(55);
    spawnHearts(12);
  });
});

document.getElementById("giftBtn").addEventListener("click", function() {
  this.classList.toggle("opened");
  document.getElementById("giftMessage").classList.add("show");
  burstConfetti(45);
  spawnHearts(18);
  setTimeout(() => document.getElementById("giftMessage").scrollIntoView({behavior:"smooth", block:"center"}), 350);
});

document.getElementById("replayBtn").addEventListener("click", () => {
  window.scrollTo({top:0, behavior:"smooth"});
  document.getElementById("giftBtn").classList.remove("opened");
  document.getElementById("giftMessage").classList.remove("show");
  document.getElementById("gameResult").classList.remove("show");
  document.querySelectorAll(".message-line").forEach(x => x.classList.remove("visible"));
  setTimeout(() => burstConfetti(60), 700);
});

function burstConfetti(count=60) {
  const box = document.getElementById("confetti");
  for(let i=0;i<count;i++){
    const c=document.createElement("i");
    c.className="conf";
    c.style.left=(35+Math.random()*30)+"%";
    c.style.setProperty("--x",((Math.random()-.5)*70)+"vw");
    c.style.transform=`rotate(${Math.random()*360}deg)`;
    c.style.background=["#f29abb","#c1a8eb","#ffd28e","#ffbfd4","#b8dfcf"][Math.floor(Math.random()*5)];
    c.style.animationDelay=(Math.random()*.35)+"s";
    box.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}

function spawnHearts(count=8) {
  const box=document.getElementById("hearts");
  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.className="float-heart";
    h.textContent=["❤️","🩷","💗","💕","✨"][Math.floor(Math.random()*5)];
    h.style.left=(Math.random()*100)+"%";
    h.style.animationDuration=(3+Math.random()*3)+"s";
    h.style.animationDelay=(Math.random()*.8)+"s";
    box.appendChild(h);
    setTimeout(()=>h.remove(),7000);
  }
}

function spawnSparkle() {
  const s=document.createElement("i");
  s.className="spark";
  s.style.left=(Math.random()*100)+"%";
  s.style.top=(Math.random()*100)+"%";
  document.getElementById("sparkles").appendChild(s);
  setTimeout(()=>s.remove(),1900);
}
setInterval(spawnSparkle, 500);
setInterval(()=>spawnHearts(2), 1800);

function fireworksBurst() {
  const box=document.getElementById("fireworks");
  for(let burst=0;burst<4;burst++){
    setTimeout(()=>{
      const cx=20+Math.random()*60, cy=20+Math.random()*45;
      for(let i=0;i<28;i++){
        const f=document.createElement("i");
        f.className="fire";
        f.style.left=cx+"%"; f.style.top=cy+"%";
        const a=Math.PI*2*i/28, r=45+Math.random()*80;
        f.style.setProperty("--dx",Math.cos(a)*r+"px");
        f.style.setProperty("--dy",Math.sin(a)*r+"px");
        f.style.background=["#f29abb","#c0a5ec","#ffd08c","#fff"][Math.floor(Math.random()*4)];
        box.appendChild(f);
        setTimeout(()=>f.remove(),1300);
      }
    },burst*650);
  }
}
const finalObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting){fireworksBurst();setTimeout(fireworksBurst,3000);finalObserver.disconnect();}
},{threshold:.3});
finalObserver.observe(document.getElementById("final"));

window.addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  document.getElementById("progress").style.width=(max>0?(scrollY/max)*100:0)+"%";
});

document.addEventListener("pointerdown",e=>{
  if(e.target.closest("button")) return;
  const s=document.createElement("i");
  s.className="spark";
  s.style.left=e.clientX+"px"; s.style.top=e.clientY+"px";
  document.getElementById("sparkles").appendChild(s);
  setTimeout(()=>s.remove(),1800);
});
