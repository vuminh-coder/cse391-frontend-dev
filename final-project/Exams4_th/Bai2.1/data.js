// --- DOM ELEMENTS ---
const form = document.getElementById("registerForm");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const genderInputs = document.getElementsByName("gender");
const genderError = document.getElementById("genderError");

// --- HELPER FUNCTIONS ---

/**
 * Hiển thị lỗi cho một trường input
 * @param {HTMLElement} input Element input bị lỗi
 * @param {String} message Thông báo lỗi
 */
function showError(input, message) {
  const formControl = input;
  // Tìm thẻ div.invalid-feedback ngay bên trong container cha hoặc là sibling
  const parent = formControl.parentElement;
  const feedback = parent.querySelector(".invalid-feedback");

  formControl.classList.add("is-invalid");
  formControl.classList.remove("is-valid");

  if (feedback) {
    feedback.innerText = message;
  }
}

/**
 * Hiển thị trạng thái thành công (xanh)
 * @param {HTMLElement} input Element input hợp lệ
 */
function showSuccess(input) {
  const formControl = input;
  formControl.classList.remove("is-invalid");
  formControl.classList.add("is-valid");
}

/**
 * Xóa trạng thái lỗi/thành công (về mặc định)
 * @param {HTMLElement} input Element input cần reset
 */
function clearError(input) {
  const formControl = input;
  formControl.classList.remove("is-invalid");
  formControl.classList.remove("is-valid");
}

// --- VALIDATION FUNCTIONS ---

function validateFullname() {
  const value = fullname.value.trim();
  // Regex: Chữ cái và khoảng trắng, hỗ trợ tiếng Việt
  const regex = /^[a-zA-ZÀ-ỹ\s]+$/;

  if (value === "") {
    showError(fullname, "Họ và tên không được để trống.");
    return false;
  } else if (value.length < 3) {
    showError(fullname, "Họ tên phải có ít nhất 3 ký tự.");
    return false;
  } else if (!regex.test(value)) {
    showError(fullname, "Họ tên chỉ chứa chữ cái và khoảng trắng.");
    return false;
  }
  showSuccess(fullname);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError(email, "Email không được để trống.");
    return false;
  } else if (!regex.test(value)) {
    showError(email, "Email không đúng định dạng (ví dụ: abc@domain.com).");
    return false;
  }
  showSuccess(email);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  const regex = /^0[0-9]{9}$/;

  if (value === "") {
    showError(phone, "Số điện thoại không được để trống.");
    return false;
  } else if (!regex.test(value)) {
    showError(phone, "SĐT phải gồm 10 chữ số và bắt đầu bằng 0.");
    return false;
  }
  showSuccess(phone);
  return true;
}

function validatePassword() {
  const value = password.value;
  // Regex: Tối thiểu 8 ký tự, 1 hoa, 1 thường, 1 số
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (value === "") {
    showError(password, "Mật khẩu không được để trống.");
    return false;
  } else if (!regex.test(value)) {
    showError(password, "Mật khẩu phải >= 8 ký tự, có chữ hoa, thường và số.");
    return false;
  }
  showSuccess(password);
  return true;
}

function validateConfirmPassword() {
  const value = confirmPassword.value;
  const passValue = password.value;

  if (value === "") {
    showError(confirmPassword, "Vui lòng xác nhận mật khẩu.");
    return false;
  } else if (value !== passValue) {
    showError(confirmPassword, "Mật khẩu xác nhận không khớp.");
    return false;
  }
  showSuccess(confirmPassword);
  return true;
}

function validateGender() {
  let isChecked = false;
  for (const radio of genderInputs) {
    if (radio.checked) {
      isChecked = true;
      break;
    }
  }

  if (!isChecked) {
    genderError.classList.remove("d-none");
    return false;
  } else {
    genderError.classList.add("d-none");
    return true;
  }
}

function validateTerms() {
  if (!terms.checked) {
    showError(terms, "Bạn phải đồng ý với điều khoản dịch vụ.");
    return false;
  }
  showSuccess(terms);
  return true;
}

// --- EVENT LISTENERS ---

// 1. Validate realtime khi Blur (rời khỏi ô)
fullname.addEventListener("blur", validateFullname);
email.addEventListener("blur", validateEmail);
phone.addEventListener("blur", validatePhone);
password.addEventListener("blur", validatePassword);
confirmPassword.addEventListener("blur", validateConfirmPassword);

// 2. Xóa lỗi khi Input (bắt đầu nhập lại)
fullname.addEventListener("input", () => clearError(fullname));
email.addEventListener("input", () => clearError(email));
phone.addEventListener("input", () => clearError(phone));
password.addEventListener("input", () => clearError(password));
confirmPassword.addEventListener("input", () => clearError(confirmPassword));

// Sự kiện Change cho Radio & Checkbox
genderInputs.forEach((input) =>
  input.addEventListener("change", validateGender),
);
terms.addEventListener("change", validateTerms);

// 3. Xử lý Submit Form
form.addEventListener("submit", function (e) {
  // Ngăn chặn hành vi gửi form mặc định
  e.preventDefault();

  // Gọi tất cả hàm validate
  // Sử dụng toán tử Bitwise & để đảm bảo TẤT CẢ các hàm đều được chạy (không bị dừng sớm như &&)
  const isFullnameValid = validateFullname();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();
  const isGenderValid = validateGender();
  const isTermsValid = validateTerms();

  const isValid =
    isFullnameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid &&
    isConfirmValid &&
    isGenderValid &&
    isTermsValid;

  if (isValid) {
    // Xử lý thành công
    const name = fullname.value.trim();
    const container = document.querySelector(".registration-form");

    // Ẩn form và hiện thông báo
    container.innerHTML = `
      <div class="text-center p-5">
        <h2 class="text-success mb-3">Đăng ký thành công! 🎉</h2>
        <p class="lead">Chào mừng thành viên mới <strong>${name}</strong>.</p>
        <button class="btn btn-primary mt-3" onclick="location.reload()">Quay lại</button>
      </div>
    `;
  }
});
