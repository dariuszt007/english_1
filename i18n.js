(() => {
  const translations = {
    pl: {
      appTitle: "Sentence Builder", studentPage: "Gra",
      adminPage: "Panel administratora", language: "Język",
      gameSettings: "Ustawienia gry", sentenceCategory: "Kategoria zdań",
      allCategories: "Wszystkie kategorie", playerCount: "Liczba graczy",
      playerNames: "Imiona graczy — wpisz po przecinku (opcjonalnie)",
      namesPlaceholder: "Anna, Bartek, Kasia", rounds: "Liczba zdań na każdego gracza",
      startGame: "Rozpocznij grę", loadJson: "Wczytaj plik JSON",
      jsonHelp: "Możesz wczytać plik z ćwiczeniami. Po zmianach pobierz zaktualizowany JSON.",
      addSentence: "Dodaj zdanie", englishSentence: "Zdanie po angielsku",
      sentencePlaceholder: "Na przykład: She has already finished her homework.",
      category: "Kategoria", addCategory: "Dodaj kategorię",
      categoryName: "Nazwa kategorii", manageSentences: "Wyszukaj, edytuj lub usuń zdania",
      filterCategory: "Filtruj według kategorii", searchSentence: "Szukaj zdania",
      searchPlaceholder: "Wpisz fragment zdania...", exportJson: "Eksport do pliku JSON",
      exportHelp: "Pobierz plik JSON, aby zachować zmiany lub użyć ich na innym urządzeniu.",
      downloadJson: "Pobierz exercises.json", copyJson: "Skopiuj kod JSON",
      loaded: "Wczytano dane.", loadFailed: "Nie udało się wczytać JSON. Wybierz plik poniżej.",
      loadedFile: "Wczytano wybrany plik JSON.", found: "Znaleziono zdań: ",
      noResults: "Brak zdań pasujących do filtra lub wyszukiwania.",
      editSentence: "Edytuj zdanie", chooseCategory: "Wybierz kategorię",
      saveChanges: "Zapisz zmiany", delete: "Usuń", enterSentenceCategory: "Wpisz zdanie i wybierz kategorię.",
      categoryExists: "Taka kategoria już istnieje.", copied: "Skopiowano JSON do schowka.",
      copyManual: "Nie udało się skopiować. Skopiuj tekst ręcznie.",
      jsonError: "JSON powinien zawierać tablice categories oraz exercises.",
      sentenceError: "Każde zdanie powinno zawierać pola sentence i category.",
      emptyCategory: "Brak kategorii", noExercises: "W wybranej kategorii nie ma zdań.",
      nowPlaying: "Teraz gra: ", check: "Sprawdź", next: "Następne zdanie",
      correct: "Poprawnie! +1 punkt.", incorrect: "Błędna odpowiedź — 0 punktów. Poprawne zdanie: ",
      scores: "Punkty", endGame: "Koniec gry!", winner: "Zwycięzca: ",
      tie: "Remis: ", pointsOne: " punkt.", pointsMany: " punktów.",
      undo: "Kliknij, aby cofnąć wybór", player: "Gracz "
    },
    en: {
      appTitle: "Sentence Builder", studentPage: "Game",
      adminPage: "Admin panel", language: "Language",
      gameSettings: "Game settings", sentenceCategory: "Sentence category",
      allCategories: "All categories", playerCount: "Number of players",
      playerNames: "Player names — comma-separated (optional)",
      namesPlaceholder: "Anna, Ben, Kate", rounds: "Sentences per player",
      startGame: "Start game", loadJson: "Load JSON file",
      jsonHelp: "Load an exercise file. Download the updated JSON after making changes.",
      addSentence: "Add sentence", englishSentence: "Sentence in English",
      sentencePlaceholder: "For example: She has already finished her homework.",
      category: "Category", addCategory: "Add category",
      categoryName: "Category name", manageSentences: "Search, edit, or delete sentences",
      filterCategory: "Filter by category", searchSentence: "Search sentences",
      searchPlaceholder: "Type part of a sentence...", exportJson: "Export JSON file",
      exportHelp: "Download the JSON file to keep your changes or use them on another device.",
      downloadJson: "Download exercises.json", copyJson: "Copy JSON",
      loaded: "Data loaded.", loadFailed: "Could not load JSON. Choose a file below.",
      loadedFile: "Selected JSON file loaded.", found: "Sentences found: ",
      noResults: "No sentences match the filter or search.",
      editSentence: "Edit sentence", chooseCategory: "Choose a category",
      saveChanges: "Save changes", delete: "Delete", enterSentenceCategory: "Enter a sentence and choose a category.",
      categoryExists: "That category already exists.", copied: "JSON copied to clipboard.",
      copyManual: "Could not copy automatically. Copy the text manually.",
      jsonError: "JSON must contain categories and exercises arrays.",
      sentenceError: "Each exercise must contain sentence and category fields.",
      emptyCategory: "No categories", noExercises: "There are no sentences in this category.",
      nowPlaying: "Now playing: ", check: "Check", next: "Next sentence",
      correct: "Correct! +1 point.", incorrect: "Incorrect — 0 points. Correct sentence: ",
      scores: "Scores", endGame: "Game over!", winner: "Winner: ",
      tie: "Tie: ", pointsOne: " point.", pointsMany: " points.",
      undo: "Click to undo selection", player: "Player "
    },
    ja: {
      appTitle: "Sentence Builder", studentPage: "ゲーム",
      adminPage: "管理パネル", language: "言語",
      gameSettings: "ゲーム設定", sentenceCategory: "文のカテゴリー",
      allCategories: "すべてのカテゴリー", playerCount: "プレイヤー数",
      playerNames: "プレイヤー名（カンマ区切り・任意）",
      namesPlaceholder: "Anna, Ben, Kate", rounds: "各プレイヤーの文の数",
      startGame: "ゲーム開始", loadJson: "JSONファイルを読み込む",
      jsonHelp: "問題ファイルを読み込めます。変更後は更新したJSONをダウンロードしてください。",
      addSentence: "文を追加", englishSentence: "英語の文",
      sentencePlaceholder: "例: She has already finished her homework.",
      category: "カテゴリー", addCategory: "カテゴリーを追加",
      categoryName: "カテゴリー名", manageSentences: "文を検索・編集・削除",
      filterCategory: "カテゴリーで絞り込む", searchSentence: "文を検索",
      searchPlaceholder: "文の一部を入力...", exportJson: "JSONファイルを書き出す",
      exportHelp: "変更を保存、または別の端末で使うにはJSONをダウンロードしてください。",
      downloadJson: "exercises.jsonをダウンロード", copyJson: "JSONをコピー",
      loaded: "データを読み込みました。", loadFailed: "JSONを読み込めません。下からファイルを選択してください。",
      loadedFile: "選択したJSONを読み込みました。", found: "見つかった文: ",
      noResults: "条件に一致する文がありません。",
      editSentence: "文を編集", chooseCategory: "カテゴリーを選択",
      saveChanges: "変更を保存", delete: "削除", enterSentenceCategory: "文を入力してカテゴリーを選択してください。",
      categoryExists: "このカテゴリーはすでにあります。", copied: "JSONをコピーしました。",
      copyManual: "自動コピーできませんでした。手動でコピーしてください。",
      jsonError: "JSONにはcategoriesとexercisesの配列が必要です。",
      sentenceError: "各文にはsentenceとcategoryが必要です。",
      emptyCategory: "カテゴリーなし", noExercises: "このカテゴリーに文はありません。",
      nowPlaying: "プレイヤー: ", check: "確認", next: "次の文",
      correct: "正解！ +1点。", incorrect: "不正解 — 0点。正しい文: ",
      scores: "得点", endGame: "ゲーム終了！", winner: "優勝: ",
      tie: "引き分け: ", pointsOne: "点。", pointsMany: "点。",
      undo: "クリックして選択を取り消す", player: "プレイヤー "
    },
    fr: {
      appTitle: "Sentence Builder", studentPage: "Jeu",
      adminPage: "Administration", language: "Langue",
      gameSettings: "Paramètres du jeu", sentenceCategory: "Catégorie de phrases",
      allCategories: "Toutes les catégories", playerCount: "Nombre de joueurs",
      playerNames: "Noms des joueurs — séparés par des virgules (facultatif)",
      namesPlaceholder: "Anna, Ben, Kate", rounds: "Phrases par joueur",
      startGame: "Commencer", loadJson: "Charger un fichier JSON",
      jsonHelp: "Chargez un fichier d'exercices. Après vos modifications, téléchargez le JSON mis à jour.",
      addSentence: "Ajouter une phrase", englishSentence: "Phrase en anglais",
      sentencePlaceholder: "Par exemple : She has already finished her homework.",
      category: "Catégorie", addCategory: "Ajouter une catégorie",
      categoryName: "Nom de la catégorie", manageSentences: "Rechercher, modifier ou supprimer des phrases",
      filterCategory: "Filtrer par catégorie", searchSentence: "Rechercher une phrase",
      searchPlaceholder: "Saisissez une partie de la phrase...", exportJson: "Exporter en JSON",
      exportHelp: "Téléchargez le JSON pour conserver vos modifications ou les utiliser sur un autre appareil.",
      downloadJson: "Télécharger exercises.json", copyJson: "Copier le JSON",
      loaded: "Données chargées.", loadFailed: "Impossible de charger le JSON. Choisissez un fichier ci-dessous.",
      loadedFile: "Fichier JSON chargé.", found: "Phrases trouvées : ",
      noResults: "Aucune phrase ne correspond aux critères.",
      editSentence: "Modifier la phrase", chooseCategory: "Choisir une catégorie",
      saveChanges: "Enregistrer", delete: "Supprimer", enterSentenceCategory: "Saisissez une phrase et choisissez une catégorie.",
      categoryExists: "Cette catégorie existe déjà.", copied: "JSON copié.",
      copyManual: "Copie automatique impossible. Copiez le texte manuellement.",
      jsonError: "Le JSON doit contenir les tableaux categories et exercises.",
      sentenceError: "Chaque exercice doit contenir sentence et category.",
      emptyCategory: "Aucune catégorie", noExercises: "Aucune phrase dans cette catégorie.",
      nowPlaying: "Au tour de : ", check: "Vérifier", next: "Phrase suivante",
      correct: "Correct ! +1 point.", incorrect: "Incorrect — 0 point. Phrase correcte : ",
      scores: "Scores", endGame: "Fin du jeu !", winner: "Gagnant : ",
      tie: "Égalité : ", pointsOne: " point.", pointsMany: " points.",
      undo: "Cliquez pour annuler la sélection", player: "Joueur "
    },
    es: {
      appTitle: "Sentence Builder", studentPage: "Juego",
      adminPage: "Administración", language: "Idioma",
      gameSettings: "Ajustes del juego", sentenceCategory: "Categoría de frases",
      allCategories: "Todas las categorías", playerCount: "Número de jugadores",
      playerNames: "Nombres — separados por comas (opcional)",
      namesPlaceholder: "Anna, Ben, Kate", rounds: "Frases por jugador",
      startGame: "Iniciar juego", loadJson: "Cargar archivo JSON",
      jsonHelp: "Carga un archivo de ejercicios. Descarga el JSON actualizado después de hacer cambios.",
      addSentence: "Añadir frase", englishSentence: "Frase en inglés",
      sentencePlaceholder: "Por ejemplo: She has already finished her homework.",
      category: "Categoría", addCategory: "Añadir categoría",
      categoryName: "Nombre de la categoría", manageSentences: "Buscar, editar o eliminar frases",
      filterCategory: "Filtrar por categoría", searchSentence: "Buscar frases",
      searchPlaceholder: "Escribe parte de una frase...", exportJson: "Exportar archivo JSON",
      exportHelp: "Descarga el JSON para guardar los cambios o usarlo en otro dispositivo.",
      downloadJson: "Descargar exercises.json", copyJson: "Copiar JSON",
      loaded: "Datos cargados.", loadFailed: "No se pudo cargar el JSON. Elige un archivo abajo.",
      loadedFile: "Archivo JSON cargado.", found: "Frases encontradas: ",
      noResults: "No hay frases que coincidan con la búsqueda.",
      editSentence: "Editar frase", chooseCategory: "Elige una categoría",
      saveChanges: "Guardar cambios", delete: "Eliminar", enterSentenceCategory: "Escribe una frase y elige una categoría.",
      categoryExists: "Esa categoría ya existe.", copied: "JSON copiado.",
      copyManual: "No se pudo copiar automáticamente. Copia el texto manualmente.",
      jsonError: "El JSON debe incluir los arrays categories y exercises.",
      sentenceError: "Cada ejercicio debe incluir sentence y category.",
      emptyCategory: "Sin categorías", noExercises: "No hay frases en esta categoría.",
      nowPlaying: "Turno de: ", check: "Comprobar", next: "Siguiente frase",
      correct: "¡Correcto! +1 punto.", incorrect: "Incorrecto — 0 puntos. Frase correcta: ",
      scores: "Puntuación", endGame: "¡Fin del juego!", winner: "Ganador: ",
      tie: "Empate: ", pointsOne: " punto.", pointsMany: " puntos.",
      undo: "Haz clic para deshacer la selección", player: "Jugador "
    },
    de: {
      appTitle: "Sentence Builder", studentPage: "Spiel",
      adminPage: "Verwaltung", language: "Sprache",
      gameSettings: "Spieleinstellungen", sentenceCategory: "Satzkategorie",
      allCategories: "Alle Kategorien", playerCount: "Anzahl der Spieler",
      playerNames: "Spielernamen — durch Kommas getrennt (optional)",
      namesPlaceholder: "Anna, Ben, Kate", rounds: "Sätze pro Spieler",
      startGame: "Spiel starten", loadJson: "JSON-Datei laden",
      jsonHelp: "Lade eine Übungsdatei. Lade nach Änderungen das aktualisierte JSON herunter.",
      addSentence: "Satz hinzufügen", englishSentence: "Satz auf Englisch",
      sentencePlaceholder: "Zum Beispiel: She has already finished her homework.",
      category: "Kategorie", addCategory: "Kategorie hinzufügen",
      categoryName: "Kategoriename", manageSentences: "Sätze suchen, bearbeiten oder löschen",
      filterCategory: "Nach Kategorie filtern", searchSentence: "Sätze suchen",
      searchPlaceholder: "Teil des Satzes eingeben...", exportJson: "JSON-Datei exportieren",
      exportHelp: "Lade das JSON herunter, um Änderungen zu speichern oder auf einem anderen Gerät zu verwenden.",
      downloadJson: "exercises.json herunterladen", copyJson: "JSON kopieren",
      loaded: "Daten geladen.", loadFailed: "JSON konnte nicht geladen werden. Wähle unten eine Datei aus.",
      loadedFile: "Ausgewählte JSON-Datei geladen.", found: "Gefundene Sätze: ",
      noResults: "Keine passenden Sätze gefunden.",
      editSentence: "Satz bearbeiten", chooseCategory: "Kategorie auswählen",
      saveChanges: "Änderungen speichern", delete: "Löschen", enterSentenceCategory: "Gib einen Satz ein und wähle eine Kategorie.",
      categoryExists: "Diese Kategorie gibt es bereits.", copied: "JSON wurde kopiert.",
      copyManual: "Kopieren nicht möglich. Bitte kopiere den Text manuell.",
      jsonError: "JSON muss die Arrays categories und exercises enthalten.",
      sentenceError: "Jeder Eintrag muss sentence und category enthalten.",
      emptyCategory: "Keine Kategorien", noExercises: "In dieser Kategorie gibt es keine Sätze.",
      nowPlaying: "Jetzt spielt: ", check: "Prüfen", next: "Nächster Satz",
      correct: "Richtig! +1 Punkt.", incorrect: "Falsch — 0 Punkte. Richtiger Satz: ",
      scores: "Punkte", endGame: "Spiel beendet!", winner: "Gewinner: ",
      tie: "Unentschieden: ", pointsOne: " Punkt.", pointsMany: " Punkte.",
      undo: "Klicken, um die Auswahl rückgängig zu machen", player: "Spieler "
    }
  };

  let language = localStorage.getItem("sb-language") || "pl";

  function t(key) {
    return translations[language]?.[key] ?? translations.pl[key] ?? key;
  }

  function applyTranslations() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    const select = document.getElementById("languageSelect");
    if (select) select.value = language;
    document.dispatchEvent(new Event("languageChanged"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("languageSelect");
    if (select) {
      select.value = language;
      select.addEventListener("change", () => {
        language = select.value;
        localStorage.setItem("sb-language", language);
        applyTranslations();
      });
    }
    applyTranslations();
  });

  window.t = t;
})();
