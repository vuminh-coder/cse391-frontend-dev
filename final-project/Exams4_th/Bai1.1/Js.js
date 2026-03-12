const form = document.querySelector("#form");
const username = document.querySelector("#name");
const userScore = document.querySelector("#score");
const table_tbody = document.querySelector("tbody");

form.addEventListener("submit", (item) => {
  item.preventDefault();

  const name = username.value.trim();
  const score = parseFloat(userScore.value); // Ép kiểu số để so sánh chính xác

  if (!name || isNaN(score) || score < 0 || score > 10) {
    alert("Vui lòng nhập đầy đủ thông tin! & Điểm phải từ 0 đến 10");
    return;
  }

  const count = table_tbody.children.length + 1;

  // Dùng class Bootstrap "table-warning" để hiện màu vàng chuẩn nhất
  const rowClass = score < 5 ? "bg-yellow text-black" : "";

  // Thêm hàng mới vào tbody
  table_tbody.innerHTML += `
    <tr class="${rowClass}">
      <td class="text-center stt">${count}</td>
      <td class="text-center">${name}</td>
      <td class="text-center">${score}</td>
      <td class="text-center">${xepHangHocLuc(score)}</td>
      <td class="text-center">
        <button class="btn btn-danger btn-delete">Delete</button>
      </td>
    </tr>
  `;

  // Reset form
  username.value = "";
  userScore.value = "";
  username.focus();

  // Sau mỗi lần thêm, bạn có thể gọi hàm thống kê ở đây
});

// Kỹ thuật Event Delegation: Gán sự kiện xóa cho thẻ TBODY
table_tbody.addEventListener("click", function (e) {
  // Kiểm tra nếu thứ người dùng click vào là nút Delete
  if (e.target.classList.contains("btn-delete")) {
    const row = e.target.closest("tr");
    row.remove();
    updateStudentOrder(); // Cập nhật lại STT sau khi xóa
  }
});

// Hàm cập nhật số thứ tự (STT)
function updateStudentOrder() {
  const rows = table_tbody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    // Tìm ô đầu tiên (ô STT) và cập nhật giá trị
    row.querySelector(".stt").innerText = index + 1;
  });
}

function xepHangHocLuc(score) {
  if (score >= 8.5) return "Giỏi";
  if (score >= 7.0) return "Khá";
  if (score >= 5.0) return "Trung bình";
  return "Yếu";
}
