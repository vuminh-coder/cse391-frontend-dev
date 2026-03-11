const form = document.querySelector("#form");
const username = document.querySelector("#name");
const userScore = document.querySelector("#score");
const table_tbody = document.querySelector("tbody");

const dataList = JSON.parse(localStorage.getItem("dataList")) || [];

function scoreXh(diem) {
  if (diem >= 8.5) return "Giỏi";
  else if (diem >= 7 && diem < 8.5) return "Khá";
  else if (diem >= 5 && diem < 7) return "Trung Bình";
  else return "Yếu";
}

function renderTable() {
  table_tbody.innerHTML = "";

  let Sum = 0;
  dataList.forEach((item, index) => {
    Sum += parseInt(item.score);

    const row = `
            <tr class="${item.score < 5 ? "bg-yellow text-white" : ""}">
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${item.name}</td>
                <td class="text-center">${item.score}</td>
                <td class="text-center">${scoreXh(item.score)}</td>
                
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Xóa</button>
                </td>
            </tr>`;

    table_tbody.insertAdjacentHTML("beforeend", row);
  });
  const rowTb = `
     <tr>
              <td colspan="3" class="text-bold text-center">Tổng số sinh viên</td>
              <td colspan="2" class="text-bold text-center">Điểm Trung Bình</td>
      </tr>
      <tr>
              <td colspan="3" class="text-bold text-center">${dataList.length}</td>
              <td colspan="2" class="text-bold text-center">${Sum / dataList.length}</td>
      </tr>
  `;
  table_tbody.insertAdjacentHTML("beforeend", rowTb);
}

renderTable();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  const name = username.value.trim();
  const score = userScore.value.trim();

  if (name === "") {
    username.classList.add("is-invalid");
    isValid = false;
  } else {
    username.classList.remove("is-invalid");
  }

  if (score === "" || score < 0 || score > 10) {
    userScore.classList.add("is-invalid");
    isValid = false;
  } else {
    userScore.classList.remove("is-invalid");
  }

  if (!isValid) {
    alert("Vui lòng kiểm tra lại thông tin nhập vào!");
    return;
  }

  console.log("Dữ liệu hợp lệ, tiến hành lưu...");

  const newData = { name, score };
  dataList.push(newData);

  localStorage.setItem("dataList", JSON.stringify(dataList));

  renderTable();

  form.reset();
  username.focus();
});

function deleteItem(index) {
  if (confirm("Xóa dòng này nhé?")) {
    dataList.splice(index, 1);
    localStorage.setItem("dataList", JSON.stringify(dataList)); // Cập nhật storage
    renderTable();
  }
}

const formName = document.querySelector(".form-find-name");
const inputName = document.querySelector(".findName");

formName.addEventListener("submit", (item) => {
  item.preventDefault();
  const filterName = dataList.filter((event, index) => {
    const findName = inputName.value.trim().toLowerCase();
    const name = event.name.trim().toLowerCase();
    return name.includes(findName);
  });
  renderTable();
});
