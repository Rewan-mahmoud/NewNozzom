import { useEffect, useRef, useState } from "react";
import useAll from "../../hooks/useAll";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import Form from "../../components/Form2/Form";
import Modal from "../../components/Modal/Modal";
import {
  fetchClients,
  postClients,
  updateClients,
} from "../../features/table/clientSlice";
import "../../styles/Clients.css";
import { BiEdit } from "react-icons/bi";
// import { GrView } from "react-icons/gr";
import "react-select-search/style.css";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import useToken from "../../hooks/useToken";
import { getCountry } from "ts-country";
import { getOptions } from "../../utils/getOption";
import { useSelector } from "react-redux";

const Clients = () => {
  const { t, i18n } = useTranslation();
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const userData = useSelector((state) => state.auth.data);
  const group_id = userData?.Branches?.[0]?.group_id;
  const branche_id = userData?.Branches?.[0]?.id; 
  const branche_name = userData?.Branches?.[0]?.name_ar; 
  const group_name = userData?.Branches?.[0]?.group_name; 
  
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    resetDataa,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("client", fetchClients);
  const { role, permissions, token } = useToken();

  const [data, setData] = useState({
    name: "",
    name_en: "",
    cr: "",
    phone: "",
    phone2: "",
    address: "",
    address_en: "",
    tax_card: "",
    tax_date: "",
    customer_type: "individual",
    type: "",
    files: "",
    street_name: "",
    building_number: "",
    plot_identification: "",
    city: "",
    region: "",
    postal_number: "",
    taxes_unable: 0,
    country: "",
    branche_id:[],
    group_id: "",
  });

  console.log("dataaa" , data)
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      console.log(result)
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const [errors, setErrors] = useState({});
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const countryInfo = getCountry();

  console.log(" dataSource ", dataSource);

  const handleClick = (e, text) => {
    // console.log('sec')
    e.stopPropagation();
    if (text.id === list) {
      setlist(false);
    } else {
      setlist(text.id);
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setlist(false);
      //  console.log('first')
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // const ref = useClickAway(() => {
  //   setlist(false);
  // });
  // console.log(countryInfo)
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("arabicName"),
      dataIndex: "name",
      key: "الاسم باللغة العربية",
    },
    {
      title: t("englishName"),
      dataIndex: "name_en",
      key: "الاسم باللغة الانجليزية",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "رقم الهاتف",
    },
    {
      title: t("vatNumber"),
      dataIndex: "tax_card",
      key: "الرقم الضريبي",
    },
    {
      title: t("country"),
      dataIndex: "country",
      key: "البلد",
    },
    {
      title: t("userType"),
      dataIndex: "type",
      key: "نوع المستخدم",
    },
    {
      title: t("clientType"),
      dataIndex: "customer_type",
      key: "نوع العميل",
    },
    {
      title: t("groups"),
      dataIndex: "group_name",
      key: "group",
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions",
      render: (text) => (
        <div className="settCol" style={{ position: "relative" }} ref={menuRef}>
          <div
            onClick={(e) => handleClick(e, text)}
            style={{ cursor: "pointer" }}
          >
            <SlOptionsVertical />
          </div>
          {list && text.id === list && (
            <div className="list-sm">
              <p
                onClick={() => {
                  // setlist(false)
                  if (
                    permissions.includes("update_customer") &&
                    role === "employee"
                  ) {
                    setModal({ open: true, type: "edit", data: text });
                  } else if (role === "admin" || role === "company") {
                    setModal({ open: true, type: "edit", data: text });
                  }
                }}
              >
                {t("edit")} <BiEdit />
              </p>
            </div>
          )}
       
        </div>
      ),
    },
  ];
  const [modalData, setModalData] = useState([
    {
      title: t("groups"),
      name: "group_id",
      id: 40,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_groupbranches_all", "Groupbrances"),
      error: "",
      // style: { gridColumn: "1/2" },
      // class: "input-group input-class",
      // inputClass: "input-field",
    },
    {
      title: t("vatStatus"),
      name: "taxes_unable",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: t("notregistered"), action: 0 },
        { name: t("registered"), action: 1 },
      ],
      action: [
        "tax_card",
        "tax_date",
        "street_name",
        "building_number",
        "plot_identification",
        "city",
        "region",
        "postal_number",
        "cr.required",
      ],
      id: 7,
    },
    {
      title: t("type"),
      name: "type",
      id: 11,
      unique: false,
      // validation: "",
      placeholder: t("cusVen"),
      required: true,
      type: "select",
      options: [
        { name: "مورد", value: "supplier", id: 0, name_en: "vendor" },
        { name: "عميل", value: "customer", id: 1, name_en: "customer" },
      ],
      error: "",
    },
    {
      title: t("arabicName"),
      name: "name",
      id: 0,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
    },
    {
      title: t("englishName"),
      name: "name_en",
      id: 1,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/^[^\u0600-\u06FF]+$/.test(value)) {
          return t("warnEnglish");
        }
      },
      type: "text",
      error: t("warnEnglish"),
    },

    {
      title: t("phone"),
      name: "phone",
      id: 3,
      unique: false,
      required: true,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },
    {
      title: t("phone2"),
      name: "phone2",
      id: 4,
      unique: false,
      required: false,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },
    {
      title: t("arabicAddress"),
      name: "address",
      id: 5,
      unique: false,
      required: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
    },
    {
      title: t("englishAddress"),
      name: "address_en",
      id: 6,
      unique: false,
      required: false,
      validation: () => {
        // if (!/^[a-zA-Z0-9\s_-]+$/.test(value)) {
        //   return "يجب ادخال احرف انجليزية";
        // }
      },
      type: "text",
      error: t("warnEnglish"),
    },
    {
      title: t("crNumber"),
      name: "cr",
      id: 2,
      unique: false,
      required: false,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: "",
    },
    {
      title: t("country"),
      name: "country",
      id: 21,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: Object.keys(countryInfo)
        // .filter((item) => item === "SA")
        .map((item) => ({
          value: countryInfo[item].name,
          name: countryInfo[item].name,
          id: item,
        })),
      error: "",
      class: " w-100 input-group",
    },

    {
      title: t("vatNumber"),
      name: "tax_card",
      unique: false,
      required: true,
      id: 8,
      validation: (value) => {
        if (!/^3\d{13}3$/.test(value)) {
          // console.log(value.length);
          return t("warn15");
        }
      },
      type: "text",
      error: "هذا الحقل يقبل ارقام فقط!",
    },
    {
      title: t("vatDate"),
      name: "tax_date",
      unique: false,
      id: 9,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },

    {
      title: t("legacyIntity"),
      name: "customer_type",
      id: 10,
      unique: false,
      // validation: "",
      type: "radio",
      required: true,
      info: [
        { name: t("person"), action: "individual" },
        { name: t("establishment"), action: "foundation" },
        { name: t("company"), action: "company" },
      ],
      // action: [
      //   "street_name",
      //   "building_number",
      //   "plot_identification",
      //   "city",
      //   "region",
      //   "postal_number",
      // ],
      // options: [
      //   { name: "فرد", value: "individual", id: 0 },
      //   { name: "مؤسسة", value: "foundation", id: 1 },
      //   { name: "شركة", value: "company", id: 2 },
      // ],
      error: "",
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
      id: 19,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
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
      title: "الملف",
      name: "files",
      id: 20,
      unique: false,
      required: false,
      type: "file",
      error: "",
    },
  ]);


  const [options, setOptions] = useState([]);


  useEffect(() => {
    printOptions("show_branches_all", "Branches").then((res) => {
      // options.push()
      let newOptions = [...options];
      newOptions.push(...res);
      setOptions(res);
    });
  }, []);
 
  const [filterOptions, setFilterOptions] = useState([]);
 
 
  useEffect(() => {
    printOptions("show_groupbranches_all", "Groupbrances").then((res) => {
      // options.push()
      let newOptions = [...filterOptions];
      newOptions.push(...res);
      setFilterOptions(res);
    });
  }, []);


  console.log(permissions);
  if (role === "employee" && !permissions.includes("view_list_customers")) {
    return <Navigate to="/categorys" />;
  }

  const handleFilterReset = () => {
    resetDataa();
  };

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("create_customer") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("create_customer"))
            ? i18n.language === "ar"
              ? "+ اضافة عميل او مورد"
              : "Add client or vendor +"
            : i18n.language === "ar"
            ? "+ اضافة عميل او مورد"
            : "Add client or vendor +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن عميل او مورد"
            : "Search for client or vendor"
        }
        modal={modal}
        setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
        resetFilter={handleFilterReset}
        filter={filterOptions}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchClients}
        resetFilter={handleFilterReset}
      />

     
   
      {modal.open && (
        <Modal
          dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postClients}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateClients}
          postLoad={postLoad}
          inputClass={"input"}
        />
      )}
    </div>
  );
};

export default Clients;
