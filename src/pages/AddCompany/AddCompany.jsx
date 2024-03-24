import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { handleBodyData } from "../../utils/bodyData";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../../hooks/useToken";
import {
    FileInput,
  InputField,
  RadioInput,
  SelectInput,
} from "../../components/Input/Inputs";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { postActiveCom, updateActiveCom } from "../../features/table/activeCompanySlice";
import { useDispatch } from "react-redux";
import { getCountry } from "ts-country";
import { ToastContainer, toast } from "react-toastify";

const AddCompany = () => {
  
  const { t, i18n } = useTranslation();
  const countryInfo = getCountry(); 
  const [data, setData] = useState({
    email: "",
    email_address: "",
    password: "",
    name: "",
    phone: "",
    company_name: "",
    company_phone: "",
    company_address: "",
    tax_number: "",
    tax_date: "",
    number_of_accounts: "",
    haraye: "",
    strat_date: "",
    end_date: "",
    country_name: "",
    common_name: "",
    street_name: "",
    building_number: "",
    plot_identification: "",
    region: "",
    postal_number: "",
    business_category: "",
    egs_serial_number: "",
    city: "",
    organization_name: "",
    organization_unit_name: "",
    otp: "",
    invoice_type: "",
    crn: "",
    organization_industry: ''
  });
  const [permissionData, setPermessionData] = useState({
    "home" : "off",
    "customers" : "off",
    "products" : "off",
    "tax_return" : "off",
    "sales" : "off",
    "purchases" : "off",
    "log" : "off",
    "reports" : "off",
    "receipt_voucher" : "off",
    "receipt_cashing" : "off",
    "Quotations" : "off",
    "receipt_sadads" : "off",
    "purchaseorder" : "off",
    "pos": "off",
    "payonline": "off",
    "zatcaV2": 'off'

  });
  const [dd, setDd] = useState({
    is_production: 0,
    duplicated: 0,
  });
  const [errors, setErrors] = useState({});

  const modalData0 = [
    {
      title: "اسم الشركة",
      name: "company_name",
      id: 5,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "هاتف الشركة",
      name: "company_phone",
      id: 3,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "البريد الالكتروني الشركة",
      name: "email_address",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "عنوان الشركة",
      name: "company_address",
      id: 6,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "الرقم الضريبي",
      name: "tax_number",
      id: 10,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "التاريخ الضريبي",
      name: "tax_date",
      id: 4,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "فاتورة حرارية",
      name: "haraye",
      id: 12,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        { name: "نعم", value: "0", id: 0 },
        { name: "لا", value: "1", id: 1 },
      ],
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("streetName"),
      name: "street_name",
      id: 13,
      unique: false,
      required: false,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("buildNumber"),
      name: "building_number",
      id: 14,
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
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("cityName"),
      name: "city",
      id: 17,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("region"),
      name: "region",
      id: 20,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("egs"),
      placeholder: "1-ABC|2-ABC|3-ABC",
      name: "egs_serial_number",
      id: 21,
      unique: false,
      required: true,
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
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("business category"),
      placeholder: "",
      name: "business_category",
      id: 23,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("commonName"),
      placeholder: "",
      name: "common_name",
      id: 24,
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
      name: "organization_unit_name",
      id: 25,
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
      name: "organization_name",
      id: 26,
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
      id: 27,
      unique: false,
      required: false,
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
      name: "invoice_type",
      id: 28,
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
      title: t("is_production"),
      name: "is_production",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 0 },
        { name: "نعم", action: 1 },
      ],
      id: 100,
    },
    {
      title: "متماثل؟",
      name: "duplicated",
      id: 101,
      unique: false,
      required: true,
      validation: () => {},
      type: "radio",
      info: [
        { name: "لا", action: 0 },
        { name: "نعم", action: 1 },
      ],
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "النشاط التجاري",
      name: "organization_industry",
      id: 102,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        {
          value: "construction_building",
          name: "البناء والتشييد (مقاولات)",
          id: 0,
        },
        {
          value: "retail_trade_e_commerce_non_food",
          name: "قطاع التجزئة والتجارة الإلكترونية (غير الغذائية)",
          id: 1,
        },
        { value: "whole_Trade", name: "قطاع الجملة", id: 2 },
        { value: "food_and_beverage", name: "الأغذية والمشروبات", id: 3 },
        {
          value: "rental_Hiring_services_no_real_estate",
          name: "خدمات الإيجار (غير العقارات)",
          id: 4,
        },
        {
          value: "administrative_and_support_services",
          name: "الخدمات الإدارية والدعم",
          id: 5,
        },
        {
          value: "manufacturing",
          name: "التصنيع",
          id: 6,
        },
        {
          value: "agriculture_forestry_and_fishing",
          name: "القطاع الزراعي وتربية المواشي",
          id: 7,
        },
        {
          value: "logistics_transportation_and_storage",
          name: "الخدمات اللوجستية والنقل والتخزين",
          id: 8,
        },
        {
          value: "professional_services",
          name: "الخدمات المهنية",
          id: 9,
        },
        {
          value: "repair_and_maintenance_automotive_property",
          name: "اصلاح وصيانة (السيارات والعقارات)",
          id: 10,
        },
        {
          value: "education_and_training",
          name: "التعليم والتدريب",
          id: 11,
        },
        {
          value: "property_operation_and_real_estate_services",
          name: "الخدمات العقارية",
          id: 12,
        },
        {
          value: "technology_telecommunications_service",
          name: "تكنولوجيا / خدمات الاتصالات",
          id: 13,
        },
        {
          value: "accommodation_and_food_service",
          name: "خدمات الاعاشة والاقامة",
          id: 14,
        },
        {
          value: "arts_entertainment_and_recreation_service",
          name: "الاضافة والترفيه",
          id: 15,
        },
        {
          value: "financial_service_insurance",
          name: "الخدمات المالية والتأمين",
          id: 16,
        },
        {
          value: "media_and_publishing_and_distribution",
          name: "الاعلام والنشر والتوزيع",
          id: 17,
        },
        {
          value: "restaurants_and_cafes",
          name: "المطاعم والكافيهات",
          id: 18,
        },
      ],
      error: "",
      class: " w-100 input-group",
    },
  ];
  const [modalData1, setModalData1] = useState([
    {
      title: "اسم المستخدم",
      name: "name",
      id: 5,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "البريد الالكتروني",
      name: "email",
      id: 11,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "الهاتف الشخصي",
      name: "phone",
      id: 6,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "كلمة المرور",
      name: "password",
      id: 10,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "عدد الموظفين",
      name: "number_of_accounts",
      id: 15,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "تاريخ بداية الاشتراك",
      name: "strat_date",
      id: 12,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "تاريخ نهاية الاشتراك",
      name: "end_date",
      id: 13,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: " w-100 input-group",
    },
  ])
  const modalData2 = [
    {
      title: "الصفحة الرئيسية",
      name: "home",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "العملاء",
      name: "customers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "منتجات",
      name: "products",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 3,
    },
    { 
      title: "نقاط البيع",
      name: "pos",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 4,
    },
    {
      title: "مبيعات",
      name: "sales",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 6,
    },
    {
      title: "المشتريات",
      name: "purchases",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 8,
    },
    {
      title: "السجل",
      name: "log",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 9,
    },
    {
      title: "التقارير",
      name: "reports",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 10,
    },
    {
      title: "سند قبض",
      name: "receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 11,
    },
    {
      title: "ايصال صرف",
      name: "receipt_cashing",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 12,
    },
    {
      title: "عروض الاسعار",
      name: "Quotations",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 13,
    },
    {
      title: "فواتير سدادات",
      name: "receipt_sadads",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 14,
    },
    {
      title: "طلبية الشراء",
      name: "purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 15,
    },
    {
      title: "تفعيل المرحلة الثانية",
      name: "zatcaV2",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 17,
    },
    {
      title: "الدفع الالكتروني",
      name: "payonline",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 16,
    },
  ];
  const modalData3 = [
    {
      title: t("is_production"),
      name: "is_production",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 0 },
        { name: "نعم", action: 1 },
      ],
      id: 0,
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
  const inputss = {
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
    radio: (item) => (
      <RadioInput
        item={item}
        key={item.id}
        data={dd}
        setFormData={setDd}
        errors={errors}
        disabled={[]}
        setDisabled={() => {}}
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
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { t } = useTranslation();
  const [id, setId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const { id: empId } = useParams();
  const dispatch = useDispatch()

  useEffect(() => {
    if (empId) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const newData = {...data}
      setData({})
      delete newData["strat_date"];
      delete newData["end_date"];
      console.log(newData)
      setData(newData);
      console.log(data)
      axios
        .post(`${apiUrl}show_companyBYadmin/${empId}`, {}, { headers })
        .then((res) => {
          // Object.keys(res.data.data.permissions).map((ele) =>
          //   // console.log(res.data.data.permissions[ele])
          // );
          console.log(res.data.data)
          let formData = { ...data };
          let permissData = { ...permissionData };
          Object.keys(data).map((item) => {
            formData[item] = res.data.data[item];
          });
          console.log(formData)
          Object.keys(permissData).map((item) => {
            // formData[item] = res.data.data.permissions[item];
            if (res.data.data.modules.includes(item)) {
              permissData[item] = "on";
            } else {
              permissData[item] = "off";
            }
          });
          // delete formData["strat_date"];
          // delete formData["end_date"];
          setModalData1(modalData1.filter(
            (item) => item.name !== "strat_date" && item.name !== "end_date"
          ))

          console.log(modalData1)

          setData(formData);
          setPermessionData(permissData);
          setLoading(false);
        });
    }
  }, [empId]);

  // console.log(data)

  const handleErrors = (data, dataSource, modalData, hidden) => {
    let err = {};
    modalData.map((item) => {
      if (item.required) {
        // console.log("req", item);
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

  const handleCreate = async (form, body) => {
    console.log(body)
    try {
      let response;
      if (!empId) {
        console.log(form);
        response = await dispatch(
          postActiveCom({
            form,
            body,
            token: `Bearer ${token}`,
          })
        );
      } else {
        // console.log(body)
        response = await dispatch(
          updateActiveCom({
            ...body,
          })
        );
      }

      //   console.log(response);
      if (response.payload && response.payload.success) {
        let reset = { ...data };
        // console.log(reset)
        [...modalData0, ...modalData1, ...modalData2].map((item) => {
          // console.log(item)
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setBtnLoader(false);
          // setSuccess(true);
          toast.success("تم انشاء الشركة بنجاح", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setErrors({});
          if (item.type !== "radio") reset[item.name] = "";
          // let ele = item.title;
          setData({ ...reset });
        });
      }
      if (response.error) {
        setLoading(false);
        setBtnLoader(false);
      }
    } catch (err) {
      console.log(err, "error");
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
      setLoading(false);
      setBtnLoader(false);
    }
  };

  const handleEdit = async (form, body) => {
    try {
      let result = await dispatch(
        updateActiveCom({
          form,
          body,
          id: empId,
          token: `Bearer ${token}`,
        })
      );
      // console.log(body);
      if (result.payload.success) {
        let reset = { ...data };
        [...modalData0, ...modalData1, ...modalData2].map((item) => {
          setErrors({});
          if (item.type !== "radio") reset[item.title] = "";
          // let ele = item.title;
          setData(reset);
        });
       toast.success("تم تعديل الشركة بنجاح", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
       });
       setBtnLoader(false);
      //  setSuccess(true);
      }
    } catch (err) {
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
      setLoading(false);
      setBtnLoader(false);
    }
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    // const headers = {
    //   Authorization: `Bearer ${token}`,
    // };
    // console.log(e.target.name)
    err = handleErrors(
      data,
      [],
      [
        ...modalData0,
        ...modalData1,
        ...modalData2,
      ]
    );
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData({...data, ...dd}, null, [...modalData0]);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // console.log(body);
      // setLoading(true);
      setBtnLoader(e.target.name);
      if (empId) {
        handleEdit(form, { ...body, modules: { ...permissionData } });
      } else {
        handleCreate(form, {
          ...body,
          save_type: e.target.name,
          modules: { ...permissionData },
        },
        e.target.name
        );
      }
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
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>بيانات الشركة</h2>
            {modalData0.map((item) => {
              return inputss[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              بيانات المستخدم
            </h2>
            {modalData1.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>الصلاحيات</h2>
            {modalData2.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            {/* <h2 style={{ width: "100%", gridColumn: "1/-1" }}>الصلاحيات</h2>
            {modalData3.map((item) => {
              return inputss[`${item.type}`](item);
            })} */}
            <button
              className="btn"
              onClick={(e) => handlSubmit(e)}
              name="save"
              disabled={btnLoader === "save"}
            >
              {btnLoader === "save" ? <LoadSpinner btn={true} /> : t("confirm")}
            </button>
            <button
              className="btn"
              onClick={(e) => handlSubmit(e)}
              name="save_and_create_key"
              disabled={btnLoader === "save_and_create_key"}
            >
              {btnLoader === "save_and_create_key" ? (
                <LoadSpinner btn={true} />
              ) : (
                t("confirm & generate keys")
              )}
            </button>
            <ToastContainer />
          </form>
        </>
      )}
    </div>
  );
};

export default AddCompany;
