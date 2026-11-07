const $ = id => document.getElementById(id);
const STORAGE_KEY = "sentence-builder-data";
let data = { categories: [], exercises: [] };

function validateData(value) {
  if (!value || !Array.isArray(value.categories) || !Array.isArray(value.exercises)) {
    throw new Error(t("jsonError"));
  }
  if (!value.categories.every(item => typeof item === "string")) {
    throw new Error(t("jsonError"));
  }
  if (!value.exercises.every(item =>
    item && typeof item.sentence === "string" && typeof item.category === "string"
  )) {
    throw new Error(t("sentenceError"));
  }
  data = value;
  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderAll();
}

function fillSelects() {
  const exerciseSelect = $("categorySelect");
  const filter = $("adminCategoryFilter");
  exerciseSelect.innerHTML = "";
  filter.innerHTML = "";

  if (!data.categories.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("emptyCategory");
    exerciseSelect.appendChild(option);
  }

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = t("allCategories");
  filter.appendChild(all);

  data.categories.forEach(category => {
    const option1 = document.createElement("option");
    option1.value = category;
    option1.textContent = category;
    exerciseSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = category;
    option2.textContent = category;
    filter.appendChild(option2);
  });
}

function renderExercises() {
  const box = $("adminExercises");
  const category = $("adminCategoryFilter").value;
  const query = $("adminSearchInput").value.trim().toLowerCase();

  const results = data.exercises
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ exercise }) =>
      (category === "all" || exercise.category === category) &&
      exercise.sentence.toLowerCase().includes(query)
    );

  $("adminResultCount").textContent = t("found") + results.length;
  box.innerHTML = "";

  if (!results.length) {
    box.textContent = t("noResults");
    return;
  }

  results.forEach(({ exercise, index }) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    const sentence = document.createElement("textarea");
    sentence.value = exercise.sentence;
    sentence.setAttribute("aria-label", t("editSentence"));

    const select = document.createElement("select");
    select.setAttribute("aria-label", t("chooseCategory"));
    data.categories.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    select.value = exercise.category;

    const save = document.createElement("button");
    save.textContent = t("saveChanges");
    save.addEventListener("click", () => {
      const text = sentence.value.trim();
      if (!text || !select.value) {
        alert(t("enterSentenceCategory"));
        return;
      }
      data.exercises[index] = { sentence: text, category: select.value };
      saveData();
    });

    const remove = document.createElement("button");
    remove.className = "danger";
    remove.textContent = t("delete");
    remove.addEventListener("click", () => {
      data.exercises.splice(index, 1);
      saveData();
    });

    item.append(sentence, select, save, remove);
    box.appendChild(item);
  });
}

function renderAll() {
  fillSelects();
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
  $("sentenceInput").value = "";
  saveData();
});

$("categoryForm").addEventListener("submit", event => {
  event.preventDefault();
  const category = $("newCategory").value.trim();
  if (!category) return;

  if (data.categories.some(item => item.toLowerCase() === category.toLowerCase())) {
    alert(t("categoryExists"));
    return;
  }

  data.categories.push(category);
  $("newCategory").value = "";
  saveData();
  $("categorySelect").value = category;
});

$("adminCategoryFilter").addEventListener("change", renderExercises);
$("adminSearchInput").addEventListener("input", renderExercises);

$("jsonFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    validateData(JSON.parse(await file.text()));
    $("loadStatus").textContent = t("loadedFile");
  } catch (error) {
    $("loadStatus").textContent = error.message;
  }
});

$("downloadJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exercises.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

$("copyJson").addEventListener("click", async () => {
  const json = JSON.stringify(data, null, 2);
  $("jsonOutput").value = json;

  try {
    await navigator.clipboard.writeText(json);
    $("copyStatus").textContent = t("copied");
  } catch {
    $("jsonOutput").focus();
    $("jsonOutput").select();
    $("copyStatus").textContent =
      document.execCommand("copy") ? t("copied") : t("copyManual");
  }
});

document.addEventListener("languageChanged", renderAll);

(async () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.categories) && Array.isArray(saved.exercises)) {
      data = saved;
    } else {
      const response = await fetch("exercises.json");
      if (!response.ok) throw new Error();
      data = await response.json();
    }
    $("loadStatus").textContent = t("loaded");
  } catch {
    $("loadStatus").textContent = t("loadFailed");
  }
  renderAll();
})();
