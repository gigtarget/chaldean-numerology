import { useState, useEffect, useRef, useCallback } from "react";

const CHALDEAN = {
  A:1,I:1,J:1,Q:1,Y:1,
  B:2,K:2,R:2,
  C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,
  H:5,N:5,E:5,X:5,
  U:6,V:6,W:6,
  O:7,Z:7,
  F:8,P:8
};

function reduceChaldean(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n < 10) return n;
  return reduceChaldean(String(n).split("").reduce((a,c)=>a+parseInt(c),0));
}

const COLOR_MAP = {
  1:"#F5C842",2:"#C8A8E9",3:"#FF8C42",4:"#5EC4FF",
  5:"#FF6B6B",6:"#6BFFB8",7:"#A78BFA",8:"#FB923C"
};

const CHART_ROWS = [
  { val:1, letters:["A","I","J","Q","Y"] },
  { val:2, letters:["B","K","R"] },
  { val:3, letters:["C","G","L","S"] },
  { val:4, letters:["D","M","T"] },
  { val:5, letters:["H","N","E","X"] },
  { val:6, letters:["U","V","W"] },
  { val:7, letters:["O","Z"] },
  { val:8, letters:["F","P"] },
];

const LANGS = {
  en: {
    title: "Chaldean Numerology",
    subtitle: "Type your name · watch the numbers speak",
    inputLabel: "Enter a name or word",
    placeholder: "e.g.  Jatin Dhiman",
    liveSum: "Live",
    chartTitle: "Chaldean Correspondence Table",
    note: "9 is sacred · not assigned · only reached through reduction",
    meanings: {
      1:{ planet:"The Sun",    keyword:"Leadership",    desc:"Independent and pioneering. A natural leader with strong willpower and creative vision." },
      2:{ planet:"The Moon",   keyword:"Intuition",     desc:"Sensitive and deeply intuitive. Attuned to emotions and the subtle currents of relationships." },
      3:{ planet:"Jupiter",    keyword:"Expression",    desc:"Creative and communicative. Gifted with words, art, and infectious enthusiasm for life." },
      4:{ planet:"Uranus",     keyword:"Foundation",    desc:"Disciplined and hardworking. Builds lasting structures through patience and determination." },
      5:{ planet:"Mercury",    keyword:"Freedom",       desc:"Adventurous and quick-witted. Thrives on change, travel, and the pursuit of experience." },
      6:{ planet:"Venus",      keyword:"Harmony",       desc:"Nurturing and artistically inclined. Creates beauty and fosters love in all environments." },
      7:{ planet:"Neptune",    keyword:"Wisdom",        desc:"Mystical and introspective. Seeks hidden truths and deeper patterns behind reality." },
      8:{ planet:"Saturn",     keyword:"Power",         desc:"Ambitious and authoritative. Capable of great achievement through discipline and focus." },
      9:{ planet:"Mars",       keyword:"Sacred",        desc:"Universally compassionate. The sacred number — attained through reduction." },
      11:{ planet:"Master 11", keyword:"Illumination",  desc:"The spiritual messenger. Heightened intuition and visionary insight beyond ordinary perception." },
      22:{ planet:"Master 22", keyword:"Master Builder",desc:"The architect of dreams. Exceptional ability to manifest large-scale visions into reality." },
      33:{ planet:"Master 33", keyword:"Master Teacher",desc:"Master of compassion. Devoted to uplifting humanity through wisdom and selfless service." },
    }
  },
  hi: {
    title: "चाल्डियन अंकशास्त्र",
    subtitle: "नाम टाइप करें · संख्याएं बोलने लगेंगी",
    inputLabel: "नाम या शब्द दर्ज करें",
    placeholder: "जैसे  Jatin Dhiman",
    liveSum: "योग",
    chartTitle: "चाल्डियन पत्राचार तालिका",
    note: "9 पवित्र है · किसी अक्षर को नहीं दिया · केवल संकुचन से प्राप्त",
    meanings: {
      1:{ planet:"सूर्य",        keyword:"नेतृत्व",       desc:"स्वतंत्र और अग्रणी। प्रबल इच्छाशक्ति और सृजनात्मक दृष्टि वाले स्वाभाविक नेता।" },
      2:{ planet:"चंद्रमा",      keyword:"अंतर्ज्ञान",    desc:"संवेदनशील और गहरे अंतर्ज्ञानी। भावनाओं और रिश्तों की सूक्ष्म धाराओं के प्रति जागरूक।" },
      3:{ planet:"बृहस्पति",     keyword:"अभिव्यक्ति",    desc:"रचनात्मक और संप्रेषणशील। शब्दों, कला और जीवन के प्रति संक्रामक उत्साह से संपन्न।" },
      4:{ planet:"यूरेनस",       keyword:"आधार",          desc:"अनुशासित और परिश्रमी। धैर्य और दृढ़ संकल्प से स्थायी संरचनाएं बनाने वाले।" },
      5:{ planet:"बुध",          keyword:"स्वतंत्रता",    desc:"साहसी और तेज़ दिमाग। परिवर्तन, यात्रा और अनुभव की खोज में पलने वाले।" },
      6:{ planet:"शुक्र",        keyword:"सामंजस्य",      desc:"पालनपोषणकर्ता और कलात्मक। सौंदर्य सृजन और प्रेम पोषण में दक्ष।" },
      7:{ planet:"नेप्च्यून",    keyword:"ज्ञान",         desc:"रहस्यमय और आत्मनिरीक्षण करने वाले। वास्तविकता के पीछे छिपे सत्य के खोजी।" },
      8:{ planet:"शनि",          keyword:"शक्ति",         desc:"महत्वाकांक्षी और अधिकारपूर्ण। अनुशासन और एकाग्रता से महान सफलता पाने में सक्षम।" },
      9:{ planet:"मंगल",         keyword:"पवित्र",        desc:"सर्वव्यापी करुणा और मानवतावाद। पवित्र संख्या — संकुचन द्वारा प्राप्त।" },
      11:{ planet:"मास्टर 11",   keyword:"प्रकाश",        desc:"आध्यात्मिक संदेशवाहक। सामान्य धारणा से परे ऊँचा अंतर्ज्ञान और दूरदर्शिता।" },
      22:{ planet:"मास्टर 22",   keyword:"महानिर्माता",   desc:"स्वप्नों का वास्तुकार। बड़े दृष्टिकोण को वास्तविकता में बदलने की असाधारण क्षमता।" },
      33:{ planet:"मास्टर 33",   keyword:"महागुरु",       desc:"करुणा के स्वामी। ज्ञान और निःस्वार्थ सेवा से मानवता को ऊँचा उठाने के लिए समर्पित।" },
    }
  }
};

function useCountUp(target, duration = 460) {
  const [display, setDisplay] = useState(null);
  const raf = useRef(null);
  const prev = useRef(null);
  useEffect(() => {
    if (target === null || target === undefined) { setDisplay(null); prev.current = null; return; }
    const from = prev.current ?? 0;
    prev.current = target;
    if (from === target) { setDisplay(target); return; }
    const start = performance.now();
    const diff = target - from;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = t < .5 ? 2*t*t : -1+(4-2*t)*t;
      setDisplay(Math.round(from + diff * e));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return display;
}

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function App() {
  const [input, setInput] = useState("");
  const [letters, setLetters] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [liveSum, setLiveSum] = useState(null);
  const [liveReduced, setLiveReduced] = useState(null);
  const [finalReduced, setFinalReduced] = useState(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isCalc, setIsCalc] = useState(false);
  const [hlIdx, setHlIdx] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");

  const timers = useRef([]);
  const debounceTm = useRef(null);
  const isDark = theme === "dark";
  const L = LANGS[lang];

  const animSum     = useCountUp(liveSum, 400);
  const animReduced = useCountUp(liveReduced, 500);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const runCalc = useCallback((raw) => {
    clearAll();
    const upper = raw.toUpperCase();
    if (!upper.trim()) {
      setLetters([]); setVisibleCount(0); setLiveSum(null); setLiveReduced(null);
      setFinalReduced(null); setShowMeaning(false); setIsCalc(false); return;
    }
    const parsed = upper.split("").map(c => ({ char:c, val: c===" "?null:(CHALDEAN[c]??null) }));
    const total = parsed.reduce((a,p)=>a+(p.val||0),0);
    const fin = reduceChaldean(total);

    setLetters(parsed); setVisibleCount(0); setLiveSum(null); setLiveReduced(null);
    setFinalReduced(null); setShowMeaning(false);

    let runSum = 0;
    parsed.forEach((p, i) => {
      const t1 = setTimeout(() => {
        setVisibleCount(i+1);
        if (p.val) {
          runSum += p.val;
          setLiveSum(runSum);
          setLiveReduced(reduceChaldean(runSum));
          setHlIdx(i);
          setTimeout(() => setHlIdx(h => h===i ? null : h), 340);
        }
      }, 68 * i);
      timers.current.push(t1);
    });
    const after = 68 * parsed.length;
    const t2 = setTimeout(() => {
      setLiveSum(total); setLiveReduced(fin); setFinalReduced(fin); setIsCalc(false);
    }, after + 80);
    timers.current.push(t2);
    const t3 = setTimeout(() => setShowMeaning(true), after + 360);
    timers.current.push(t3);
  }, []);

  useEffect(() => {
    setIsCalc(input.trim().length > 0);
    setShowMeaning(false);
    clearTimeout(debounceTm.current);
    debounceTm.current = setTimeout(() => runCalc(input), 280);
    return () => clearTimeout(debounceTm.current);
  }, [input, runCalc]);

  useEffect(() => () => { clearAll(); clearTimeout(debounceTm.current); }, []);

  const inputUpper = input.toUpperCase().split("").filter(c=>c!==" ");
  const activeMeaning = L.meanings[finalReduced] || L.meanings[liveReduced] || null;

  // ── colour tokens ──────────────────────────────────────────
  const d = isDark;
  const c = {
    bg:            d ? "#07080f"                                          : "#f4f0ff",
    bgGrad:        d ? "radial-gradient(ellipse at 22% 8%,#160a28 0%,#07080f 55%,#000510 100%)"
                     : "radial-gradient(ellipse at 22% 8%,#ede9ff 0%,#f8f6ff 55%,#eef4ff 100%)",
    card:          d ? "rgba(255,255,255,.028)"                           : "rgba(255,255,255,.82)",
    cardBorder:    d ? "rgba(245,200,66,.13)"                             : "rgba(160,120,240,.22)",
    cardShadow:    d ? "0 4px 40px rgba(0,0,0,.4)"                       : "0 4px 40px rgba(100,60,200,.09)",
    topLine:       d ? "rgba(245,200,66,.38)"                             : "rgba(167,139,250,.45)",
    text:          d ? "#e8dfc8"                                          : "#2a1f3d",
    textMuted:     d ? "rgba(232,223,200,.38)"                            : "rgba(80,50,140,.42)",
    accent:        d ? "#f5c842"                                          : "#7c3aed",
    accent2:       d ? "#c8a8e9"                                          : "#a78bfa",
    inputBg:       d ? "rgba(255,255,255,.04)"                            : "rgba(255,255,255,.88)",
    inputBorder:   d ? "rgba(245,200,66,.22)"                             : "rgba(140,90,220,.28)",
    inputColor:    d ? "#f5e090"                                          : "#3a1f6a",
    inputPH:       d ? "rgba(245,200,66,.18)"                             : "rgba(140,90,220,.28)",
    inputFocusBd:  d ? "rgba(245,200,66,.45)"                             : "rgba(124,58,237,.5)",
    inputFocusBg:  d ? "rgba(245,200,66,.035)"                            : "rgba(255,255,255,.97)",
    inputGlow:     d ? "rgba(245,200,66,.07)"                             : "rgba(124,58,237,.08)",
    sweepColor:    d ? "rgba(245,200,66,.06)"                             : "rgba(167,139,250,.09)",
    liveBadgeBg:   d ? "rgba(245,200,66,.08)"                             : "rgba(167,139,250,.1)",
    liveBadgeBd:   d ? "rgba(245,200,66,.2)"                              : "rgba(167,139,250,.3)",
    liveDot:       d ? "#f5c842"                                          : "#a78bfa",
    progressGrad:  d ? "linear-gradient(90deg,#f5c842,#c8a8e9,#f5c842)"  : "linear-gradient(90deg,#a78bfa,#f5c842,#a78bfa)",
    numGrad:       d ? "linear-gradient(160deg,#fff5c0,#f5c842,#e89020)" : "linear-gradient(160deg,#c4b5fd,#7c3aed,#4c1d95)",
    numGlow0:      d ? "rgba(245,200,66,.45)"                             : "rgba(124,58,237,.4)",
    numGlow50:     d ? "rgba(245,200,66,.78)"                             : "rgba(124,58,237,.72)",
    ringA:         d ? "rgba(245,200,66,.2)"                              : "rgba(124,58,237,.2)",
    ringB:         d ? "rgba(167,139,250,.14)"                            : "rgba(245,200,66,.14)",
    stripBg:       d ? "rgba(245,200,66,.04)"                             : "rgba(124,58,237,.05)",
    stripBd:       d ? "rgba(245,200,66,.14)"                             : "rgba(124,58,237,.15)",
    planet:        d ? "#c8a8e9"                                          : "#a78bfa",
    keyword:       d ? "#f5c842"                                          : "#7c3aed",
    desc:          d ? "rgba(232,223,200,.7)"                             : "rgba(60,40,100,.65)",
    toggleBg:      d ? "rgba(255,255,255,.06)"                            : "rgba(120,80,200,.09)",
    toggleBd:      d ? "rgba(255,255,255,.11)"                            : "rgba(160,100,220,.22)",
    toggleHov:     d ? "rgba(255,255,255,.11)"                            : "rgba(120,80,200,.16)",
    titleGrad:     d ? "linear-gradient(135deg,#f5c842 0%,#e8a020 40%,#f5c842 70%,#fff5c0 100%)"
                     : "linear-gradient(135deg,#7c3aed 0%,#5b21b6 40%,#a78bfa 70%,#4c1d95 100%)",
    divider:       d ? "linear-gradient(90deg,transparent,#f5c842,transparent)"
                     : "linear-gradient(90deg,transparent,#a78bfa,transparent)",
    cellBg:        d ? "rgba(255,255,255,.025)"                           : "rgba(255,255,255,.65)",
    cellBd:        d ? "rgba(255,255,255,.07)"                            : "rgba(160,100,220,.12)",
    cellLtBg:      d ? "rgba(255,255,255,.05)"                            : "rgba(120,80,200,.07)",
    cellLtColor:   d ? "rgba(232,223,200,.45)"                            : "rgba(80,50,140,.45)",
    chartTitle:    d ? "rgba(200,168,233,.44)"                            : "rgba(120,80,200,.4)",
    note:          d ? "rgba(232,223,200,.18)"                            : "rgba(80,50,140,.25)",
    starOp:        d ? 1                                                   : 0,
    blobOp:        d ? 0                                                   : 1,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=Raleway:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${c.bg};-webkit-text-size-adjust:100%;}

        .wrap{
          min-height:100vh;
          background:${c.bgGrad};
          font-family:'Raleway',sans-serif;
          color:${c.text};
          overflow-x:hidden;position:relative;
          transition:background .4s,color .4s;
        }

        .stars{
          position:fixed;inset:0;pointer-events:none;z-index:0;
          opacity:${c.starOp};transition:opacity .4s;
          background-image:
            radial-gradient(1px 1px at 8% 12%,rgba(255,255,255,.8) 0%,transparent 100%),
            radial-gradient(1px 1px at 28% 44%,rgba(255,255,255,.5) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 52% 19%,rgba(255,255,255,.7) 0%,transparent 100%),
            radial-gradient(1px 1px at 68% 61%,rgba(255,255,255,.4) 0%,transparent 100%),
            radial-gradient(1px 1px at 83% 9%,rgba(255,255,255,.6) 0%,transparent 100%),
            radial-gradient(1px 1px at 91% 79%,rgba(255,255,255,.5) 0%,transparent 100%),
            radial-gradient(1px 1px at 40% 74%,rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 76% 33%,rgba(200,168,233,.65) 0%,transparent 100%),
            radial-gradient(1px 1px at 16% 66%,rgba(245,200,66,.45) 0%,transparent 100%),
            radial-gradient(1px 1px at 33% 88%,rgba(200,168,233,.3) 0%,transparent 100%);
        }
        .blobs{
          position:fixed;inset:0;pointer-events:none;z-index:0;
          opacity:${c.blobOp};transition:opacity .4s;
          background-image:
            radial-gradient(ellipse at 15% 20%,rgba(167,139,250,.18) 0%,transparent 50%),
            radial-gradient(ellipse at 85% 70%,rgba(245,200,66,.12) 0%,transparent 50%),
            radial-gradient(ellipse at 60% 10%,rgba(200,168,233,.15) 0%,transparent 40%);
        }
        .orb{position:fixed;border-radius:50%;filter:blur(88px);pointer-events:none;z-index:0;animation:orbF 8s ease-in-out infinite;}
        .orb1{width:380px;height:380px;top:-100px;right:-100px;background:radial-gradient(circle,${d?"rgba(167,139,250,.1)":"rgba(167,139,250,.14)"} 0%,transparent 70%);}
        .orb2{width:280px;height:280px;bottom:-30px;left:-60px;background:radial-gradient(circle,${d?"rgba(245,200,66,.07)":"rgba(245,200,66,.1)"} 0%,transparent 70%);animation-delay:-4s;}
        @keyframes orbF{0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}

        .container{position:relative;z-index:1;max-width:820px;margin:0 auto;padding:20px 16px 60px;}

        /* topbar */
        .topbar{display:flex;justify-content:flex-end;gap:7px;margin-bottom:18px;}
        .tbtn{
          display:flex;align-items:center;gap:5px;padding:5px 12px;
          border-radius:18px;cursor:pointer;border:1px solid ${c.toggleBd};
          background:${c.toggleBg};color:${c.text};
          font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.1em;
          transition:background .25s,transform .15s;-webkit-appearance:none;
        }
        .tbtn:hover{transform:translateY(-1px);background:${c.toggleHov};}

        /* header */
        .hdr{text-align:center;margin-bottom:18px;}
        .ttl{
          font-family:'Cinzel Decorative',serif;font-size:clamp(1.4rem,4.2vw,2.3rem);
          font-weight:400;line-height:1.2;
          color:${d?"#f5c842":"#7c3aed"};
          opacity:0;animation:fadeUp .7s .05s ease forwards;
          position:relative;display:inline-block;
        }
        @supports (-webkit-background-clip: text) {
          .ttl{
            background:${c.titleGrad};
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
            color:transparent;
          }
        }
        .sub{
          font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.17em;
          color:${c.textMuted};margin-top:7px;
          opacity:0;animation:fadeUp .7s .2s ease forwards;
        }
        .div{width:90px;height:1px;margin:12px auto 0;background:${c.divider};opacity:0;animation:fadeUp .7s .28s ease forwards;}

        /* main card */
        .mcard{
          background:${c.card};border:1px solid ${c.cardBorder};
          border-radius:18px;padding:20px 18px 18px;
          backdrop-filter:blur(16px);position:relative;overflow:hidden;
          opacity:0;animation:fadeUp .7s .35s ease forwards;
          box-shadow:${c.cardShadow};transition:background .4s,border-color .4s,box-shadow .4s;
        }
        .mcard::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,${c.topLine},transparent);
        }

        /* progress */
        .pbar{height:2px;background:${d?"rgba(245,200,66,.07)":"rgba(167,139,250,.12)"};border-radius:2px;overflow:hidden;margin-bottom:12px;}
        .pfill{height:100%;border-radius:2px;background:${c.progressGrad};background-size:200% 100%;transition:width .35s ease;animation:shim 1.8s linear infinite;}
        @keyframes shim{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

        /* label row */
        .lrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;gap:8px;}
        .ilbl{font-family:'Cinzel',serif;font-size:.63rem;letter-spacing:.22em;text-transform:uppercase;color:${d?"rgba(245,200,66,.5)":"rgba(120,80,200,.55)"};white-space:nowrap;}

        /* live badge */
        .lbadge{
          display:inline-flex;align-items:center;gap:6px;flex-shrink:0;
          padding:4px 11px;border-radius:18px;
          background:${c.liveBadgeBg};border:1px solid ${c.liveBadgeBd};
          opacity:0;transform:scale(.82);
          transition:opacity .3s,transform .3s cubic-bezier(.34,1.56,.64,1),background .4s,border-color .4s;
        }
        .lbadge.show{opacity:1;transform:scale(1);}
        .ldot{width:6px;height:6px;border-radius:50%;background:${c.liveDot};animation:blk 1.1s ease-in-out infinite;flex-shrink:0;}
        @keyframes blk{0%,100%{opacity:1;}50%{opacity:.15;}}
        .llbl{font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;color:${d?"rgba(245,200,66,.5)":"rgba(120,80,200,.5)"};}
        .lval{font-family:'Cinzel Decorative',serif;font-size:.95rem;color:${c.accent};min-width:20px;text-align:right;}

        /* input */
        .iwrap{position:relative;}
        .ninput{
          width:100%;background:${c.inputBg};border:1px solid ${c.inputBorder};
          border-radius:12px;color:${c.inputColor};
          font-family:'Cinzel',serif;font-size:clamp(1rem,3.5vw,1.15rem);letter-spacing:.06em;
          padding:11px 16px;outline:none;
          transition:border-color .3s,box-shadow .3s,background .4s,color .4s;
          caret-color:${c.accent};
        }
        .ninput::placeholder{color:${c.inputPH};font-size:.88rem;}
        .ninput:focus{
          border-color:${c.inputFocusBd};background:${c.inputFocusBg};
          box-shadow:0 0 0 3px ${c.inputGlow};
        }
        .swp{position:absolute;inset:0;border-radius:12px;pointer-events:none;
          background:linear-gradient(90deg,transparent 0%,${c.sweepColor} 50%,transparent 100%);
          background-size:200% 100%;opacity:0;transition:opacity .3s;animation:swp 1.2s linear infinite;}
        .swp.on{opacity:1;}
        @keyframes swp{from{background-position:200% 0;}to{background-position:-200% 0;}}

        /* letters */
        .ltrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;}

        /* result strip — INSIDE card, no scroll */
        .rstrip{
          margin-top:16px;padding:14px 16px;
          background:${c.stripBg};border:1px solid ${c.stripBd};
          border-radius:13px;
          display:flex;align-items:center;gap:16px;flex-wrap:wrap;
          opacity:0;transform:translateY(10px) scale(.97);
          transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1);
        }
        .rstrip.show{opacity:1;transform:none;}

        .rnumwrap{position:relative;flex-shrink:0;}
        .nring{position:absolute;inset:-10px;border-radius:50%;pointer-events:none;
          background:conic-gradient(${c.ringA} 0deg,transparent 120deg,${c.ringB} 240deg,transparent 360deg);
          animation:rng 9s linear infinite;opacity:.5;}
        @keyframes rng{to{transform:rotate(360deg);}}
        .rbignum{
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(3rem,9vw,5rem);line-height:1;
          background:${c.numGrad};
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:ng 3s ease-in-out infinite;display:block;
        }
        @keyframes ng{0%,100%{filter:drop-shadow(0 0 14px ${c.numGlow0});}50%{filter:drop-shadow(0 0 30px ${c.numGlow50});}}

        .rtxt{flex:1;min-width:140px;}
        .rplanet{font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.28em;text-transform:uppercase;color:${c.planet};margin-bottom:4px;}
        .rkw{font-family:'Cinzel Decorative',serif;font-size:1rem;color:${c.keyword};margin-bottom:5px;line-height:1.2;}
        .rdesc{font-family:'Raleway',sans-serif;font-weight:300;font-size:.8rem;line-height:1.65;color:${c.desc};}
        .mfade{opacity:0;transform:translateY(7px);transition:opacity .42s .06s,transform .42s .06s;}
        .mfade.show{opacity:1;transform:none;}

        /* chart */
        .csec{margin-top:24px;opacity:0;animation:fadeUp .9s .55s ease forwards;}
        .ctitle{font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:${c.chartTitle};margin-bottom:13px;text-align:center;}
        .cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
        @media(max-width:420px){.cgrid{grid-template-columns:repeat(2,1fr);}}
        .ccell{
          background:${c.cellBg};border:1px solid ${c.cellBd};
          border-radius:11px;padding:11px 9px;
          transition:background .25s,border-color .25s,transform .2s,box-shadow .2s;
        }
        .ccell.lit{transform:translateY(-2px);}
        .cnum{font-family:'Cinzel Decorative',serif;font-size:1.2rem;line-height:1;margin-bottom:7px;}
        .clts{display:flex;flex-wrap:wrap;gap:3px;}
        .clt{
          font-family:'Cinzel',serif;font-size:.6rem;padding:2px 5px;border-radius:4px;
          background:${c.cellLtBg};letter-spacing:.04em;color:${c.cellLtColor};
          transition:background .2s,color .2s,transform .18s,box-shadow .2s;
        }
        .clt.hit{transform:scale(1.2);}

        .fnote{text-align:center;margin-top:28px;font-family:'Raleway',sans-serif;font-weight:300;font-size:.65rem;letter-spacing:.13em;color:${c.note};}

        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <div className="wrap">
        <div className="stars"/><div className="blobs"/>
        <div className="orb orb1"/><div className="orb orb2"/>

        <div className="container">

          {/* Topbar */}
          <div className="topbar">
            <button className="tbtn" onClick={() => setLang(l => l==="en"?"hi":"en")}>
              <span style={{fontSize:".8rem"}}>{lang==="en"?"अ":"A"}</span>
              {lang==="en" ? "हिंदी" : "English"}
            </button>
            <button className="tbtn" onClick={() => setTheme(t => t==="dark"?"light":"dark")}>
              {isDark ? <SunIcon/> : <MoonIcon/>}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>

          {/* Header */}
          <div className="hdr">
            <h1 className="ttl">{L.title}</h1>
            <p className="sub">{L.subtitle}</p>
            <div className="div"/>
          </div>

          {/* Main card */}
          <div className="mcard">

            {/* Progress bar */}
            <div className="pbar">
              <div className="pfill" style={{width:`${Math.min((input.length/30)*100,100)}%`}}/>
            </div>

            {/* Label row: label left, live badge right */}
            <div className="lrow">
              <span className="ilbl">{L.inputLabel}</span>
              <div className={`lbadge${liveSum!==null?" show":""}`}>
                <div className="ldot"/>
                <span className="llbl">{L.liveSum}</span>
                <span className="lval">{animSum ?? "—"}</span>
              </div>
            </div>

            {/* Input */}
            <div className="iwrap">
              <input
                className="ninput"
                type="text"
                placeholder={L.placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
                maxLength={50}
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
              <div className={`swp${isCalc?" on":""}`}/>
            </div>

            {/* Letter chips */}
            {letters.length > 0 && (
              <div className="ltrow">
                {letters.map((l, i) => {
                  const color = l.val ? (COLOR_MAP[l.val]||"#e8dfc8") : null;
                  if (l.char===" ") return <div key={i} style={{width:10}}/>;
                  const vis = i < visibleCount;
                  const hl  = hlIdx === i;
                  return (
                    <div key={i} style={{
                      display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                      opacity:vis?1:0,
                      transform:vis?"translateY(0) scale(1)":"translateY(14px) scale(0.6)",
                      transition:"opacity 0.27s cubic-bezier(.34,1.56,.64,1),transform 0.27s cubic-bezier(.34,1.56,.64,1)",
                    }}>
                      <div style={{
                        width:38,height:38,borderRadius:8,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"'Cinzel',serif",fontSize:"0.95rem",fontWeight:600,
                        color:color||"rgba(128,128,128,.4)",
                        border:`1px solid ${color?color+"40":"rgba(128,128,128,.15)"}`,
                        background:color?`${color}12`:"rgba(128,128,128,.04)",
                        boxShadow:hl&&color?`0 0 16px ${color}66`:"none",
                        transition:"box-shadow .3s",
                      }}>{l.char}</div>
                      <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.56rem",fontWeight:600,color:color||"rgba(128,128,128,.35)",opacity:.9}}>
                        {l.val??"·"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Result strip — inline, no scroll */}
            {liveReduced !== null && (
              <div className={`rstrip${liveReduced!==null?" show":""}`}>
                <div className="rnumwrap">
                  <div className="nring"/>
                  <span className="rbignum">{animReduced ?? liveReduced}</span>
                </div>
                <div className={`mfade${showMeaning?" show":""}`}>
                  {activeMeaning ? (
                    <div className="rtxt">
                      <p className="rplanet">{activeMeaning.planet}</p>
                      <p className="rkw">{activeMeaning.keyword}</p>
                      <p className="rdesc">{activeMeaning.desc}</p>
                    </div>
                  ) : (
                    <div className="rtxt">
                      <p className="rkw" style={{fontSize:".95rem"}}>Number {liveReduced}</p>
                      <p className="rdesc">A unique vibrational frequency on your numerological journey.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="csec">
            <p className="ctitle">{L.chartTitle}</p>
            <div className="cgrid">
              {CHART_ROWS.map(row => {
                const color = COLOR_MAP[row.val];
                const isLit = inputUpper.some(c => row.letters.includes(c));
                return (
                  <div key={row.val} className={`ccell${isLit?" lit":""}`}
                    style={isLit?{background:`${color}0e`,borderColor:`${color}36`,boxShadow:`0 0 14px ${color}15`}:{}}>
                    <div className="cnum" style={{color}}>{row.val}</div>
                    <div className="clts">
                      {row.letters.map((lt,i) => {
                        const hit = inputUpper.includes(lt);
                        return (
                          <span key={i} className={`clt${hit?" hit":""}`}
                            style={hit?{background:`${color}22`,color,boxShadow:`0 0 7px ${color}44`}:{}}>
                            {lt}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="fnote">{L.note}</p>
        </div>
      </div>
    </>
  );
}
