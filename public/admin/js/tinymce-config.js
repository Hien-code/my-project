tinymce.init({
  selector: "#desc", // ID textarea đúng từ pug
  plugins: "advlist autolink lists link image charmap preview anchor",
  toolbar:
    "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent",
  license_key: "gpl", // Dùng bản open-source, không cần key thương mại
});
