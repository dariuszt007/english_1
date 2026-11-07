const $ = id => document.getElementById(id);

const STORAGE_KEY = "sentence-builder-data";
const REFRESH_INTERVAL = 30_000;

let data = {
  categories: [],
  exercises: []
};

let game = null;
let gameActive = false;

function isValidData(value) {
  return Boolean(
    value &&
    Array.isArray(value.categories) &&
    Array.isArray(value.exercises) &&
    value.categories.every(category => typeof category === "string") &&
    value.exercises.every(exercise =>
      exercise &&
      typeof exercise.sentence === "string" &&
      typeof exercise.category === "string"
    )
  );
}

function getSavedData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (isValidData(saved)) {
      return saved;
    }
  } catch (error) {
    // Uszkodzony lub niedostępny zapis lokalny zostanie pominięty.
  }

  return null;
}

async function fetchLatestData() {
  const response = await fetch(`exercises.json?v=${Date.now()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać pliku exercises.json.");
  }

  const latestData = await response.json();

  if (!isValidData(latestData)) {
    throw new Error("Plik exercises.json ma nieprawidłowy format.");
  }

  return latestData;
}

async function loadData() {
  try {
    const latestData = await fetchLatestData();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(latestData));
    } catch (error) {
      // Aplikacja może działać bez zapisu lokalnego.
    }

    return latestData;
  } catch (error) {
    return getSavedData() || {
      categories: [],
      exercises: []
    };
  }
}

function fillCategorySelect() {
  const select = $("categoryFilter");

  if (!select) return;

  const previousValue = select.value;
  select.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allCategories");
  select.appendChild(allOption);

  data.categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.value = data.categories.includes(previousValue)
    ? previousValue
    : "all";
}

function shuffle(array) {
  const result = [...array];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] =
      [result[randomIndex], result[index]];
  }

  return result;
}

function renderScores() {
  const scoreArea = $("scoreArea");

  if (!scoreArea) return;

  scoreArea.innerHTML = "";

  if (!game) return;

  const heading = document.createElement("h2");
  heading.textContent = t("scores");
  scoreArea.appendChild(heading);

  game.players.forEach((player, index) => {
    const row = document.createElement("p");
    row.textContent = `${player}: ${game.scores[index]}`;
    scoreArea.appendChild(row);
  });
}

function finishGame() {
  const area = $("gameArea");

  if (!game || !area) return;

  gameActive = false;
  area.innerHTML = "";

  const highestScore = Math.max(...game.scores);
  const winners = game.players.filter(
    (_, index) => game.scores[index] === highestScore
  );

  const card = document.createElement("section");
  card.className = "panel";

  const heading = document.createElement("h2");
  heading.textContent = t("endGame");

  const winnerText = document.createElement("p");
  winnerText.textContent =
    (winners.length > 1 ? t("tie") : t("winner")) +
    winners.join(", ") +
    " — " +
    highestScore +
    (highestScore === 1 ? t("pointsOne") : t("pointsMany"));

  card.append(heading, winnerText);
  area.appendChild(card);

  fillCategorySelect();
  renderScores();

  // Po grze sprawdź, czy na GitHubie pojawił się już nowszy plik.
  refreshLatestData();
}

function showNextExercise() {
  if (!game) return;

  if (game.completed >= game.queue.length) {
    finishGame();
    return;
  }

  game.solved = false;

  const area = $("gameArea");
  const playerIndex = game.completed % game.players.length;
  const exercise = game.queue[game.completed];

  const correctWords = exercise.sentence
    .trim()
    .split(/\s+/)
    .map((text, id) => ({ text, id }));

  const selectedWords = [];

  area.innerHTML = "";

  const card = document.createElement("section");
  card.className = "exercise";

  const turnHeading = document.createElement("h2");
  turnHeading.textContent = t("nowPlaying") + game.players[playerIndex];

  const categoryLabel = document.createElement("p");
  categoryLabel.className = "muted";
  categoryLabel.textContent = exercise.category;

  const answerArea = document.createElement("div");
  answerArea.className = "sentence";

  const wordBank = document.createElement("div");

  const result = document.createElement("div");
  result.className = "result";

  function updateAnswer() {
    answerArea.innerHTML = "";

    selectedWords.forEach((word, index) => {
      const tile = document.createElement("span");
      tile.className = "word";
      tile.textContent = word.text;
      tile.title = t("undo");

      tile.addEventListener("click", () => {
        if (game.solved) return;

        const removedWord = selectedWords.splice(index, 1)[0];

        wordBank.querySelectorAll("[data-word-id]").forEach(bankWord => {
          if (Number(bankWord.dataset.wordId) === removedWord.id) {
            bankWord.classList.remove("hidden");
          }
        });

        updateAnswer();
      });

      answerArea.appendChild(tile);
    });
  }

  shuffle(correctWords).forEach(word => {
    const tile = document.createElement("span");
    tile.className = "word";
    tile.textContent = word.text;
    tile.dataset.wordId = word.id;

    tile.addEventListener("click", () => {
      if (game.solved) return;

      selectedWords.push(word);
      tile.classList.add("hidden");
      updateAnswer();
    });

    wordBank.appendChild(tile);
  });

  const checkButton = document.createElement("button");
  checkButton.type = "button";
  checkButton.textContent = t("check");

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "secondary hidden";
  nextButton.textContent = t("next");

  checkButton.addEventListener("click", () => {
    if (game.solved) return;

    const userAnswer = selectedWords
      .map(word => word.text)
      .join(" ");

    const correctAnswer = exercise.sentence.trim();
    game.solved = true;

    if (userAnswer === correctAnswer) {
      game.scores[playerIndex] += 1;
      result.textContent = t("correct");
      result.style.color = "green";
    } else {
      result.textContent = t("incorrect") + correctAnswer;
      result.style.color = "#b9382b";
    }

    checkButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
    renderScores();
  });

  nextButton.addEventListener("click", () => {
    game.completed += 1;
    showNextExercise();
  });

  card.append(
    turnHeading,
    categoryLabel,
    answerArea,
    wordBank,
    checkButton,
    nextButton,
    result
  );

  area.appendChild(card);
  renderScores();
}

function startGame() {
  const selectedCategory = $("categoryFilter").value;

  const availableExercises = data.exercises.filter(exercise =>
    selectedCategory === "all" ||
    exercise.category === selectedCategory
  );

  if (availableExercises.length === 0) {
    alert(t("noExercises"));
    return;
  }

  const playerCount = Math.max(
    1,
    parseInt($("playerCount").value, 10) || 1
  );

  const roundsPerPlayer = Math.max(
    1,
    parseInt($("rounds").value, 10) || 1
  );

  const enteredNames = $("playerNames").value
    .split(",")
    .map(name => name.trim())
    .filter(Boolean);

  const players = Array.from(
    { length: playerCount },
    (_, index) => enteredNames[index] || t("player") + (index + 1)
  );

  const totalTurns = playerCount * roundsPerPlayer;
  const queue = Array.from(
    { length: totalTurns },
    (_, index) => availableExercises[index % availableExercises.length]
  );

  game = {
    players,
    scores: players.map(() => 0),
    queue: shuffle(queue),
    completed: 0,
    solved: false
  };

  gameActive = true;
  showNextExercise();
}

async function refreshLatestData() {
  try {
    const latestData = await fetchLatestData();
    const latestJson = JSON.stringify(latestData);
    const currentJson = JSON.stringify(data);

    if (latestJson === currentJson) {
      return;
    }

    data = latestData;

    try {
      localStorage.setItem(STORAGE_KEY, latestJson);
    } catch (error) {
      // Brak zapisu lokalnego nie blokuje aktualizacji na stronie.
    }

    // Nie przerywaj gry. Kategorie odśwież po jej zakończeniu.
    if (!gameActive) {
      fillCategorySelect();
    }
  } catch (error) {
    // Przy chwilowym braku połączenia pozostaw aktualnie wczytany zestaw.
  }
}

$("startGame").addEventListener("click", startGame);

$("categoryFilter").addEventListener("change", () => {
  if (gameActive) {
    gameActive = false;
    game = null;
    $("gameArea").innerHTML = "";
    $("scoreArea").innerHTML = "";
  }
});

document.addEventListener("languageChanged", () => {
  fillCategorySelect();
  renderScores();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshLatestData();
  }
});

(async () => {
  data = await loadData();
  fillCategorySelect();

  window.setInterval(refreshLatestData, REFRESH_INTERVAL);
})();
