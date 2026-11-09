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
    jsonMissing: "Nie znaleziono poprawnego pliku exercises.json ani kopii lokalnej."
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
    jsonMissing: "有効なexercises.jsonもローカル保存データも見つかりません。"
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
    jsonMissing: "No valid exercises.json or local backup was found."
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
    orderSaved: "Ordre enregistré. Téléchargez le JSON pour publier les modifications.",
    jsonLoaded: "JSON du serveur chargé.",
    jsonError: "Impossible de charger le JSON du serveur. La sauvegarde locale est utilisée.",
    jsonMissing: "Aucun fichier exercises.json valide ni aucune sauvegarde locale n'a été trouvé."
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
    jsonMissing: "No se encontró un exercises.json válido ni una copia local."
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
    jsonMissing: "Keine gültige exercises.json oder lokale Sicherung gefunden."
  }
};

const excelTranslations = {
  pl: {
    title: "Import i eksport Excel",
    fileLabel: "Wybierz plik Excel do importu (.xlsx lub .xls)",
    importButton: "Importuj dane z Excela",
    exportButton: "Eksportuj do Excela",
    chooseFile: "Najpierw wybierz plik Excel.",
    libraryError: "Nie udało się załadować biblioteki Excel. Sprawdź połączenie z internetem i odśwież stronę.",
    importDone: count => `Zaimportowano ${count} zdań z pliku Excel. Import zastąpił poprzednie dane.`,
    importCanceled: "Import anulowany.",
    exportDone: "Wyeksportowano plik sentence-builder.xlsx.",
    importError: "Nie udało się zaimportować pliku Excel.",
    exportError: "Nie udało się wyeksportować pliku Excel.",
    missingSheet: 'Nie znaleziono arkusza "Sentences", "Zdania" ani "Exercises".',
    emptySheet: "Arkusz zdań musi zawierać nagłówki i przynajmniej jeden wiersz.",
    missingColumns: 'Arkusz zdań musi mieć kolumny "Sentence" i "Category" lub ich polskie odpowiedniki.',
    noSentences: "W arkuszu nie znaleziono poprawnych zdań.",
    confirmImport: count => `Import zastąpi obecne dane. Liczba zdań w pliku: ${count}. Kontynuować?`
  },
  en: {
    title: "Excel import and export",
    fileLabel: "Choose an Excel file to import (.xlsx or .xls)",
    importButton: "Import from Excel",
    exportButton: "Export to Excel",
    chooseFile: "Please choose an Excel file first.",
    libraryError: "Could not load the Excel library. Check your internet connection and refresh the page.",
    importDone: count => `Imported ${count} sentences. The import replaced the previous data.`,
    importCanceled: "Import canceled.",
    exportDone: "Exported sentence-builder.xlsx.",
    importError: "Could not import the Excel file.",
    exportError: "Could not export the Excel file.",
    missingSheet: 'Could not find the "Sentences", "Zdania", or "Exercises" sheet.',
    emptySheet: "The sentences sheet must contain a header row and at least one sentence.",
    missingColumns: 'The sentences sheet must have "Sentence" and "Category" columns, or their Polish equivalents.',
    noSentences: "No valid sentences were found in the sheet.",
    confirmImport: count => `Importing will replace the current data. Sentences in the file: ${count}. Continue?`
  },
  ja: {
    title: "Excelのインポートとエクスポート",
    fileLabel: "インポートするExcelファイルを選択 (.xlsx または .xls)",
    importButton: "Excelからインポート",
    exportButton: "Excelにエクスポート",
    chooseFile: "先にExcelファイルを選択してください。",
    libraryError: "Excelライブラリを読み込めません。通信を確認してページを再読み込みしてください。",
    importDone: count => `${count}件の文をインポートしました。以前のデータは置き換えられました。`,
    importCanceled: "インポートをキャンセルしました。",
    exportDone: "sentence-builder.xlsx をエクスポートしました。",
    importError: "Excelファイルをインポートできませんでした。",
    exportError: "Excelファイルをエクスポートできませんでした。",
    missingSheet: '"Sentences"、"Zdania"、または "Exercises" シートが見つかりません。',
    emptySheet: "文のシートには見出しと少なくとも1件の文が必要です。",
    missingColumns: '"Sentence" と "Category" の列、またはポーランド語の同等の列が必要です。',
    noSentences: "有効な文が見つかりませんでした。",
    confirmImport: count => `インポートすると現在のデータが置き換えられます。ファイル内の文: ${count}件。続行しますか？`
  },
  fr: {
    title: "Import et export Excel",
    fileLabel: "Choisir un fichier Excel à importer (.xlsx ou .xls)",
    importButton: "Importer depuis Excel",
    exportButton: "Exporter vers Excel",
    chooseFile: "Veuillez d'abord choisir un fichier Excel.",
    libraryError: "Impossible de charger la bibliothèque Excel. Vérifiez la connexion puis actualisez la page.",
    importDone: count => `${count} phrases importées. L'import a remplacé les données précédentes.`,
    importCanceled: "Importation annulée.",
    exportDone: "Fichier sentence-builder.xlsx exporté.",
    importError: "Impossible d'importer le fichier Excel.",
    exportError: "Impossible d'exporter le fichier Excel.",
    missingSheet: 'Feuille "Sentences", "Zdania" ou "Exercises" introuvable.',
    emptySheet: "La feuille des phrases doit contenir une ligne d'en-tête et au moins une phrase.",
    missingColumns: 'La feuille doit contenir les colonnes "Sentence" et "Category", ou leurs équivalents polonais.',
    noSentences: "Aucune phrase valide n'a été trouvée.",
    confirmImport: count => `L'import remplacera les données actuelles. Phrases dans le fichier : ${count}. Continuer ?`
  },
  es: {
    title: "Importar y exportar Excel",
    fileLabel: "Selecciona un archivo Excel para importar (.xlsx o .xls)",
    importButton: "Importar desde Excel",
    exportButton: "Exportar a Excel",
    chooseFile: "Selecciona primero un archivo Excel.",
    libraryError: "No se pudo cargar la biblioteca de Excel. Comprueba la conexión y actualiza la página.",
    importDone: count => `Se importaron ${count} frases. La importación reemplazó los datos anteriores.`,
    importCanceled: "Importación cancelada.",
    exportDone: "Se exportó sentence-builder.xlsx.",
    importError: "No se pudo importar el archivo Excel.",
    exportError: "No se pudo exportar el archivo Excel.",
    missingSheet: 'No se encontró la hoja "Sentences", "Zdania" o "Exercises".',
    emptySheet: "La hoja de frases debe tener encabezados y al menos una frase.",
    missingColumns: 'La hoja debe incluir las columnas "Sentence" y "Category", o sus equivalentes en polaco.',
    noSentences: "No se encontraron frases válidas en la hoja.",
    confirmImport: count => `La importación reemplazará los datos actuales. Frases en el archivo: ${count}. ¿Continuar?`
  },
  de: {
    title: "Excel-Import und -Export",
    fileLabel: "Excel-Datei zum Import auswählen (.xlsx oder .xls)",
    importButton: "Aus Excel importieren",
    exportButton: "Nach Excel exportieren",
    chooseFile: "Bitte wähle zuerst eine Excel-Datei aus.",
    libraryError: "Die Excel-Bibliothek konnte nicht geladen werden. Prüfe die Internetverbindung und lade die Seite neu.",
    importDone: count => `${count} Sätze importiert. Der Import hat die bisherigen Daten ersetzt.`,
    importCanceled: "Import abgebrochen.",
    exportDone: "sentence-builder.xlsx wurde exportiert.",
    importError: "Die Excel-Datei konnte nicht importiert werden.",
    exportError: "Die Excel-Datei konnte nicht exportiert werden.",
    missingSheet: 'Das Tabellenblatt "Sentences", "Zdania" oder "Exercises" wurde nicht gefunden.',
    emptySheet: "Das Satz-Tabellenblatt benötigt eine Kopfzeile und mindestens einen Satz.",
    missingColumns: 'Das Tabellenblatt benötigt die Spalten "Sentence" und "Category" oder die polnischen Entsprechungen.',
    noSentences: "Es wurden keine gültigen Sätze gefunden.",
    confirmImport: count => `Der Import ersetzt die aktuellen Daten. Sätze in der Datei: ${count}. Fortfahren?`
  }
};

function currentLanguage() {
  const language = (document.documentElement.lang || "pl")
    .toLowerCase()
    .split("-")[0];

  return adminText[language] ? language : "pl";
}

function uiText(key) {
  return adminText[currentLanguage()]?.[key] ?? adminText.pl[key] ?? key;
}

function excelText(key, ...args) {
  const language = currentLanguage();
  const value = excelTranslations[language]?.[key] ??
    excelTranslations.pl[key];

  return typeof value === "function" ? value(...args) : value;
}

function updateExcelLanguage() {
  $("excelTitle").textContent = excelText("title");
  $("excelFileLabel").textContent = excelText("fileLabel");
  $("importExcel").textContent = excelText("importButton");
  $("exportExcel").textContent = excelText("exportButton");
}

function appText(key, fallback) {
  return typeof t === "function" ? t(key) : fallback;
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
    throw new Error("Nieprawidłowy format danych.");
  }

  const categories = [...value.categories];
  const exercises = value.exercises
    .map(exercise => ({
      ...exercise,
      sentence: exercise.sentence.trim(),
      category: exercise.category.trim()
    }))
    .filter(exercise => exercise.sentence && exercise.category);

  exercises.forEach(exercise => {
    if (!categories.includes(exercise.category)) {
      categories.push(exercise.category);
    }
  });

  const categoryModes = {};

  categories.forEach(category => {
    categoryModes[category] =
      value.categoryModes?.[category] === "random"
        ? "random"
        : "ordered";
  });

  return {
    ...value,
    categories,
    categoryModes,
    exercises
  };
}

function saveLocalData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Panel nadal działa, jeśli localStorage jest niedostępny.
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
    option.textContent = appText("emptyCategory", "Brak kategorii");
    exerciseSelect.appendChild(option);
  }

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = appText("allCategories", "Wszystkie kategorie");
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
      ? previousFilter || "all"
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

  const indexes = getCategoryIndexes(exercise.category);
  const position = indexes.indexOf(index);
  const targetPosition = position + direction;

  if (
    position < 0 ||
    targetPosition < 0 ||
    targetPosition >= indexes.length
  ) {
    return;
  }

  const currentIndex = indexes[position];
  const targetIndex = indexes[targetPosition];

  [
    data.exercises[currentIndex],
    data.exercises[targetIndex]
  ] = [
    data.exercises[targetIndex],
    data.exercises[currentIndex]
  ];

  saveAndRender();
  $("excelStatus").textContent = uiText("orderSaved");
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
  $("excelStatus").textContent = uiText("orderSaved");
}

function enablePointerReorder(handle, item, list, category) {
  let dragging = false;
  let moved = false;

  function onPointerMove(event) {
    if (!dragging) return;

    event.preventDefault();

    const target = document.elementFromPoint(event.clientX, event.clientY);
    const targetItem = target?.closest(".admin-item");

    if (
      !targetItem ||
      targetItem === item ||
      targetItem.parentElement !== list
    ) {
      return;
    }

    const rect = targetItem.getBoundingClientRect();
    const insertBefore = event.clientY < rect.top + rect.height / 2;

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

  $("adminResultCount").textContent =
    appText("found", "Znaleziono: ") + results.length;

  box.innerHTML = "";

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = appText("noResults", "Brak wyników.");
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
    sentence.setAttribute(
      "aria-label",
      appText("editSentence", "Edytuj zdanie")
    );

    const categorySelect = document.createElement("select");
    categorySelect.setAttribute(
      "aria-label",
      appText("chooseCategory", "Wybierz kategorię")
    );

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
      const categoryIndexes = getCategoryIndexes(category);

      const moveUp = document.createElement("button");
      moveUp.type = "button";
      moveUp.className = "move-button";
      moveUp.textContent = "↑";
      moveUp.title = uiText("moveUp");
      moveUp.setAttribute("aria-label", uiText("moveUp"));
      moveUp.disabled = categoryIndexes[0] === index;
      moveUp.addEventListener("click", () => {
        moveExerciseWithinCategory(index, -1);
      });

      const moveDown = document.createElement("button");
      moveDown.type = "button";
      moveDown.className = "move-button";
      moveDown.textContent = "↓";
      moveDown.title = uiText("moveDown");
      moveDown.setAttribute("aria-label", uiText("moveDown"));
      moveDown.disabled =
        categoryIndexes[categoryIndexes.length - 1] === index;
      moveDown.addEventListener("click", () => {
        moveExerciseWithinCategory(index, 1);
      });

      actions.append(moveUp, moveDown);
    }

    const save = document.createElement("button");
    save.type = "button";
    save.textContent = appText("saveChanges", "Zapisz zmiany");

    save.addEventListener("click", () => {
      const sentenceText = sentence.value.trim();
      const newCategory = categorySelect.value;

      if (!sentenceText || !newCategory) {
        alert(appText(
          "enterSentenceCategory",
          "Wpisz zdanie i wybierz kategorię."
        ));
        return;
      }

      data.exercises[index] = {
        ...data.exercises[index],
        sentence: sentenceText,
        category: newCategory
      };

      data.categoryModes[newCategory] ||= "ordered";
      saveAndRender();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = appText("delete", "Usuń");

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

function normalizeExcelHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findHeaderIndex(headers, acceptedNames) {
  return headers.findIndex(header =>
    acceptedNames.includes(normalizeExcelHeader(header))
  );
}

function importExcelWorkbook(workbook) {
  const exerciseSheetName = workbook.SheetNames.find(name =>
    ["sentences", "zdania", "exercises"].includes(
      normalizeExcelHeader(name)
    )
  );

  if (!exerciseSheetName) {
    throw new Error(excelText("missingSheet"));
  }

  const rows = XLSX.utils.sheet_to_json(
    workbook.Sheets[exerciseSheetName],
    {
      header: 1,
      defval: "",
      raw: false
    }
  );

  if (rows.length < 2) {
    throw new Error(excelText("emptySheet"));
  }

  const headers = rows[0];
  const sentenceIndex = findHeaderIndex(headers, [
    "sentence",
    "zdanie",
    "english sentence"
  ]);
  const categoryIndex = findHeaderIndex(headers, [
    "category",
    "kategoria"
  ]);

  if (sentenceIndex === -1 || categoryIndex === -1) {
    throw new Error(excelText("missingColumns"));
  }

  const exercises = rows
    .slice(1)
    .map(row => ({
      sentence: String(row[sentenceIndex] ?? "").trim(),
      category: String(row[categoryIndex] ?? "").trim()
    }))
    .filter(exercise => exercise.sentence && exercise.category);

  if (!exercises.length) {
    throw new Error(excelText("noSentences"));
  }

  const categories = [];
  const categoryModes = {};

  const categorySheetName = workbook.SheetNames.find(name =>
    ["categories", "kategorie"].includes(normalizeExcelHeader(name))
  );

  if (categorySheetName) {
    const categoryRows = XLSX.utils.sheet_to_json(
      workbook.Sheets[categorySheetName],
      {
        header: 1,
        defval: "",
        raw: false
      }
    );

    if (categoryRows.length > 0) {
      const categoryHeaders = categoryRows[0];
      const categoryNameIndex = findHeaderIndex(categoryHeaders, [
        "category",
        "kategoria"
      ]);
      const modeIndex = findHeaderIndex(categoryHeaders, [
        "mode",
        "tryb",
        "order",
        "kolejnosc"
      ]);

      if (categoryNameIndex !== -1) {
        categoryRows.slice(1).forEach(row => {
          const category = String(row[categoryNameIndex] ?? "").trim();
          if (!category) return;

          if (!categories.includes(category)) {
            categories.push(category);
          }

          const mode = normalizeExcelHeader(
            modeIndex === -1 ? "" : row[modeIndex]
          );

          categoryModes[category] =
            mode === "random" || mode === "losowo"
              ? "random"
              : "ordered";
        });
      }
    }
  }

  exercises.forEach(exercise => {
    if (!categories.includes(exercise.category)) {
      categories.push(exercise.category);
    }

    categoryModes[exercise.category] ||= "ordered";
  });

  return normalizeData({
    categories,
    categoryModes,
    exercises
  });
}

$("exerciseForm").addEventListener("submit", event => {
  event.preventDefault();

  const sentence = $("sentenceInput").value.trim();
  const category = $("categorySelect").value;

  if (!sentence || !category) {
    alert(appText(
      "enterSentenceCategory",
      "Wpisz zdanie i wybierz kategorię."
    ));
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
    alert(appText("categoryExists", "Ta kategoria już istnieje."));
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
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    data = normalizeData(JSON.parse(await file.text()));
    saveLocalData();
    renderAll();
  } catch (error) {
    console.error("JSON import error:", error);
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
  } catch (error) {
    const temporaryTextarea = document.createElement("textarea");
    temporaryTextarea.value = json;
    temporaryTextarea.setAttribute("readonly", "");
    temporaryTextarea.style.position = "fixed";
    temporaryTextarea.style.left = "-9999px";
    temporaryTextarea.style.top = "0";

    document.body.appendChild(temporaryTextarea);
    temporaryTextarea.select();
    document.execCommand("copy");
    temporaryTextarea.remove();
  }
});

$("importExcel").addEventListener("click", async () => {
  const file = $("excelFile").files?.[0];
  const status = $("excelStatus");

  if (!file) {
    status.textContent = excelText("chooseFile");
    return;
  }

  if (typeof XLSX === "undefined") {
    status.textContent = excelText("libraryError");
    return;
  }

  try {
    const workbook = XLSX.read(await file.arrayBuffer());
    const importedData = importExcelWorkbook(workbook);

    const confirmed = window.confirm(
      excelText("confirmImport", importedData.exercises.length)
    );

    if (!confirmed) {
      status.textContent = excelText("importCanceled");
      return;
    }

    data = importedData;
    saveLocalData();
    renderAll();

    status.textContent = excelText("importDone", data.exercises.length);
    $("excelFile").value = "";
  } catch (error) {
    status.textContent =
      error.message || excelText("importError");
  }
});

$("exportExcel").addEventListener("click", () => {
  const status = $("excelStatus");

  if (typeof XLSX === "undefined") {
    status.textContent = excelText("libraryError");
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();

    const sentenceRows = [
      ["Sentence", "Category"],
      ...data.exercises.map(exercise => [
        exercise.sentence,
        exercise.category
      ])
    ];

    const categoryRows = [
      ["Category", "Mode"],
      ...data.categories.map(category => [
        category,
        data.categoryModes?.[category] === "random"
          ? "random"
          : "ordered"
      ])
    ];

    const sentencesSheet = XLSX.utils.aoa_to_sheet(sentenceRows);
    const categoriesSheet = XLSX.utils.aoa_to_sheet(categoryRows);

    XLSX.utils.book_append_sheet(workbook, sentencesSheet, "Sentences");
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, "Categories");

    XLSX.writeFile(workbook, "sentence-builder.xlsx");
    status.textContent = excelText("exportDone");
  } catch (error) {
    status.textContent = excelText("exportError");
  }
});

document.addEventListener("languageChanged", () => {
  renderAll();
  updateExcelLanguage();
});

$("languageSelect").addEventListener("change", () => {
  window.setTimeout(updateExcelLanguage, 0);
});

(async () => {
  updateExcelLanguage();

  try {
    const response = await fetch(`exercises.json?v=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Could not load exercises.json");
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
  updateExcelLanguage();
})();
