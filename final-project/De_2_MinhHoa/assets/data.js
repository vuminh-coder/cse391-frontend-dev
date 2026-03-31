const contacts = [
  {
    name: "Thomas Hardy",
    email: "thomashardy@mail.com",
    phone: "(171) 555-2222",
    position: "Fullstack Developer",
  },
  {
    name: "Dominique Perrier",
    email: "dominiqueperrier@mail.com",
    phone: "(313) 555-5735",
    position: "Frontend Developer",
  },
  {
    name: "Maria Anders",
    email: "mariaanders@mail.com",
    phone: "(503) 555-9931",
    position: "Backend Developer",
  },
  {
    name: "Fran Wilson",
    email: "franwilson@mail.com",
    phone: "(204) 619-5731",
    position: "UI/UX Designer",
  },
  {
    name: "Martin Blank",
    email: "martinblank@mail.com",
    phone: "(480) 631-2097",
    position: "Project Manager",
  },

  {
    name: "Alice Freeman",
    email: "alicef@mail.com",
    phone: "(415) 555-1234",
    position: "Data Scientist",
  },
  {
    name: "Boris Johnson",
    email: "borisj@mail.com",
    phone: "(202) 555-0199",
    position: "DevOps Engineer",
  },
  {
    name: "Clara Oswald",
    email: "clarao@mail.com",
    phone: "(312) 555-7890",
    position: "Quality Assurance",
  },
  {
    name: "Daniel Ricciardo",
    email: "danr@mail.com",
    phone: "(512) 555-4321",
    position: "Product Owner",
  },
  {
    name: "Elena Gilbert",
    email: "elenag@mail.com",
    phone: "(617) 555-6677",
    position: "Business Analyst",
  },
  {
    name: "Fiona Gallagher",
    email: "fionag@mail.com",
    phone: "(312) 555-2468",
    position: "Mobile Developer",
  },
  {
    name: "George Costanza",
    email: "georgec@mail.com",
    phone: "(212) 555-9012",
    position: "System Administrator",
  },
  {
    name: "Hannah Abbott",
    email: "habbott@mail.com",
    phone: "(702) 555-3344",
    position: "Security Specialist",
  },
  {
    name: "Ian Wright",
    email: "ianw@mail.com",
    phone: "(818) 555-5566",
    position: "Cloud Architect",
  },
  {
    name: "Julia Roberts",
    email: "juliar@mail.com",
    phone: "(310) 555-7788",
    position: "Marketing Lead",
  },
];

let UserInfo = JSON.parse(localStorage.getItem("UserInfo1"));

if (!UserInfo || UserInfo.length === 0) {
  UserInfo = contacts;
  localStorage.setItem("UserInfo1", JSON.stringify(UserInfo));
}

const userForm = document.getElementById("userForm");
const btnCloseIcon = document.getElementById("btnCloseIcon");
const btnCancel = document.getElementById("btnCancel");
const btnNewEmployee = document.querySelector("#btnNewEmployee");
const tbody = document.querySelector("#tbody");

// Các input tag
const userNameInput = document.getElementById("userName");
const userPhoneInput = document.getElementById("userPhone");
const userEmailInput = document.getElementById("userEmail");
const positionSelect = document.getElementById("position-select");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (!userForm || !tbody) {
  console.error(
    "Lỗi: Không tìm thấy form hoặc tbody trong HTML. Vui lòng kiểm tra lại ID.",
  );
}

let editingIndex = -1; // -1 nghĩa là đang thêm mới, >= 0 là đang sửa

btnNewEmployee.addEventListener("click", () => {
  editingIndex = -1;
  userForm.reset();
  userForm.classList.remove("d-none");
});

btnCloseIcon.addEventListener("click", () => {
  userForm.classList.add("d-none");
});

btnCancel.addEventListener("click", () => {
  userForm.reset();
  userForm.classList.add("d-none");
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  let positionText = "";
  if (positionSelect.selectedIndex > 0) {
    positionText = positionSelect.options[positionSelect.selectedIndex].text;
  } else {
    alert("Vui lòng chọn vị trí công việc!");
    return;
  }
  
  if (!userNameInput.value.trim() || !userPhoneInput.value.trim() || !userEmailInput.value.trim()) {
    alert("Vui lòng điền đủ thông tin!");
    return;
  }

  const newUser = {
    name: userNameInput.value.trim(),
    phone: userPhoneInput.value.trim(),
    email: userEmailInput.value.trim(),
    position: positionText
  };

  if (editingIndex === -1) {
    UserInfo.unshift(newUser);
  } else {
    UserInfo[editingIndex] = newUser;
  }
  
  localStorage.setItem("UserInfo1", JSON.stringify(UserInfo));
  if (searchInput) searchInput.value = "";
  Rerender();
  userForm.classList.add("d-none");
  userForm.reset();
});

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
      const filtered = UserInfo.filter(user => 
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword) ||
        user.position.toLowerCase().includes(keyword)
      );
      Rerender(filtered);
    } else {
      Rerender();
    }
  });

  searchInput.addEventListener("input", (e) => {
    if (e.target.value.trim() === "") {
      Rerender();
    }
  });
}

function Rerender(data = UserInfo) {
  tbody.innerHTML = "";
  const rows = data.map((user, index) => {
    const realIndex = UserInfo.indexOf(user);
    if (realIndex === -1) return "";
    return `
    <tr>
      <td class="text-center text-dark">${index + 1}</td>
      <td class="text-center text-dark">${user.name}</td>
      <td class="text-center text-dark">${user.email}</td>
      <td class="text-center text-dark">${user.phone}</td>
      <td class="text-center text-dark"><span class="badge text-center text-dark">${user.position}</span></td>
      <td class="d-flex border-0 align-items-center justify-content-center">
          <button class="btn border-0" type="button" onclick="editUser(${realIndex})">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dfdf2b"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="cursor: pointer; margin-right: 15px;"
              title="Sửa"
            >  
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn border-0" type="button" onclick="deleteUser(${realIndex})">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc3545"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="cursor: pointer;"
              title="Xóa"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
      </td>
    </tr>
    `;
  });
  tbody.innerHTML = rows.join("");
}

window.editUser = function(index) {
  editingIndex = index;
  const user = UserInfo[index];
  
  if (userNameInput) userNameInput.value = user.name;
  if (userPhoneInput) userPhoneInput.value = user.phone;
  if (userEmailInput) userEmailInput.value = user.email;
  
  if (positionSelect) {
    for (let i = 0; i < positionSelect.options.length; i++) {
      if (positionSelect.options[i].text === user.position || positionSelect.options[i].value === user.position) {
        positionSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  if (userForm) userForm.classList.remove("d-none");
};

window.deleteUser = function(index) {
  if (confirm("Bạn có chắc chắn muốn xóa nhân sự này không?")) {
    UserInfo.splice(index, 1);
    localStorage.setItem("UserInfo1", JSON.stringify(UserInfo));
    if (searchInput) searchInput.value = "";
    Rerender();
  }
};

Rerender();
