module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  //findIndex : Tìm bản ghi thỏa mãn điều kiện nào đó.
  //Lặp qua từng item của Mảng filterStatus
  //Lấy ra bản ghi == bản ghi người dùng truyển lên
  if (query.status) {
    const index = filterStatus.findIndex((item) => item.status == query.status);
    //Cập nhật lại bản ghi trong mảng có status = req.query.status(Người ta truyền lên)
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    //Cập nhật lại bản ghi trong mảng có status = req.query.status(Người ta truyền lên)
    filterStatus[index].class = "active";
  }
  return filterStatus;
};
