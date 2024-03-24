import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { handleBodyData } from "../../utils/bodyData";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../../hooks/useToken";
import { InputField, SelectInput } from "../../components/Input/Inputs";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const [data, setData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "password",
      name: "password",
      id: 5,
      unique: false,
      required: true,
      validation: (value) => {
        console.log(value);
        if (value.length < 8) return "يجب ان لا تقل كلمة السر عن 8 ";
      },
      type: "password",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "passCon",
      name: "password_confirmation",
      id: 7,
      unique: false,
      required: true,
      validation: (value) => {
        if (value !== data["password"]) return "برجاء تأكيد كلمة السر";
      },
      type: "password",
      error: "",
      class: " w-100 input-group",
    },
  ];
  const inputs = {
    select: (item) => (
      <SelectInput
        // note={note}
        // custom={custom}
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
      />
    ),
    password: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
  };

  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [success, setSuccess] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false)
  
//   useEffect(() => {
//     setLoading(true);
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };
//     axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
//       // setData(prev => ({...prev, ...res.data.data}))
//       console.log(res.data.data);
//       Object.keys(data).map((key) => {
//         setData((prev) => ({ ...prev, [key]: String(res.data.data[key]) }));
//       });
//       setLoading(false);
//     });
//   }, []);

  // console.log(data)

  const handleErrors = (data, dataSource, modalData, hidden) => {
    let err = {};
    // if(data.password === data.password_confirmation) {
    //   err 
    // }
    modalData.map((item) => {
      // if(data[item.name]){

      // }
      if (item.required) {
        // console.log("req");
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t("required") };
      }

      if (item.unique)
        dataSource.map(
          (ele) =>
            ele[item.name] === data[item.name] &&
            (err[item.name] = {
              title: item.name,
              message: t("fieldExist"),
            })
        );
      if (
        item.validation &&
        item.validation(data[item.name]) &&
        // item.required &&
        data[item.name] !== ''
      ) {
        console.log("validation");
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

  const handlSubmit = (e, uri) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    err = handleErrors(data, [], [...modalData]);
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData(data, null, [...modalData]);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      console.log(body);
      // if()
      setBtnLoader(true);
      axios
        .post(`${apiUrl}update_password`, { ...body }, { headers })
        .then((res) => {
          console.log(res);
          setSuccess(true)
          // navigate("/");
          setBtnLoader(false);
          // console.log(res.data.data.receipts);

          // dispatch(addTaxRep(res.data.data));
        })
        .catch((err) => {
          // setLoading(false);
          console.log(err);
          // dispatch(addProReb(err))
        });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false)
    }, 2000)
  }, [success])
  return (
    <div className="page-wrapper">
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
            {success && <div className="success">
              <p>تم تغيير كلمة السر بنجاح</p>
            </div>}
        <form
          className="form-wrapper update"
          onSubmit={(e) => handlSubmit(e)}
          // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {modalData.map((item) => {
            return inputs[`${item.type}`](item);
          })}
          {/* <h2 style={{ width: "100%", gridColumn: "1/-1" }}>بيانات المستخدم</h2> */}
          {/* <hr /> */}
          <button className="btn" onClick={(e) => handlSubmit(e)} disabled={btnLoader}>
            {btnLoader ? <LoadSpinner btn={true} /> : t("confirm")}
          </button>
        </form>
        </>
      )}
    </div>
  );
};

export default ForgetPassword;
