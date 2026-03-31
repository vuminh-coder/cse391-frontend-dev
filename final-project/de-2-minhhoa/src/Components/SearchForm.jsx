import { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
    }
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // Real-time search
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="d-flex justify-content-between text-bg-light p-2"
      id="searchForm"
    >
      <div className="d-flex align-items-center column-gap-3">
        <h1>Quản Lý Nhân Sự</h1>
        <a href="#" className="text-decoration-none text-dark">
          Trang Chủ
        </a>
        <a href="#" className="text-decoration-none text-dark">
          Liên Hệ
        </a>
      </div>

      <div className="d-flex align-items-center column-gap-3">
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          placeholder="Tìm kiếm ...."
          className="input border-2 text-dark border-dark radius-2 p-1"
          id="searchInput"
        />
        <button
          type="submit"
          className="btn border-success border-2 text-success text-align-left p-1"
        >
          Tìm
        </button>
      </div>
    </form>
  );
}
