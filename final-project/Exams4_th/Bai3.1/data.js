const registerForm = document.querySelector("#registerForm");

// Hàm helper để validate từng trường
function validateField(input, condition) {
  if (condition) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Xử lý sự kiện submit
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Lấy các phần tử input
  const fullname = document.querySelector("#fullname");
  const email = document.querySelector("#email");
  const phone = document.querySelector("#phone");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmPassword");
  const terms = document.querySelector("#terms");
  const genderInputs = document.querySelectorAll('input[name="gender"]');
  const genderError = document.querySelector("#genderError");

  // Định nghĩa Regex
  const fullnameRegex = /^[a-zA-ZÀ-ỹ\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{9}$/; // Thêm số 0 ở đầu theo yêu cầu của bạn
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  let isValid = true;

  // Tiến hành kiểm tra
  if (!validateField(fullname, fullnameRegex.test(fullname.value.trim())))
    isValid = false;
  if (!validateField(email, emailRegex.test(email.value.trim())))
    isValid = false;
  if (!validateField(phone, phoneRegex.test(phone.value.trim())))
    isValid = false;
  if (!validateField(password, passwordRegex.test(password.value.trim())))
    isValid = false;

  // Kiểm tra khớp mật khẩu
  if (
    !validateField(
      confirmPassword,
      confirmPassword.value === password.value && confirmPassword.value !== "",
    )
  ) {
    isValid = false;
  }

  // Kiểm tra checkbox điều khoản
  if (!validateField(terms, terms.checked)) isValid = false;

  // Kiểm tra giới tính (Radio)
  const isGenderSelected = Array.from(genderInputs).some((r) => r.checked);
  if (!isGenderSelected) {
    genderError.classList.remove("d-none");
    genderError.style.display = "block";
    isValid = false;
  } else {
    genderError.style.display = "none";
  }

  if (isValid) {
    alert("Đăng ký thành công!");
    // registerForm.submit(); // Gửi form đi nếu cần
  }
});
