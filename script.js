const bmiCategories = {
  child: [
    { max: 14.9, category: "Podváha", advice: "Zkus přidat více výživných jídel." },
    { max: 18.4, category: "Normální váha", advice: "Výborně, pokračuj ve zdravém životním stylu." },
    { max: 21.9, category: "Nadváha", advice: "Více pohybu by mohlo pomoci." },
    { max: Infinity, category: "Obezita", advice: "Je vhodné poradit se s lékařem." }
  ],
  adult: [
    { max: 18.49, category: "Podváha", advice: "Zkus zvýšit kalorický příjem." },
    { max: 24.99, category: "Normální váha", advice: "Super, udržuj rovnováhu pohybu a jídla." },
    { max: 29.99, category: "Nadváha", advice: "Zvaž více aktivity a lehčí stravu." },
    { max: Infinity, category: "Obezita", advice: "Doporučuje se konzultace s odborníkem." }
  ],
  elderly: [
    { max: 22.0, category: "Podváha", advice: "Zkus přidat více výživných jídel." },
    { max: 27.0, category: "Normální váha", advice: "Dobrá kondice, pokračuj tak dál." },
    { max: 30.0, category: "Nadváha", advice: "Trocha pohybu navíc může pomoci." },
    { max: Infinity, category: "Obezita", advice: "Zvaž konzultaci s lékařem." }
  ]
};

let history = [];

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const ageInput = document.getElementById("age");
const groupSelect = document.getElementById("group");
const resultCard = document.getElementById("resultCard");
const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const bmiAdvice = document.getElementById("bmiAdvice");
const emptyResult = document.getElementById("emptyResult");
const historyTable = document.querySelector("#historyTable tbody");

const form = document.getElementById("bmiForm");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function getAgeGroup(age, manualGroup) {
  if (manualGroup !== "auto") {
    return manualGroup;
  }
  if (age < 18) return "child";
  if (age < 65) return "adult";
  return "elderly";
}

function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

function getCategory(bmi, group) {
  const table = bmiCategories[group];
  return table.find(row => bmi <= row.max);
}

function displayResult(result) {
  emptyResult.classList.add("d-none");
  resultCard.classList.remove("d-none");

  resultCard.className = "border rounded p-3";
  resultCard.classList.add(result.cssClass);

  bmiValue.textContent = `BMI: ${result.bmi.toFixed(1)}`;
  bmiCategory.textContent = `Kategorie: ${result.category}`;
  bmiAdvice.textContent = `Doporučení: ${result.advice}`;
}

function addToHistory(data) {
  history.push(data);
  renderHistory();
}

function renderHistory() {
  historyTable.innerHTML = "";

  history.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.date}</td>
      <td>${row.age}</td>
      <td>${row.weight}</td>
      <td>${row.height}</td>
      <td>${row.bmi.toFixed(1)}</td>
      <td>${row.category}</td>
    `;
    historyTable.appendChild(tr);
  });
}


form.addEventListener("submit", function (e) {
  e.preventDefault();
  form.classList.add("was-validated");

  if (!form.checkValidity()) return;

  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const age = parseInt(ageInput.value);

  const group = getAgeGroup(age, groupSelect.value);
  const bmi = calculateBMI(weight, height);
  const categoryInfo = getCategory(bmi, group);

  const cssClassMap = {
    "Podváha": "underweight",
    "Normální váha": "normal",
    "Nadváha": "overweight",
    "Obezita": "obese"
  };

  displayResult({
    bmi,
    category: categoryInfo.category,
    advice: categoryInfo.advice,
    cssClass: cssClassMap[categoryInfo.category]
  });
});

resetBtn.addEventListener("click", () => {
  form.reset();
  form.classList.remove("was-validated");
  resultCard.classList.add("d-none");
  emptyResult.classList.remove("d-none");
});

saveBtn.addEventListener("click", () => {
  if (resultCard.classList.contains("d-none")) return;

  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const age = parseInt(ageInput.value);
  const bmi = parseFloat(bmiValue.textContent.replace("BMI: ", ""));

  const category = bmiCategory.textContent.replace("Kategorie: ", "");

  addToHistory({
    date: new Date().toLocaleString(),
    age,
    weight,
    height,
    bmi,
    category
  });
});

exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(history, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "bmi_history.json";
  a.click();

  URL.revokeObjectURL(url);
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  renderHistory();
});
