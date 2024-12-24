/* eslint-disable no-unused-vars */
import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import { deletePur, fetchPur } from "../../features/table/purSlice";
import { useState } from "react";
import useAll from "../../hooks/useAll";
import { Link, Navigate } from "react-router-dom";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";

const Purchases = () => {
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
  } = useAll("pur", fetchPur);
  const dispatch = useDispatch();
  const { token, role, permissions } = useToken();

  const handleDelete = (item) => {
    // console.log(item.id)
    dispatch(deletePur({ id: item.id, token }));
  };
  const menuRef = useRef();
  const [list, setlist] = useState(false);

  // const handleClick = (i) => {
  //   console.log(i)
  //   if (list === i.id) {
  //     console.log('first')
  //     return setlist(false);
  //   }
  //   setlist(i.id);
  // };
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

  // console.log(dataSource)

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("invoiceNumber"),
      dataIndex: "invoice_number",
      key: "رقم الفاتورة",
    },

    {
      title: t("vendorName"),
      dataIndex: "customers.name",
      key: "اسم المورد",
    },

    {
      title: t("invoiceDate"),
      dataIndex: "created_at",
      key: "تاريخ الفاتورة",
    },
    {
      title: t("invoiceType"),
      dataIndex: "paymentType",
      key: "نوع الفاتورة",
    },
    {
      title: t("subTotal"),
      dataIndex: "sub_total",
      key: "المجموع الفرعي",
    },
    {
      title: t("vatAmount"),
      dataIndex: "tax",
      key: "قيمة الضريبة",
    },
    {
      title: t("totall"),
      dataIndex: "total",
      key: "المجموع الكلي",
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
              

              {role === "employee" &&
              permissions.includes("update_purchases") ? (
                <Link to={`/add-pur/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/add-pur/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : null}
              {role === "employee" &&
              permissions.includes("purchasesReturns_request") &&
              text.show_add !== 1 ? (
                <Link to={`/add-pur/refund/${text.id}`}>
                  {t("purReqReturn")} <BiEdit />
                </Link>
              ) : (role === "admin" || role === "company") &&
                text.show_add !== 1 ? (
                <Link to={`/add-pur/refund/${text.id}`}>
                  {t("purReqReturn")} <BiEdit />
                </Link>
              ) : null}

              <p onClick={() => handleDelete(text)}>
                {t("delete")}
                <BsFillTrashFill />
              </p>
              {role === "employee" &&
              permissions.includes("print_purchases") ? (
                <Link to={`/report/preview-sales/${text.id}/purchases`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/purchases`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
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

  if (role === "employee" && !permissions.includes("view_list_purchases")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("create_purchases") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("create_purchases"))
            ? i18n.language === "ar"
              ? "+ اضافة فاتورة"
              : "Add invoice +"
            : i18n.language === "ar"
            ? "+ اضافة فاتورة"
            : "Add invoice +"
        }
        placeholder={
          i18n.language === "ar" ? "ابحث عن فاتورة" : "Search for invoice"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-pur/add`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchPur}
      />
    </div>
  );
};

export default Purchases;
