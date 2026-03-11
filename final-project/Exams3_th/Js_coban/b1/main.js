const statusEl = document.getElementById("status");
const btnHello = document.getElementById("btnHello");

btnHello.addEventListener("click", function () {
  statusEl.textContent =
    "Xin chào! Đây là nội dung được thay đổi bằng JavaScript.";
});
