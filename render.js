/* World Cup 2026 — render */
(function () {
  const WC = window.WC;
  const flag = (iso) => `https://flagcdn.com/${iso}.svg`;
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const flagImg = (iso, extra) =>
    `<img src="${flag(iso)}" alt="" loading="eager" crossorigin="anonymous"${extra ? " " + extra : ""}>`;

  const EXPORT = location.search.indexOf("export") !== -1;
  if (EXPORT) document.body.classList.add("exporting");

  /* ---------- header host flags ---------- */
  const hostsEl = document.getElementById("hosts");
  hostsEl.innerHTML = WC.hosts
    .map((h) => flagImg(h.iso))
    .join('<span class="dot"></span>') +
    '<span class="dot"></span><span>Host Nations</span>';

  /* ---------- group tables ---------- */
  function groupCard(letter) {
    const g = WC.groups[letter];
    const card = el("div", "grp");
    const head = el("div", "grp-h");
    head.innerHTML =
      `<div class="gl">${letter}</div>` +
      `<div class="gn">Group ${letter}<span class="from">${g.from}</span></div>` +
      ["W", "D", "L", "GF", "GA", "PTS"].map((c) => `<div class="ch">${c}</div>`).join("");
    card.appendChild(head);
    g.teams.forEach((t) => {
      const row = el("div", "row");
      const tag = t.tag ? `<span class="tg">${t.tag}</span>` : "";
      row.innerHTML =
        `<div class="fl">${flagImg(t.iso)}</div>` +
        `<div class="nm">${t.name}${tag}</div>` +
        '<div class="st"></div><div class="st"></div><div class="st"></div>' +
        '<div class="st"></div><div class="st"></div><div class="st"></div>';
      card.appendChild(row);
    });
    return card;
  }
  const colL = document.getElementById("colL");
  const colR = document.getElementById("colR");
  ["A", "B", "C", "D", "E", "F"].forEach((l) => colL.appendChild(groupCard(l)));
  ["G", "H", "I", "J", "K", "L"].forEach((l) => colR.appendChild(groupCard(l)));

  /* ---------- host cities ---------- */
  const citiesEl = document.getElementById("cities");
  WC.hostCities.forEach((c) => {
    const d = el("div", "city");
    d.innerHTML = flagImg(c.iso) + `<span>${c.city}</span>`;
    citiesEl.appendChild(d);
  });

  /* ---------- dates ---------- */
  const datesEl = document.getElementById("dates");
  WC.dates.forEach((d) => {
    const r = el("div", "dt");
    r.innerHTML = `<span class="dl">${d.label}</span><span class="dv"><b>${d.val}</b><small>${d.place}</small></span>`;
    datesEl.appendChild(r);
  });

  /* ---------- round labels ---------- */
  const rounds = [
    "Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals",
    "Final", "Semi-Finals", "Quarter-Finals", "Round of 16", "Round of 32",
  ];
  const roundsEl = document.getElementById("rounds");
  rounds.forEach((r, i) => {
    const d = el("div", "rlbl" + (i === 4 ? " mid" : ""), r);
    roundsEl.appendChild(d);
  });

  /* ---------- bracket ---------- */
  function buildBracket() {
    const C = document.getElementById("bracket");
    const svg = document.getElementById("wires");
    // clear previous boxes (keep svg)
    [...C.querySelectorAll(".match,.champ,.third,.final-cap")].forEach((n) => n.remove());
    svg.innerHTML = "";

    const W = C.clientWidth, H = C.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const bw = 66, bh = 46, bwF = 124;
    const finalZone = 150;
    const sideW = (W - finalZone) / 2;
    const step = (sideW - bw) / 3;
    const colX = (i) => i * step;                 // left side: left edge of col i
    const colXR = (i) => W - bw - i * step;        // right side: left edge of col i
    const cy32 = (i) => (i + 0.5) * (H / 8);

    const wires = [];
    const line = (x1, y1, x2, y2) =>
      wires.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`);
    const elbow = (cax, ctY, cbY, pax, pY) => {
      const midX = (cax + pax) / 2;
      line(cax, ctY, midX, ctY);
      line(cax, cbY, midX, cbY);
      line(midX, ctY, midX, cbY);
      line(midX, pY, pax, pY);
    };

    function makeBox(x, cy, m, big) {
      const box = el("div", "match" + (big ? " big" : ""));
      box.style.left = x + "px";
      const h = big ? 50 : bh;
      box.style.top = (cy - h / 2) + "px";
      const mno = m.id ? `<span class="mno">M${m.id}</span>` : "";
      box.innerHTML = mno +
        m.slots.map((s, idx) =>
          `<div class="slot${idx === 1 ? " div" : ""}"><span class="guide">${s}</span><span class="score"></span></div>`
        ).join("");
      C.appendChild(box);
      return { x, cy, w: big ? bwF : bw, h };
    }

    // ----- LEFT SIDE -----
    const L = WC.left;
    const lr32 = L.r32.map((m, i) => makeBox(colX(0), cy32(i), m));
    const lr16cy = [0, 1, 2, 3].map((j) => (lr32[2 * j].cy + lr32[2 * j + 1].cy) / 2);
    const lr16 = L.r16.map((m, j) => makeBox(colX(1), lr16cy[j], m));
    const lqfcy = [0, 1].map((k) => (lr16[2 * k].cy + lr16[2 * k + 1].cy) / 2);
    const lqf = L.qf.map((m, k) => makeBox(colX(2), lqfcy[k], m));
    const lsfcy = (lqf[0].cy + lqf[1].cy) / 2;
    const lsf = makeBox(colX(3), lsfcy, L.sf[0]);

    // ----- RIGHT SIDE -----
    const R = WC.right;
    const rr32 = R.r32.map((m, i) => makeBox(colXR(0), cy32(i), m));
    const rr16cy = [0, 1, 2, 3].map((j) => (rr32[2 * j].cy + rr32[2 * j + 1].cy) / 2);
    const rr16 = R.r16.map((m, j) => makeBox(colXR(1), rr16cy[j], m));
    const rqfcy = [0, 1].map((k) => (rr16[2 * k].cy + rr16[2 * k + 1].cy) / 2);
    const rqf = R.qf.map((m, k) => makeBox(colXR(2), rqfcy[k], m));
    const rsfcy = (rqf[0].cy + rqf[1].cy) / 2;
    const rsf = makeBox(colXR(3), rsfcy, R.sf[0]);

    // ----- FINAL (center) -----
    const fx = W / 2 - bwF / 2;
    const fcy = H / 2;
    makeBox(fx, fcy, WC.final, true);

    // final caption above
    const cap = el("div", "final-cap");
    cap.style.left = (W / 2) + "px";
    cap.style.top = (fcy - 92) + "px";
    cap.innerHTML = `<div class="fl">FINAL</div><div class="fd">Jul 19 · MetLife Stadium, NJ</div>`;
    C.appendChild(cap);

    // champion box below final
    const champ = el("div", "champ");
    champ.style.left = (W / 2) + "px";
    champ.style.top = (fcy + 40) + "px";
    champ.innerHTML =
      `<div class="cl">★ &nbsp; World Champion &nbsp; ★</div><div class="cb"></div>`;
    C.appendChild(champ);

    // third place at bottom center
    const third = el("div", "third");
    third.style.left = (W / 2) + "px";
    third.style.top = (H - 98) + "px";
    third.innerHTML =
      `<div class="tl">Third-Place Play-off · Jul 18 · Miami</div>` +
      `<div class="tb"><div class="match" style="position:relative;left:0;top:0;width:100%;border:none;background:transparent">` +
      WC.third.slots.map((s, idx) =>
        `<div class="slot${idx === 1 ? " div" : ""}"><span class="guide">${s}</span><span class="score"></span></div>`
      ).join("") + `</div></div>`;
    C.appendChild(third);

    // ----- connectors -----
    // left: parent is to the RIGHT of children (child right edge -> parent left edge)
    const Lr = bw; // child right-edge offset
    for (let j = 0; j < 4; j++)
      elbow(colX(0) + Lr, lr32[2 * j].cy, lr32[2 * j + 1].cy, colX(1), lr16[j].cy);
    for (let k = 0; k < 2; k++)
      elbow(colX(1) + Lr, lr16[2 * k].cy, lr16[2 * k + 1].cy, colX(2), lqf[k].cy);
    elbow(colX(2) + Lr, lqf[0].cy, lqf[1].cy, colX(3), lsf.cy);
    // left sf -> final
    line(colX(3) + Lr, lsf.cy, fx, fcy);

    // right: parent is to the LEFT of children (child left edge -> parent right edge)
    for (let j = 0; j < 4; j++)
      elbow(colXR(0), rr32[2 * j].cy, rr32[2 * j + 1].cy, colXR(1) + Lr, rr16[j].cy);
    for (let k = 0; k < 2; k++)
      elbow(colXR(1), rr16[2 * k].cy, rr16[2 * k + 1].cy, colXR(2) + Lr, rqf[k].cy);
    elbow(colXR(2), rqf[0].cy, rqf[1].cy, colXR(3) + Lr, rsf.cy);
    // right sf -> final
    line(colXR(3), rsf.cy, fx + bwF, fcy);

    svg.innerHTML = wires.join("");
    svg.setAttribute("stroke", "var(--gold)");
    svg.setAttribute("fill", "none");
    [...svg.querySelectorAll("line")].forEach((l) => {
      l.setAttribute("stroke", "#a8812f");
      l.setAttribute("stroke-width", "1");
    });
  }

  /* ---------- screen scaling ---------- */
  function fitStage() {
    if (window.__PRINTLOCK) return;
    if (EXPORT) { document.getElementById("poster").style.transform = "none"; return; }
    const stage = document.querySelector(".stage");
    const poster = document.getElementById("poster");
    const pad = 24;
    const s = Math.min((window.innerWidth - pad) / 1400, (window.innerHeight - pad) / 1000);
    poster.style.transform = `scale(${s})`;
  }

  /* ---------- size switcher ---------- */
  let pageStyle = document.getElementById("pagesize");
  if (!pageStyle) {
    pageStyle = document.createElement("style");
    pageStyle.id = "pagesize";
    document.head.appendChild(pageStyle);
  }
  const PAGE = {
    letter: "11in 8.5in",
    tabloid: "17in 11in",
    poster: "24in 18in",
  };
  function setSize(size) {
    document.body.classList.remove("size-letter", "size-tabloid", "size-poster");
    document.body.classList.add("size-" + size);
    pageStyle.textContent = `@page{size:${PAGE[size]};margin:0.3in;}`;
    document.querySelectorAll(".bar button[data-size]").forEach((b) =>
      b.classList.toggle("on", b.dataset.size === size));
  }
  document.querySelectorAll(".bar button[data-size]").forEach((b) =>
    b.addEventListener("click", () => setSize(b.dataset.size)));

  function applyPrintLock() {
    const PL = window.__PRINTLOCK;
    if (!PL) return false;
    document.body.classList.add("printlock");
    const bar = document.querySelector(".bar");
    if (bar) bar.remove();
    const st = document.createElement("style");
    st.textContent =
      `html,body{background:#fff;}` +
      `.stage{position:static;display:block;overflow:visible;}` +
      `.poster{box-shadow:none;margin:0;transform-origin:top left;` +
      `transform:translate(${PL.tx}px,${PL.ty}px) scale(${PL.s});}` +
      `@media print{@page{size:${PL.size};margin:0;}` +
      `.poster{position:absolute;top:0;left:0;` +
      `transform:translate(${PL.tx}px,${PL.ty}px) scale(${PL.s})!important;}}`;
    document.head.appendChild(st);
    return true;
  }

  /* ---------- init ---------- */
  function init() {
    buildBracket();
    if (applyPrintLock()) return;
    fitStage();
    setSize("letter");
  }
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
  window.addEventListener("resize", () => { fitStage(); buildBracket(); });
})();
