// 1. Khai báo các biến
const btnAdd = document.getElementById("btnAdd");
const btnClose = document.getElementById("btnClose");
const formEmployee = document.getElementById("formEmployee");

// 2. Khi click vào nút + add -> Hiện Form
btnAdd.addEventListener("click", function () {
  formEmployee.classList.add("show-form");
});

// 3. Khi click vào nút X -> Ẩn Form
btnClose.addEventListener("click", function () {
  formEmployee.classList.remove("show-form");
});
