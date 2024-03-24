import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import { fetchSalesR } from "../../features/table/salesRSlice";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import useToken from "../../hooks/useToken";

const SalesReturn = () => {
  // const [modal, setModal] = useState({ open: false, type: "", data: null });
  const { t, i18n } = useTranslation();
  const { dataSource, dataToFilter, loading, filterData, total, perPage } =
    useAll("salesR", fetchSalesR);
  const menuRef = useRef();
  const { token, role, permissions } = useToken();
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
      title: t("oldInvoice"),
      dataIndex: "old_new",
      key: "رقم الفاتورة القديمة",
    },
    {
      title: t("Invoice limit"),
      dataIndex: "sent_to_zatca_status",
      key: "حد الفاتورة",
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
              {/* <Link
                to={`/report/preview-sales/${text.id}/creditnote`}
                // className="viewBtn"
              >
                {t("view")} <GrView />
              </Link> */}
              {role === "employee" &&
              permissions.includes("print_salesReturns") ? (
                <Link to={`/report/preview-sales/${text.id}/creditnote`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/creditnote`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
              {role === "company" && permissions.includes("zatcaV2") && (
                <>
                  <p onClick={() => console.log(text)}>طباعة XML</p>
                  <p onClick={() => console.log(text)}>طباعة PDF/A3</p>
                  {/* {text.invoice_type_stander === "B2C" && (
                    <p onClick={() => console.log(text.invoice_type_stander)}>
                      تأكيد واعتماد
                    </p>
                  )} */}
                </>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  if (role === "employee" && !permissions.includes("view_list_salesReturns")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("salesReturns_request") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" &&
                permissions.includes("salesReturns_request"))
            ? i18n.language === "ar"
              ? "+ اضافة مرتجع"
              : "Add refund +"
            : i18n.language === "ar"
            ? "+ اضافة مرتجع"
            : "Add refund +"
        }
        placeholder={
          i18n.language === "ar" ? "ابحث عن مرتجع" : "Search for refund"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-refund/add`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchSalesR}
      />
    </div>
  );
};

export default SalesReturn;
