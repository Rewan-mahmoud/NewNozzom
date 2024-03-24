/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { apiUrl } from '../../features/table/billSlice';
import { handleBodyData } from '../../utils/bodyData';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useToken from '../../hooks/useToken';
import { FileInput, InputField, SelectInput } from '../../components/Input/Inputs';
import { useNavigate } from 'react-router-dom';
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getCountry } from "ts-country";
import { toast } from 'react-toastify';


const EditProfile = () => {
  const { t, i18n } = useTranslation();
  const countryInfo = getCountry(); 
    const [success, setSuccess] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [data, setData] = useState({
      company_name: "",
      company_phone: "",
      company_address: "",
      tax_number: "",
      bank_account_number: "",
      bank_name: "",
      world_bank_code: "",
      haraye: "",
      purchaseorder_num: "",
      purchases_num: "",
      purchasesreturn_num: "",
      salesreturn_num: "",
      sales_num: "",
      quotation_num: "",
      email: "",
      username: "",
      phoneuser: "",
      logo: "",
      header: "",
      footer: "",
      plot_identification: "",
      street_name: "",
      region: "",
      invoice_type: "",
      is_production: "",
      postal_number: "",
      egs_serial_number: "",
      otp: "",
      crn: "",
      organization_name: "",
      organization_unit_name: "",
      country_name: "",
      business_category: "",
      building_number: "",
      common_name: ''
    });
    const [errors, setErrors] = useState({});
    // console.log()
    // Object.keys(countryInfo).map((item) =>
    //   console.log(item)
    // );
    const modalData = [
      {
        title: t("companyName"),
        name: "company_name",
        id: 2,
        disable: true,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group",
      },
      {
        title: t("companyPhone"),
        name: "company_phone",
        disable: true,
        id: 1,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: "w-100 input-group",
      },

      {
        title: t("companyAddress"),
        name: "company_address",
        id: 3,
        disable: true,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group ",
      },

      {
        title: t("vatNumber"),
        name: "tax_number",
        id: 4,
        disable: true,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("streetName"),
        name: "street_name",
        id: 13,
        unique: false,
        disable: true,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("CRN"),
        name: "crn",
        id: 22,
        unique: false,
        required: true,
        disable: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("buildNumber"),
        name: "building_number",
        id: 14,
        disable: true,
        unique: false,
        required: true,
        validation: (value) => {
          if (value && (value.length < 4 || value.length > 4)) {
            return t("4 numbers");
          }
        },
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("plotIdentification"),
        name: "plot_identification",
        id: 16,
        unique: false,
        required: true,
        validation: (value) => {
          if (value && (value.length < 4 || value.length > 4)) {
            return t("4 numbers");
          }
        },
        type: "text",
        disable: true,
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("cityName"),
        name: "city_name",
        id: 17,
        unique: false,
        required: true,
        disable: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("region"),
        name: "region",
        id: 17,
        unique: false,
        required: true,
        disable: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("egs sereial number"),
        placeholder: "1-ABC|2-ABC|3-ABC",
        name: "egs_serial_number",
        id: 17,
        disable: true,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("business category"),
        placeholder: "",
        name: "business_category",
        id: 17,
        unique: false,
        disable: true,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("commonName"),
        placeholder: "",
        name: "commonName",
        id: 17,
        disable: true,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("organizationUnitName"),
        placeholder: "",
        disable: true,
        name: "organization_unit_name",
        id: 17,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("organizationName"),
        placeholder: "",
        disable: true,
        name: "organization_name",
        id: 17,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("OTP"),
        placeholder: "",
        name: "otp",
        disable: true,
        id: 17,
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
      {
        title: t("invoiceType"),
        placeholder: "",
        disable: true,
        name: "invoice_type",
        id: 17,
        unique: false,
        required: true,
        validation: () => {},
        type: "select",
        options: [
          { value: "1100", name: "Simplified And Standard", id: 0 },
          { value: "0100", name: "Simplified", id: 1 },
          { value: "1000", name: "Standard", id: 2 },
        ],
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("postalZone"),
        name: "postal_number",
        id: 18,
        disable: true,
        unique: false,
        required: true,
        validation: (value) => {
          if (value && (value.length < 5 || value.length > 5)) {
            return t("5 numbers");
          }
        },
        type: "text",
        error: "",
        class: " w-100 input-group",
      },
      {
        title: t("country"),
        name: "country_name",
        disable: true,
        id: 19,
        unique: false,
        required: true,
        validation: () => {},
        type: "select",
        options: Object.keys(countryInfo)
          .filter((item) => item === "SA")
          .map((item) => ({
            value: item,
            name: countryInfo[item].native,
            id: item,
          })),
        error: "",
        class: " w-100 input-group",
      },

      {
        title: t("logo"),
        name: "logo",
        id: 6,
        unique: false,
        required: false,
        validation: () => {},
        type: "file",
        error: "",
        class: " w-100 input-group ",

        // style: {width: '100%'}
      },
    ];
    const modalData2 = [
      {
        title: "userName",
        name: "username",
        // disable: true,
        id: 2,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group",
      },
      {
        title: "email",
        name: "email",
        id: 1,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        class: "w-100 input-group",
      },

      {
        title: "phone",
        // disable: true,
        name: "phoneuser",
        id: 3,
        unique: false,
        required: true,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group ",
      },
    ];
    const modalData3 = [
      {
        title: "bankNo",
        name: "bank_account_number",
        // disable: true,
        id: 2,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group",
      },
      {
        title: "bankName",
        name: "bank_name",
        id: 1,
        // disable: true,
        unique: false,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        class: "w-100 input-group",
      },

      {
        title: "iban",
        name: "world_bank_code",
        id: 3,
        unique: false,
        // disable: true,
        required: false,
        validation: () => {},
        type: "text",
        error: "",
        // class: "input-group input-class",
        class: "w-100 input-group ",
      },
      {
        title: "invHeader",
        name: "header",
        id: 6,
        unique: false,
        required: false,
        validation: () => {},
        type: "file",
        error: "",
        class: " w-100 input-group ",
        style: { gridColumn: "unset" },

        // style: {width: '100%'}
      },
      {
        title: "invFooter",
        name: "footer",
        id: 4,
        unique: false,
        required: false,
        validation: () => {},
        type: "file",
        error: "",
        class: " w-100 input-group ",
        style: { gridColumn: "unset" },

        // style: {width: '100%'}
      },
      {
        title: "تفعيل الطباعة الحراري",
        name: "haraye",
        id: 8,
        unique: false,
        required: false,
        validation: () => {},
        // disable: true,
        type: "select",
        error: "",
        options: [
          { name: "نعم", value: "1" },
          { name: "لا", value: "0" },
        ],
        // class: "input-group input-class",
        class: "w-100 input-group",
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
      file: (item) => (
        <FileInput
          item={item}
          key={item.id}
          data={data}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
        />
      ),
    };

    const { token } = useToken();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      setLoading(true)
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.post(`${apiUrl}show_company`, {}, {headers}).then(res => {
        // setData(prev => ({...prev, ...res.data.data}))
        console.log(res.data.data)
        Object.keys(data).map(key => {
          setData(prev => ({...prev, [key]:String(res.data.data[key])}));
        })
        setLoading(false)
      })
    }, [])

   
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

    const handlSubmit = (e, uri) => {
      e.preventDefault();
      window.scrollTo(0, 0)
      let err = {};
      setErrors({});
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      err = handleErrors(data, [], [...modalData, ...modalData2, ...modalData3]);
      // to={`/report/${1}/tax`}
      if (Object.keys(err).length > 0) {
        setErrors((prev) => ({ ...prev, ...err }));
      } else {
        const body = handleBodyData(data, null, [
          ...modalData,
          ...modalData2,
          ...modalData3,
        ]);
        const form = new FormData();
        Object.keys(body).forEach((key) => {
          form.append(key, body[key]);
        });
         console.log(body);
        setBtnLoader(true);
        axios
          .post(`${apiUrl}update_company`, form, { headers })
          .then((res) => {
            console.log(body);
            setBtnLoader(false);
            toast.success("Succeful payment!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            // window.scrollTo(0, 0)
            // window.scrollTo({
            //   top: 0,
            //   behavior: "smooth",
            // })
            // window.scrollBy({
            //   top: 0
            // })
            setSuccess(true)
            // navigate('/')
            // console.log(res.data.data.receipts);

            // dispatch(addTaxRep(res.data.data));
          })
          .catch((err) => {
            // setLoading(false);
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
            setBtnLoader(false)
            console.log(err);
            // dispatch(addProReb(err))
          });
      }
    };

    // const handleNavigate = () => {
    //   if (dataSource.length > 0) navigate(`/report/tax/${data["type"]}`);
    // };
  return (
    <div className="page-wrapper">
      {loading ? <LoadSpinner/> : <>
      {/* {success && <div
      className='success'
      ><p></p></div>} */}
      <form
        className="form-wrapper update"
        onSubmit={(e) => handlSubmit(e)}
        // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <h2 style={{ width: "100%", gridColumn: "1/-1" }}>{t('userInfo')}</h2>
        {/* <hr /> */}
        {modalData2.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <h2 style={{ width: "100%", gridColumn: "1/-1" }}>{t('bankInfo')}</h2>
        {modalData3.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onClick={(e) => handlSubmit(e)} disabled={btnLoader}>
          {btnLoader ? <LoadSpinner btn={true} /> : t("confirm")}
        </button>
      </form></>}
    </div>
  );
}

export default EditProfile