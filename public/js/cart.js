const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantity = input.value;
      const productId = input.getAttribute("product-id");
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
