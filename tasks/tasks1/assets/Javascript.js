const bgBody = document.querySelector(".background");

const ContentCt = document.querySelector(".content-ct");
bgBody.addEventListener("click", () => {
  const BgBody = document.querySelector("body");

  if (BgBody) {
    const SetBgBody = BgBody.style;
    SetBgBody.background = "linear-gradient(to left , #f06bdc, #c3d9ef)";
  }

  if (ContentCt) {
    ContentCt.classList.add("._attributes");
  }
});
