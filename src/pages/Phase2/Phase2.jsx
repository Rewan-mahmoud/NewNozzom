import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { handleBodyData } from "../../utils/bodyData";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../../hooks/useToken";
import {phase} from '../../features/auth/auth'
import {
  CheckInput,
  InputField,
  RadioInput,
  SelectInput,
  TextareaInput,
} from "../../components/Input/Inputs";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Phase2 = () => {
  const [data, setData] = useState({
    otp: "",
  });
  const [errors, setErrors] = useState({});

  const modalData0 = [
    {
      title: "OTP",
      name: "otp",
      id: 11,
      unique: false,
      required: true,
      validation: (value) => {
        if (value && (value.length < 6 || value.length > 6)) {
          return t("6 numbers");
        }
      },
      type: "text",
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
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
      />
    ),
    textarea: (item) => (
      <TextareaInput
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
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
    radio: (item) => (
      <RadioInput
        item={item}
        key={item.id}
        data={permissionData}
        // handleRadio={handleRadio}
        setFormData={setPermessionData}
        errors={errors}
        disabled={[]}
        setDisabled={() => {}}
      />
    ),
    checkbox: (item) => (
      <CheckInput
        item={item}
        key={item.id}
        data={permissionData}
        // handleRadio={handleRadio}
        setFormData={setPermessionData}
        errors={errors}
        disabled={[]}
        setDisabled={() => {}}
      />
    ),
  };

  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [btnLoader, setBtnLoader] = useState(false);
  const { id: empId } = useParams();
  const [render, setRender] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (empId) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(`${apiUrl}show_employee/${empId}`, {}, { headers })
        .then((res) => {
          // Object.keys(res.data.data.permissions).map((ele) =>
          //   // console.log(res.data.data.permissions[ele])
          // );
          let formData = { ...data };
          let permissData = { ...permissionData };
          Object.keys(data).map((item) => {
            formData[item] = res.data.data[item];
          });
          Object.keys(permissData).map((item) => {
            // formData[item] = res.data.data.permissions[item];
            if (res.data.data.permissions.includes(item)) {
              permissData[item] = "on";
            } else {
              permissData[item] = "off";
            }
          });
          setData(formData);
          setPermessionData(permissData);
          setLoading(false);
        });
    }
  }, []);

  // console.log(data)

  const handleErrors = (data, dataSource, modalData, hidden) => {
    let err = {};
    modalData.map((item) => {
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

  const handlSubmit = (e) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (!empId) {
      err = handleErrors(
        data,
        [],
        [
          ...modalData0
        ]
      );
    }
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData(data, null, [...modalData0]);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // console.log(body);
      // setLoading(true);
      setBtnLoader(true);
      
        axios
          .post(
            `${apiUrl}add_otp`,
            { ...body },
            { headers }
          )
          .then((res) => {
            console.log(res)
            setBtnLoader(false);
            if(res.data.success) {
              toast.success("تم انشاء الشهادة بنجاح", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              dispatch(phase(1))
            } else {
              toast.error(res.data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
            // navigate("/");
            // setLoading(false);
            // console.log(res.data.data.receipts);

            // dispatch(addTaxRep(res.data.data));
          })
          .catch((err) => {
            // setLoading(false);
            console.log(err)
            setBtnLoader(false);
            toast.error("حدث خطأ ما", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            // console.log(err);
            // dispatch(addProReb(err))
          });
      
    }
  };

  

  return (
    <div className="page-wrapper">
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
          <form
            className="form-wrapper update"
            onSubmit={(e) => handlSubmit(e)}
            // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            {/* <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              {t("empInfo")}
            </h2> */}
            {modalData0.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            {/* <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              الصفحة الرئيسية
            </h2> */}
            {/* {modalData1.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>{t("client")}</h2>
            {modalData2.map((item) => {
              return inputs[`${item.type}`](item);
            })}

            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>المنتجات</h2>
            {modalData3.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اقرار ضريبة القيمة المضافة
            </h2>
            {modalData4.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>مبيعات</h2>
            {modalData6.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>مشتريات</h2>
            {modalData8.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>السجل</h2>
            {modalData9.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>التقارير</h2>
            {modalData10.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>سند القبض</h2>
            {modalData11.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>ايصال الصرف</h2>
            {modalData12.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>عروض الاسعار</h2>
            {modalData13.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>طلبية الشراء</h2>
            {modalData7.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              فواتير بسدادات
            </h2>
            {modalData14.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              الارصدة الافتتاحية
            </h2>
            {modalData15.map((item) => {
              return inputs[`${item.type}`](item);
            })} */}
            {/* <div> */}
            <button
              className="btn"
              onClick={(e) => handlSubmit(e)}
              disabled={btnLoader}
            >
              {btnLoader ? <LoadSpinner btn={true} /> : t("confirm")}
            </button>
            {/* </div> */}
            <ToastContainer />
          </form>
        </>
      )}
    </div>
  );
};

export default Phase2;
