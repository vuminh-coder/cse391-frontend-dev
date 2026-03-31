import { useState, useEffect } from "react";
import "./assets/css/bootstrap.min.css";
import "./App.css";
import SearchForm from "./Components/SearchForm";
import FromTable from "./Components/FromTable";
import UserForm from "./Components/UserForm";
import UserData from "./Components/DataJson";

// Make sure initial data has IDs
const initialDataWithIds = UserData.map((user, index) => ({
  ...user,
  id: user.id || Date.now() + index,
}));

function App() {
  const [listUser, setListUser] = useState(initialDataWithIds);
  const [userEdit, setUserEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("UserData", JSON.stringify(listUser));
  }, [listUser]);

  const handleDelete = (id) => {
    const newList = listUser.filter((user) => user.id !== id);
    setListUser(newList);
  };

  const handleEditClick = (user) => {
    setUserEdit(user);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setUserEdit(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setUserEdit(null);
  };

  const handleSave = (userData) => {
    if (userEdit) {
      // Update
      const newList = listUser.map((u) => 
        u.id === userData.id ? userData : u
      );
      setListUser(newList);
    } else {
      // Create
      setListUser([...listUser, userData]);
    }
    handleCloseForm();
  };

  const filteredUsers = listUser.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.phone?.includes(searchKeyword)
  );

  return (
    <>
      <SearchForm onSearch={setSearchKeyword} />
      <FromTable 
        listUser={filteredUsers} 
        onDelete={handleDelete} 
        onEdit={handleEditClick} 
        onAddClick={handleAddClick} 
      />
      <UserForm 
        key={userEdit ? userEdit.id : 'new'}
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        userEdit={userEdit} 
        onSave={handleSave} 
      />
    </>
  );
}

export default App;
