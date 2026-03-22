const inputTaskName = document.getElementById("inputTaskName");
const btnAddTask = document.getElementById("btnAddTask");
const taskList = document.getElementById("taskList");
const taskCountInfo = document.getElementById("taskCountInfo");

const dataJson = JSON.parse(localStorage.getItem("infoUser")) || [];

btnAddTask.addEventListener("click", () => {
  const taskNameValue = inputTaskName.value.trim();

  if (!taskNameValue) {
    alert("Vui lòng nhập tên công việc!");
    return;
  }

  const newTask = {
    name: taskNameValue,
    isValid: false,
  };

  dataJson.push(newTask);
  localStorage.setItem("infoUser", JSON.stringify(dataJson));
  inputTaskName.value = "";
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";
  dataJson.forEach((user, index) => {
    const rows = document.createElement("li");
    rows.className = `d-flex justify-content-between align-items-center column-gap-2 w-100`;

    rows.innerHTML = `
      <p class="m-0">${user.name}</p> 
      <div class="d-flex column-gap-2">
        <button class="btn btn-success btn-edit">Edit</button> 
        <button class="btn btn-danger btn-delete">Delete</button>
      </div>
    `;
    taskList.appendChild(rows);

    const btnEdit = rows.querySelector(".btn-edit");
    const btnDelete = rows.querySelector(".btn-delete");

    btnDelete.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa?")) {
        dataJson.splice(index, 1);
        localStorage.setItem("infoUser", JSON.stringify(dataJson));
        renderTasks();
      }
    });

    btnEdit.addEventListener("click", () => {
      const inputEdit = prompt("Chỉnh sửa tên công việc:", user.name);
      if (inputEdit !== null && inputEdit.trim() !== "") {
        dataJson[index].name = inputEdit.trim();
        localStorage.setItem("infoUser", JSON.stringify(dataJson));
        renderTasks();
      }
    });
  });
}

renderTasks();
