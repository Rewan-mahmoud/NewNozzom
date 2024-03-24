/* eslint-disable no-prototype-builtins */
import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import  Table  from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import { deletePurchase, fetchPurchase, handleConvert } from "../../features/table/purchaseSlice";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BsFillTrashFill } from "react-icons/bs";
import { SlOptionsVertical } from "react-icons/sl";

const apiUrl = import.meta.env.VITE_APP_API;
import useToken from './../../hooks/useToken';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";

const PurchasesOrder = () => {
  const {t, i18n} = useTranslation()
  const {token, role, permissions} = useToken()
  const { dataSource, dataToFilter, loading, filterData, total, perPage } =
    useAll("purchase",  fetchPurchase);
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
  // const dataSource = [
  //   {
  //     key: "1",
  //     "اسم العميل": "احمد سامح",
  //     الهاتف: "01094743313",
  //     العنوان: "الشرقية",
  //     "تاريخ الفاتورة": "25/22/2020",
  //     "نوع الفاتورة": "فاتورة",
  //     "المجموع الفرعي": "0000",
  //     "قيمة الضريبة": "10",
  //     "المجموع الكلي": "10",
  //     "حالة العرض": "10",
  //   },
  //   {
  //     key: "2",
  //     "اسم العميل": "احمد سامح",
  //     الهاتف: "01094743313",
  //     العنوان: "الشرقية",
  //     "تاريخ الفاتورة": "25/22/2020",
  //     "نوع الفاتورة": "فاتورة",
  //     "المجموع الفرعي": "0000",
  //     "قيمة الضريبة": "10",
  //     "المجموع الكلي": "10",
  //     "حالة العرض": "10",
  //   },
  // ];
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    date: '',
    files: "",
    invoice_description: "",
    items: [],
  });

  const handleDelete = (item) => {
    // console.log(item.id)
    dispatch(deletePurchase({ id: item.id, token }));
  };

  const handleConverte = async (body) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let newBody = { ...data };
    let copiedObject = JSON.parse(JSON.stringify(body));
    Object.keys(copiedObject).map((item) => {
      if (newBody.hasOwnProperty(item)) {
        if (
          typeof copiedObject[item] === "object" &&
          copiedObject[item] !== null
        ) {
          copiedObject[item].map((i) =>
            Object.keys(i).map((e) => i[e] === null && (i[e] = ""))
          );
        }
        newBody = { ...newBody, [item]: copiedObject[item] };
      }
    });
    // console.log(newBody);
    let id = body.id;
    // console.log(id);

    return axios
      .post(`${apiUrl}convert_purchaseorder/${id}`, newBody, { headers })
      .then(() => dispatch(handleConvert(id)))
      .catch((err) => console.log(err));
  };
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
      title: t("branch"),
      dataIndex: "branche_name",
      key: "branches",
  },
    {
      title: t("customerName"),
      dataIndex: "customers.name",
      key: "اسم العميل",
    },

    {
      title: t("invoiceDate"),
      dataIndex: "date",
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
      title: t("total"),
      dataIndex: "total",
      key: "المجموع الكلي",
    },
    {
      title: "حالة العرض",
      dataIndex: "tranfire",
      key: "حالة العرض",
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
              permissions.includes("edit_purchaseorder") &&
              !Number(text.tranfire) ? (
                <Link to={`/add-purchase/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : (role === "admin" || role === "company") &&
                !Number(text.tranfire) ? (
                <Link to={`/add-purchase/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : null}
              {Number(text.tranfire) ? null : (
                <p onClick={() => handleConverte(text)}>
                  {t("invoice")} <BiEdit />
                </p>
              )}
              {role === "employee" &&
              permissions.includes("delete_purchaseorder") &&
              !Number(text.tranfire) ? (
                <p onClick={() => handleDelete(text)}>
                  {t("delete")}
                  <BsFillTrashFill />
                </p>
              ) : (role === "admin" || role === "company") &&
                !Number(text.tranfire) ? (
                <p onClick={() => handleDelete(text)}>
                  {t("delete")}
                  <BsFillTrashFill />
                </p>
              ) : null}
              {role === "employee" &&
              permissions.includes("view_purchaseorder") ? (
                <Link to={`/report/preview-sales/${text.id}/purchaseorder`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/purchaseorder`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ),
    },
  ];

  if (role === "employee" && !permissions.includes("purchaseorder")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("add_purchaseorder") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("add_purchaseorder"))
            ? i18n.language === "ar"
              ? "+ اضافة طلبية"
              : "Add an order +"
            : i18n.language === "ar"
            ? "+ اضافة طلبية"
            : "Add an order +"
        }
        placeholder={
          i18n.language === "ar" ? "ابحث عن طلبية" : "Search for an order"
        }
        columns={columns}
        dataSource={dataSource}
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-purchase/add`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchPurchase}
      />
    </div>
  );
}

export default PurchasesOrder