/* =========================================================
   Données (titres, artistes et couleurs fictifs)
   ========================================================= */
const TRACKS = [
  { id: 1,  title: "Nuit Électrique",   artist: "Les Lumières Froides", c1: "#7b2ff7", c2: "#f107a3", duration: 214 },
  { id: 2,  title: "Rivages",           artist: "Mara Delvaux",         c1: "#00c6ff", c2: "#0072ff", duration: 187 },
  { id: 3,  title: "Sable & Soleil",    artist: "Kofi Mensah",          c1: "#f7971e", c2: "#ffd200", duration: 243 },
  { id: 4,  title: "Forêt Mécanique",   artist: "Orion Vale",           c1: "#11998e", c2: "#38ef7d", duration: 201 },
  { id: 5,  title: "Cendres",           artist: "Noa Berthier",         c1: "#434343", c2: "#000000", duration: 176 },
  { id: 6,  title: "Pulsation",         artist: "DJ Calypso",           c1: "#ff416c", c2: "#ff4b2b", duration: 228 },
  { id: 7,  title: "Brume du matin",    artist: "Ilyes & Sofia",        c1: "#8e9eab", c2: "#eef2f3", duration: 195 },
  { id: 8,  title: "Cosmos Doux",       artist: "Alba Nox",             c1: "#2c3e50", c2: "#4ca1af", duration: 260 },
  { id: 9,  title: "Rue des Tambours",  artist: "Brass Fanfare",        c1: "#c31432", c2: "#240b36", duration: 182 },
  { id: 10, title: "Lac Intérieur",     artist: "Mara Delvaux",         c1: "#43cea2", c2: "#185a9d", duration: 219 },
  { id: 11, title: "Néon Tropical",     artist: "Kofi Mensah",          c1: "#fc00ff", c2: "#00dbde", duration: 205 },
  { id: 12, title: "Dernier Métro",     artist: "Les Lumières Froides", c1: "#373b44", c2: "#4286f4", duration: 233 },
  { id: 13, title: "Terre Rouge",       artist: "Awa Traoré",           c1: "#cb2d3e", c2: "#ef473a", duration: 190 },
  { id: 14, title: "Lofi pour Réviser", artist: "Studio Café",          c1: "#614385", c2: "#516395", duration: 168 },
  { id: 15, title: "Aube Dorée",        artist: "Alba Nox",             c1: "#ff9966", c2: "#ff5e62", duration: 211 },
  { id: 16, title: "Vagues Hautes",     artist: "Orion Vale",           c1: "#1488cc", c2: "#2b32b2", duration: 199 },
];

const PLAYLISTS = [
  { name: "Coup de cœur",      sub: "Playlist • Vous",        tracks: [1, 6, 11] },
  { name: "Focus & Études",    sub: "Playlist • Vous",        tracks: [14, 8, 10] },
  { name: "Road Trip",         sub: "Playlist • Vous",        tracks: [3, 13, 16] },
  { name: "Soirée Chill",      sub: "Playlist • Studio Café", tracks: [7, 2, 5] },
  { name: "Afro Vibes",        sub: "Playlist • Vous",        tracks: [3, 13, 6] },
  { name: "Découvertes",       sub: "Playlist • Vous",        tracks: [4, 9, 12] },
];

const GENRES = [
  ["Pop", "#e8115b"], ["Hip-Hop", "#ba5d07"], ["Rock", "#e13300"], ["Électro", "#7358ff"],
  ["Jazz", "#477d95"], ["Afrobeats", "#148a08"], ["Chill", "#1e3264"], ["Classique", "#8d67ab"],
  ["Reggae", "#0d73ec"], ["Soul", "#dc148c"], ["Podcasts", "#006450"], ["Concerts", "#e61e32"],
];

/* =========================================================
   Utilitaires & icônes
   ========================================================= */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ICON = {
  play:   '<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:  '<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  volHigh:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
  volLow: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>',
  volMute:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="m17 9 5 6M22 9l-5 6"/></svg>',
};
const icon = (name, size = 20) => ICON[name].replaceAll("{s}", size);

const gradient = (t) => `linear-gradient(135deg, ${t.c1}, ${t.c2})`;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const byId = (id) => TRACKS.find((t) => t.id === id);
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* =========================================================
   État du lecteur
   ========================================================= */
const state = {
  index: 0,
  playing: false,
  elapsed: 0,          // secondes écoulées
  shuffle: false,
  repeat: false,
  volume: 70,
  lastVolume: 70,
  timer: null,
  liked: new Set(),
};

/* =========================================================
   Rendu des cartes
   ========================================================= */
function cardHTML(track) {
  return `
    <article class="card" data-id="${track.id}">
      <div class="art" style="background:${gradient(track)}"></div>
      <button class="play-fab" aria-label="Lire ${track.title}">${icon("play", 22)}</button>
      <h4>${track.title}</h4>
      <p>${track.artist}</p>
    </article>`;
}

function renderGrid(container, tracks) {
  container.innerHTML = tracks.map(cardHTML).join("");
}

function renderHome() {
  const h = new Date().getHours();
  $("#greeting").textContent = h < 6 || h >= 18 ? "Bonsoir" : h < 12 ? "Bonjour" : "Bon après-midi";

  $("#quick-grid").innerHTML = PLAYLISTS.map((p, i) => {
    const t = byId(p.tracks[0]);
    return `
      <div class="quick" data-playlist="${i}">
        <div class="q-cover" style="background:${gradient(t)}"></div>
        <span>${p.name}</span>
        <button class="play-fab" aria-label="Lire ${p.name}">${icon("play", 20)}</button>
      </div>`;
  }).join("");

  renderGrid($("#grid-mixes"), TRACKS.slice(0, 8));
  renderGrid($("#grid-recent"), TRACKS.slice(8, 16));
  renderGrid($("#grid-library"), TRACKS);
}

function renderSidebar() {
  $("#sidebar-playlists").innerHTML = PLAYLISTS.map((p, i) => {
    const t = byId(p.tracks[0]);
    return `
      <li data-playlist="${i}" title="${p.name}">
        <div class="mini-cover" style="background:${gradient(t)}"></div>
        <div class="pl-info">
          <div class="pl-name">${p.name}</div>
          <div class="pl-sub">${p.sub}</div>
        </div>
      </li>`;
  }).join("");
}

function renderGenres() {
  $("#genre-grid").innerHTML = GENRES.map(
    ([name, color]) => `<div class="genre" data-genre="${name}" style="background:${color}">${name}</div>`
  ).join("");
}

/* =========================================================
   Lecteur : lecture / pause / navigation
   ========================================================= */
const els = {
  play: $("#btn-play"),
  prev: $("#btn-prev"),
  next: $("#btn-next"),
  shuffle: $("#btn-shuffle"),
  repeat: $("#btn-repeat"),
  like: $("#btn-like"),
  progress: $("#progress"),
  volume: $("#volume"),
  mute: $("#btn-mute"),
  cur: $("#time-current"),
  total: $("#time-total"),
  cover: $("#player-cover"),
  title: $("#player-title"),
  artist: $("#player-artist"),
};

const current = () => TRACKS[state.index];

function setSliderFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty("--pct", pct + "%");
}

function updateTrackUI() {
  const t = current();
  els.cover.style.background = gradient(t);
  els.title.textContent = t.title;
  els.artist.textContent = t.artist;
  els.total.textContent = fmt(t.duration);
  els.like.classList.toggle("active", state.liked.has(t.id));
  document.title = state.playing ? `${t.title} • ${t.artist}` : "Musique – Clone UI";
  updatePlayingCards();
}

function updateProgressUI() {
  const t = current();
  els.progress.value = (state.elapsed / t.duration) * 100;
  els.cur.textContent = fmt(state.elapsed);
  setSliderFill(els.progress);
}

function updatePlayButtons() {
  els.play.innerHTML = icon(state.playing ? "pause" : "play", 18);
  els.play.setAttribute("aria-label", state.playing ? "Pause" : "Lecture");
}

function updatePlayingCards() {
  const id = current().id;
  $$(".card").forEach((card) => {
    const isCurrent = Number(card.dataset.id) === id;
    card.classList.toggle("playing", isCurrent);
    $(".play-fab", card).innerHTML = icon(isCurrent && state.playing ? "pause" : "play", 22);
  });
}

function startTimer() {
  stopTimer();
  state.timer = setInterval(() => {
    state.elapsed += 0.25;
    if (state.elapsed >= current().duration) {
      state.repeat ? seekTo(0) : nextTrack(true);
    } else {
      updateProgressUI();
    }
  }, 250);
}
function stopTimer() { clearInterval(state.timer); state.timer = null; }

function play() {
  state.playing = true;
  startTimer();
  updatePlayButtons();
  updateTrackUI();
}
function pause() {
  state.playing = false;
  stopTimer();
  updatePlayButtons();
  updateTrackUI();
}
function togglePlay() { state.playing ? pause() : play(); }

function loadTrack(index, autoplay = true) {
  state.index = (index + TRACKS.length) % TRACKS.length;
  state.elapsed = 0;
  updateProgressUI();
  autoplay ? play() : (updateTrackUI(), updatePlayButtons());
}

function nextTrack() {
  if (state.shuffle) {
    let r;
    do { r = Math.floor(Math.random() * TRACKS.length); } while (r === state.index && TRACKS.length > 1);
    return loadTrack(r);
  }
  loadTrack(state.index + 1);
}
function prevTrack() {
  // Comme sur les vrais lecteurs : > 3 s => on revient au début du titre
  if (state.elapsed > 3) return seekTo(0);
  loadTrack(state.index - 1);
}
function seekTo(seconds) {
  state.elapsed = seconds;
  updateProgressUI();
}

function playTrackById(id) {
  const i = TRACKS.findIndex((t) => t.id === id);
  if (i === state.index) return togglePlay();
  loadTrack(i);
}

/* ---- Volume ---- */
function updateVolumeUI() {
  els.volume.value = state.volume;
  setSliderFill(els.volume);
  els.mute.innerHTML = icon(state.volume === 0 ? "volMute" : state.volume < 50 ? "volLow" : "volHigh");
}

/* =========================================================
   Navigation entre vues
   ========================================================= */
const history = { stack: ["home"], pos: 0 };

function showView(name, pushHistory = true) {
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  $$(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.view === name));
  $(".main").scrollTo({ top: 0 });

  if (pushHistory) {
    history.stack = history.stack.slice(0, history.pos + 1);
    if (history.stack[history.pos] !== name) {
      history.stack.push(name);
      history.pos++;
    }
  }
  if (name === "search") $("#search-input").focus({ preventScroll: true });
  updatePlayingCards();
}

function goHistory(delta) {
  const p = history.pos + delta;
  if (p < 0 || p >= history.stack.length) return;
  history.pos = p;
  showView(history.stack[p], false);
}

/* =========================================================
   Recherche (filtrage visuel)
   ========================================================= */
function runSearch(query) {
  const q = normalize(query.trim());
  const browse = $("#search-browse");
  const results = $("#search-results");

  if (!q) {
    browse.hidden = false;
    results.hidden = true;
    return;
  }
  const found = TRACKS.filter((t) => normalize(t.title).includes(q) || normalize(t.artist).includes(q));
  browse.hidden = true;
  results.hidden = false;
  renderGrid($("#grid-results"), found);
  $("#no-result").hidden = found.length > 0;
  updatePlayingCards();
}

/* =========================================================
   Événements
   ========================================================= */
function bindEvents() {
  // Navigation
  $$(".nav-link").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));
  $("#btn-back").addEventListener("click", () => goHistory(-1));
  $("#btn-forward").addEventListener("click", () => goHistory(1));

  // Clic sur cartes (délégation d'événements)
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) return playTrackById(Number(card.dataset.id));

    const pl = e.target.closest("[data-playlist]");
    if (pl) {
      const list = PLAYLISTS[Number(pl.dataset.playlist)];
      return playTrackById(list.tracks[0]);
    }

    const genre = e.target.closest(".genre");
    if (genre) {
      // Démo : lance une recherche à partir du nom du genre
      const input = $("#search-input");
      input.value = genre.dataset.genre;
      runSearch(input.value);
    }
  });

  // Contrôles lecteur
  els.play.addEventListener("click", togglePlay);
  els.next.addEventListener("click", nextTrack);
  els.prev.addEventListener("click", prevTrack);

  els.shuffle.addEventListener("click", () => {
    state.shuffle = !state.shuffle;
    els.shuffle.classList.toggle("active", state.shuffle);
  });
  els.repeat.addEventListener("click", () => {
    state.repeat = !state.repeat;
    els.repeat.classList.toggle("active", state.repeat);
  });
  els.like.addEventListener("click", () => {
    const id = current().id;
    state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
    els.like.classList.toggle("active", state.liked.has(id));
  });

  // Barre de progression
  els.progress.addEventListener("input", () => {
    seekTo((els.progress.value / 100) * current().duration);
  });

  // Volume
  els.volume.addEventListener("input", () => {
    state.volume = Number(els.volume.value);
    if (state.volume > 0) state.lastVolume = state.volume;
    updateVolumeUI();
  });
  els.mute.addEventListener("click", () => {
    state.volume = state.volume === 0 ? state.lastVolume || 70 : 0;
    updateVolumeUI();
  });

  // Recherche
  $("#search-input").addEventListener("input", (e) => runSearch(e.target.value));

  // Raccourcis clavier
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input[type='search']")) return;
    if (e.code === "Space") { e.preventDefault(); togglePlay(); }
    if (e.code === "ArrowRight" && e.shiftKey) nextTrack();
    if (e.code === "ArrowLeft" && e.shiftKey) prevTrack();
  });
}

/* =========================================================
   Initialisation
   ========================================================= */
function init() {
  renderSidebar();
  renderHome();
  renderGenres();
  bindEvents();
  updateVolumeUI();
  loadTrack(0, false);
}
init();