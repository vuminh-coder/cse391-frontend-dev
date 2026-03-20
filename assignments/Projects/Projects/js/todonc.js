// 1. Khởi tạo dữ liệu từ LocalStorage hoặc mảng rỗng
let taskList = JSON.parse(localStorage.getItem("infoUser")) || [];

const inputTaskName = document.getElementById("inputTaskName");
const btnAddTask = document.getElementById("btnAddTask");
const taskListContainer = document.getElementById("taskList");
const taskCountInfo = document.getElementById("taskCountInfo");

// 2. Hàm hiển thị danh sách (Render)
function renderTasks() {
  taskListContainer.innerHTML = ""; // Xoá danh sách cũ trước khi vẽ mới

  taskList.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${task.completed ? "completed" : ""}`;

    // Tạo nội dung cho item
    li.innerHTML = `
      <span class="task-text" onclick="toggleComplete(${index})">${task.name}</span>
      <div class="actions">
        <button class="btn-edit text-dark btn" onclick="editTask(${index})">Sửa</button>
        <button class="btn-delete btn" onclick="deleteTask(${index})">Xoá</button>
      </div>
    `;
    taskListContainer.appendChild(li);
  });

  updateTaskCount();
  saveData();
}

// 3. Thêm công việc mới
btnAddTask.addEventListener("click", () => {
  const taskName = inputTaskName.value.trim();
  if (!taskName) {
    alert("Vui lòng nhập tên công việc!");
    return;
  }

  const newTask = {
    name: taskName,
    completed: false,
  };

  taskList.push(newTask);
  inputTaskName.value = ""; // Reset input
  renderTasks();
});

// 4. Xoá công việc
function deleteTask(index) {
  if (confirm("Bạn có chắc muốn xoá công việc này?")) {
    taskList.splice(index, 1);
    renderTasks();
  }
}

// 5. Sửa công việc
function editTask(index) {
  const newName = prompt("Chỉnh sửa công việc:", taskList[index].name);
  if (newName !== null && newName.trim() !== "") {
    taskList[index].name = newName.trim();
    renderTasks();
  }
}

// 6. Đánh dấu hoàn thành (Toggle)
function toggleComplete(index) {
  taskList[index].completed = !taskList[index].completed;
  renderTasks();
}

// 7. Cập nhật số lượng
function updateTaskCount() {
  const count = taskList.length;
  taskCountInfo.textContent = `Tổng: ${count} công việc`;
}

// 8. Lưu vào LocalStorage
function saveData() {
  localStorage.setItem("infoUser", JSON.stringify(taskList));
}

// Khởi chạy lần đầu khi load trang
renderTasks();
