export default function FromTable({ listUser, onDelete, onEdit, onAddClick }) {
  return (
    <div id="table" className="mt-4 px-xxl-5">
      <header className="d-flex justify-content-between align-items-center">
        <h3>Danh Sách Nhân Sự</h3>
        <button
          className="btn btn-success"
          id="btnNewEmployee"
          onClick={onAddClick}
        >
          + Thêm Mới
        </button>
      </header>

      <table className="w-100 mt-5 table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vị trí</th>
            <th className="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {listUser.map((user, index) => (
            <tr key={user.id || index}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{user.name}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.phone}</td>
              <td className="text-center">
                <span className="badge bg-secondary">{user.position}</span>
              </td>
              <td className="d-flex justify-content-center border-0">
                <button className="btn border-0" onClick={() => onEdit(user)}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dfdf2b"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>

                <button
                  className="btn border-0"
                  onClick={() => onDelete(user.id)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc3545"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
