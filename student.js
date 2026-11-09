const $ = id => document.getElementById(id);

const STORAGE_KEY = "sentence-builder-data";
const REFRESH_INTERVAL = 30_000;

let data = {
  categories: [],
  categoryModes: {},
  exercises: []
};

let game = null;
let gameActive = false;

const speechTranslations = {
  pl: {
    voice: "Głos",
    male: "Męski, brytyjski",
    speed: "Prędkość wymowy",
    play: "Odtwórz wymowę",
    unavailable: "Ta przeglądarka nie obsługuje syntezy mowy.",
    noBritishVoice: "Nie znaleziono męskiego głosu brytyjskiego. Sprawdź głosy dostępne w ustawieniach urządzenia lub przeglądarki.",
    playing: "Odtwarzam wymowę."
  },
  ja: {
    voice: "音声",
    male: "男性・イギリス英語",
    speed: "読み上げ速度",
    play: "発音を再生",
    unavailable: "このブラウザーは音声合成に対応していません。",
    noBritishVoice: "イギリス英語の男性音声が見つかりません。端末またはブラウザーの設定を確認してください。",
    playing: "発音を再生しています。"
  },
  en: {
    voice: "Voice",
    male: "Male, British",
    speed: "Speaking speed",
    play: "Play pronunciation",
    unavailable: "Speech synthesis is not supported by this browser.",
    noBritishVoice: "No British English male voice was found. Check your device or browser settings.",
    playing: "Playing pronunciation."
  },
  fr: {
    voice: "Voix",
    male: "Masculine, britannique",
    speed: "Vitesse de prononciation",
    play: "Écouter la prononciation",
    unavailable: "La synthèse vocale n'est pas prise en charge par ce navigateur.",
    noBritishVoice: "Aucune voix masculine d'anglais britannique n'a été trouvée.",
    playing: "Lecture de la prononciation."
  },
  es: {
    voice: "Voz",
    male: "Masculina, británica",
    speed: "Velocidad de pronunciación",
    play: "Reproducir pronunciación",
    unavailable: "Este navegador no admite síntesis de voz.",
    noBritishVoice: "No se encontró una voz masculina de inglés británico.",
    playing: "Reproduciendo la pronunciación."
  },
  de: {
    voice: "Stimme",
    male: "Männlich, britisch",
    speed: "Sprechgeschwindigkeit",
    play: "Aussprache abspielen",
    unavailable: "Dieser Browser unterstützt keine Sprachausgabe.",
    noBritishVoice: "Keine britisch-englische Männerstimme gefunden.",
    playing: "Aussprache wird abgespielt."
  }
};

function speechText(key) {
  const language = (document.documentElement.lang || "pl")
    .toLowerCase()
    .split("-")[0];

  return speechTranslations[language]?.[key] ??
    speechTranslations.pl[key] ??
    key;
}

function normalizeData(value) {
  if (
    !value ||
    !Array.isArray(value.categories) ||
    !Array.isArray(value.exercises) ||
    !value.categories.every(category => typeof category === "string") ||
    !value.exercises.every(exercise =>
      exercise &&
      typeof exercise.sentence === "string" &&
      typeof exercise.category === "string"
    )
  ) {
    throw new Error("Nieprawidłowy format exercises.json.");
  }

  const categoryModes = {};

  value.categories.forEach(category => {
    categoryModes[category] =
      value.categoryModes?.[category] === "random" ? "random" : "ordered";
  });

  return {
    ...value,
    categories: [...value.categories],
    categoryModes,
    exercises: value.exercises.map(exercise => ({
      ...exercise,
      sentence: exercise.sentence,
      category: exercise.category
    }))
  };
}

function getSavedData() {
  try {
    return normalizeData(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch (error) {
    return null;
  }
}

async function fetchLatestData() {
  const response = await fetch(`exercises.json?v=${Date.now()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać exercises.json.");
  }

  return normalizeData(await response.json());
}

async function loadData() {
  try {
    const latestData = await fetchLatestData();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(latestData));
    } catch (error) {
      // Aplikacja działa również bez zapisu lokalnego.
    }

    return latestData;
  } catch (error) {
    return getSavedData() || {
      categories: [],
      categoryModes: {},
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

function buildGameQueue(availableExercises, totalTurns) {
  const selectedCategory = $("categoryFilter").value;

  const categories = selectedCategory === "all"
    ? data.categories
    : [selectedCategory];

  const categoryPools = categories
    .map(category => {
      const categoryExercises = availableExercises.filter(
        exercise => exercise.category === category
      );

      if (!categoryExercises.length) return [];

      return data.categoryModes?.[category] === "random"
        ? shuffle(categoryExercises)
        : categoryExercises;
    })
    .filter(pool => pool.length > 0);

  // Łączy kategorie naprzemiennie, zachowując kolejność lub tasowanie
  // ustawione osobno dla każdej kategorii.
  const sequence = [];
  const maxLength = Math.max(...categoryPools.map(pool => pool.length));

  for (let index = 0; index < maxLength; index++) {
    categoryPools.forEach(pool => {
      if (pool[index]) sequence.push(pool[index]);
    });
  }

  if (!sequence.length) return [];

  return Array.from(
    { length: totalTurns },
    (_, index) => sequence[index % sequence.length]
  );
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

function showPronunciationControls(sentence, container) {
  const panel = document.createElement("div");
  panel.className = "pronunciation-controls";

  const voiceInfo = document.createElement("p");
  voiceInfo.textContent = `${speechText("voice")}: ${speechText("male")}`;

  const speedLabel = document.createElement("label");
  speedLabel.textContent = speechText("speed");

  const speedRow = document.createElement("div");
  speedRow.className = "rate-row";

  const speedInput = document.createElement("input");
  speedInput.type = "range";
  speedInput.min = "0.1";
  speedInput.max = "1.5";
  speedInput.step = "0.1";
  speedInput.value = "0.8";
  speedInput.setAttribute("aria-label", speechText("speed"));

  const speedValue = document.createElement("span");
  speedValue.textContent = `${Number(speedInput.value).toFixed(1)}×`;

  speedInput.addEventListener("input", () => {
    speedValue.textContent = `${Number(speedInput.value).toFixed(1)}×`;
  });

  speedRow.append(speedInput, speedValue);
  speedLabel.appendChild(speedRow);

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.textContent = speechText("play");

  const status = document.createElement("p");
  status.className = "muted speech-status";
  status.setAttribute("aria-live", "polite");

  playButton.addEventListener("click", () => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      status.textContent = speechText("unavailable");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const britishVoices = voices.filter(voice =>
      /^en[-_]gb\b/i.test(voice.lang)
    );

    const maleNamePattern =
      /\b(male|man|ryan|george|oliver|daniel|arthur|fred|alex|tom|james|lee)\b/i;

    const maleBritishVoice = britishVoices.find(voice =>
      maleNamePattern.test(voice.name)
    );

    if (!maleBritishVoice) {
      status.textContent = speechText("noBritishVoice");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB";
    utterance.voice = maleBritishVoice;
    utterance.rate = Number(speedInput.value);

    status.textContent = speechText("playing");
    window.speechSynthesis.speak(utterance);
  });

  panel.append(voiceInfo, speedLabel, playButton, status);
  container.appendChild(panel);
}

function finishGame() {
  const area = $("gameArea");
  const settingsPanel = $("gameSettingsPanel");

  gameActive = false;

  if (settingsPanel) {
    settingsPanel.classList.remove("hidden");
  }

  area.innerHTML = "";

  const highestScore = Math.max(...game.scores);
  const winners = game.players.filter(
    (_, index) => game.scores[index] === highestScore
  );

  const resultCard = document.createElement("section");
  resultCard.className = "panel";

  const heading = document.createElement("h2");
  heading.textContent = t("endGame");

  const winnerText = document.createElement("p");
  winnerText.textContent =
    (winners.length > 1 ? t("tie") : t("winner")) +
    winners.join(", ") +
    " — " +
    highestScore +
    (highestScore === 1 ? t("pointsOne") : t("pointsMany"));

  resultCard.append(heading, winnerText);
  area.appendChild(resultCard);

  fillCategorySelect();
  renderScores();
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
  wordBank.className = "word-bank";

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

  // Kafelki są tasowane za każdym razem, gdy wyświetlane jest nowe zdanie.
  shuffle(correctWords).forEach(word => {
    const tile = document.createElement("button");
    tile.type = "button";
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

    const userAnswer = selectedWords.map(word => word.text).join(" ");
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

    showPronunciationControls(correctAnswer, card);
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

  if (!availableExercises.length) {
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
  const queue = buildGameQueue(availableExercises, totalTurns);

  if (!queue.length) {
    alert(t("noExercises"));
    return;
  }

  game = {
    players,
    scores: players.map(() => 0),
    queue,
    completed: 0,
    solved: false
  };

  gameActive = true;
  $("gameSettingsPanel").classList.add("hidden");
  $("gameArea").innerHTML = "";
  $("scoreArea").innerHTML = "";

  showNextExercise();
}

async function refreshLatestData() {
  try {
    const latestData = await fetchLatestData();

    if (JSON.stringify(latestData) === JSON.stringify(data)) {
      return;
    }

    data = latestData;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Strona nadal działa bez zapisu lokalnego.
    }

    if (!gameActive) {
      fillCategorySelect();
    }
  } catch (error) {
    // W razie braku sieci zostają aktualnie wczytane dane.
  }
}

$("startGame").addEventListener("click", startGame);

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
