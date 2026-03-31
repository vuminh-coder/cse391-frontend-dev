const Constants = [
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
];

let UserData = JSON.parse(localStorage.getItem("UserData"));

if (!UserData || UserData.length === 0) {
  UserData = Constants;
  localStorage.setItem("UserData", JSON.stringify(UserData));
}

export default UserData;
