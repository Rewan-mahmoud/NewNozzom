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

const InvoiceSetting = () => {
    const [data, setData] = useState({
      perfix_sales: "",
      suffix_sales: "",
      starting_sales: "",
      perfix_quotations: "",
      suffix_quotations: "",
      starting_quotations: "",
      perfix_purchase: "",
      suffix_purchase: "",
      starting_purchase: "",
      perfix_debitnote: "",
      suffix_debitnote: "",
      starting_debitnote: "",
      perfix_creditnote: "",
      suffix_creditnote: "",
      starting_creditnote: "",
      perfix_purchaseorder: "",
      suffix_purchaseorder: "",
      starting_purchaseorder: ''
    });
    const [errors, setErrors] = useState({});

    const modalData0 = [
      {
        title: "Prefix details",
        name: "perfix_sales",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_sales",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_sales",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
    ];
    const modalData1 = [
      {
        title: "Prefix details",
        name: "perfix_quotations",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_quotations",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_quotations",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
    ];
    const modalData2 = [
      {
        title: "Prefix details",
        name: "perfix_purchase",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_purchase",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_purchase",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
    ];
    const modalData3 = [
      {
        title: "Prefix details",
        name: "perfix_debitnote",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_debitnote",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_debitnote",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
    ];
    const modalData4 = [
      {
        title: "Prefix details",
        name: "perfix_creditnote",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_creditnote",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_creditnote",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
    ];
    const modalData5 = [
      {
        title: "Prefix details",
        name: "perfix_purchaseorder",
        id: 5,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Suffix",
        name: "suffix_purchaseorder",
        id: 11,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: "Starting number",
        name: "starting_purchaseorder",
        id: 10,
        unique: false,
        required: false,
        validation: () => {},
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
    const { t } = useTranslation();
    const [id, setId] = useState(null)
    const [success, setSuccess] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);

    // useEffect(() => {
    //   setLoading(true);
    //   const headers = {
    //     Authorization: `Bearer ${token}`,
    //   };
    //   axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
    //     // setData(prev => ({...prev, ...res.data.data}))
    //     console.log(res.data.data);
    //     Object.keys(data).map((key) => {
    //       setData((prev) => ({ ...prev, [key]: String(res.data.data[key]) }));
    //     });
    //     setLoading(false);
    //   });
    // }, []);

    // console.log(data)

    useEffect(() => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      setLoading(true)
      axios
        .post(`${apiUrl}show_starting`, {}, { headers })
        .then((res) => {
          let newData = {...data}
          Object.keys(newData).map(
            (item) => (newData[item] = res.data.data.StartingNumber[0][item])
          );
          setId(res.data.data.StartingNumber[0].company_id);
          setData(newData)
          setLoading(false)
        });
    }, [])


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
      err = handleErrors(
        data,
        [],
        [...modalData0, ...modalData1, ...modalData2, ...modalData3, ...modalData4, ...modalData5]
      );
      // to={`/report/${1}/tax`}
      if (Object.keys(err).length > 0) {
        setErrors((prev) => ({ ...prev, ...err }));
      } else {
        const body = handleBodyData(data, null, [
          ...modalData0,
          ...modalData1,
          ...modalData2,
          ...modalData3,
          ...modalData4,
          ...modalData5
        ]);
        const form = new FormData();
        Object.keys(body).forEach((key) => {
          form.append(key, body[key]);
        });
        console.log(body);
        // setLoading(true);
        setBtnLoader(true)
        axios
          .post(`${apiUrl}update_starting/${id}`, { ...body }, { headers })
          .then(() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
            setBtnLoader(false);
            setSuccess(true);
            // navigate("/");
            // setLoading(false);
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
        setSuccess(false);
      }, 2000);
    }, [success]);

  return (
    <div className="page-wrapper">
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
          {success && (
            <div className="success">
              <p>تم تحديث اعدادات الترقيم</p>
            </div>
          )}
          <form
            className="form-wrapper update"
            onSubmit={(e) => handlSubmit(e)}
            // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات فواتير المبيعات
            </h2>
            {modalData0.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات فاتورة المشتريات
            </h2>
            {modalData2.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات عرض السعر
            </h2>
            {modalData1.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات طلبية الشراء
            </h2>
            {modalData5.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات فواتير مرتجع المشتريات
            </h2>
            {modalData3.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اعدادات فواتير مرتجع المبيعات
            </h2>
            {modalData4.map((item) => {
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
}

export default InvoiceSetting