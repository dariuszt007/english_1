const $ = id => document.getElementById(id);
const STORAGE_KEY = "sentence-builder-data";

let data = { categories: [], exercises: [] };
let game = null;

function getSavedData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.categories) && Array.isArray(saved.exercises)) {
      return saved;
    }
  } catch {}
  return null;
}

async function loadData() {
  const saved = getSavedData();
  if (saved) return saved;

  try {
    const response = await fetch("exercises.json");
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return { categories: [], exercises: [] };
  }
}

function fillCategorySelect() {
  const select = $("categoryFilter");
  select.innerHTML = "";

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = t("allCategories");
  select.appendChild(all);

  data.categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

$("startGame").addEventListener("click", () => {
  const category = $("categoryFilter").value;
  const exercises = data.exercises.filter(item =>
    category === "all" || item.category === category
  );

  if (!exercises.length) {
    alert(t("noExercises"));
    return;
  }

  const playerCount = Math.max(1, parseInt($("playerCount").value, 10) || 1);
  const rounds = Math.max(1, parseInt($("rounds").value, 10) || 1);
  const names = $("playerNames").value.split(",").map(x => x.trim()).filter(Boolean);
  const players = Array.from({ length: playerCount }, (_, i) =>
    names[i] || `${t("player")}${i + 1}`
  );
  const total = playerCount * rounds;
  const queue = Array.from({ length: total }, (_, i) => exercises[i % exercises.length]);

  game = {
    players,
    scores: players.map(() => 0),
    queue: shuffle(queue),
    completed: 0,
    solved: false
  };
  showNextExercise();
});

function renderScores() {
  const box = $("scoreArea");
  box.innerHTML = "";
  if (!game) return;

  const heading = document.createElement("h2");
  heading.textContent = t("scores");
  box.appendChild(heading);

  game.players.forEach((player, i) => {
    const row = document.createElement("p");
    row.textContent = `${player}: ${game.scores[i]}`;
    box.appendChild(row);
  });
}

function showNextExercise() {
  if (!game) return;

  const area = $("gameArea");
  area.innerHTML = "";

  if (game.completed >= game.queue.length) {
    const high = Math.max(...game.scores);
    const winners = game.players.filter((_, i) => game.scores[i] === high);
    const card = document.createElement("section");
    card.className = "panel";

    const title = document.createElement("h2");
    title.textContent = t("endGame");

    const text = document.createElement("p");
    text.textContent =
      (winners.length > 1 ? t("tie") : t("winner")) +
      winners.join(", ") + " — " + high +
      (high === 1 ? t("pointsOne") : t("pointsMany"));

    card.append(title, text);
    area.appendChild(card);
    renderScores();
    return;
  }

  game.solved = false;
  const playerIndex = game.completed % game.players.length;
  const exercise = game.queue[game.completed];
  const correctWords = exercise.sentence.trim().split(/\s+/)
    .map((text, id) => ({ text, id }));
  const selected = [];

  const card = document.createElement("section");
  card.className = "exercise";

  const heading = document.createElement("h2");
  heading.textContent = t("nowPlaying") + game.players[playerIndex];

  const category = document.createElement("p");
  category.className = "muted";
  category.textContent = exercise.category;

  const answer = document.createElement("div");
  answer.className = "sentence";
  const bank = document.createElement("div");
  const result = document.createElement("div");
  result.className = "result";

  function updateAnswer() {
    answer.innerHTML = "";
    selected.forEach((word, index) => {
      const tile = document.createElement("span");
      tile.className = "word";
      tile.textContent = word.text;
      tile.title = t("undo");
      tile.addEventListener("click", () => {
        if (game.solved) return;
        const removed = selected.splice(index, 1)[0];
        bank.querySelectorAll("[data-word-id]").forEach(item => {
          if (Number(item.dataset.wordId) === removed.id) item.classList.remove("hidden");
        });
        updateAnswer();
      });
      answer.appendChild(tile);
    });
  }

  shuffle(correctWords).forEach(word => {
    const tile = document.createElement("span");
    tile.className = "word";
    tile.textContent = word.text;
    tile.dataset.wordId = word.id;
    tile.addEventListener("click", () => {
      if (game.solved) return;
      selected.push(word);
      tile.classList.add("hidden");
      updateAnswer();
    });
    bank.appendChild(tile);
  });

  const check = document.createElement("button");
  check.textContent = t("check");

  const next = document.createElement("button");
  next.className = "secondary hidden";
  next.textContent = t("next");

  check.addEventListener("click", () => {
    if (game.solved) return;
    const userAnswer = selected.map(word => word.text).join(" ");
    game.solved = true;

    if (userAnswer === exercise.sentence.trim()) {
      game.scores[playerIndex]++;
      result.textContent = t("correct");
      result.style.color = "green";
    } else {
      result.textContent = t("incorrect") + exercise.sentence;
      result.style.color = "#b9382b";
    }

    check.classList.add("hidden");
    next.classList.remove("hidden");
    renderScores();
  });

  next.addEventListener("click", () => {
    game.completed++;
    showNextExercise();
  });

  card.append(heading, category, answer, bank, check, next, result);
  area.appendChild(card);
  renderScores();
}

document.addEventListener("languageChanged", () => {
  fillCategorySelect();
  if (game) showNextExercise();
});

(async () => {
  data = await loadData();
  fillCategorySelect();
})();
