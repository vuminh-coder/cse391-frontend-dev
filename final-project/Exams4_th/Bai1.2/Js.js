const form = document.querySelector("#form");
const username = document.querySelector("#name");
const userScore = document.querySelector("#score");
const table_tbody = document.querySelector("tbody");
const select = document.querySelector("#select");
const formFindName = document.querySelector("#formFindName");
const inputFindName = document.querySelector("#findName");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = username.value.trim();
  const score = parseFloat(userScore.value);

  if (!name || isNaN(score) || score < 0 || score > 10) {
    alert("Vui lòng nhập đầy đủ thông tin! & Điểm phải từ 0 đến 10");
    return;
  }

  const count = table_tbody.children.length + 1;
  const classification = xepHangHocLuc(score);

  const rowClass = score < 5 ? "bg-yellow text-dark" : "";

  table_tbody.innerHTML += `
    <tr class="${rowClass}">
      <td class="text-center stt">${count}</td>
      <td class="text-center student-name">${name}</td>
      <td class="text-center">${score}</td>
      <td class="text-center classification">${classification}</td>
      <td class="text-center">
        <button class="btn btn-danger btn-sm btn-delete">Delete</button>
      </td>
    </tr>
  `;

  form.reset();
  username.focus();
});

table_tbody.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    e.target.closest("tr").remove();
    updateStudentOrder();
  }
});

function updateStudentOrder() {
  const rows = table_tbody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.querySelector(".stt").innerText = index + 1;
  });
}

function xepHangHocLuc(score) {
  if (score >= 8.5) return "Giỏi";
  if (score >= 7.0) return "Khá";
  if (score >= 5.0) return "Trung bình";
  return "Yếu";
}

formFindName.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = inputFindName.value.trim().toLowerCase();
  const rows = table_tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const studentName = row
      .querySelector(".student-name")
      .innerText.toLowerCase();
    row.style.display = studentName.includes(keyword) ? "" : "none";
  });
});

select.addEventListener("change", () => {
  const selectValue = select.value; // all, kha, gioi, etc.
  const selectedText = select.options[select.selectedIndex].text.toLowerCase();

  const currentRows = table_tbody.querySelectorAll("tr");

  currentRows.forEach((row) => {
    const rowClassText = row
      .querySelector(".classification")
      .innerText.toLowerCase();

    if (selectValue === "all" || rowClassText === selectedText) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
