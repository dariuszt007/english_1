const $ = id => document.getElementById(id);
const STORAGE_KEY = "sentence-builder-data";

let data = {
  categories: [],
  categoryModes: {},
  exercises: []
};

const adminText = {
  pl: {
    modeTitle: "Kolejność zdań dla tej kategorii",
    chooseCategory: "Wybierz konkretną kategorię, aby ustawić jej kolejność.",
    ordered: "Według kolejności ustawionej poniżej",
    random: "Losowo przy każdej grze",
    dragHelp: "Przeciągnij uchwyt, aby zmienić kolejność. Możesz też użyć przycisków ↑ i ↓.",
    dragHandle: "Przeciągnij, aby zmienić kolejność",
    moveUp: "Przenieś zdanie w górę",
    moveDown: "Przenieś zdanie w dół",
    orderSaved: "Kolejność zapisana. Pobierz JSON, aby opublikować zmiany.",
    jsonLoaded: "Wczytano JSON z serwera.",
    jsonError: "Nie udało się wczytać JSON z serwera. Użyto kopii lokalnej.",
    jsonMissing: "Nie znaleziono poprawnego pliku exercises.json ani kopii lokalnej.",
    dragNeedsCategory: "Aby zmieniać kolejność, wybierz jedną kategorię i wyczyść wyszukiwanie."
  },
  ja: {
    modeTitle: "このカテゴリーの文の順序",
    chooseCategory: "順序を設定するにはカテゴリーを選択してください。",
    ordered: "下の順序どおり",
    random: "ゲームごとにランダム",
    dragHelp: "ハンドルをドラッグして順序を変更します。↑と↓ボタンも使えます。",
    dragHandle: "ドラッグして順序を変更",
    moveUp: "文を上に移動",
    moveDown: "文を下に移動",
    orderSaved: "順序を保存しました。変更を公開するにはJSONをダウンロードしてください。",
    jsonLoaded: "サーバーのJSONを読み込みました。",
    jsonError: "サーバーのJSONを読み込めません。ローカルの保存データを使用しました。",
    jsonMissing: "有効なexercises.jsonもローカル保存データも見つかりません。",
    dragNeedsCategory: "順序を変更するには、カテゴリーを1つ選択し、検索語を消してください。"
  },
  en: {
    modeTitle: "Sentence order for this category",
    chooseCategory: "Select a specific category to set its order.",
    ordered: "Use the order shown below",
    random: "Random for each game",
    dragHelp: "Drag the handle to reorder. You can also use the ↑ and ↓ buttons.",
    dragHandle: "Drag to change order",
    moveUp: "Move sentence up",
    moveDown: "Move sentence down",
    orderSaved: "Order saved. Download the JSON file to publish your changes.",
    jsonLoaded: "Loaded JSON from the server.",
    jsonError: "Could not load server JSON. Using the local backup.",
    jsonMissing: "No valid exercises.json or local backup was found.",
    dragNeedsCategory: "To reorder, select one category and clear the search field."
  },
  fr: {
    modeTitle: "Ordre des phrases pour cette catégorie",
    chooseCategory: "Choisissez une catégorie précise pour définir son ordre.",
    ordered: "Dans l'ordre affiché ci-dessous",
    random: "Aléatoire à chaque partie",
    dragHelp: "Faites glisser la poignée pour réorganiser. Vous pouvez aussi utiliser les boutons ↑ et ↓.",
    dragHandle: "Faire glisser pour réorganiser",
    moveUp: "Déplacer la phrase vers le haut",
    moveDown: "Déplacer la phrase vers le bas",
    orderSaved: "Ordre enregistré. Téléchargez le JSON pour publier vos modifications.",
    jsonLoaded: "JSON du serveur chargé.",
    jsonError: "Impossible de charger le JSON du serveur. La sauvegarde locale est utilisée.",
    jsonMissing: "Aucun fichier exercises.json valide ni aucune sauvegarde locale n'a été trouvé.",
    dragNeedsCategory: "Pour réorganiser, choisissez une catégorie et videz le champ de recherche."
  },
  es: {
    modeTitle: "Orden de las frases para esta categoría",
    chooseCategory: "Selecciona una categoría concreta para configurar su orden.",
    ordered: "En el orden mostrado abajo",
    random: "Aleatorio en cada partida",
    dragHelp: "Arrastra el control para cambiar el orden. También puedes usar los botones ↑ y ↓.",
    dragHandle: "Arrastrar para cambiar el orden",
    moveUp: "Mover la frase hacia arriba",
    moveDown: "Mover la frase hacia abajo",
    orderSaved: "Orden guardado. Descarga el JSON para publicar los cambios.",
    jsonLoaded: "JSON del servidor cargado.",
    jsonError: "No se pudo cargar el JSON del servidor. Se usa la copia local.",
    jsonMissing: "No se encontró un exercises.json válido ni una copia local.",
    dragNeedsCategory: "Para cambiar el orden, selecciona una categoría y borra la búsqueda."
  },
  de: {
    modeTitle: "Satzreihenfolge für diese Kategorie",
    chooseCategory: "Wähle eine bestimmte Kategorie, um ihre Reihenfolge festzulegen.",
    ordered: "In der unten gezeigten Reihenfolge",
    random: "Bei jedem Spiel zufällig",
    dragHelp: "Ziehe den Griff, um die Reihenfolge zu ändern. Du kannst auch die ↑- und ↓-Schaltflächen verwenden.",
    dragHandle: "Ziehen, um die Reihenfolge zu ändern",
    moveUp: "Satz nach oben verschieben",
    moveDown: "Satz nach unten verschieben",
    orderSaved: "Reihenfolge gespeichert. Lade die JSON-Datei herunter, um Änderungen zu veröffentlichen.",
    jsonLoaded: "JSON vom Server geladen.",
    jsonError: "Server-JSON konnte nicht geladen werden. Die lokale Sicherung wird verwendet.",
    jsonMissing: "Keine gültige exercises.json oder lokale Sicherung gefunden.",
    dragNeedsCategory: "Wähle zum Sortieren eine Kategorie aus und leere das Suchfeld."
  }
};

function uiText(key) {
  const language = (document.documentElement.lang || "pl")
    .toLowerCase()
    .split("-")[0];

  return adminText[language]?.[key] ?? adminText.pl[key] ?? key;
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
    throw new Error(t("jsonError"));
  }

  const categoryModes = {};

  value.categories.forEach(category => {
    categoryModes[category] =
      value.categoryModes?.[category] === "random"
        ? "random"
        : "ordered";
  });

  return {
    ...value,
    categories: [...value.categories],
    categoryModes,
    exercises: value.exercises.map(exercise => ({ ...exercise }))
  };
}

function saveLocalData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Edycja i eksport nadal działają, jeśli localStorage jest niedostępny.
  }
}

function saveAndRender() {
  saveLocalData();
  renderAll();
}

function fillSelects() {
  const exerciseSelect = $("categorySelect");
  const filter = $("adminCategoryFilter");
  const previousExerciseCategory = exerciseSelect.value;
  const previousFilter = filter.value;

  exerciseSelect.innerHTML = "";
  filter.innerHTML = "";

  if (!data.categories.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("emptyCategory");
    exerciseSelect.appendChild(option);
  }

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allCategories");
  filter.appendChild(allOption);

  data.categories.forEach(category => {
    const exerciseOption = document.createElement("option");
    exerciseOption.value = category;
    exerciseOption.textContent = category;
    exerciseSelect.appendChild(exerciseOption);

    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = category;
    filter.appendChild(filterOption);
  });

  if (data.categories.includes(previousExerciseCategory)) {
    exerciseSelect.value = previousExerciseCategory;
  }

  filter.value =
    previousFilter === "all" || data.categories.includes(previousFilter)
      ? previousFilter
      : "all";
}

function renderCategorySettings() {
  const box = $("categoryOrderSettings");
  const category = $("adminCategoryFilter").value;

  box.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = uiText("modeTitle");
  box.appendChild(heading);

  if (category === "all" || !data.categories.includes(category)) {
    const message = document.createElement("p");
    message.className = "muted";
    message.textContent = uiText("chooseCategory");
    box.appendChild(message);
    return;
  }

  const modeSelect = document.createElement("select");
  modeSelect.setAttribute("aria-label", uiText("modeTitle"));

  const orderedOption = document.createElement("option");
  orderedOption.value = "ordered";
  orderedOption.textContent = uiText("ordered");

  const randomOption = document.createElement("option");
  randomOption.value = "random";
  randomOption.textContent = uiText("random");

  modeSelect.append(orderedOption, randomOption);
  modeSelect.value = data.categoryModes[category] || "ordered";

  modeSelect.addEventListener("change", () => {
    data.categoryModes[category] = modeSelect.value;
    saveAndRender();
  });

  const help = document.createElement("p");
  help.className = "muted";
  help.textContent = uiText("dragHelp");

  box.append(modeSelect, help);
}

function showOrderSavedStatus() {
  const status = $("loadStatus");
  status.textContent = uiText("orderSaved");
}

function getCategoryIndexes(category) {
  return data.exercises
    .map((exercise, index) =>
      exercise.category === category ? index : -1
    )
    .filter(index => index !== -1);
}

function moveExerciseWithinCategory(index, direction) {
  const exercise = data.exercises[index];
  if (!exercise) return;

  const categoryIndexes = getCategoryIndexes(exercise.category);
  const position = categoryIndexes.indexOf(index);
  const targetPosition = position + direction;

  if (
    position === -1 ||
    targetPosition < 0 ||
    targetPosition >= categoryIndexes.length
  ) {
    return;
  }

  const currentIndex = categoryIndexes[position];
  const targetIndex = categoryIndexes[targetPosition];

  [
    data.exercises[currentIndex],
    data.exercises[targetIndex]
  ] = [
    data.exercises[targetIndex],
    data.exercises[currentIndex]
  ];

  saveAndRender();
  showOrderSavedStatus();
}

function reorderCategoryFromDom(category, list) {
  const categoryIndexes = getCategoryIndexes(category);

  const reorderedIndexes = [...list.querySelectorAll(".admin-item")]
    .map(item => Number(item.dataset.index));

  if (
    reorderedIndexes.length !== categoryIndexes.length ||
    reorderedIndexes.some(index => !Number.isInteger(index))
  ) {
    renderAll();
    return;
  }

  const reorderedExercises = reorderedIndexes.map(
    index => data.exercises[index]
  );

  categoryIndexes.forEach((targetIndex, position) => {
    data.exercises[targetIndex] = reorderedExercises[position];
  });

  saveAndRender();
  showOrderSavedStatus();
}

function enablePointerReorder(handle, item, list, category) {
  let dragging = false;
  let moved = false;

  function onPointerMove(event) {
    if (!dragging) return;

    event.preventDefault();

    const target = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    const targetItem = target?.closest(".admin-item");

    if (
      !targetItem ||
      targetItem === item ||
      targetItem.parentElement !== list
    ) {
      return;
    }

    const targetRect = targetItem.getBoundingClientRect();
    const insertBefore = event.clientY < targetRect.top + targetRect.height / 2;

    if (insertBefore) {
      if (item.nextElementSibling !== targetItem) {
        list.insertBefore(item, targetItem);
        moved = true;
      }
    } else if (targetItem.nextElementSibling !== item) {
      list.insertBefore(item, targetItem.nextElementSibling);
      moved = true;
    }
  }

  function finishDrag() {
    if (!dragging) return;

    dragging = false;
    item.classList.remove("is-dragging");
    document.body.classList.remove("is-reordering");

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", finishDrag);
    document.removeEventListener("pointercancel", finishDrag);

    if (moved) {
      reorderCategoryFromDom(category, list);
    }
  }

  handle.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) return;

    event.preventDefault();
    dragging = true;
    moved = false;

    item.classList.add("is-dragging");
    document.body.classList.add("is-reordering");

    document.addEventListener("pointermove", onPointerMove, {
      passive: false
    });
    document.addEventListener("pointerup", finishDrag);
    document.addEventListener("pointercancel", finishDrag);
  });
}

function renderExercises() {
  const box = $("adminExercises");
  const category = $("adminCategoryFilter").value;
  const query = $("adminSearchInput").value.trim().toLowerCase();

  const canReorder =
    category !== "all" &&
    data.categories.includes(category) &&
    query.length === 0;

  const results = data.exercises
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ exercise }) =>
      (category === "all" || exercise.category === category) &&
      exercise.sentence.toLowerCase().includes(query)
    );

  $("adminResultCount").textContent = t("found") + results.length;
  box.innerHTML = "";

  if (
    category !== "all" &&
    query.length > 0 &&
    data.categories.includes(category)
  ) {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = uiText("dragNeedsCategory");
    box.appendChild(note);
  }

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = t("noResults");
    box.appendChild(empty);
    return;
  }

  results.forEach(({ exercise, index }) => {
    const item = document.createElement("div");
    item.className = "admin-item";
    item.dataset.index = String(index);

    if (canReorder) {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "drag-handle";
      handle.textContent = "☰";
      handle.setAttribute("aria-label", uiText("dragHandle"));
      handle.title = uiText("dragHandle");

      enablePointerReorder(handle, item, box, category);
      item.appendChild(handle);
    }

    const sentence = document.createElement("textarea");
    sentence.value = exercise.sentence;
    sentence.setAttribute("aria-label", t("editSentence"));

    const categorySelect = document.createElement("select");
    categorySelect.setAttribute("aria-label", t("chooseCategory"));

    data.categories.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      categorySelect.appendChild(option);
    });

    categorySelect.value = exercise.category;

    const actions = document.createElement("div");
    actions.className = "admin-actions";

    if (canReorder) {
      const moveUp = document.createElement("button");
      moveUp.type = "button";
      moveUp.className = "move-button";
      moveUp.textContent = "↑";
      moveUp.setAttribute("aria-label", uiText("moveUp"));
      moveUp.title = uiText("moveUp");
      moveUp.disabled = getCategoryIndexes(category)[0] === index;
      moveUp.addEventListener("click", () => {
        moveExerciseWithinCategory(index, -1);
      });

      const categoryIndexes = getCategoryIndexes(category);
      const moveDown = document.createElement("button");
      moveDown.type = "button";
      moveDown.className = "move-button";
      moveDown.textContent = "↓";
      moveDown.setAttribute("aria-label", uiText("moveDown"));
      moveDown.title = uiText("moveDown");
      moveDown.disabled =
        categoryIndexes[categoryIndexes.length - 1] === index;
      moveDown.addEventListener("click", () => {
        moveExerciseWithinCategory(index, 1);
      });

      actions.append(moveUp, moveDown);
    }

    const save = document.createElement("button");
    save.type = "button";
    save.textContent = t("saveChanges");

    save.addEventListener("click", () => {
      const text = sentence.value.trim();

      if (!text || !categorySelect.value) {
        alert(t("enterSentenceCategory"));
        return;
      }

      data.exercises[index] = {
        ...data.exercises[index],
        sentence: text,
        category: categorySelect.value
      };

      if (!data.categoryModes[categorySelect.value]) {
        data.categoryModes[categorySelect.value] = "ordered";
      }

      saveAndRender();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = t("delete");

    remove.addEventListener("click", () => {
      data.exercises.splice(index, 1);
      saveAndRender();
    });

    actions.append(save, remove);
    item.append(sentence, categorySelect, actions);
    box.appendChild(item);
  });
}

function renderAll() {
  fillSelects();
  renderCategorySettings();
  renderExercises();
  $("jsonOutput").value = JSON.stringify(data, null, 2);
}

$("exerciseForm").addEventListener("submit", event => {
  event.preventDefault();

  const sentence = $("sentenceInput").value.trim();
  const category = $("categorySelect").value;

  if (!sentence || !category) {
    alert(t("enterSentenceCategory"));
    return;
  }

  data.exercises.push({ sentence, category });
  data.categoryModes[category] ||= "ordered";
  $("sentenceInput").value = "";

  saveAndRender();
});

$("categoryForm").addEventListener("submit", event => {
  event.preventDefault();

  const category = $("newCategory").value.trim();
  if (!category) return;

  if (
    data.categories.some(item =>
      item.toLowerCase() === category.toLowerCase()
    )
  ) {
    alert(t("categoryExists"));
    return;
  }

  data.categories.push(category);
  data.categoryModes[category] = "ordered";
  $("newCategory").value = "";

  saveAndRender();
  $("categorySelect").value = category;
});

$("adminCategoryFilter").addEventListener("change", renderAll);
$("adminSearchInput").addEventListener("input", renderExercises);

$("jsonFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    data = normalizeData(JSON.parse(await file.text()));
    saveLocalData();
    $("loadStatus").textContent = t("loadedFile");
    renderAll();
  } catch (error) {
    $("loadStatus").textContent = error.message || t("jsonError");
  }
});

$("downloadJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "exercises.json";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("copyJson").addEventListener("click", async () => {
  const json = JSON.stringify(data, null, 2);
  $("jsonOutput").value = json;

  try {
    await navigator.clipboard.writeText(json);
    $("copyStatus").textContent = t("copied");
  } catch (error) {
    $("jsonOutput").focus();
    $("jsonOutput").select();

    $("copyStatus").textContent =
      document.execCommand("copy")
        ? t("copied")
        : t("copyManual");
  }
});

document.addEventListener("languageChanged", renderAll);

(async () => {
  try {
    const response = await fetch(`exercises.json?v=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Server JSON unavailable");
    }

    data = normalizeData(await response.json());
    saveLocalData();
    $("loadStatus").textContent = uiText("jsonLoaded");
  } catch (error) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      data = normalizeData(saved);
      $("loadStatus").textContent = uiText("jsonError");
    } catch (localError) {
      data = {
        categories: [],
        categoryModes: {},
        exercises: []
      };
      $("loadStatus").textContent = uiText("jsonMissing");
    }
  }

  renderAll();
})();
