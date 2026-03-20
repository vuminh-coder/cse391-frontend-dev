// 1. Lấy dữ liệu từ localStorage (Dùng let để có thể cập nhật mảng)
let infoUserData = JSON.parse(localStorage.getItem("userData")) || [];

const inputTaskName = document.querySelector("#inputTaskName");
const btnAddTask = document.querySelector("#btnAddTask");
const taskListDisplay = document.querySelector("#taskList"); // Đổi tên để tránh nhầm với mảng dữ liệu
const taskCountInfo = document.querySelector("#taskCountInfo");

let date = new Date();

// 2. Hàm hiển thị danh sách
function renderTasks() {
  taskListDisplay.innerHTML = ""; // Xóa nội dung cũ

  // Lặp qua mảng DỮ LIỆU (infoUserData)
  infoUserData.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("todo-item");

    // Nếu công việc đã xong, thêm class 'isValid'
    if (task.isValid) {
      div.classList.add("isValid");
    }

    div.innerHTML = `
      <span class="task-text" 
            style="cursor:pointer; ${task.isValid ? "text-decoration: line-through; color: gray;" : ""}" 
            onclick="toggleComplete(${index})">
            ${task.name}
      </span>
      <div class="actions" style="display: flex; gap: 10px; align-items: center;">
      <span style="color: gray;">${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}</span>
        <button class="btn-edit btn" onclick="editTask(${index})">Sửa</button>
        <button class="btn-delete btn" onclick="deleteTask(${index})">Xoá</button>
      </div>
    `;
    taskListDisplay.appendChild(div);
  });

  updateTaskCount();
}

// 3. Sự kiện thêm công việc
btnAddTask.addEventListener("click", () => {
  const taskName = inputTaskName.value.trim();

  if (taskName === "") {
    alert("Vui lòng nhập tên công việc");
    return;
  }

  const newTask = {
    name: taskName,
    isValid: false,
  };

  infoUserData.push(newTask); // Thêm vào mảng
  saveData(); // Lưu vào máy
  renderTasks(); // Vẽ lại giao diện
  inputTaskName.value = ""; // Xóa ô nhập
});

// 4. Các hàm chức năng
function deleteTask(index) {
  if (confirm("Bạn có chắc muốn xoá công việc này?")) {
    infoUserData.splice(index, 1);
    saveData();
    renderTasks();
  }
}

function editTask(index) {
  const newName = prompt("Chỉnh sửa công việc:", infoUserData[index].name);
  if (newName !== null && newName.trim() !== "") {
    infoUserData[index].name = newName.trim();
    saveData();
    renderTasks();
  }
}

function toggleComplete(index) {
  infoUserData[index].isValid = !infoUserData[index].isValid;
  saveData();
  renderTasks();
}

// 5. Lưu và Cập nhật
function saveData() {
  localStorage.setItem("userData", JSON.stringify(infoUserData));
}

function updateTaskCount() {
  taskCountInfo.textContent = `Tổng: ${infoUserData.length} công việc`;
}

// Chạy lần đầu khi load trang
renderTasks();
