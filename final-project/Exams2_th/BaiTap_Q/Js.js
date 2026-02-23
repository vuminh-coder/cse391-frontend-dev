const listImg = [...document.querySelectorAll(".listImg img")];
const imgFullSize = document.querySelector(".img_FullSize img");

if (imgFullSize && listImg.length) {
  imgFullSize.src = listImg[0].getAttribute("src");
}

listImg.forEach((item) => {
  item.addEventListener("click", () => {
    if (imgFullSize) {
      imgFullSize.src = item.getAttribute("src");
      removeAllActive();
      item.classList.add("active");
    }
  });
});

const removeAllActive = () => {
  const AllActive = [...document.querySelectorAll(".listImg img.active")];
  AllActive.forEach((item) => {
    item.classList.remove("active");
  });
};
