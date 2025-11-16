let data;

// Load JSON file containing the regulators and documents
fetch("regulators.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    loadSectors();
  })
  .catch(error => {
    document.getElementById("checklist").innerHTML =
      "<p style='color:red;'>Error loading data. Make sure regulators.json exists.</p>";
  });

// Populate the sectors dropdown menu
function loadSectors() {
  const select = document.getElementById("sectorSelect");

  data.sectors.forEach((sector, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = sector.name;
    select.appendChild(option);
  });

  select.addEventListener("change", loadChecklist);
  loadChecklist();
}

// Build the checklist dynamically
function loadChecklist() {
  const index = document.getElementById("sectorSelect").value;
  const sector = data.sectors[index];
  const checklistDiv = document.getElementById("checklist");

  checklistDiv.innerHTML = ""; // clear previous content

  sector.regulators.forEach(reg => {
    const regDiv = document.createElement("div");
    regDiv.classList.add("regulator");

    let html = `<h3>${reg.name}</h3>`;

    reg.documents.forEach(doc => {
      html += `
        <label>
          <input type="checkbox" class="doc-check" data-doc="${doc}">
          ${doc}
        </label><br>
      `;
    });

    regDiv.innerHTML = html;
    checklistDiv.appendChild(regDiv);
  });
}

// Generate compliance report
document.getElementById("submitBtn").addEventListener("click", () => {
  const checks = document.querySelectorAll(".doc-check");

  let available = [];
  let missing = [];

  checks.forEach(c => {
    if (c.checked) available.push(c.dataset.doc);
    else missing.push(c.dataset.doc);
  });

  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = `
    <h2>Compliance Report</h2>

    <h3>✔ Documents You Have</h3>
    <ul>${available.map(a => `<li>${a}</li>`).join("")}</ul>

    <h3>✖ Documents Missing</h3>
    <ul>${missing.map(m => `<li>${m}</li>`).join("")}</ul>
  `;
});
