import { BiEdit } from 'react-icons/bi';
import PageHead from '../../components/PageHead/PageHead';
import  Table  from '../../components/Table/Table';
import { GrView } from 'react-icons/gr';
import useAll from '../../hooks/useAll';
import { deleteReceipt, fetchReceipt } from '../../features/table/receiptSlice';
import { Link, Navigate } from 'react-router-dom';
import { BsFillTrashFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import useToken from '../../hooks/useToken';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { SlOptionsVertical } from "react-icons/sl";

const PurchasesReturns = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    // error,
    filterData,
    total,
    perPage,
  } = useAll("receipt", fetchReceipt);
  
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { token, role, permissions } = useToken();

  const handleDelete = (item) => {
    // console.log(item.id)
    dispatch(deleteReceipt({ id: item.id, token }));
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
      title: t("payMethod"),
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
              {role === "employee" &&
              permissions.includes("update_purchasesReturns") ? (
                <Link to={`/add-refund-sale/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : role === "admin" ||
                (role === "company" && !permissions.includes("zatcaV2")) ? (
                <Link to={`/add-refund-sale/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : null}
              <p onClick={() => handleDelete(text)}>
                {t("delete")} <BsFillTrashFill />
              </p>

              {role === "employee" &&
              permissions.includes("print_purchasesReturns") ? (
                <Link to={`/report/preview-sales/${text.id}/depitnote`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/depitnote`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
              {role === "company" && permissions.includes("zatcaV2") && (
                <>
                  <p onClick={() => console.log(text)}>طباعة XML</p>
                  <p onClick={() => console.log(text)}>طباعة PDF/A3</p>
                  {/* {text.invoice_type === "B2C" && (
                    <p onClick={() => console.log(text.invoice_type)}>
                      تأكيد واعتماد
                    </p>
                  )} */}
                </>
              )}
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

  if (
    role === "employee" &&
    !permissions.includes("view_list_purchasesReturns")
  ) {
    return <Navigate to="/categorys" />;
  }
 
  return (
    <div className="page-wrapper">
      <PageHead
        btn={i18n.language === "ar" ? "+ اضافة مرتجع" : "Add refund +"}
        placeholder={
          i18n.language === "ar" ? "ابحث عن مرتجع" : "Search for refund"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-refund-sale/add`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchReceipt}
      />
    </div>
  );
}

export default PurchasesReturns