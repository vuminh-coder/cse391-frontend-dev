# HƯỚNG DẪN MINH HỌA - QUẢN LÝ NHÂN SỰ

## I. PHÂN TÍCH YÊU CẦU
- Xây dựng giao diện quản lý nhân sự
- Có form thêm mới (popup)
- Có dữ liệu mẫu (giả lập CSDL)
- Validate dữ liệu nhập
- Hiển thị dữ liệu ra danh sách
- Xây dựng lại bằng ReactJS

---

## II. PHẦN 1: HTML + CSS (GIAO DIỆN TĨNH)

### 1. Thiết kế layout chính
- Tạo bố cục tổng thể:
  - Header (tiêu đề)
  - Khu vực nội dung chính
  - Bảng hiển thị danh sách nhân sự
  - Nút "Add" / "Thêm mới"

### 2. Thiết kế bảng dữ liệu
- Xác định các cột thông tin:
  - Họ tên
  - Email
  - Số điện thoại
  - Ngày sinh / thông tin khác (nếu có)
- Tạo dữ liệu mẫu (hard-code trực tiếp trong HTML)

### 3. Thiết kế form (popup)
- Tạo form dạng pop-up (ẩn/hiện)
- Các trường input:
  - Họ tên
  - Email
  - Số điện thoại
  - Các trường bổ sung
- Nút Submit / Cancel

---

## III. PHẦN 2: JAVASCRIPT (JS / JQUERY)

### 1. Tạo dữ liệu giả lập (data.js)
- Tạo file `data.js`
- Khai báo mảng JSON
- Tối thiểu 5 bản ghi
- Dữ liệu phù hợp với bảng đã thiết kế

### 2. Xử lý hiển thị dữ liệu
- Đọc dữ liệu từ file `data.js`
- Render dữ liệu ra bảng HTML

### 3. Xử lý form popup
- Viết chức năng:
  - Mở form khi click "Add"
  - Đóng form khi cancel

### 4. Validate dữ liệu (HTML5 + JS)
- Kiểm tra:
  - Không được bỏ trống
  - Họ tên ≤ 30 ký tự
  - Email đúng định dạng
  - SĐT = 10 chữ số
- Sử dụng:
  - Required
  - maxlength / minlength
  - type="email"
- Hiển thị thông báo lỗi (bằng tiếng Anh)

### 5. Xử lý thêm dữ liệu
- Lấy dữ liệu từ form
- Kiểm tra validate:
  - Nếu sai → hiển thị lỗi
  - Nếu đúng → thêm vào danh sách
- Cập nhật lại bảng hiển thị

---

## IV. PHẦN 3: REACTJS

### 1. Khởi tạo project React
- Tạo project React
- Dọn dẹp cấu trúc ban đầu

---

### 2. Phân tích và chia Component
- Xác định các component:
  - App (cha)
  - EmployeeList (danh sách)
  - EmployeeItem (1 dòng)
  - EmployeeForm (form thêm mới)
- Xác định:
  - Component nào chứa State
  - Component nào nhận Props

---

### 3. Bước 1: Xây dựng giao diện tĩnh
- Chuyển giao diện HTML sang React
- Tạo dữ liệu cứng trong component
- Hiển thị danh sách từ dữ liệu cứng

---

### 4. Bước 2: Load dữ liệu từ data.js
- Import dữ liệu từ file `data.js`
- Lưu vào State trong component cha
- Truyền dữ liệu xuống component con qua Props

---

### 5. Bước 3: Hiển thị dữ liệu động
- Duyệt mảng dữ liệu
- Render danh sách bằng component con
- Hiểu rõ:
  - State: nơi lưu dữ liệu
  - Props: truyền dữ liệu

---

### 6. Thêm mới dữ liệu

#### a. Lấy dữ liệu từ form
- Xử lý sự kiện:
  - onChange (cập nhật input)
  - onSubmit (submit form)

#### b. Validate dữ liệu
- Kiểm tra các điều kiện giống phần JS:
  - Không rỗng
  - Đúng định dạng
- Nếu sai:
  - Hiển thị lỗi
- Nếu đúng:
  - Cho phép thêm

#### c. Thêm dữ liệu vào State
- Cập nhật danh sách nhân sự
- Render lại UI

---

## V. TIÊU CHÍ HOÀN THÀNH

### 1. Chức năng
- Hiển thị danh sách đúng
- Thêm mới hoạt động
- Validate chính xác

### 2. Giao diện
- Rõ ràng, dễ nhìn
- Popup hoạt động tốt

### 3. Mã nguồn
- Tổ chức rõ ràng
- Dễ đọc, dễ hiểu
- Đúng cấu trúc React

---


## VI. KẾT LUẬN

- Bài tập tập trung vào:
  - Tư duy UI
  - Xử lý dữ liệu
  - Hiểu State & Props trong React
- Cần làm rõ luồng dữ liệu:
  - Input → Validate → State → UI