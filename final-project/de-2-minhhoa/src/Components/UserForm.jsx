import { useState } from "react";

export default function UserForm({ isOpen, onClose, userEdit, onSave }) {
  const [name, setName] = useState(userEdit?.name || "");
  const [phone, setPhone] = useState(userEdit?.phone || "");
  const [email, setEmail] = useState(userEdit?.email || "");
  const [position, setPosition] = useState(userEdit?.position || "");
  const [gender, setGender] = useState(userEdit?.gender || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !position) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSave({
      id: userEdit ? userEdit.id : Date.now(),
      name,
      phone,
      email,
      position,
      gender,
    });
  };

  return (
    <form onSubmit={handleSubmit} id="userForm" className="">
      <div className="d-flex justify-content-between align-items-center border-bottom border-2 mb-3">
        <h2>{userEdit ? "Sửa Nhân Sự" : "Thêm Nhân Sự Mới"}</h2>
        <button
          id="btnCloseIcon"
          type="button"
          className="text-bg-white border-0"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c757d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ cursor: "pointer" }}
            title="Đóng"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="w-100 row">
        <div className="col-6 row-gap-2">
          <div className="d-flex flex-column">
            <label htmlFor="userName">Họ tên :</label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input border-2 text-dark border-dark radius-2 p-1"
            />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="userPhone">Số điện thoại</label>
            <input
              type="text"
              id="userPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input border-2 text-dark border-dark radius-2 p-1 mt-2"
            />
          </div>
          <div className="d-flex flex-column mt-3">
            <div htmlFor="userGender" id="userGender">
              Giới tính
            </div>
            <div className="d-flex column-gap-2">
              <div>
                <input
                  type="radio"
                  name="userGender"
                  id="userMale"
                  value="Nam"
                  checked={gender === "Nam"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="userMale">Nam</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="userGender"
                  id="userFemale"
                  value="Nữ"
                  checked={gender === "Nữ"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="userFemale">Nữ</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 row-gap-2">
          <div className="d-flex flex-column">
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input border-2 text-dark border-dark radius-2 p-1"
            />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="position-select" className="mb-2">
              Chọn vị trí công việc:
            </label>
            <select
              name="position"
              id="position-select"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="form-select border-2 text-dark border-dark radius-2 p-1"
            >
              <option value="" disabled>
                -- Chọn vị trí --
              </option>
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Product Owner">Product Owner</option>
              <option value="Business Analyst">Business Analyst</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Security Specialist">Security Specialist</option>
              <option value="Cloud Architect">Cloud Architect</option>
              <option value="Marketing Lead">Marketing Lead</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4 column-gap-2">
        <button
          id="btnCancel"
          type="button"
          onClick={onClose}
          className="btn btn-danger"
        >
          Cancel
        </button>
        <button id="btnSave" type="submit" className="btn btn-success">
          Save
        </button>
      </div>
    </form>
  );
}
