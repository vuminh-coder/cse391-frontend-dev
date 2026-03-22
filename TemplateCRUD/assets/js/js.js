let users = JSON.parse(localStorage.getItem("usersData")) || [];

const form = document.getElementById("crudForm");
const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const classInput = document.getElementById("user-class");
const scoreInput = document.getElementById("user-score");
const editIndexInput = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const tableBody = document.getElementById("tableBody");

function renderTable() {
  tableBody.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.class}</td>
            <td>${user.score}</td>
            <td>
                <button class="btn-edit" onclick="editUser(${index})">Sửa</button>
                <button class="btn-delete" onclick="deleteUser(${index})">Xóa</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const editIndex = editIndexInput.value;
  const classValue = classInput.value.trim();
  const scoreValue = scoreInput.value.trim();

  if (editIndex === "") {
    users.push({
      name: nameValue,
      email: emailValue,
      class: classValue,
      score: scoreValue,
    });
  } else {
    users[editIndex] = {
      name: nameValue,
      email: emailValue,
      class: classValue,
      score: scoreValue,
    };
  }

  saveData();
  resetForm();
  renderTable();
});

function editUser(index) {
  const user = users[index];
  nameInput.value = user.name;
  emailInput.value = user.email;
  classInput.value = user.class;
  scoreInput.value = user.score;
  editIndexInput.value = index;

  submitBtn.textContent = "Cập Nhật";
  submitBtn.style.backgroundColor = "#ffc107";
  submitBtn.style.color = "#000";
  cancelBtn.style.display = "inline-block";
}

function deleteUser(index) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
    users.splice(index, 1);
    saveData();
    renderTable();

    if (editIndexInput.value == index) {
      resetForm();
    }
  }
}

function saveData() {
  localStorage.setItem("usersData", JSON.stringify(users));
}

function resetForm() {
  form.reset();
  editIndexInput.value = "";
  submitBtn.textContent = "Thêm Mới";
  submitBtn.style.backgroundColor = "#28a745";
  submitBtn.style.color = "#fff";
  cancelBtn.style.display = "none";
}

renderTable();
