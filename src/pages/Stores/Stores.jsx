import { useEffect, useRef, useState } from "react";
import useAll from "../../hooks/useAll";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import "../../styles/Clients.css";
import { BiEdit } from "react-icons/bi";
import "react-select-search/style.css";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import useToken from "../../hooks/useToken";
import { getOptions } from "../../utils/getOption";
import { useDispatch } from "react-redux";

import {
  fetchStores,
  postStore,
  updateStore,
} from "../../features/table/storeSlice";

const Stores = () => {
  const { t, i18n } = useTranslation();
  // const { token } = useToken();
  const { role, permissions, token } = useToken();
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

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
  } = useAll("store", fetchStores);
  const [data, setData] = useState({
    name_ar: "",
    name_en: "",
    phone: "",
    address_ar: "",
    address_en: "",
    branche_id: "",
  });
  const [errors, setErrors] = useState({});
  const menuRef = useRef();
  const [list, setlist] = useState(false);

  const handleClick = (e, text) => {
    e.stopPropagation();

    // Close the modal
    setModal({ open: false, type: "", data: null });
    if (text.id === list) {
      setlist(false);
    } else {
      setlist(text.id);
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setlist(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const modalData = [
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
      title: t("branch"),
      name: "branche_id",
      id: 7,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_branches_all", "Branches"),
      error: "",
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
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("branch"),
      dataIndex: "branche_name",
      key: "branches",
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
            : role === "admin" || role === "company"
            ? //   ||
              //   (role === "employee" && permissions.includes("create_customer"))
              i18n.language === "ar"
              ? "+ اضافة مخزن"
              : "Add store +"
            : i18n.language === "ar"
            ? "+ اضافة مخزن"
            : "Add store +"
        }
        placeholder={
          i18n.language === "ar" ? "ابحث عن مخزن" : "Search for Store"
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
        // fetch={updateBranch}
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
          dispatchMethod={postStore}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateStore}
          postLoad={postLoad}
          inputClass={"input"}
          //api eddition
          // exludeData={['address_en']}
        />
      )}
    </div>
  );
};

export default Stores;
