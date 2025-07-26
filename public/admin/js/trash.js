//Delete vĩnh viễn
const buttonHardDelete = document.querySelectorAll("[button-delete-hard]");
if (buttonHardDelete.length > 0) {
  const formDeleteHard = document.querySelector("#form-delete-hard");
  const path = formDeleteHard.getAttribute("data-path");

  buttonHardDelete.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này?"
      );
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteHard.action = action;
        formDeleteHard.submit();
      }
    });
  });
}

//Khôi phục xóa mềm
const buttonRestore = document.querySelectorAll("[button-restore]");
if (buttonRestore.length > 0) {
  const formRestore = document.querySelector("#form-restore");
  const path = formRestore.getAttribute("data-path");

  buttonRestore.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const isConfirm = confirm("Bạn có muốn khôi phục sản phẩm này?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=PATCH`;
        formRestore.action = action;
        formRestore.submit();
      }
    });
  });
}
