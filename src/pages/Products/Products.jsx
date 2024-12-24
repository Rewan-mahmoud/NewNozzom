import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import  Table  from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import { fetchProducts, postProduct, updateProduct } from "../../features/table/productSlice";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { Link, Navigate } from "react-router-dom";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import axios from "axios";
import { useSelector } from "react-redux";

const Products = () => {
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [activeFile, setActiveFile] = useState(false);
  const { role, permissions } = useToken();
  const [fileName, setFileName] = useState(null);
;

  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
    resetDataa,
  } = useAll("product", fetchProducts);
  const { token } = useToken();
  const { t, i18n } = useTranslation();

  const [data, setData] = useState({
    ar_name: "",
    en_name: "",
    cyril: "",
    purchaseprice: "",
    unite: "",
    barcode: "",
    unite_id: "",
    category_id: "",
    category: "",
    price: "",
    vat: "",
    reason: "",
    sales: 0,
    purchase: 0,
    active_pos: 0,
    type: 0,
    group_id: "",
    branche_id:[],
  });




  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      console.log(result)
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    axios.post("https://cashiry.nozzm.com/api/taxes_reason", {}).then(res => console.log(res)).catch(err => console.log(err))
  }, []);

  const [errors, setErrors] = useState({});
  const menuRef = useRef();
  const [list, setlist] = useState(false);


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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("arabicName"),
      dataIndex: "ar_name",
      key: "الاسم باللغة العربية",
    },
    {
      title: t("englishName"),
      dataIndex: "en_name",
      key: "الاسم باللغة الانجليزية",
    },
  //   {
  //     title: t("groups"),
  //     dataIndex: "group_name",
  //     key: "group",
  //   },
  //   {
  //     title: t("branch"),
  //     dataIndex: "branche_name",
  //     key: "branches",
  // },
    {
      title: t("serial"),
      dataIndex: "cyril",
      key: "الرقم التسلسلي",
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "التصنيفات",
    },
    {
      title: t("unites"),
      dataIndex: "unite",
      key: "وحدات القياس",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "النوع",
    },
    {
      title: t("vatRate"),
      dataIndex: "vat",
      key: "نسبة الضريبة",
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
                    permissions.includes("update_product") &&
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
              <Link
                to={`/product/${text.id}`}
                // onClick={() => setModal({ open: true, type: "view", data: text })}
              >
                {t("view")} <GrView />
              </Link>
            </div>
          )}
          {/* <button
            className="editBtn"
            onClick={() => setModal({ open: true, type: "edit", data: text })}
          >
            {t("edit")} <BiEdit />
          </button> */}
        </div>
      ),
    },
  ];

  const [modalData, setModalData] = useState([

    // {
    //   title: t("groups"),
    //   name: "group_id",
    //   id: 40,
    //   unique: false,
    //   required: false,
    //   validation: () => {},
    //   type: "select",
    //   getOptions: () => printOptions("show_groupbranches_all", "Groupbrances"),
    //   error: "",
    //   // style: { gridColumn: "1/2" },
    //   // class: "input-group input-class",
    //   // inputClass: "input-field",
    // },

    {
      title: t("type"),
      name: "type",
      id: 0,
      unique: false,
      required: true,
      type: "radio",
      info: [
        { name: t("product"), action: 1 },
        { name: t("service"), action: 0 },
      ],
      action: [],
      error: "",
    },
    {
      title: t("serial"),
      name: "cyril",
      id: 1,
      unique: false,
      required: false,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: "برجاء ادخال حروف انجليزية",
    },
    {
      title: t("arabicName"),
      name: "ar_name",
      id: 2,
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
      name: "en_name",
      id: 3,
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
      title: t("activePos"),
      name: "active_pos",
      id: 8,
      type: "radio",
      info: [
        { name: t("notActive"), action: 0 },
        { name: t("active"), action: 1 },
      ],
      // action: [""],
      error: "",
    },
    {
      title: t("isForSale"),
      name: "sales",
      id: 4,
      // unique: false,
      // required: true,
      type: "radio",
      info: [
        { name: t("notForSale"), action: 0 },
        { name: t("defineSale"), action: 1 },
      ],
      action: ["price"],
      error: "",
    },
    {
      title: t("salePrice"),
      name: "price",
      unique: false,
      required: true,
      id: 5,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },
    {
      title: t("isForPurchase"),
      name: "purchase",
      id: 6,
      type: "radio",
      info: [
        { name: t("notForPurchase"), action: 0 },
        { name: t("definePurchase"), action: 1 },
      ],
      action: ["purchaseprice"],
      error: "",
    },
    {
      title: t("purchasePrice"),
      name: "purchaseprice",
      id: 7,
      unique: false,
      required: true,
      // validation: ,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t("warnNumber");
        }
      },
      type: "text",
      error: t("warnNumber"),
    },

    {
      title: t("vatRate"),
      name: "vat",
      id: 12,
      validation: () => {},
      type: "select",
      // options: taxOptions,
      // getOptions: printOptions3,
      getOptions: () => printOptions("taxes_all", "taxes"),
      // options: [
      //   {name: 0, value: 0}
      // ],
      action: ["reason"],
      error: "",
      unique: false,
      required: true,
    },
    {
      title: t("reason"),
      name: "reason",
      id: 15,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("taxes_reason", "Taxesreason"),
      error: "",
    },
    {
      title: t("proCat"),
      name: "category_id",
      id: 10,
      type: "select",
      // options: catOptions,
      // getOptions: printOptions,
      // getOptions: () => printOptions("show_category_all", "category"),
      error: "",
      unique: false,
      required: true,
      
    },
    
    {
      title: t("proUnit"),
      name: "unite_id",
      id: 11,
      validation: () => {},
      type: "select",
      // options: unitOptions,
      // getOptions: printOptions2,
      getOptions: () => printOptions("unite_all", "Unites"),
      error: "",
      unique: false,
      required: true,
    },

    {
      title: t("barcode"),
      name: "barcode",
      id: 9,
      unique: false,
      required: false,
      validation: (value) => {
        // if (!/\d+$/g.test(value)) {
        //   return "يجب ادخال ارقام فقط";
        // }
        if (value.length < 12) return "يجب ادخال 12 رقم";
      },
      style: { gridColumn: "1/-1" },
      type: "text",
      error: "برجاء ادخال ارقام فقط",
    },
    {
      title: "الملف",
      name: "files",
      id: 13,
      unique: false,
      required: false,
      // validation: "",
      type: "file",
      error: "",
    },

    // {
    //   title: "نوع العميل",
    //   name: "customer_type",
    //   id: 10,
    //   // validation: "",
    //   type: "select",
    //   options: [
    //     { name: "فرد", value: "individual" },
    //     { name: "مؤسسة", value: "foundation" },
    //     { name: "شركة", value: "company" },
    //   ],
    //   error: "",
    // },
    // {
    //   title: "النوع",
    //   name: "type",
    //   id: 11,
    //   // validation: "",
    //   type: "select",
    //   options: [
    //     { name: "مورد", value: "supplier" },
    //     { name: "عميل", value: "customer" },
    //   ],
    //   error: "",
    // },
    // {
    //   title: "الملف",
    //   name: "files",
    //   id: 12,
    //   // validation: "",
    //   type: "file",
    //   error: "",
    // },
    ]);

    // useEffect(() => {
    //   let newData = [...modalData];
    //   if (role === "employee") {
    //       newData.unshift({
    //         title: t("groups"),
    //         name: "group_id",
    //         id: 21,
    //         unique: false,
    //         required: false,
    //         validation: () => {},
    //         type: "select",
    //         // disable: true,
    //         value:group_id,
    //         placeholder: group_name,
    //     });
    //     newData.splice(1, 0, {
    //       title: t("branch"),
    //       name: "branche_id",
    //       id: 22,
    //       unique: false,
    //       required: false,
    //       validation: () => {},
    //       type: "select",
    //       // disable: true,
    //       value:branche_id,
    //       placeholder: branche_name,
    //     });
    //   } 
    //   else  {
    //     newData.unshift({
    //     title: t("groups"),
    //     name: "group_id",
    //     id: 21,
    //     unique: false,
    //     required: false,
    //     validation: () => {},
    //     type: "select",
    //     getOptions: () =>
    //       printOptions("show_groupbranches_all", "Groupbrances"),
    //     });
    //   }
  
  
    //   setModalData(newData); // Update the state with the new array
    // }, []);



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
     console.log("setFilterOptions",setFilterOptions)
   });
 }, []);

  console.log(dataSource); 

  if (role === "employee" && !permissions.includes("view_list_products")) {
    return <Navigate to="/categorys" />;
  }

   const handleFilterReset = () => {
     resetDataa()
   };

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("create_product") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("create_product"))
            ? i18n.language === "ar"
              ? "+ اضافة صنف"
              : "Add product or service +"
            : i18n.language === "ar"
            ? "+ اضافة صنف"
            : "Add product or service +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن صنف"
            : "Search for product or service"
        }
        modal={modal}
        setModal={setModal}
        searchData={dataSource}
        // setDataToFilter={filterData}
        resetFilter={handleFilterReset}
        // filter={filterOptions}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        fetch={fetchProducts}
        total={total}
        perPage={perPage}
      />
      {modal.open && (
        <Modal
          dataSource={dataSource}
          // name={true}
          pro={true}
          postLoad={postLoad}
          setModal={setModal}
          setFileName={setFileName}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          fileName={fileName}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postProduct}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateProduct}
          inputClass={"input"}
          //essam api eddition
          // exludeData={["files", "address_en"]}
        />
      )}
    </div>
  );
}

export default Products


