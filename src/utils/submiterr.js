

// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate()

export const handleErrors = (data, dataSource, modalData, hidden) => {
  let err = {};
  modalData.map((item) => {
    if (item.required) {
      // console.log("req");
      if (data[item.name] === "")
        err[item.name] = { title: item.name, message: "هذا الحقل مطلوب" };
    }

    if (item.unique)
      dataSource.map(
        (ele) =>
          ele[item.name] === data[item.name] &&
          (err[item.name] = {
            title: item.name,
            message: "هذا الحقل مسجل بالفعل",
          })
      );
    if (
      item.validation &&
      item.validation(data[item.name]) &&
      item.required &&
      item.validation(data[item.name])
    ) {
      // console.log("validation");
      err[item.name] = {
        title: item.name,
        message: item.validation(data[item.name]),
      };
    }
    if (hidden && hidden.length && hidden.includes(item.name))
      hidden.map((item) => delete err[item]);
  });
  return err;
};

// export const handlSubmit = ( setErrors, data, modalData, dataSource, uri) => {
// //   e.preventDefault();
//   let err = {};
//   setErrors({});
//   err = handleErrors(data, dataSource, modalData);
//   // to={`/report/${1}/tax`}
//   if (Object.keys(err).length > 0) {
//     setErrors((prev) => ({ ...prev, ...err }));
//   } else {
//     const body = handleBodyData(data, [],  modalData);
//     const form = new FormData();
//     Object.keys(body).forEach((key) => {
//       form.append(key, body[key]);
//     });
//     console.log(body, uri);
//   }
// };
