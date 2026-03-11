// Kịch bản:
// - Người dùng nhập tên công việc vào ô input
// - Nhấn nút "Thêm" → thêm công việc mới vào danh sách (dạng <li>)
// - Mỗi mục công việc có nút "Xoá" để xoá mục đó khỏi danh sách
// - Cập nhật số lượng công việc sau mỗi lần thêm/xoá
// - Nếu ô input trống → không thêm (alert thông báo)

// Bước 1: Truy xuất các phần tử DOM cần tác động
const inputTaskName = document.getElementById("inputTaskName");
const btnAddTask = document.getElementById("btnAddTask");
const taskListContainer = document.getElementById("taskList");
const taskCountInfo = document.getElementById("taskCountInfo");

// Bước 2: Gắn sự kiện click cho nút "Thêm"
btnAddTask.addEventListener("click", function () {
  // Bước 2.1: Lấy giá trị từ ô input và loại bỏ khoảng trắng thừa
  const taskName = inputTaskName.value.trim();

  // Bước 2.2: Kiểm tra nếu ô input trống thì hiển thị thông báo
  // TODO: Nếu taskName rỗng → alert("Vui lòng nhập tên công việc!") rồi return

  if (taskName.trim().length === 0 || !taskName) {
    alert("Vui lòng nhập tên công việc!");
    return;
  }
  // Bước 2.3: Tạo phần tử <li> mới chứa tên công việc
  // TODO: Tạo phần tử <li> mới bằng document.createElement("li")

  const newTaskItem = document.createElement("li");
  newTaskItem.classList.add("todo-item");

  // TODO: Thêm class "todo-item" cho <li>

  taskListContainer.appendChild(newTaskItem);

  // Bước 2.4: Tạo <span> chứa tên công việc
  // TODO: Tạo phần tử <span> mới

  // TODO: Gán textContent = taskName cho <span>
  newTaskItem.textContent = taskName;
  // Bước 2.5: Tạo nút "Xoá" cho mục công việc
  // TODO: Tạo phần tử <button> mới

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn-delete");

  // TODO: Gán textContent = "Xoá"

  btnDelete.textContent = "Xoá";

  // TODO: Thêm class "btn-delete" cho nút

  btnDelete.classList.add(".btn-delete");

  // Bước 2.6: Gắn sự kiện click cho nút "Xoá"
  // TODO: Khi click nút xoá → xoá phần tử <li> cha ra khỏi danh sách
  btnDelete.addEventListener("click", () => {
    const row = this.closest("li");
    taskListContainer.remove(row);
    updateTaskCount();
  });
  //       Gợi ý: dùng taskListContainer.removeChild(newTaskItem)
  // TODO: Sau khi xoá, gọi hàm updateTaskCount()

  // Bước 2.7: Ghép các phần tử lại và thêm vào danh sách
  // TODO: appendChild <span> và <button> vào <li>
  newTaskItem.appendChild(btnDelete);
  // TODO: appendChild <li> vào taskListContainer
  taskListContainer.appendChild(newTaskItem);

  // Bước 2.8: Xoá giá trị ô input và cập nhật số lượng
  // TODO: Đặt inputTaskName.value = ""
  inputTaskName.value = "";
  // TODO: Gọi hàm updateTaskCount()
  updateTaskCount();
});

// Bước 3: Hàm cập nhật số lượng công việc
function updateTaskCount() {
  // TODO: Đếm số phần tử con của taskListContainer
  //       Gợi ý: taskListContainer.children.length
  // TODO: Cập nhật nội dung taskCountInfo: "Tổng: X công việc"

  const count = taskListContainer.children.length;
  return (taskCountInfo.textContent = "Tổng: " + count + " công việc");
}
