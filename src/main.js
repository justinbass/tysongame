import "./style.css";
import purpleguyUrl from "../purpleguy.png";

const app = document.querySelector("#app");
if (!app) throw new Error("Missing #app element");

const canvas = document.createElement("canvas");
app.appendChild(canvas);
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Could not create 2D canvas context");

function makeSpriteUploadIcon() {
  const icon = document.createElement("canvas");
  icon.width = 20;
  icon.height = 20;
  const ictx = icon.getContext("2d");
  if (!ictx) throw new Error("Could not create sprite icon context");
  ictx.imageSmoothingEnabled = false;
  ictx.fillStyle = "#0b0b10";
  ictx.fillRect(4, 5, 12, 10);
  ictx.fillStyle = "#f8fafc";
  ictx.fillRect(5, 6, 10, 8);
  ictx.fillStyle = "#a78bfa";
  ictx.fillRect(6, 11, 8, 2);
  ictx.fillStyle = "#0b0b10";
  ictx.fillRect(8, 8, 2, 2);
  return icon;
}

function makeRigIcon() {
  const icon = document.createElement("canvas");
  icon.width = 20;
  icon.height = 20;
  const ictx = icon.getContext("2d");
  if (!ictx) throw new Error("Could not create rig icon context");
  ictx.imageSmoothingEnabled = false;
  ictx.clearRect(0, 0, 20, 20);

  // Simple "bones" glyph.
  ictx.fillStyle = "#0b0b10";
  ictx.fillRect(6, 4, 2, 12);
  ictx.fillRect(12, 4, 2, 12);
  ictx.fillRect(6, 9, 8, 2);
  ictx.fillStyle = "#f8fafc";
  ictx.fillRect(7, 5, 1, 10);
  ictx.fillRect(13, 5, 1, 10);
  ictx.fillRect(7, 10, 6, 1);
  return icon;
}

function makePixelDogSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = 16;
  sprite.height = 12;
  const sctx = sprite.getContext("2d");
  if (!sctx) throw new Error("Could not create dog sprite context");
  sctx.clearRect(0, 0, sprite.width, sprite.height);

  const BLACK = "#0b0b10";
  const BROWN = "#a16207";
  const BROWN_DARK = "#713f12";
  const WHITE = "#f8fafc";
  const RED = "#ef4444";

  function px(x, y, w, h, color) {
    sctx.fillStyle = color;
    sctx.fillRect(x, y, w, h);
  }

  // Outline silhouette.
  px(2, 5, 10, 6, BLACK); // body outline
  px(10, 4, 5, 5, BLACK); // head outline
  px(12, 3, 2, 2, BLACK); // ear outline
  px(3, 10, 2, 2, BLACK); // legs outline
  px(7, 10, 2, 2, BLACK);
  px(1, 7, 1, 2, BLACK); // tail outline

  // Fill body + shading.
  px(3, 6, 8, 4, BROWN);
  px(7, 6, 4, 4, BROWN_DARK);

  // Fill head + ear.
  px(11, 5, 3, 3, BROWN);
  px(13, 5, 1, 3, BROWN_DARK);
  px(12, 4, 1, 1, BROWN_DARK);
  px(12, 3, 1, 1, BROWN_DARK);

  // Tail.
  px(1, 7, 1, 2, BROWN_DARK);

  // Eye + mouth + tongue.
  px(12, 6, 1, 1, WHITE);
  px(13, 6, 1, 1, BLACK);
  px(14, 7, 1, 1, RED);

  return sprite;
}

function makeDogIcon() {
  const icon = document.createElement("canvas");
  icon.width = 20;
  icon.height = 20;
  const ictx = icon.getContext("2d");
  if (!ictx) throw new Error("Could not create dog icon context");
  ictx.clearRect(0, 0, icon.width, icon.height);
  ictx.imageSmoothingEnabled = false;

  const BLACK = "#0b0b10";
  const BROWN = "#a16207";
  const BROWN_DARK = "#713f12";
  const WHITE = "#f8fafc";

  function px(x, y, w, h, color) {
    ictx.fillStyle = color;
    ictx.fillRect(x, y, w, h);
  }

  // Button plate.
  px(2, 2, 16, 16, "#111827");
  px(3, 3, 14, 14, "#0b1020");

  // Tiny dog face.
  px(6, 7, 10, 8, BLACK);
  px(7, 8, 8, 6, BROWN);
  px(11, 8, 4, 6, BROWN_DARK);
  px(8, 10, 2, 1, WHITE);
  px(12, 10, 2, 1, WHITE);
  px(10, 12, 4, 1, BLACK);
  px(6, 6, 2, 2, BLACK); // ear
  px(7, 6, 1, 1, BROWN_DARK);

  return icon;
}

function makeEmptyLayer() {
  const layer = document.createElement("canvas");
  layer.width = 24;
  layer.height = 42;
  const lctx = layer.getContext("2d");
  if (!lctx) throw new Error("Could not create layer canvas context");
  lctx.clearRect(0, 0, layer.width, layer.height);
  return { layer, lctx };
}

function alphaMaskForCanvas(layerCanvas) {
  const lctx = layerCanvas.getContext("2d");
  if (!lctx) throw new Error("Could not read layer canvas context");
  const { data, width, height } = lctx.getImageData(
    0,
    0,
    layerCanvas.width,
    layerCanvas.height,
  );
  const alpha = new Uint8Array(width * height);
  for (let i = 0, j = 3; i < alpha.length; i += 1, j += 4) {
    alpha[i] = data[j];
  }
  return { alpha, width, height };
}

function makePixelGuyLayers() {
  const head = makeEmptyLayer();
  const torso = makeEmptyLayer();
  const armL = makeEmptyLayer();
  const armR = makeEmptyLayer();
  const legs = makeEmptyLayer();

  const PURPLE = "#7c3aed";
  const PURPLE_DARK = "#5b21b6";
  const BLACK = "#0b0b10";
  const WHITE = "#f8fafc";
  const YELLOW = "#fbbf24";
  const OUTLINE = "#0b0b10";

  function px(target, x, y, w, h, color) {
    target.lctx.fillStyle = color;
    target.lctx.fillRect(x, y, w, h);
  }

  // Head + hat + face.
  px(head, 8, 2, 8, 1, OUTLINE); // hat brim top
  px(head, 7, 3, 10, 1, OUTLINE);
  px(head, 9, 0, 6, 2, OUTLINE); // hat top
  px(head, 7, 4, 10, 10, OUTLINE); // head outline

  px(head, 10, 1, 4, 1, BLACK);
  px(head, 9, 2, 6, 1, BLACK);
  px(head, 8, 3, 8, 1, BLACK);

  px(head, 8, 5, 8, 8, PURPLE);
  px(head, 12, 5, 4, 8, PURPLE_DARK);

  px(head, 9, 8, 2, 1, WHITE);
  px(head, 13, 8, 2, 1, WHITE);
  px(head, 10, 8, 1, 1, BLACK);
  px(head, 14, 8, 1, 1, BLACK);
  // Small retro grin (original, minigame-inspired).
  px(head, 10, 11, 1, 1, BLACK);
  px(head, 11, 12, 3, 1, BLACK);
  px(head, 14, 11, 1, 1, BLACK);

  // Torso (outline + fill + badge).
  px(torso, 7, 14, 10, 16, OUTLINE); // torso outline (thinner + longer)
  px(torso, 8, 15, 8, 14, PURPLE);
  px(torso, 12, 15, 4, 14, PURPLE_DARK);

  px(torso, 9, 19, 3, 3, YELLOW);
  px(torso, 9, 19, 3, 1, BLACK);
  px(torso, 9, 21, 3, 1, BLACK);
  px(torso, 9, 19, 1, 3, BLACK);
  px(torso, 11, 19, 1, 3, BLACK);

  // Arms.
  px(armL, 6, 16, 2, 14, OUTLINE);
  px(armL, 6, 17, 1, 12, PURPLE_DARK);

  px(armR, 16, 16, 2, 14, OUTLINE);
  px(armR, 17, 17, 1, 12, PURPLE_DARK);

  // Legs.
  px(legs, 8, 30, 3, 11, OUTLINE);
  px(legs, 13, 30, 3, 11, OUTLINE);
  px(legs, 9, 31, 2, 10, PURPLE_DARK);
  px(legs, 13, 31, 2, 10, PURPLE_DARK);

  const layers = {
    head: head.layer,
    torso: torso.layer,
    armL: armL.layer,
    armR: armR.layer,
    legs: legs.layer,
  };

  const masks = {
    head: alphaMaskForCanvas(layers.head),
    torso: alphaMaskForCanvas(layers.torso),
    armL: alphaMaskForCanvas(layers.armL),
    armR: alphaMaskForCanvas(layers.armR),
    legs: alphaMaskForCanvas(layers.legs),
  };

  return {
    layers,
    masks,
    width: 24,
    height: 42,
    eyes: {
      eyeL: { x: 10, y: 8 },
      eyeR: { x: 14, y: 8 },
    },
  };
}

const templateArt = makePixelGuyLayers();
const dogArt = {
  sprite: makePixelDogSprite(),
  icon: makeDogIcon(),
};
const spriteUploadIcon = makeSpriteUploadIcon();
const rigIcon = makeRigIcon();
const state = {
  dragging: false,
  pressed: false,
  pressedOnGuy: false,
  pressedArea: null,
  pressedLocalX: 0,
  pressedLocalY: 0,
  pressStartX: 0,
  pressStartY: 0,
  // Position in CSS pixels (not device pixels).
  x: window.innerWidth / 2,
  y: window.innerHeight / 2 + 80,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2 + 80,
  spriteScale: 10,
  spriteSmoothDraw: true,
  art: templateArt,
  isTemplateArt: true,
  eyePoints: templateArt.eyes,
  customSprite: null, // { base: HTMLCanvasElement, width, height, rig, eyes }
  rigEdit: {
    enabled: false,
    draggingGuide: null, // "headEnd" | "torsoEnd" | "legsStart" | "armLeftEnd" | "armRightStart" | null
  },
  combo: {
    streak: 0,
    lastHitAt: -Infinity,
  },
  hold: {
    area: null, // "head" | "torso" | "armL" | "armR" | "legs" | null
    limb: null, // "armL" | "armR" | null
    targetX: 0,
    targetY: 0,
    startedAt: -Infinity,
    activeUntil: -Infinity,
  },
  eyeAnim: {
    which: null, // "eyeL" | "eyeR" | null
    startedAt: -Infinity,
  },
  eyeHits: {
    eyeL: 0,
    eyeR: 0,
  },
  dogs: [],
  punches: {
    head: -Infinity,
    torso: -Infinity,
    armL: -Infinity,
    armR: -Infinity,
    legs: -Infinity,
  },
  punchMeta: {
    head: { x: 12, y: 10, dirX: 1 },
    torso: { x: 12, y: 22, dirX: 1 },
    armL: { x: 7, y: 18, dirX: -1 },
    armR: { x: 17, y: 18, dirX: 1 },
    legs: { x: 12, y: 34, dirX: 1 },
  },
};

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resize);
resize();

function pointerPos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const ui = {
  dogIcon: { x: 16, y: 16, size: 44 },
  spriteIcon: { x: 16, y: 68, size: 44 },
  rigIcon: { x: 16, y: 120, size: 44 },
};

function pointInRect(p, rect) {
  return (
    p.x >= rect.x &&
    p.x <= rect.x + rect.size &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.size
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function maskHit(mask, x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  if (xi < 0 || yi < 0 || xi >= mask.width || yi >= mask.height) return false;
  return mask.alpha[yi * mask.width + xi] > 0;
}

function areaAtLocal(localX, localY) {
  const art = state.art;

  // Eyes: configurable points so custom sprites still support eye clicks/holds.
  const eyePoints = state.eyePoints;
  if (eyePoints) {
    const radius = Math.max(2, Math.round(art.width * 0.06));
    const r2 = radius * radius;
    const dxL = localX - eyePoints.eyeL.x;
    const dyL = localY - eyePoints.eyeL.y;
    if (dxL * dxL + dyL * dyL <= r2) return "eyeL";
    const dxR = localX - eyePoints.eyeR.x;
    const dyR = localY - eyePoints.eyeR.y;
    if (dxR * dxR + dyR * dyR <= r2) return "eyeR";
  }

  // Prefer top-most parts.
  if (maskHit(art.masks.head, localX, localY)) return "head";
  if (maskHit(art.masks.armL, localX, localY)) return "armL";
  if (maskHit(art.masks.armR, localX, localY)) return "armR";
  if (maskHit(art.masks.torso, localX, localY)) return "torso";
  if (maskHit(art.masks.legs, localX, localY)) return "legs";
  return null;
}

function currentGuyTransform(t) {
  const art = state.art;
  const breath = (Math.sin(t * 2.2) + 1) / 2; // 0..1
  const scaleX = (1 - breath * 0.01) * state.spriteScale;
  const scaleY = (1 + breath * 0.03) * state.spriteScale;
  const sway = Math.sin(t * 1.1) * 0.03;
  const lift = Math.sin(t * 2.2) * 2;

  // M = T(x, y+lift) * R(sway) * S(scaleX, scaleY) * T(-w/2, -h)
  const m = new DOMMatrix();
  m.translateSelf(state.x, state.y + lift);
  m.rotateSelf((sway * 180) / Math.PI);
  m.scaleSelf(scaleX, scaleY);
  m.translateSelf(-art.width / 2, -art.height);
  return { m, scaleX, scaleY, sway, lift };
}

function localFromPointer(p, t) {
  const { m } = currentGuyTransform(t);
  const inv = m.inverse();
  const pt = new DOMPoint(p.x, p.y).matrixTransform(inv);
  return { x: pt.x, y: pt.y };
}

function rebuildCustomArt() {
  const cs = state.customSprite;
  if (!cs) return;
  const art = makeArtFromUploadedSpriteCanvas(cs.base, cs.rig, cs.eyes);
  state.art = art;
  state.isTemplateArt = false;
  state.eyePoints = art.eyes;
}

function triggerPunch(area, t, localX, localY) {
  if (!area) return;
  const art = state.art;

  const isEye = area === "eyeL" || area === "eyeR";
  const normalizedArea = isEye ? "head" : area;
  const hitX = Number.isFinite(localX) ? localX : art.width / 2;
  const hitY = Number.isFinite(localY) ? localY : art.height / 2;

  if (isEye) {
    state.eyeAnim.which = area;
    state.eyeAnim.startedAt = t;

    state.eyeHits[area] += 1;
    if (state.eyeHits[area] >= 10) {
      // After 10 eye hits, hold that eye with the matching hand.
      state.hold.area = area;
      state.hold.limb = area === "eyeL" ? "armL" : "armR";
      // Lock to eye point so it always reads as "covering the eye".
      const eye = state.eyePoints?.[area] ?? { x: hitX, y: hitY };
      state.hold.targetX = eye.x;
      state.hold.targetY = eye.y;
      state.hold.startedAt = t;
      state.hold.activeUntil = t + 10;

      // Reset so it has to be earned again.
      state.eyeHits[area] = 0;
    }
  } else {
    state.punches[normalizedArea] = t;
    state.punchMeta[normalizedArea] = {
      x: hitX,
      y: hitY,
      dirX: hitX < art.width / 2 ? -1 : 1,
    };
  }

  // Combo tracking: if time between hits is < 3s, build a streak.
  if (t - state.combo.lastHitAt < 3) state.combo.streak += 1;
  else state.combo.streak = 1;
  state.combo.lastHitAt = t;

  // Trigger "hold the hurt spot" after 10 fast hits in a row.
  if (state.combo.streak >= 10) {
    const pickLimb = () => {
      if (normalizedArea === "armL") return "armR";
      if (normalizedArea === "armR") return "armL";
      return hitX < art.width / 2 ? "armL" : "armR";
    };

    state.hold.area = normalizedArea;
    state.hold.limb = pickLimb();
    state.hold.targetX = hitX;
    state.hold.targetY = hitY;
    state.hold.startedAt = t;
    state.hold.activeUntil = t + 10;

    // Reset the streak so you have to earn the next hold.
    state.combo.streak = 0;
    state.combo.lastHitAt = -Infinity;
  }
}

function dogHurt(area, t, localX, localY) {
  const art = state.art;
  const hitX = Number.isFinite(localX) ? localX : art.width / 2;
  const hitY = Number.isFinite(localY) ? localY : art.height / 2;
  state.punches[area] = t;
  state.punchMeta[area] = {
    x: hitX,
    y: hitY,
    dirX: hitX < art.width / 2 ? -1 : 1,
  };
}

function makeArtFromUploadedSpriteCanvas(baseCanvas, rig, eyes) {
  const w = baseCanvas.width;
  const h = baseCanvas.height;
  const bctx = baseCanvas.getContext("2d");
  if (!bctx) throw new Error("Could not read sprite base context");
  const { data } = bctx.getImageData(0, 0, w, h);
  const alpha = new Uint8Array(w * h);
  for (let i = 0, j = 3; i < alpha.length; i += 1, j += 4) alpha[i] = data[j];

  const headEnd = Math.floor(h * rig.headEnd);
  const torsoEnd = Math.floor(h * rig.torsoEnd);
  const legsStart = Math.floor(h * rig.legsStart);
  const armStartY = Math.floor(h * rig.armStartY);
  const armEndY = Math.floor(h * rig.armEndY);
  const armLeftEnd = Math.floor(w * rig.armLeftEnd);
  const armRightStart = Math.floor(w * rig.armRightStart);

  function maskFromPredicate(fn) {
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = y * w + x;
        if (!alpha[i]) continue;
        if (fn(x, y)) out[i] = alpha[i];
      }
    }
    return { alpha: out, width: w, height: h };
  }

  const armLMask = maskFromPredicate(
    (x, y) => y >= armStartY && y <= armEndY && x <= armLeftEnd,
  );
  const armRMask = maskFromPredicate(
    (x, y) => y >= armStartY && y <= armEndY && x >= armRightStart,
  );
  const headMask = maskFromPredicate((_, y) => y <= headEnd);
  const legsMask = maskFromPredicate((_, y) => y >= legsStart);
  const torsoMask = maskFromPredicate((x, y) => {
    if (y < headEnd || y > torsoEnd) return false;
    const i = y * w + x;
    if (armLMask.alpha[i] || armRMask.alpha[i]) return false;
    return true;
  });

  function layerFromMask(mask) {
    const layer = document.createElement("canvas");
    layer.width = w;
    layer.height = h;
    const lctx = layer.getContext("2d");
    if (!lctx) throw new Error("Could not create layer canvas context");
    const imageData = lctx.createImageData(w, h);
    const out = imageData.data;
    for (let i = 0; i < mask.alpha.length; i += 1) {
      if (!mask.alpha[i]) continue;
      const si = i * 4;
      out[si] = data[si];
      out[si + 1] = data[si + 1];
      out[si + 2] = data[si + 2];
      out[si + 3] = data[si + 3];
    }
    lctx.putImageData(imageData, 0, 0);
    return layer;
  }

  return {
    width: w,
    height: h,
    layers: {
      head: layerFromMask(headMask),
      torso: layerFromMask(torsoMask),
      armL: layerFromMask(armLMask),
      armR: layerFromMask(armRMask),
      legs: layerFromMask(legsMask),
    },
    masks: {
      head: headMask,
      torso: torsoMask,
      armL: armLMask,
      armR: armRMask,
      legs: legsMask,
    },
    eyes,
  };
}

function setCustomSpriteFromImage(img) {
  const targetH = 84;
  const aspect = img.width / Math.max(1, img.height);
  const w = Math.max(24, Math.min(96, Math.round(targetH * aspect)));
  const h = targetH;

  const base = document.createElement("canvas");
  base.width = w;
  base.height = h;
  const bctx = base.getContext("2d");
  if (!bctx) throw new Error("Could not create sprite base context");
  bctx.clearRect(0, 0, w, h);
  bctx.imageSmoothingEnabled = true;
  bctx.drawImage(img, 0, 0, w, h);

  state.customSprite = {
    base,
    width: w,
    height: h,
    rig: {
      headEnd: 0.36,
      torsoEnd: 0.74,
      legsStart: 0.7,
      armStartY: 0.34,
      armEndY: 0.78,
      armLeftEnd: 0.44,
      armRightStart: 0.56,
    },
    eyes: {
      eyeL: { x: w * 0.42, y: h * 0.22 },
      eyeR: { x: w * 0.58, y: h * 0.22 },
    },
  };

  rebuildCustomArt();
}

function loadCustomSpriteFromUrl(url) {
  const img = new Image();
  img.onload = () => {
    try {
      setCustomSpriteFromImage(img);
    } catch (err) {
      console.error("Failed to apply sprite from image:", err);
    }
  };
  img.onerror = () => {
    console.error("Failed to load sprite image:", url);
  };
  img.src = url;
}

function spawnDog() {
  const w = window.innerWidth;
  const spawnLeft = Math.random() < 0.5;
  const x = spawnLeft ? -60 : w + 60;
  const y = Math.floor(window.innerHeight * 0.62) + 140;
  state.dogs.push({
    id: crypto.randomUUID(),
    x,
    y,
    facing: spawnLeft ? 1 : -1,
    phase: "run", // run -> bite -> leave
    spawnedAt: performance.now() / 1000,
    biteUntil: -Infinity,
    nextBiteAt: -Infinity,
  });
}

function pickGuideAtLocal(local, art) {
  const cs = state.customSprite;
  if (!cs) return null;
  const { rig } = cs;
  const snap = Math.max(2, Math.round(art.height * 0.03));

  const y = local.y;
  const x = local.x;
  const headEndY = rig.headEnd * art.height;
  const torsoEndY = rig.torsoEnd * art.height;
  const legsStartY = rig.legsStart * art.height;
  const armLeftX = rig.armLeftEnd * art.width;
  const armRightX = rig.armRightStart * art.width;

  if (Math.abs(y - headEndY) <= snap) return "headEnd";
  if (Math.abs(y - torsoEndY) <= snap) return "torsoEnd";
  if (Math.abs(y - legsStartY) <= snap) return "legsStart";
  if (Math.abs(x - armLeftX) <= snap) return "armLeftEnd";
  if (Math.abs(x - armRightX) <= snap) return "armRightStart";
  return null;
}

canvas.addEventListener("pointerdown", (event) => {
  const now = performance.now() / 1000;
  const p = pointerPos(event);

  if (pointInRect(p, ui.dogIcon)) {
    spawnDog();
    return;
  }

  if (pointInRect(p, ui.spriteIcon)) {
    loadCustomSpriteFromUrl(purpleguyUrl);
    return;
  }

  if (pointInRect(p, ui.rigIcon)) {
    state.rigEdit.enabled = !state.rigEdit.enabled;
    state.rigEdit.draggingGuide = null;
    return;
  }

  if (state.rigEdit.enabled && state.customSprite) {
    const local = localFromPointer(p, now);
    // Shift+click sets eye points (left/right based on click position).
    if (event.shiftKey) {
      const isLeft = local.x < state.art.width / 2;
      const key = isLeft ? "eyeL" : "eyeR";
      state.customSprite.eyes[key] = {
        x: clamp(local.x, 0, state.art.width),
        y: clamp(local.y, 0, state.art.height),
      };
      rebuildCustomArt();
      return;
    }

    state.rigEdit.draggingGuide = pickGuideAtLocal(local, state.art);
    if (!state.rigEdit.draggingGuide) return;
    canvas.setPointerCapture(event.pointerId);
    return;
  }

  canvas.setPointerCapture(event.pointerId);
  const local = localFromPointer(p, now);
  const area = areaAtLocal(local.x, local.y);

  state.pressed = true;
  state.pressedOnGuy = Boolean(area);
  state.pressedArea = area;
  state.pressedLocalX = local.x;
  state.pressedLocalY = local.y;
  state.pressStartX = p.x;
  state.pressStartY = p.y;

  // Start moving immediately when clicking empty space; for the guy we wait to
  // see if it's a click (punch) or a drag (move).
  if (!state.pressedOnGuy) {
    state.dragging = true;
    state.targetX = p.x;
    state.targetY = p.y;
  }
});

canvas.addEventListener("pointermove", (event) => {
  const p = pointerPos(event);
  const now = performance.now() / 1000;

  if (state.rigEdit.enabled && state.customSprite && state.rigEdit.draggingGuide) {
    const local = localFromPointer(p, now);
    const cs = state.customSprite;
    const rig = cs.rig;
    const minGapY = 0.08;
    const minGapX = 0.08;

    const yFrac = clamp(local.y / state.art.height, 0, 1);
    const xFrac = clamp(local.x / state.art.width, 0, 1);

    if (state.rigEdit.draggingGuide === "headEnd") {
      rig.headEnd = clamp(yFrac, 0.15, rig.torsoEnd - minGapY);
    } else if (state.rigEdit.draggingGuide === "torsoEnd") {
      rig.torsoEnd = clamp(yFrac, rig.headEnd + minGapY, 0.9);
    } else if (state.rigEdit.draggingGuide === "legsStart") {
      rig.legsStart = clamp(yFrac, rig.headEnd + minGapY, 0.95);
    } else if (state.rigEdit.draggingGuide === "armLeftEnd") {
      rig.armLeftEnd = clamp(xFrac, 0.15, rig.armRightStart - minGapX);
    } else if (state.rigEdit.draggingGuide === "armRightStart") {
      rig.armRightStart = clamp(xFrac, rig.armLeftEnd + minGapX, 0.85);
    }

    // Keep arm vertical window roughly around torso.
    rig.armStartY = clamp(rig.headEnd - 0.02, 0.15, 0.7);
    rig.armEndY = clamp(rig.torsoEnd + 0.04, 0.3, 0.95);

    rebuildCustomArt();
    return;
  }

  if (!state.pressed) return;

  const dx = p.x - state.pressStartX;
  const dy = p.y - state.pressStartY;
  const moved = Math.hypot(dx, dy);

  if (!state.dragging && moved > 6) state.dragging = true;
  if (!state.dragging) return;

  state.targetX = p.x;
  state.targetY = p.y;
});

canvas.addEventListener("pointerup", (event) => {
  const now = performance.now() / 1000;
  if (state.rigEdit.enabled && state.rigEdit.draggingGuide) {
    state.rigEdit.draggingGuide = null;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    return;
  }
  if (state.pressed && state.pressedOnGuy && !state.dragging) {
    triggerPunch(state.pressedArea, now, state.pressedLocalX, state.pressedLocalY);
  }

  state.dragging = false;
  state.pressed = false;
  state.pressedOnGuy = false;
  state.pressedArea = null;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // ignore
  }
});

function drawBackground() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Gradient sky.
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#060a16");
  g.addColorStop(1, "#0b1020");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Subtle grid.
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = "#1b2140";
  ctx.lineWidth = 1;
  const grid = 48;
  const offsetY = Math.floor(h * 0.62);
  for (let x = 0; x <= w; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, offsetY);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = offsetY; y <= h; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function updateDogs(t, dt) {
  const targetX = state.x;
  const targetY = state.y;
  const speed = 340;

  state.dogs = state.dogs
    .map((dog) => {
      if (dog.phase === "run") {
        const dx = targetX - dog.x;
        const dy = targetY - dog.y;
        const dist = Math.hypot(dx, dy);
        dog.facing = dx >= 0 ? 1 : -1;
        if (dist < 110) {
          dog.phase = "bite";
          dog.biteUntil = t + 3.0;
          dog.nextBiteAt = t;
        } else {
          const ux = dx / Math.max(1, dist);
          const uy = dy / Math.max(1, dist);
          dog.x += ux * speed * dt;
          dog.y += uy * speed * dt;
        }
      } else if (dog.phase === "bite") {
        const dx = targetX - dog.x;
        const dy = targetY - dog.y;
        dog.facing = dx >= 0 ? 1 : -1;

        // Stay near the target.
        dog.x += Math.sign(dx) * 80 * dt;
        dog.y += Math.sign(dy) * 60 * dt;

        if (t >= dog.nextBiteAt) {
          dog.nextBiteAt = t + 0.35;
          dogHurt("legs", t, state.art.width / 2, state.art.height * 0.85);
        }

        if (t >= dog.biteUntil) dog.phase = "leave";
      } else if (dog.phase === "leave") {
        dog.x += dog.facing * 520 * dt;
      }
      return dog;
    })
    .filter((dog) => {
      const w = window.innerWidth;
      return dog.x > -200 && dog.x < w + 200;
    });
}

function drawDogs(t) {
  const sprite = dogArt.sprite;
  for (const dog of state.dogs) {
    const bite = dog.phase === "bite";
    const hop = bite ? Math.sin((t - dog.spawnedAt) * 18) * 4 : 0;
    const scale = 6;

    ctx.save();
    ctx.translate(dog.x, dog.y + hop);
    ctx.scale(dog.facing * scale, scale);
    ctx.translate(-sprite.width / 2, -sprite.height);
    ctx.drawImage(sprite, 0, 0);

    if (bite) {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(14, 7, 1, 1);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(15, 6, 1, 1);
    }

    ctx.restore();
  }
}

function drawUI() {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const drawButton = (rect, iconCanvas) => {
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#111827";
    ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    ctx.globalAlpha = 1;
    ctx.drawImage(iconCanvas, rect.x + 12, rect.y + 12, 20, 20);
  };

  drawButton(ui.dogIcon, dogArt.icon);

  drawButton(ui.spriteIcon, spriteUploadIcon);
  drawButton(ui.rigIcon, rigIcon);
  ctx.restore();
}

function drawGuy(t) {
  const PUNCH_MS = 220;
  const EYE_MS = 420;
  const HOLD_IN_S = 0.25;
  const art = state.art;
  const pivots = {
    head: { x: art.width * 0.5, y: art.height * 0.24 },
    torso: { x: art.width * 0.5, y: art.height * 0.55 },
    armL: { x: art.width * 0.33, y: art.height * 0.55 },
    armR: { x: art.width * 0.67, y: art.height * 0.55 },
    legs: { x: art.width * 0.5, y: art.height * 0.85 },
  };

  function punchProgress(area) {
    const start = state.punches[area];
    const p = (t - start) / (PUNCH_MS / 1000);
    if (p <= 0 || p >= 1) return 0;
    // Quick impact curve 0..1..0
    return Math.sin(p * Math.PI);
  }

  const headP = punchProgress("head");
  const torsoP = punchProgress("torso");
  const armLP = punchProgress("armL");
  const armRP = punchProgress("armR");
  const legsP = punchProgress("legs");
  const headHit = state.punchMeta.head;
  const torsoHit = state.punchMeta.torso;
  const armLHit = state.punchMeta.armL;
  const armRHit = state.punchMeta.armR;
  const legsHit = state.punchMeta.legs;
  const eyeWhich = state.eyeAnim.which;
  const eyeP = (() => {
    const p = (t - state.eyeAnim.startedAt) / (EYE_MS / 1000);
    if (p <= 0 || p >= 1) return 0;
    // 0..1..0
    return Math.sin(p * Math.PI);
  })();

  const holdActive = t < state.hold.activeUntil && Boolean(state.hold.limb);
  const holdEase = (() => {
    if (!holdActive) return 0;
    const p = Math.min(1, Math.max(0, (t - state.hold.startedAt) / HOLD_IN_S));
    // easeOutCubic
    return 1 - Math.pow(1 - p, 3);
  })();
  const holdPain = holdActive ? 0.55 : 0;

  const hurtP = Math.max(headP, torsoP, armLP, armRP, legsP, eyeP, holdPain);

  // Breathing baseline.
  const breath = (Math.sin(t * 2.2) + 1) / 2; // 0..1
  const scaleX = (1 - breath * 0.01 + torsoP * 0.04) * state.spriteScale;
  const scaleY = (1 + breath * 0.03 - torsoP * 0.05) * state.spriteScale;
  const sway =
    Math.sin(t * 1.1) * 0.03 +
    armLP * -0.06 +
    armRP * 0.06 +
    hurtP * Math.sin(t * 40) * 0.015;
  const lift = Math.sin(t * 2.2) * 2 - legsP * 6;
  const knockX = headP * 6 * headHit.dirX;
  const knockRot = headP * 0.18;
  const shakeX = hurtP * Math.sin(t * 70) * 2.5;
  const shakeY = hurtP * Math.cos(t * 60) * 1.5;

  ctx.save();
  ctx.translate(state.x + knockX + shakeX, state.y + lift + shakeY);
  ctx.rotate(sway + knockRot);
  ctx.scale(scaleX, scaleY);
  ctx.imageSmoothingEnabled = state.spriteSmoothDraw;

  // Draw each part with its own little punch reaction.
  const w = art.width;
  const h = art.height;
  ctx.translate(-w / 2, -h);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function drawLayer(layer, pivot, extra) {
    ctx.save();
    ctx.translate(pivot.x, pivot.y);
    if (extra?.rot) ctx.rotate(extra.rot);
    if (extra?.sx || extra?.sy) {
      ctx.scale(extra.sx ?? 1, extra.sy ?? 1);
    }
    if (extra?.tx || extra?.ty) ctx.translate(extra.tx ?? 0, extra.ty ?? 0);
    ctx.translate(-pivot.x, -pivot.y);
    ctx.drawImage(layer, 0, 0);
    ctx.restore();
  }

  const layers = art.layers;

  // Order: legs -> torso -> arms -> head.
  drawLayer(layers.legs, pivots.legs, {
    rot: legsP * 0.06,
    tx: 0,
    ty: legsP * 2,
  });

  drawLayer(layers.torso, pivots.torso, {
    sx: 1 + torsoP * 0.03,
    sy: 1 - torsoP * 0.04,
  });

  const armLExtra = {
    rot: armLP * -0.25,
    tx: armLP * -1.5,
    ty: armLP * 0.5,
  };

  const armRExtra = {
    rot: armRP * 0.25,
    tx: armRP * 1.5,
    ty: armRP * 0.5,
  };

  if (holdActive) {
    const targetX =
      state.hold.area === "eyeL"
        ? state.eyePoints?.eyeL?.x ?? w * 0.42
        : state.hold.area === "eyeR"
          ? state.eyePoints?.eyeR?.x ?? w * 0.58
          : state.hold.targetX;
    const targetY =
      state.hold.area === "eyeL" || state.hold.area === "eyeR"
        ? (state.hold.area === "eyeL"
            ? state.eyePoints?.eyeL?.y
            : state.eyePoints?.eyeR?.y) ?? h * 0.22
        : state.hold.targetY;
    const limb = state.hold.limb;
    const pivot = limb ? pivots[limb] : null;

    if (pivot) {
      const dx = targetX - pivot.x;
      const dy = targetY - pivot.y;
      const len = Math.max(0.001, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const eyeHold = state.hold.area === "eyeL" || state.hold.area === "eyeR";
      const reachRot = eyeHold
        ? clamp(angle - Math.PI / 2, -3.0, 1.1)
        : clamp(angle - Math.PI / 2, -1.1, 1.1);
      const reachDist = eyeHold ? Math.min(9, len * 0.55) : Math.min(4, len * 0.25);
      const reachTx = (dx / len) * reachDist;
      const reachTy = (dy / len) * reachDist;
      const tremble = Math.sin(t * 28) * 0.03;

      const holdExtra = {
        rot: (reachRot + tremble) * holdEase,
        tx: reachTx * holdEase,
        ty: reachTy * holdEase,
      };

      if (limb === "armL") Object.assign(armLExtra, holdExtra);
      if (limb === "armR") Object.assign(armRExtra, holdExtra);
    }
  }

  drawLayer(layers.armL, pivots.armL, armLExtra);
  drawLayer(layers.armR, pivots.armR, armRExtra);

  drawLayer(layers.head, pivots.head, {
    rot: headP * 0.18,
    ty: headP * -1.5,
  });

  // Hurt overlay: squint + grimace + blush tint.
  if (hurtP) {
    ctx.save();
    ctx.globalAlpha = 0.12 * hurtP;
    ctx.fillStyle = "#fb7185"; // pink-red tint
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    if (state.isTemplateArt) {
      // Squinty eyes / "ow" face (template only).
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#0b0b10";
      const squint = Math.floor(hurtP * 2);
      ctx.fillRect(9, 8 + squint, 3, 1);
      ctx.fillRect(13, 8 + squint, 3, 1);
      ctx.fillRect(10, 12, 6, 2);
      ctx.fillStyle = "#f8fafc";
      ctx.globalAlpha = 0.8 * hurtP;
      ctx.fillRect(11, 12, 1, 1);
      ctx.fillRect(13, 12, 1, 1);
      ctx.restore();
    }
  }

  // Custom eye click animation: close ONLY the interacted eye.
  if (eyeWhich && eyeP) {
    const isLeft = eyeWhich === "eyeL";
    const eye = isLeft ? state.eyePoints?.eyeL : state.eyePoints?.eyeR;
    const eyeX = Math.floor((eye?.x ?? (isLeft ? w * 0.42 : w * 0.58)) - 1);
    const eyeY = Math.floor(eye?.y ?? h * 0.22);
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#0b0b10";
    // Eyelid line with a tiny twitch.
    const twitch = Math.round(Math.sin((t - state.eyeAnim.startedAt) * 30) * 0.5);
    ctx.fillRect(eyeX, eyeY + twitch, 3, 1);
    // Little brow crease.
    ctx.globalAlpha = 0.85 * eyeP;
    ctx.fillRect(eyeX, eyeY - 2, 2, 1);
    ctx.restore();
  }

  // Impact flashes (per area).
  function impactFlash(area, progress, meta) {
    if (!progress) return;
    const amp = progress;
    ctx.save();
    ctx.globalAlpha = 0.65 * amp;
    ctx.fillStyle = "#fbbf24";
    const fx = Math.floor(meta.x);
    const fy = Math.floor(meta.y);
    ctx.fillRect(fx - 1, fy - 1, 3, 3);
    ctx.globalAlpha = 0.85 * amp;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(fx, fy, 1, 1);
    ctx.restore();
  }

  impactFlash("head", headP, headHit);
  impactFlash("torso", torsoP, torsoHit);
  impactFlash("armL", armLP, armLHit);
  impactFlash("armR", armRP, armRHit);
  impactFlash("legs", legsP, legsHit);

  if (state.rigEdit.enabled && state.customSprite) {
    const cs = state.customSprite;
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#f8fafc";

    const headEndY = cs.rig.headEnd * h;
    const torsoEndY = cs.rig.torsoEnd * h;
    const legsStartY = cs.rig.legsStart * h;
    const armLeftX = cs.rig.armLeftEnd * w;
    const armRightX = cs.rig.armRightStart * w;

    const hline = (y) => {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    };
    const vline = (x) => {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    };

    hline(headEndY);
    hline(torsoEndY);
    hline(legsStartY);
    vline(armLeftX);
    vline(armRightX);

    // Eye points.
    const eyeL = state.eyePoints?.eyeL;
    const eyeR = state.eyePoints?.eyeR;
    ctx.fillStyle = "#fbbf24";
    if (eyeL) ctx.fillRect(Math.round(eyeL.x) - 1, Math.round(eyeL.y) - 1, 3, 3);
    if (eyeR) ctx.fillRect(Math.round(eyeR.x) - 1, Math.round(eyeR.y) - 1, 3, 3);

    ctx.restore();
  }

  ctx.restore();
}

function animate(now) {
  const t = now / 1000;
  const dt = animate.lastNow ? (now - animate.lastNow) / 1000 : 0;
  animate.lastNow = now;

  // Smooth movement.
  const follow = 1 - Math.pow(0.001, Math.min(dt, 0.05));
  state.x += (state.targetX - state.x) * follow;
  state.y += (state.targetY - state.y) * follow;

  updateDogs(t, Math.min(dt, 0.05));
  drawBackground();
  drawDogs(t);
  drawGuy(t);
  drawUI();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
