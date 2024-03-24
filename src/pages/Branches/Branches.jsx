import { useEffect, useRef, useState } from "react";
import useAll from "../../hooks/useAll";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
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
import { fetchBranches, postBranch, updateBranch } from "../../features/table/branchSlice";
import { getOptions } from "../../utils/getOption";
const Branches = () => {
  const { t, i18n } = useTranslation();
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("branch", fetchBranches);
  const { role, permissions, token } = useToken();
  const [data, setData] = useState({
    name_ar: "",
    name_en: "",
    crn: "",
    phone: "",
    address_ar: "",
    address_en: "",
  });

  const [errors, setErrors] = useState({});
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const countryInfo = getCountry();
  // const { token, role } = useToken();

//   console.log(countryInfo);

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

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("data" , role)
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
      dataIndex: "name_ar",
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
    // {
    //   title: t("vatNumber"),
    //   dataIndex: "tax_card",
    //   key: "الرقم الضريبي",
    // },
    // {
    //   title: t("userType"),
    //   dataIndex: "type",
    //   key: "نوع المستخدم",
    // },
    // {
    //   title: t("clientType"),
    //   dataIndex: "customer_type",
    //   key: "نوع العميل",
    // },
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

  const modalData = [
    {
      title: t("groups"),
      name: "group_id",
      id: 7,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_groupbranches_all", "Groupbrances") ,
      error: "",
      // style: { gridColumn: "1/2" },
      // class: "input-group input-class",
      // inputClass: "input-field",
    },
    {
      title: t("arabicName"),
      name: "name_ar",
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
      required: false,
      validation: (value) => {
        if (!/^[^\u0600-\u06FF]+$/.test(value)) {
          return t("warnEnglish");
        }
      },
      type: "text",
      error: t("warnEnglish"),
    },
    {
      title: t("crNumber"),
      name: "crn",
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
      title: t("arabicAddress"),
      name: "address_ar",
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
  ];
//   if (role === "employee" && !permissions.includes("view_list_customers")) {
//     return <Navigate to="/categorys" />;
//   }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
        //   !permissions.includes("create_customer") && 
          role === "employee"
            ? false
            : role === "admin" ||
              role === "company" 
            //   ||
            //   (role === "employee" && permissions.includes("create_customer"))
            ? i18n.language === "ar"
              ? "+ اضافة فرع"
              : "Add branch +"
            : i18n.language === "ar"
            ? "+ اضافة فرع"
            : "Add branch +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن فرع"
            : "Search for Branch"
        }
        modal={modal}
        setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchBranches}
      />
      {modal.open && (
        <Modal
        name={true}
          dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postBranch}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateBranch}
          postLoad={postLoad}
          inputClass={"input"}
        />
      )}
    </div>
  );
};

export default Branches;
