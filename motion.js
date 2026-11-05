/* ===== GRÜN · couche « mouvement » v3 : douce, fluide, sous le doigt =====
   Ne change AUCUNE fonction, aucun texte, aucune donnée : seulement du mouvement, de la lumière et deux gestes en plus
   (glisser une fenêtre vers le bas pour la fermer, glisser depuis le bord gauche pour revenir — appli installée seulement).
   Tout se coupe si le téléphone est réglé sur « réduire les animations ». */
(function () {
  "use strict";
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = "cubic-bezier(.22,1,.36,1)";        /* sortie très douce */
  const SOFT = "cubic-bezier(.25,1.12,.4,1)";       /* rebond à peine perceptible */
  const LIME = "228,243,58", GREEN = "59,224,138";
  const STANDALONE = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;

  const css = `
@view-transition{navigation:auto}
::view-transition-old(root){animation:gm-out .22s ease both}
::view-transition-new(root){animation:gm-in .32s ${EASE} both}
@keyframes gm-out{to{opacity:0;transform:scale(.985)}}
@keyframes gm-in{from{opacity:0;transform:translateY(8px)}}
html{-webkit-tap-highlight-color:transparent}
.grun-ov{-webkit-backdrop-filter:blur(0px);backdrop-filter:blur(0px);transition:opacity .25s ease,backdrop-filter .35s ease,-webkit-backdrop-filter .35s ease!important}
.grun-ov.in{-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.grun-ov .grun-sheet{transform:translateY(48px);transition:transform .48s ${SOFT}!important;will-change:transform}
.grun-ov.in .grun-sheet{transform:none}
.grun-ov.out .grun-sheet{transform:translateY(32px);transition:transform .2s ease!important}
.grun-ov .grun-sheet.gm-drag{transition:none!important}
.grun-ov .grun-sheet::before{content:"";display:block;width:38px;height:5px;border-radius:5px;background:rgba(255,255,255,.18);margin:-4px auto 6px}
#main[data-gm-depth]{transition:transform .42s ${SOFT},filter .35s ease,border-radius .35s ease;transform-origin:50% 0}
html.grun-sheet-on #main[data-gm-depth]{transform:scale(.965) translateY(6px);filter:brightness(.8);border-radius:20px;overflow:hidden}
#grun-toast.on{animation:gm-toast .5s ${SOFT}}
@keyframes gm-toast{from{transform:translateY(18px);opacity:0}}
.gm-splash{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:var(--bg,#0B0E0C);transition:opacity .5s ease}
.gm-splash.out{opacity:0;pointer-events:none}
.gm-splash svg{filter:drop-shadow(0 0 26px rgba(${GREEN},.25))}
.gm-amb{position:fixed;inset:-20%;z-index:0;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(40% 32% at 78% 12%,rgba(${GREEN},.07),transparent 70%),radial-gradient(46% 36% at 12% 88%,rgba(${LIME},.045),transparent 70%);animation:gm-drift 30s ease-in-out infinite alternate}
@keyframes gm-drift{to{transform:translate(-4%,3%) scale(1.06)}}
.gm-w{display:inline-block;overflow:hidden;vertical-align:top;padding:.2em .04em .1em;margin:-.2em -.04em -.1em}
.gm-w>span{display:inline-block}
.gm-rip{position:fixed;z-index:9998;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:radial-gradient(circle,rgba(${LIME},.22),rgba(${LIME},0) 70%)}
.gm-ghost{position:fixed;inset:0;overflow:hidden;pointer-events:none;background:var(--bg,#0B0E0C)}
.gm-ghost>div{position:absolute}
.gm-edge{position:fixed;inset:0;z-index:9990;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 40%);opacity:0}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}::view-transition-old(root),::view-transition-new(root){animation:none!important}.gm-amb{display:none}}`;
  const st = document.createElement("style"); st.id = "gm-css"; st.textContent = css; document.head.appendChild(st);
  /* iPhone : sans cet écouteur, l'état « appuyé » n'apparaît pas au toucher */
  document.addEventListener("touchstart", () => { }, { passive: true });
  if (RM) return;

  const A = (el, kf, o) => { try { return el.animate(kf, { fill: "backwards", ...o }); } catch (e) { } };
  const amb = () => { if (document.body && !document.querySelector(".gm-amb")) { const d = document.createElement("div"); d.className = "gm-amb"; d.setAttribute("aria-hidden", "true"); document.body.prepend(d); } };

  /* ---------- ouverture : le logo se dessine (une fois par session, sur l'accueil) ---------- */
  try {
    const home = /(^|\/)(index\.html)?$/.test(location.pathname) && (!location.hash || location.hash === "#/" || location.hash === "#");
    if (home && !sessionStorage.getItem("gm-splash")) {
      sessionStorage.setItem("gm-splash", "1");
      const s = document.createElement("div"); s.className = "gm-splash"; s.setAttribute("aria-hidden", "true");
      s.innerHTML = `<svg width="160" height="160" viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="none" stroke="#3BE08A" stroke-width="9" stroke-linecap="round" stroke-dasharray="402" stroke-dashoffset="402" transform="rotate(150 75 75)"><animate attributeName="stroke-dashoffset" from="402" to="113" dur=".85s" fill="freeze" calcMode="spline" keySplines=".22 1 .36 1"/></circle>
        <circle cx="75" cy="75" r="47" fill="none" stroke="#E4F33A" stroke-width="9" stroke-linecap="round" stroke-dasharray="295" stroke-dashoffset="295" transform="rotate(-40 75 75)"><animate attributeName="stroke-dashoffset" from="295" to="133" begin=".15s" dur=".85s" fill="freeze" calcMode="spline" keySplines=".22 1 .36 1"/></circle>
        <text x="75" y="86" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="800" font-size="34" fill="#F2F5F0" opacity="0">GRÜN<animate attributeName="opacity" from="0" to="1" begin=".4s" dur=".45s" fill="freeze"/></text></svg>`;
      (document.body || document.documentElement).appendChild(s);
      setTimeout(() => { s.classList.add("out"); setTimeout(() => s.remove(), 520); }, 1150);
    }
  } catch (e) { }

  /* ---------- sens de navigation ---------- */
  let dir = 1, lastNav = performance.now();
  const stack = (() => { try { return JSON.parse(sessionStorage.getItem("gm-stack") || "[]"); } catch (e) { return []; } })();
  const key = () => location.pathname + location.hash;
  if (stack[stack.length - 1] !== key()) stack.push(key());
  addEventListener("hashchange", () => {
    const k = key(); if (stack.length > 1 && stack[stack.length - 2] === k) { stack.pop(); dir = -1; } else { stack.push(k); dir = 1; }
    if (stack.length > 60) stack.splice(0, stack.length - 60);
    try { sessionStorage.setItem("gm-stack", JSON.stringify(stack)); } catch (e) { }
    lastNav = performance.now();
  }, true);

  /* ---------- grands titres : apparition douce mot par mot ---------- */
  function titles(root) {
    let n = 0;
    for (const h of root.querySelectorAll("h1, h2")) {
      if (n >= 2) break;
      if (h.children.length || !h.textContent.trim() || h.closest(".grun-ov")) continue;
      const cs = getComputedStyle(h); if (parseFloat(cs.fontSize) < 26 || /box/.test(cs.display) || (cs.webkitLineClamp && cs.webkitLineClamp !== "none")) continue;
      const r = h.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) continue;
      n++; const orig = h.textContent, parts = orig.split(/(\s+)/); h.textContent = ""; const spans = [];
      for (const p of parts) { if (!p) continue; if (/^\s+$/.test(p)) { h.appendChild(document.createTextNode(p)); continue; }
        const w = document.createElement("span"); w.className = "gm-w"; const i = document.createElement("span"); i.textContent = p; w.appendChild(i); h.appendChild(w); spans.push(i); }
      spans.forEach((s, i) => A(s, [{ transform: "translateY(55%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, delay: 40 + i * 40, easing: EASE }));
      setTimeout(() => { if (h.querySelector(".gm-w") && h.textContent === orig) h.textContent = orig; }, 120 + spans.length * 40 + 620);
    }
  }

  /* ---------- un écran qui vient d'être affiché ---------- */
  const IOS = "cubic-bezier(.32,.72,0,1)";   /* la courbe des transitions d'iPhone */
  let ghost = null, first = true;
  function snap(main) {   /* image de l'écran qu'on quitte, juste avant que l'appli dessine le suivant */
    if (ghost) { ghost.remove(); ghost = null; }
    if (!main.children.length) return;
    const r = main.getBoundingClientRect(), g = document.createElement("div"), inner = document.createElement("div");
    g.className = "gm-ghost"; g.setAttribute("aria-hidden", "true"); inner.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px`;
    inner.className = main.className; for (const c of main.children) inner.appendChild(c.cloneNode(true));
    for (const el of inner.querySelectorAll("[id]")) el.removeAttribute("id");
    g.appendChild(inner); ghost = g;
  }
  function enter(main) {
    let g = ghost; ghost = null;
    if (window.__gmNoPush) { window.__gmNoPush = false; if (g) g.remove(); first = false; draw(main); counts(main); reveal(main); return; }
    if (g && !first) {
      const W = innerWidth, D = 460, fwd = dir > 0, bg = getComputedStyle(document.body).backgroundColor;
      g.style.zIndex = fwd ? "1" : "3"; document.body.appendChild(g);
      const ms = main.style; const keep = { position: ms.position, zIndex: ms.zIndex, background: ms.background, minHeight: ms.minHeight, boxShadow: ms.boxShadow };
      ms.position = ms.position || "relative"; ms.zIndex = "2"; ms.background = bg; ms.minHeight = "100vh"; ms.boxShadow = "-18px 0 40px rgba(0,0,0,.35)";
      if (fwd) { A(main, [{ transform: `translateX(${W}px)` }, { transform: "none" }], { duration: D, easing: IOS }); A(g, [{ transform: "none", filter: "brightness(1)" }, { transform: `translateX(${-W * .28}px)`, filter: "brightness(.6)" }], { duration: D, easing: IOS, fill: "forwards" }); }
      else { A(main, [{ transform: `translateX(${-W * .28}px)`, filter: "brightness(.6)" }, { transform: "none", filter: "brightness(1)" }], { duration: D, easing: IOS }); A(g, [{ transform: "none" }, { transform: `translateX(${W}px)` }], { duration: D, easing: IOS, fill: "forwards" }); }
      setTimeout(() => { g.remove(); Object.assign(ms, keep); }, D + 30);
    } else {
      A(main, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE });
      const kids = [...main.children].filter(x => x.offsetHeight > 0).slice(0, 10);
      kids.forEach((k, i) => A(k, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 440, delay: 30 + i * 28, easing: EASE }));
      if (first) titles(main);
    }
    first = false;
    draw(main); counts(main); reveal(main);
  }
  function draw(root) {
    let n = 0;
    for (const p of root.querySelectorAll("svg path, svg polyline, svg line, svg polygon, svg circle")) {
      if (n > 40) break; const cs = getComputedStyle(p);
      const fill = cs.fill && cs.fill !== "none" && !/rgba\(0, 0, 0, 0\)/.test(cs.fill) && cs.fillOpacity !== "0";
      const stroke = cs.stroke && cs.stroke !== "none" && parseFloat(cs.strokeWidth) > 0;
      if (p.tagName === "polygon" && fill) { p.style.transformBox = "fill-box"; p.style.transformOrigin = "center"; A(p, [{ transform: "scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 800, delay: 120, easing: SOFT }); n++; continue; }
      if (!stroke || fill || !p.getTotalLength) continue;
      let L = 0; try { L = p.getTotalLength(); } catch (e) { } if (!L || L > 5000) continue;
      if (cs.strokeDasharray && cs.strokeDasharray !== "none") continue;
      A(p, [{ strokeDasharray: `${L}`, strokeDashoffset: `${L}` }, { strokeDasharray: `${L}`, strokeDashoffset: "0" }], { duration: 1000, delay: 140 + n * 16, easing: EASE, fill: "none" });
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
      const t0 = performance.now(), D = 900; n++; let mine = null;
      const step = now => { if (mine !== null && el.textContent !== mine) return; const x = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - x, 4); mine = fmt(v * e); el.textContent = mine; if (x < 1) requestAnimationFrame(step); else el.textContent = t; };
      requestAnimationFrame(step);
    }
  }
  let io = null;
  function reveal(main) {
    if (!("IntersectionObserver" in window)) return; if (io) io.disconnect();
    io = new IntersectionObserver(es => { for (const e of es) { if (!e.isIntersecting) continue; io.unobserve(e.target); A(e.target, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 560, easing: EASE }); } }, { rootMargin: "0px 0px -4% 0px" });
    [...main.querySelectorAll(":scope > * > *, :scope > *")].filter(x => { const r = x.getBoundingClientRect(); return r.height > 24 && r.top > innerHeight * 1.02; }).slice(0, 80).forEach(x => io.observe(x));
  }

  /* ---------- appui : s'enfonce vite, revient avec un léger rebond ---------- */
  const PSEL = "#main a,#main button,#main summary,#main [role=button],#main label.chip,#main [data-pf],#main [data-a],.gs-btn,nav a,nav button,.grun-sheet button";
  function press() { }
  let down = null, dn = null, sx = 0, sy = 0;
  addEventListener("pointerdown", e => {
    const t = e.target.closest && e.target.closest(PSEL); if (!t) return;
    if (getComputedStyle(t).transform === "none") { dn = A(t, [{ transform: "none" }, { transform: "scale(.97)" }], { duration: 110, easing: "ease-out", fill: "forwards" }); down = t; }
    sx = e.clientX; sy = e.clientY;
    const r = document.createElement("div"); r.className = "gm-rip"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; document.body.appendChild(r);
    A(r, [{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(2.6)", opacity: 0 }], { duration: 600, easing: EASE, fill: "forwards" }); setTimeout(() => r.remove(), 640);
  }, { passive: true, capture: true });
  const up = () => { if (!down) return; const t = down, a = dn; down = null; dn = null;
    const rel = A(t, [{ transform: "scale(.97)" }, { transform: "scale(1.012)", offset: .55 }, { transform: "none" }], { duration: 460, easing: "cubic-bezier(.3,.7,.4,1)" });
    if (a) a.cancel(); };
  addEventListener("pointerup", up, true); addEventListener("pointercancel", up, true);
  addEventListener("pointermove", e => { if (down && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) up(); }, { passive: true, capture: true });

  /* ---------- fenêtres : on les glisse vers le bas pour les fermer ---------- */
  let sd = null;
  addEventListener("touchstart", e => {
    const sh = e.target.closest && e.target.closest(".grun-sheet"); if (!sh || e.touches.length > 1) return;
    const sc = e.target.closest(".gs-b"); if (sc && sc.scrollTop > 0) return;
    if (e.target.closest("input,textarea,select,[contenteditable]")) return;
    sd = { sh, y0: e.touches[0].clientY, x0: e.touches[0].clientX, t0: performance.now(), dy: 0, on: false };
  }, { passive: true });
  addEventListener("touchmove", e => {
    if (!sd) return; const y = e.touches[0].clientY, dy = y - sd.y0, dx = e.touches[0].clientX - sd.x0;
    if (!sd.on) { if (dy > 8 && dy > Math.abs(dx)) { sd.on = true; sd.sh.classList.add("gm-drag"); } else if (dy < -4 || Math.abs(dx) > 10) { sd = null; return; } else return; }
    sd.dy = Math.max(0, dy); const v = sd.dy < 0 ? 0 : sd.dy; sd.sh.style.transform = `translateY(${v}px)`;
    const ov = sd.sh.parentElement; if (ov) ov.style.opacity = String(Math.max(.35, 1 - v / 600));
  }, { passive: true });
  addEventListener("touchend", () => {
    if (!sd) return; const s = sd; sd = null; if (!s.on) return;
    const v = s.dy / Math.max(1, performance.now() - s.t0), H = s.sh.offsetHeight, close = s.dy > Math.min(160, H * .3) || v > .6;
    s.sh.classList.remove("gm-drag"); const ov = s.sh.parentElement;
    if (close) { s.sh.style.transition = `transform .26s ${EASE}`; s.sh.style.transform = `translateY(${H + 40}px)`; const x = s.sh.querySelector(".gs-x"); setTimeout(() => { if (x) x.click(); else if (ov) ov.click(); }, 180); }
    else { s.sh.style.transition = `transform .5s ${SOFT}`; s.sh.style.transform = ""; if (ov) { ov.style.transition = "opacity .3s ease"; ov.style.opacity = ""; } setTimeout(() => { s.sh.style.transition = ""; }, 520); }
  }, { passive: true });

  /* ---------- appli installée : glisser depuis le bord gauche pour revenir ---------- */
  if (STANDALONE) {
    let ed = null; const shade = document.createElement("div"); shade.className = "gm-edge";
    addEventListener("touchstart", e => { if (e.touches[0].clientX > 22 || document.documentElement.classList.contains("grun-sheet-on") || history.length < 2) return; const m = document.getElementById("main"); if (!m) return;
      ed = { m, x0: e.touches[0].clientX, y0: e.touches[0].clientY, t0: performance.now(), dx: 0, on: false }; }, { passive: true });
    addEventListener("touchmove", e => { if (!ed) return; const dx = e.touches[0].clientX - ed.x0, dy = e.touches[0].clientY - ed.y0;
      if (!ed.on) { if (dx > 10 && dx > Math.abs(dy) * 1.2) { ed.on = true; document.body.appendChild(shade); ed.m.style.transition = "none"; } else if (Math.abs(dy) > 12) { ed = null; return; } else return; }
      ed.dx = Math.max(0, dx); ed.m.style.transform = `translateX(${ed.dx}px)`; shade.style.opacity = String(Math.max(0, 1 - ed.dx / innerWidth) * .9); }, { passive: true });
    addEventListener("touchend", () => { if (!ed) return; const s = ed; ed = null; if (!s.on) return; const v = s.dx / Math.max(1, performance.now() - s.t0), go = s.dx > innerWidth * .33 || v > .55;
      s.m.style.transition = `transform .28s ${EASE}`;
      if (go) { s.m.style.transform = `translateX(${innerWidth}px)`; setTimeout(() => { window.__gmNoPush = true; history.back(); setTimeout(() => { s.m.style.transition = ""; s.m.style.transform = ""; shade.remove(); }, 60); }, 220); }
      else { s.m.style.transform = ""; shade.style.transition = "opacity .25s"; shade.style.opacity = "0"; setTimeout(() => { s.m.style.transition = ""; shade.remove(); shade.style.transition = ""; }, 300); } }, { passive: true });
  }

  function boot() {
    amb(); press(document);
    const main = document.getElementById("main"); if (!main) return;
    const fixedInside = () => [...main.querySelectorAll('.grun-actbar,[class*="bar"],[style*="fixed"],[style*="sticky"]')].some(e => { const p = getComputedStyle(e).position; return p === "fixed" || p === "sticky"; });
    let was = false;
    new MutationObserver(() => { const on = document.documentElement.classList.contains("grun-sheet-on"); if (on === was) return; was = on;
      if (on) { if (!fixedInside()) main.setAttribute("data-gm-depth", ""); } else setTimeout(() => { if (!was) main.removeAttribute("data-gm-depth"); }, 420); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    let pending = true, timer = null, dirty = false;
    addEventListener("pointerdown", () => { dirty = false; }, true);
    /* l'appli redessine dès « popstate », avant « hashchange » : on prend l'image de l'écran au plus tôt */
    let snapped = 0;
    const prep = () => { if (performance.now() - snapped < 300) return; snapped = performance.now(); pending = true; lastNav = performance.now(); if (!dirty) snap(main); else if (ghost) { ghost.remove(); ghost = null; } };
    addEventListener("click", e => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (a && !e.defaultPrevented && a.getAttribute("href") !== location.hash) prep(); }, true);
    addEventListener("popstate", prep, true);
    addEventListener("hashchange", () => { if (!pending) prep(); setTimeout(() => { snapped = 0; }, 0); }, true);
    new MutationObserver(() => { dirty = true; if (!pending || performance.now() - lastNav > 1500) { press(main); return; } pending = false; enter(main); })
      .observe(main, { childList: true });
    if (main.children.length) { pending = false; enter(main); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
