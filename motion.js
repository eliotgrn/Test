/* ===== GRÜN · couche « mouvement » v4 : propre, fluide, sous le doigt =====
   Ne change AUCUNE fonction, aucun texte, aucune donnée.
   - ouverture : le vrai logo de l'accueil se dessine sur place (ses deux anneaux, puis GRÜN et ses deux balles)
   - changement d'écran : le nouvel écran glisse légèrement et apparaît ; rien ne reste derrière
   - onglets du bas : simple fondu
   - fenêtres : montent avec souplesse, se ferment en les tirant vers le bas ; l'écran derrière ne bouge pas
   - appui : le bouton s'enfonce et revient ; petit « tic » sur les choix (iPhone récent / Android)
   - chiffres qui défilent, courbes et radars qui se dessinent, contenus qui apparaissent au défilement
   - appli installée : glisser depuis le bord gauche pour revenir
   Tout se coupe si le téléphone est réglé sur « réduire les animations ». */
(function () {
  "use strict";
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = "cubic-bezier(.22,1,.36,1)";        /* sortie très douce */
  const SOFT = "cubic-bezier(.25,1.1,.4,1)";        /* rebond à peine perceptible */
  const LIME = "228,243,58";
  const STANDALONE = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;

  const css = `
@view-transition{navigation:auto}
::view-transition-old(root){animation:gm-out .2s ease both}
::view-transition-new(root){animation:gm-in .3s ${EASE} both}
@keyframes gm-out{to{opacity:0}}
@keyframes gm-in{from{opacity:0}}
html{-webkit-tap-highlight-color:transparent}
.grun-ov .grun-sheet{transform:translateY(40px);transition:transform .46s ${SOFT}!important;will-change:transform}
.grun-ov.in .grun-sheet{transform:none}
.grun-ov.out .grun-sheet{transform:translateY(28px);transition:transform .18s ease!important}
.grun-ov .grun-sheet.gm-drag{transition:none!important}
.grun-ov .grun-sheet::before{content:"";display:block;width:38px;height:5px;border-radius:5px;background:rgba(255,255,255,.18);margin:-4px auto 6px}
#grun-toast.on{animation:gm-toast .45s ${SOFT}}
@keyframes gm-toast{from{transform:translateY(16px);opacity:0}}
.gm-rip{position:fixed;z-index:9998;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:radial-gradient(circle,rgba(${LIME},.2),rgba(${LIME},0) 70%)}
.gm-edge{position:fixed;inset:0;z-index:9990;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.6),rgba(0,0,0,0) 45%);opacity:0}
input,textarea,select{transition:border-color .2s ease,box-shadow .25s ease}
input:focus,textarea:focus,select:focus{box-shadow:0 0 0 3px rgba(${LIME},.16)}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}::view-transition-old(root),::view-transition-new(root){animation:none!important}}`;
  const st = document.createElement("style"); st.id = "gm-css"; st.textContent = css; document.head.appendChild(st);
  /* iPhone : sans cet écouteur, l'état « appuyé » n'apparaît pas au toucher */
  document.addEventListener("touchstart", () => { }, { passive: true });
  if (RM) return;

  const A = (el, kf, o) => { try { return el.animate(kf, { fill: "backwards", ...o }); } catch (e) { } };

  /* ---------- ouverture : le vrai logo de l'accueil se dessine sur place (une fois par session) ---------- */
  let opened = false;
  function logo(root) {
    if (opened) return; const ring = root.querySelector(".g2-ring"); if (!ring) return;
    try { if (sessionStorage.getItem("gm-logo")) { opened = true; return; } sessionStorage.setItem("gm-logo", "1"); } catch (e) { }
    opened = true;
    const arcs = [...ring.querySelectorAll("svg circle")].filter(c => c.getAttribute("stroke-dasharray"));
    const parts = [...ring.querySelectorAll(".grun-wm > span")], balls = [...ring.querySelectorAll(".grun-wm .u i")];
    /* on attend que l'écran de lancement de l'appli s'efface, le logo reste caché jusque-là */
    const hold = [...arcs.map(c => { const d = parseFloat(c.getAttribute("stroke-dasharray")); return A(c, [{ strokeDashoffset: d }, { strokeDashoffset: d }], { duration: 4000, fill: "both" }); }),
      ...parts.map(p => A(p, [{ opacity: 0 }, { opacity: 0 }], { duration: 4000, fill: "both" })), ...balls.map(b => A(b, [{ transform: "scale(0)" }, { transform: "scale(0)" }], { duration: 4000, fill: "both" }))];
    const go = () => { hold.forEach(h => h && h.cancel());
      arcs.forEach((c, i) => { const d = parseFloat(c.getAttribute("stroke-dasharray")); A(c, [{ strokeDashoffset: d }, { strokeDashoffset: 0 }], { duration: 1000, delay: 40 + i * 140, easing: EASE }); });
      parts.forEach((p, i) => A(p, [{ opacity: 0, transform: "translateY(.18em)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: 260 + i * 70, easing: EASE }));
      balls.forEach((b, i) => A(b, [{ transform: "scale(0)" }, { transform: "scale(1.25)", offset: .6 }, { transform: "none" }], { duration: 520, delay: 600 + i * 90, easing: "ease-out" })); };
    const t0 = performance.now(); (function wait() { const sp = document.getElementById("splash"); if (!sp || sp.classList.contains("out") || performance.now() - t0 > 2500) go(); else setTimeout(wait, 40); })();
  }

  /* ---------- sens de navigation ---------- */
  let dir = 1, navKind = "";
  const stack = (() => { try { return JSON.parse(sessionStorage.getItem("gm-stack") || "[]"); } catch (e) { return []; } })();
  const key = () => location.pathname + location.hash;
  if (stack[stack.length - 1] !== key()) stack.push(key());
  addEventListener("hashchange", () => {
    const k = key(); if (stack.length > 1 && stack[stack.length - 2] === k) { stack.pop(); dir = -1; } else { stack.push(k); dir = 1; }
    if (stack.length > 60) stack.splice(0, stack.length - 60);
    try { sessionStorage.setItem("gm-stack", JSON.stringify(stack)); } catch (e) { }
  }, true);

  /* ---------- grands titres : apparition douce mot par mot (premier affichage seulement) ---------- */
  function titles(root) {
    let n = 0;
    for (const h of root.querySelectorAll("h1, h2")) {
      if (n >= 2) break;
      if (h.children.length || !h.textContent.trim() || h.closest(".grun-ov")) continue;
      const cs = getComputedStyle(h); if (parseFloat(cs.fontSize) < 26 || /box/.test(cs.display) || (cs.webkitLineClamp && cs.webkitLineClamp !== "none")) continue;
      const r = h.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) continue;
      n++; const orig = h.textContent, parts = orig.split(/(\s+)/); h.textContent = ""; const spans = [];
      for (const p of parts) { if (!p) continue; if (/^\s+$/.test(p)) { h.appendChild(document.createTextNode(p)); continue; }
        const w = document.createElement("span"); w.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding:.2em .04em .1em;margin:-.2em -.04em -.1em";
        const i = document.createElement("span"); i.style.display = "inline-block"; i.textContent = p; w.appendChild(i); h.appendChild(w); spans.push(i); }
      spans.forEach((s, i) => A(s, [{ transform: "translateY(55%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, delay: 40 + i * 40, easing: EASE }));
      setTimeout(() => { if (h.textContent === orig) h.textContent = orig; }, 120 + spans.length * 40 + 620);
    }
  }

  /* ---------- un écran qui vient d'être affiché ---------- */
  let first = true;
  function enter(main) {
    if (window.__gmNoAnim) { window.__gmNoAnim = false; }
    else if (first) {
      const kids = [...main.children].filter(x => x.offsetHeight > 0).slice(0, 10);
      kids.forEach((k, i) => A(k, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 460, delay: 30 + i * 30, easing: EASE }));
      titles(main);
    } else if (navKind === "tab") {
      A(main, [{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
    } else {
      A(main, [{ opacity: 0, transform: `translateX(${dir * 22}px)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: EASE });
    }
    first = false; navKind = "";
    logo(main); draw(main); counts(main); reveal(main);
  }
  function draw(root) {
    let n = 0;
    for (const p of root.querySelectorAll("svg path, svg polyline, svg line, svg polygon, svg circle")) {
      if (n > 40) break; if (p.closest(".g2-ring")) continue; const cs = getComputedStyle(p);
      const fill = cs.fill && cs.fill !== "none" && !/rgba\(0, 0, 0, 0\)/.test(cs.fill) && cs.fillOpacity !== "0";
      const stroke = cs.stroke && cs.stroke !== "none" && parseFloat(cs.strokeWidth) > 0;
      if (p.tagName === "polygon" && fill) { p.style.transformBox = "fill-box"; p.style.transformOrigin = "center"; A(p, [{ transform: "scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 800, delay: 100, easing: SOFT }); n++; continue; }
      if (!stroke || fill || !p.getTotalLength) continue;
      let L = 0; try { L = p.getTotalLength(); } catch (e) { } if (!L || L > 5000) continue;
      if (cs.strokeDasharray && cs.strokeDasharray !== "none") continue;
      A(p, [{ strokeDasharray: `${L}`, strokeDashoffset: `${L}` }, { strokeDasharray: `${L}`, strokeDashoffset: "0" }], { duration: 900, delay: 100 + n * 14, easing: EASE, fill: "none" });
      n++;
    }
  }
  function counts(root) {
    let n = 0;
    for (const el of root.querySelectorAll("b, strong, span, div, p, h1, h2, h3")) {
      if (n >= 8) break; if (el.children.length) continue;
      const t = (el.textContent || "").trim(); const m = /^(\d{1,3}(?:[\s  ]\d{3})*|\d{1,4})(?:([.,])(\d{1,2}))?$/.exec(t); if (!m) continue;
      if (parseFloat(getComputedStyle(el).fontSize) < 24) continue;
      const sp = (m[1].match(/[\s  ]/) || [" "])[0], dec = m[3] ? m[3].length : 0, sep = m[2] || ",", v = parseFloat(m[1].replace(/[\s  ]/g, "") + "." + (m[3] || "0")); if (!v) continue;
      const fmt = x => { const [a, b] = x.toFixed(dec).split("."); const g = m[1].length > 4 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, sp) : a; return b ? g + sep + b : g; };
      const t0 = performance.now(), D = 850; n++; let mine = null;
      const step = now => { if (mine !== null && el.textContent !== mine) return; const x = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - x, 4); mine = fmt(v * e); el.textContent = mine; if (x < 1) requestAnimationFrame(step); else el.textContent = t; };
      requestAnimationFrame(step);
    }
  }
  let io = null;
  function reveal(main) {
    if (!("IntersectionObserver" in window)) return; if (io) io.disconnect();
    io = new IntersectionObserver(es => { for (const e of es) { if (!e.isIntersecting) continue; io.unobserve(e.target); A(e.target, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE }); } }, { rootMargin: "0px 0px -4% 0px" });
    [...main.querySelectorAll(":scope > * > *, :scope > *")].filter(x => { const r = x.getBoundingClientRect(); return r.height > 24 && r.top > innerHeight * 1.02; }).slice(0, 80).forEach(x => io.observe(x));
  }
  /* « Chargement… » : il respire doucement, le temps que le contenu arrive */
  function shimmer(root) { for (const el of root.querySelectorAll(".load, .msg")) { if (!/^Chargement/.test((el.textContent || "").trim()) || el.dataset.gms) continue; el.dataset.gms = 1;
    A(el, [{ opacity: .45 }, { opacity: 1 }, { opacity: .45 }], { duration: 1400, iterations: 6, easing: "ease-in-out" }); } }

  /* ---------- appui : s'enfonce vite, revient en douceur ---------- */
  const PSEL = "#main a,#main button,#main summary,#main [role=button],#main label.chip,#main [data-pf],#main [data-a],.gs-btn,nav a,nav button,.grun-sheet button,.g2 a,.g2 button";
  let down = null, dn = null, sx = 0, sy = 0;
  addEventListener("pointerdown", e => {
    const t = e.target.closest && e.target.closest(PSEL); if (!t) return;
    if (getComputedStyle(t).transform === "none") { dn = A(t, [{ transform: "none" }, { transform: "scale(.97)" }], { duration: 110, easing: "ease-out", fill: "forwards" }); down = t; }
    sx = e.clientX; sy = e.clientY;
    const lk = e.target.closest("a[href]"); if (lk) { const h = lk.getAttribute("href"); if (/\.html/.test(h) && !document.querySelector(`link[rel=prefetch][href="${h}"]`)) { const p = document.createElement("link"); p.rel = "prefetch"; p.href = h; document.head.appendChild(p); } }
    const r = document.createElement("div"); r.className = "gm-rip"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; document.body.appendChild(r);
    A(r, [{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(2.4)", opacity: 0 }], { duration: 560, easing: EASE, fill: "forwards" }); setTimeout(() => r.remove(), 600);
  }, { passive: true, capture: true });
  const up = () => { if (!down) return; const t = down, a = dn; down = null; dn = null;
    A(t, [{ transform: "scale(.97)" }, { transform: "scale(1.008)", offset: .6 }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.3,.7,.4,1)" }); if (a) a.cancel(); };
  addEventListener("pointerup", up, true); addEventListener("pointercancel", up, true);
  addEventListener("pointermove", e => { if (down && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) up(); }, { passive: true, capture: true });

  /* ---------- retour haptique, discret, seulement sur les choix ---------- */
  function tick() {
    try { if (navigator.vibrate) { navigator.vibrate(8); return; }
      const l = document.createElement("label"); l.setAttribute("aria-hidden", "true"); l.style.display = "none";
      const i = document.createElement("input"); i.type = "checkbox"; i.setAttribute("switch", ""); l.appendChild(i); document.head.appendChild(l); l.click(); l.remove(); } catch (e) { }
  }
  const HSEL = ".grun-ov button, .gs-btn, label.chip, [role=tab], [aria-pressed], .chip, #grun-nav a, #grun-nav button, input[type=checkbox], input[type=radio]";
  addEventListener("click", e => { if (e.isTrusted && e.target.closest && e.target.closest(HSEL)) tick(); }, true);

  /* ---------- fenêtres : on les tire vers le bas pour les fermer ---------- */
  let sd = null;
  addEventListener("touchstart", e => {
    const sh = e.target.closest && e.target.closest(".grun-sheet"); if (!sh || e.touches.length > 1) return;
    const sc = e.target.closest(".gs-b"); if (sc && sc.scrollTop > 0) return;
    if (e.target.closest("input,textarea,select,[contenteditable]")) return;
    sd = { sh, y0: e.touches[0].clientY, x0: e.touches[0].clientX, t0: performance.now(), dy: 0, on: false };
  }, { passive: true });
  addEventListener("touchmove", e => {
    if (!sd) return; const dy = e.touches[0].clientY - sd.y0, dx = e.touches[0].clientX - sd.x0;
    if (!sd.on) { if (dy > 8 && dy > Math.abs(dx)) { sd.on = true; sd.sh.classList.add("gm-drag"); } else if (dy < -4 || Math.abs(dx) > 10) { sd = null; return; } else return; }
    sd.dy = Math.max(0, dy); sd.sh.style.transform = `translateY(${sd.dy}px)`;
    const ov = sd.sh.parentElement; if (ov) ov.style.opacity = String(Math.max(.4, 1 - sd.dy / 600));
  }, { passive: true });
  addEventListener("touchend", () => {
    if (!sd) return; const s = sd; sd = null; if (!s.on) return;
    const v = s.dy / Math.max(1, performance.now() - s.t0), H = s.sh.offsetHeight, close = s.dy > Math.min(160, H * .3) || v > .6;
    s.sh.classList.remove("gm-drag"); const ov = s.sh.parentElement;
    if (close) { tick(); s.sh.style.transition = `transform .24s ${EASE}`; s.sh.style.transform = `translateY(${H + 40}px)`; const x = s.sh.querySelector(".gs-x"); setTimeout(() => { if (x) x.click(); else if (ov) ov.click(); }, 170); }
    else { s.sh.style.transition = `transform .46s ${SOFT}`; s.sh.style.transform = ""; if (ov) { ov.style.transition = "opacity .3s ease"; ov.style.opacity = ""; } setTimeout(() => { s.sh.style.transition = ""; }, 480); }
  }, { passive: true });

  /* ---------- appli installée : glisser depuis le bord gauche pour revenir ---------- */
  if (STANDALONE) {
    let ed = null; const shade = document.createElement("div"); shade.className = "gm-edge";
    const reset = m => { m.style.transition = ""; m.style.transform = ""; m.style.opacity = ""; shade.remove(); shade.style.transition = ""; shade.style.opacity = "0"; };
    addEventListener("touchstart", e => { if (e.touches[0].clientX > 22 || document.documentElement.classList.contains("grun-sheet-on") || history.length < 2) return; const m = document.getElementById("main"); if (!m) return;
      ed = { m, x0: e.touches[0].clientX, y0: e.touches[0].clientY, t0: performance.now(), dx: 0, on: false }; }, { passive: true });
    addEventListener("touchmove", e => { if (!ed) return; const dx = e.touches[0].clientX - ed.x0, dy = e.touches[0].clientY - ed.y0;
      if (!ed.on) { if (dx > 10 && dx > Math.abs(dy) * 1.2) { ed.on = true; document.body.appendChild(shade); ed.m.style.transition = "none"; } else if (Math.abs(dy) > 12) { ed = null; return; } else return; }
      ed.dx = Math.max(0, dx); const p = Math.min(1, ed.dx / innerWidth); ed.m.style.transform = `translateX(${ed.dx}px)`; shade.style.opacity = String((1 - p) * .9); }, { passive: true });
    addEventListener("touchend", () => { if (!ed) return; const s = ed; ed = null; if (!s.on) return; const v = s.dx / Math.max(1, performance.now() - s.t0), go = s.dx > innerWidth * .33 || v > .55;
      s.m.style.transition = `transform .26s ${EASE}, opacity .26s ease`; shade.style.transition = "opacity .26s ease";
      if (go) { tick(); s.m.style.transform = `translateX(${innerWidth * .6}px)`; s.m.style.opacity = "0"; shade.style.opacity = "0";
        setTimeout(() => { window.__gmNoAnim = true; s.m.style.transition = "none"; s.m.style.transform = ""; history.back(); setTimeout(() => { reset(s.m); A(s.m, [{ opacity: 0, transform: "translateX(-22px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: EASE }); }, 30); }, 230); }
      else { s.m.style.transform = ""; shade.style.opacity = "0"; setTimeout(() => reset(s.m), 280); } }, { passive: true });
  }

  function boot() {
    const main = document.getElementById("main"); if (!main) return;
    /* une navigation = un clic sur un lien interne, un retour, ou un changement d'adresse ; les signaux rapprochés comptent pour une seule */
    let navAt = -1e9, done = true;
    const prep = () => { const now = performance.now(); if (now - navAt > 350) done = false; navAt = now; };
    addEventListener("click", e => { if (e.target.closest && e.target.closest("#grun-nav")) navKind = "tab"; const a = e.target.closest && e.target.closest('a[href^="#"]'); if (a) prep(); }, true);
    addEventListener("popstate", prep, true);
    addEventListener("hashchange", prep, true);
    /* un nouvel écran = #main réécrit juste après une navigation : on anime avant le premier affichage */
    new MutationObserver(() => { shimmer(main); logo(main); if (done || performance.now() - navAt > 700) return; done = true; enter(main); })
      .observe(main, { childList: true });
    if (main.children.length) { enter(main); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
