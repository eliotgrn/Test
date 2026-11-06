/* ===== GRÜN 2050 · habillage =====
   Ne change AUCUNE fonction, aucun texte, aucune donnée : seulement l'apparence.
   Fond vivant (aurore, grille, grain), cartes en verre avec bord lumineux, grands titres au mot clé en vert citron,
   boutons principaux et chiffres qui brillent, courbes lumineuses, barre d'onglets flottante. */
(function () {
  "use strict";
  const css = `
html{background:#040605!important}
body{background:transparent!important}
.g2{background:transparent!important}
/* ---- fond vivant ---- */
.gs-bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.gs-bg .au{position:absolute;inset:-30%;filter:blur(60px)}
.gs-bg .au i{position:absolute;border-radius:50%}
.gs-bg .au i:nth-child(1){width:60%;height:40%;left:45%;top:6%;background:radial-gradient(circle,rgba(59,224,138,.26),transparent 70%);animation:gsa 16s ease-in-out infinite alternate}
.gs-bg .au i:nth-child(2){width:55%;height:38%;left:4%;top:58%;background:radial-gradient(circle,rgba(228,243,58,.12),transparent 70%);animation:gsb 20s ease-in-out infinite alternate}
.gs-bg .au i:nth-child(3){width:45%;height:30%;left:28%;top:34%;background:radial-gradient(circle,rgba(30,140,120,.18),transparent 70%);animation:gsa 24s ease-in-out infinite alternate-reverse}
@keyframes gsa{to{transform:translate(-18%,12%) scale(1.15)}}@keyframes gsb{to{transform:translate(20%,-10%) scale(1.1)}}
.gs-bg .gr{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse at 50% 15%,#000 15%,transparent 70%);mask-image:radial-gradient(ellipse at 50% 15%,#000 15%,transparent 70%)}
.gs-bg .gn{position:absolute;inset:0;opacity:.05;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>")}
/* ---- verre ---- */
.gs-glass{background:linear-gradient(160deg,rgba(26,37,31,.78),rgba(9,14,11,.72)) padding-box,linear-gradient(140deg,rgba(228,243,58,.38),rgba(59,224,138,.16) 32%,rgba(255,255,255,.05) 60%,rgba(59,224,138,.16)) border-box!important;border:1px solid transparent!important;-webkit-backdrop-filter:blur(16px) saturate(1.35);backdrop-filter:blur(16px) saturate(1.35);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 18px 44px rgba(0,0,0,.4)}
.gs-btn2{background:rgba(255,255,255,.055)!important;border-color:rgba(255,255,255,.09)!important;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
/* ---- titres : plus grands, sur deux lignes si besoin ---- */
.hx.bas{--hx:224px}
.hx h1{line-height:.88!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important}
.gs-chipg{box-shadow:0 0 16px rgba(59,224,138,.22),inset 0 0 10px rgba(59,224,138,.08)}
.gs-chipo{box-shadow:0 0 16px rgba(255,159,67,.22),inset 0 0 10px rgba(255,159,67,.08)}
.gs-hl{font-style:normal;color:#E4F33A;text-shadow:0 0 26px rgba(228,243,58,.35)}
#main h1{text-shadow:0 0 30px rgba(59,224,138,.12)}
/* ---- boutons principaux et chiffres ---- */
.gs-cta{box-shadow:0 0 0 5px rgba(228,243,58,.08),0 14px 34px rgba(228,243,58,.22)!important}
.gs-num{text-shadow:0 0 26px rgba(228,243,58,.28)}
.gs-big{color:#E4F33A!important}
/* ---- courbes ---- */
.gs-glow{filter:drop-shadow(0 0 6px rgba(228,243,58,.55))}
.gs-glowg{filter:drop-shadow(0 0 5px rgba(59,224,138,.5))}
/* ---- barre d'onglets flottante ---- */
@media (max-width:900px){
#grun-nav{left:10px!important;right:10px!important;bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;border-radius:24px!important;background:rgba(14,20,17,.62)!important;-webkit-backdrop-filter:blur(22px) saturate(1.5)!important;backdrop-filter:blur(22px) saturate(1.5)!important;border:1px solid rgba(255,255,255,.07)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 16px 40px rgba(0,0,0,.55)!important;padding-bottom:0!important;overflow:hidden}
#grun-nav a.on{color:#0A0D0B!important;position:relative}
#grun-nav a.on::before{content:"";position:absolute;inset:6px 4px;border-radius:18px;background:#E4F33A;box-shadow:0 0 22px rgba(228,243,58,.4);z-index:-1}
#grun-nav a{position:relative;z-index:0}
body.grun-has-nav{padding-bottom:calc(var(--nav-h) + 22px + env(safe-area-inset-bottom,0px))}
}
/* ---- fenêtres en verre ---- */
.grun-ov .grun-sheet{background:linear-gradient(170deg,rgba(24,34,28,.92),rgba(8,12,10,.94))!important;-webkit-backdrop-filter:blur(24px) saturate(1.4);backdrop-filter:blur(24px) saturate(1.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 -20px 60px rgba(0,0,0,.5)}
@media (prefers-reduced-motion: reduce){.gs-bg .au i{animation:none!important}}`;
  const st = document.createElement("style"); st.id = "gs-css"; st.textContent = css; document.head.appendChild(st);

  function bg() { if (!document.body || document.querySelector(".gs-bg")) return; const d = document.createElement("div"); d.className = "gs-bg"; d.setAttribute("aria-hidden", "true"); d.innerHTML = '<div class="au"><i></i><i></i><i></i></div><div class="gr"></div><div class="gn"></div>'; document.body.prepend(d); }

  const PANEL = "rgb(17, 22, 20)", BTN = "rgb(18, 23, 20)", LIMEBG = /rgb\(228, 2(43|55), 58\)/;
  const seen = new WeakSet();
  function dress(root) {
    if (!root) return;
    /* cartes : tout ce qui a le fond « panneau » de l'appli devient du verre */
    for (const el of root.querySelectorAll("a,div,section,article,details,li,button,label,form")) {
      if (seen.has(el)) continue; seen.add(el);
      const cs = getComputedStyle(el), b = cs.backgroundColor;
      if (b === PANEL && parseFloat(cs.borderTopLeftRadius) >= 12) el.classList.add("gs-glass");
      else if (b === BTN && el.matches("button,a,.ib")) el.classList.add("gs-btn2");
      else if (LIMEBG.test(b) && el.matches("button,a,label,[role=button]") && el.offsetHeight >= 34) el.classList.add("gs-cta");
      else if (el.offsetHeight > 0 && el.offsetHeight < 44 && parseFloat(cs.borderTopWidth) >= 1 && parseFloat(cs.borderTopLeftRadius) >= 10) { const bc = cs.borderTopColor; if (/rgb\(59, 224, 138\)/.test(bc)) el.classList.add("gs-chipg"); else if (/rgb\(2(4|5)\d, 1[3-7]\d, \d{1,2}\)/.test(bc)) el.classList.add("gs-chipo"); }
    }
    /* grands titres : le dernier mot en vert citron (le texte reste exactement le même) */
    for (const h of root.querySelectorAll("h1")) {
      if (h.dataset.gs || h.children.length) continue; const t = h.textContent; const m = /^(.*\S)\s+(\S+)$/.exec(t.trim()); h.dataset.gs = 1;
      if (!m || t.trim().length > 40) continue; const cs = getComputedStyle(h); if (parseFloat(cs.fontSize) < 26) continue;
      const lead = t.slice(0, t.lastIndexOf(m[2])); h.textContent = ""; h.append(document.createTextNode(lead)); const em = document.createElement("em"); em.className = "gs-hl"; em.textContent = m[2]; h.append(em);
    }
    /* grands titres d'en-tête : le plus grand possible (jusqu'à 60 px) sans jamais couper un mot ni déborder */
    for (const h of root.querySelectorAll(".hx h1")) { if (h.dataset.gsf) continue; h.dataset.gsf = 1; const f0 = parseFloat(getComputedStyle(h).fontSize);
      const set = f => h.style.setProperty("font-size", f + "px", "important");
      const box = h.parentElement, lim = () => Math.min(innerWidth - 16, box ? box.getBoundingClientRect().right : innerWidth);
      const fits = f => { const r = h.getBoundingClientRect(); if (r.right > lim() + 1) return false; return h.scrollWidth <= h.clientWidth + 1 && Math.round(h.scrollHeight / (f * .88)) <= 2 && [...h.querySelectorAll("*")].every(x => x.getBoundingClientRect().right <= r.right + 1); };
      let f = Math.max(f0, 60); set(f); while (!fits(f) && f > f0) { f -= 2; set(f); } if (!fits(f)) h.style.removeProperty("font-size"); }
    /* en-têtes : si le titre agrandi touche les boutons du haut, l'en-tête s'allonge juste ce qu'il faut */
    for (const hx of root.querySelectorAll(".hx")) { const t = hx.querySelector(".hx-t"), h = hx.querySelector(".hx-h"); if (!t || !h) continue;
      const over = h.getBoundingClientRect().bottom + 14 - t.getBoundingClientRect().top; if (over > 0) hx.style.height = (hx.offsetHeight + over) + "px"; }
    /* grands chiffres et courbes lumineuses */
    for (const el of root.querySelectorAll("b,strong,span,div,p")) { if (el.children.length || el.classList.contains("gs-num") || el.dataset.gsn) continue; el.dataset.gsn = 1; const t = (el.textContent || "").trim(); if (!/^[\d\s  .,]+$/.test(t) || !/\d/.test(t)) continue; const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize); if (fs < 26) continue; el.classList.add("gs-num");
      /* grands chiffres : 40 % plus grands et en vert citron, seulement s'ils sont blancs et s'il y a la place */
      if (cs.color === "rgb(242, 245, 240)" && fs < 60) { const box = el.parentElement; const w0 = box ? box.scrollWidth : 0; el.style.fontSize = (fs * 1.4) + "px"; el.style.lineHeight = "1"; el.classList.add("gs-big");
        if (box && (box.scrollWidth > box.clientWidth + 1 || box.scrollWidth > w0 + 1 && box.scrollWidth > box.clientWidth)) { el.style.fontSize = ""; el.style.lineHeight = ""; el.classList.remove("gs-big"); } } }
    for (const p of root.querySelectorAll("svg path, svg polyline")) { if (p.classList.contains("gs-glow") || p.classList.contains("gs-glowg")) continue; const cs = getComputedStyle(p); if (cs.fill !== "none" || cs.strokeDasharray !== "none" || parseFloat(cs.strokeWidth) < 1.5) continue;
      if (LIMEBG.test(cs.stroke)) p.classList.add("gs-glow"); else if (/rgb\(59, 224, 138\)|rgb\(47, 191, 113\)/.test(cs.stroke)) p.classList.add("gs-glowg"); }
  }
  let q = false; const sched = () => { if (q) return; q = true; requestAnimationFrame(() => { q = false; dress(document.getElementById("main")); dress(document.getElementById("grun-nav")); for (const s of document.querySelectorAll(".grun-sheet")) dress(s); }); };
  function boot() { bg(); sched(); new MutationObserver(sched).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
