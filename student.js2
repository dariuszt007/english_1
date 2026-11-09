const $ = id => document.getElementById(id);

const STORAGE_KEY = "sentence-builder-data";
const REFRESH_INTERVAL = 30_000;

let data = {
  categories: [],
  exercises: []
};

let game = null;
let gameActive = false;

const speechTranslations = {
  pl: {
    voice: "Głos",
    female: "Kobiecy",
    male: "Męski",
    speed: "Prędkość wymowy",
    play: "Odtwórz wymowę",
    unavailable: "Ta przeglądarka nie obsługuje syntezy mowy.",
    noBritish: "Nie znaleziono brytyjskiego głosu angielskiego. Dodaj taki głos w ustawieniach urządzenia lub przeglądarki.",
    genderFallback: "Nie udało się rozpoznać płci głosu. Odtwarzam dostępny głos brytyjski.",
    playing: "Odtwarzam wymowę."
  },
  ja: {
    voice: "音声",
    female: "女性",
    male: "男性",
    speed: "読み上げ速度",
    play: "発音を再生",
    unavailable: "このブラウザーは音声合成に対応していません。",
    noBritish: "イギリス英語の音声が見つかりません。端末またはブラウザーの設定で追加してください。",
    genderFallback: "音声の性別を判定できません。利用可能なイギリス英語の音声を再生します。",
    playing: "発音を再生しています。"
  },
  en: {
    voice: "Voice",
    female: "Female",
    male: "Male",
    speed: "Speaking speed",
    play: "Play pronunciation",
    unavailable: "Speech synthesis is not supported by this browser.",
    noBritish: "No British English voice was found. Add one in your device or browser settings.",
    genderFallback: "Could not identify a voice matching that gender. Playing an available British voice.",
    playing: "Playing pronunciation."
  },
  fr: {
    voice: "Voix",
    female: "Féminine",
    male: "Masculine",
    speed: "Vitesse de prononciation",
    play: "Écouter la prononciation",
    unavailable: "La synthèse vocale n'est pas prise en charge par ce navigateur.",
    noBritish: "Aucune voix d'anglais britannique n'a été trouvée. Ajoutez-en une dans les réglages de l'appareil ou du navigateur.",
    genderFallback: "Impossible d'identifier une voix correspondant au genre choisi. Lecture d'une voix britannique disponible.",
    playing: "Lecture de la prononciation."
  },
  es: {
    voice: "Voz",
    female: "Femenina",
    male: "Masculina",
    speed: "Velocidad de pronunciación",
    play: "Reproducir pronunciación",
    unavailable: "Este navegador no admite síntesis de voz.",
    noBritish: "No se encontró una voz de inglés británico. Añádela en los ajustes del dispositivo o del navegador.",
    genderFallback: "No se pudo identificar una voz de ese género. Se reproducirá una voz británica disponible.",
    playing: "Reproduciendo la pronunciación."
  },
  de: {
    voice: "Stimme",
    female: "Weiblich",
    male: "Männlich",
    speed: "Sprechgeschwindigkeit",
    play: "Aussprache abspielen",
    unavailable: "Dieser Browser unterstützt keine Sprachausgabe.",
    noBritish: "Keine britische englische Stimme gefunden. Füge sie in den Geräte- oder Browsereinstellungen hinzu.",
    genderFallback: "Eine passende Stimme konnte nicht erkannt werden. Eine verfügbare britische Stimme wird abgespielt.",
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
    return isValidData(saved) ? saved : null;
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
      // Aplikacja działa również bez zapisu lokalnego.
    }

    return latestData;
  } catch (error) {
    return getSavedData() || { categories: [], exercises: [] };
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

  const voiceLabel = document.createElement("label");
  voiceLabel.textContent = speechText("voice");

  const voiceSelect = document.createElement("select");
  voiceSelect.setAttribute("aria-label", speechText("voice"));

  const femaleOption = document.createElement("option");
  femaleOption.value = "female";
  femaleOption.textContent = speechText("female");

  const maleOption = document.createElement("option");
  maleOption.value = "male";
  maleOption.textContent = speechText("male");

  voiceSelect.append(femaleOption, maleOption);
  voiceLabel.appendChild(voiceSelect);

  const speedLabel = document.createElement("label");
  speedLabel.textContent = speechText("speed");

  const speedRow = document.createElement("div");
  speedRow.className = "rate-row";

  const speedInput = document.createElement("input");
  speedInput.type = "range";
  speedInput.min = "0.6";
  speedInput.max = "1.2";
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
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      status.textContent = speechText("unavailable");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const britishVoices = voices.filter(voice =>
      /^en[-_]gb\b/i.test(voice.lang)
    );

    if (britishVoices.length === 0) {
      status.textContent = speechText("noBritish");
      return;
    }

    const gender = voiceSelect.value;

    const femaleNamePattern =
      /female|woman|susan|hazel|sonia|libby|kate|amy|serena|victoria|moira|tessa|fiona|olivia|ava|samantha/i;

    const maleNamePattern =
      /male|man|ryan|george|oliver|daniel|arthur|fred|alex|tom|james|lee/i;

    const genderPattern =
      gender === "female" ? femaleNamePattern : maleNamePattern;

    const matchingVoice = britishVoices.find(voice =>
      genderPattern.test(voice.name)
    );

    const selectedVoice = matchingVoice || britishVoices[0];

    if (!matchingVoice) {
      status.textContent = speechText("genderFallback");
    } else {
      status.textContent = speechText("playing");
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB";
    utterance.voice = selectedVoice;
    utterance.rate = Number(speedInput.value);

    window.speechSynthesis.speak(utterance);
  });

  panel.append(voiceLabel, speedLabel, playButton, status);
  container.appendChild(panel);
}

function finishGame() {
  const area = $("gameArea");

  gameActive = false;
  $("gameSettingsPanel").classList.remove("hidden");
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

    // Po sprawdzeniu odpowiedzi pokaż przycisk i ustawienia wymowy.
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
      // Działanie strony nie zależy od localStorage.
    }

    // Nie zmieniaj pytań w trakcie gry.
    if (!gameActive) {
      fillCategorySelect();
    }
  } catch (error) {
    // Przy braku połączenia pozostają obecnie wczytane dane.
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
