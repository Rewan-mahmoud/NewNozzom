import { GrView } from "react-icons/gr";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { BiEdit, BiDollar } from "react-icons/bi";
import useAll from "../../hooks/useAll";
import { fetchSales, updateSales } from "../../features/table/salesSlice";
import { useEffect, useRef, useState } from "react";
// import { useDispatch } from 'react-redux';
import Modal from "../../components/Modal/Modal";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SlOptionsVertical } from "react-icons/sl";
import useToken from "../../hooks/useToken";
import { Dialog } from "@mui/material";
// import { Checkout } from '../../components/Checkout/Checkout';
import CloseIcon from "@mui/icons-material/Close";
// import { PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';

// import { createToken } from "moyasar";
// import axios from 'axios';
// import useToken from '../../hooks/useToken';
// import {createTok} from "../../moyasar";

// const apiUrl = import.meta.env.VITE_APP_API;

const Receipt = () => {
  // const [stripePromise, setStripePromise]= useState(null)
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
  } = useAll("sales", fetchSales);

  // useEffect(() => {
  //   if(Moyasar) {

  //   }
  // }, [])
  // const [cardNumber, setCardNumber] = useState("");
  // const [expiryMonth, setExpiryMonth] = useState("");
  // const [expiryYear, setExpiryYear] = useState("");
  // const [cvv, setCvv] = useState("");

  // const handlePayment = async (e) => {
  //   e.preventDefault();

  //   // Create a token using Moyasar
  //   const token = await createToken({
  //     card_number: cardNumber,
  //     expiry_month: expiryMonth,
  //     expiry_year: expiryYear,
  //     cvc: cvv,
  //   });

  //   // Use the token for further processing (e.g., sending it to your server)
  //   console.log(token);
  // };
  // const dispatch = useDispatch();
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
  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    created_at: "",
    files: "",
    invoice_description: "",
    invoice_number: dataSource.length + 1,
    total_amount_remaining: 0,
    items: [],
  });

  const [errors, setErrors] = useState({});
  const { role, permissions } = useToken();
  const [pay, setPay] = useState({ open: false, id: "" });
  const modalData = [
    {
      title: "العميل",
      name: "customer_id",
      id: 0,
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      error: "",
      // getOptions: printOptions2,
    },
    {
      title: "طريقة الدفع",
      name: "paymentType",
      id: 0,
      // validation: ,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        { name: "نقدي", value: "cash", id: 0 },
        { name: "شبكة", value: "network", id: 1 },
        { name: "بنكي", value: "bank", id: 2 },
        { name: "اجل", value: "installement", id: 3 },
      ],
      error: "",
    },
    {
      title: "التاريخ",
      name: "date",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: "اضافة عرض سعر",
      name: "items",
      id: 2,
      type: "group",
      child: {
        item: [
          {
            name: "product",
            title: "اسم المنتج",
            id: 0,
            unique: true,
            required: true,
            type: "select",
            // getOptions: printOptions,
          },
          {
            name: "quantity",
            title: "الكمية",
            id: 1,
            unique: false,
            required: true,
            type: "text",
          },
          {
            name: "description",
            title: "الوصف",
            id: 1,
            unique: false,
            required: true,
            type: "text",
          },
          {
            name: "piece_price",
            title: "سعر الوحدة قبل الضريبة",
            id: 1,
            unique: false,
            required: true,
            type: "text",
          },
          {
            name: "discount",
            title: "الخصم",
            id: 1,
            unique: false,
            required: true,
            type: "text",
          },
        ],
      },
    },
  ];


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
    // {
    //   title: "حالة العرض",
    //   dataIndex: "tranfire",
    //   key: "حالة العرض",
    // },
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
              {/* {text.show_add === 1 ? null : (
                <Link to={`/add-sales/refund/${text.id}`}>
                  {t("reqReturn")} <BiEdit />
                </Link>
              )} */}
              {role === "employee" &&
              permissions.includes("salesReturns_request") &&
              text.show_add !== 1 ? (
                <Link to={`/add-sales/refund/${text.id}`}>
                  {t("reqReturn")} <BiEdit />
                </Link>
              ) : (role === "admin" || role === "company") &&
                text.show_add !== 1 ? (
                <Link to={`/add-sales/refund/${text.id}`}>
                  {t("reqReturn")} <BiEdit />
                </Link>
              ) : null}
              {role === "company" &&
              permissions.includes("payonline") &&
              text.show_add !== 1 ? (
                <Link
                  to={`/report/new/${text.id}`}
                  // onClick={() => setPay({ open: true, id: text.id })}
                >
                  دفع الكتروني <BiDollar />
                </Link>
              ) : (role === "admin" ||
                  (role === "company" && permissions.includes("payonline"))) &&
                text.show_add !== 1 ? (
                <p onClick={() => setPay({ open: true, id: text.id })}>
                  دفع الكتروني <BiDollar />
                </p>
              ) : null}
              {role === "employee" && permissions.includes("print_sales") ? (
                <Link to={`/report/preview-sales/${text.id}/sales`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/sales`}>
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

  if (role === "employee" && !permissions.includes("view_list_sales")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("create_product") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("create_sales"))
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
        navigate={`/add-sales/add`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchSales}
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
          // dispatchMethod={postOffer}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateSales}
          //api eddition
          // exludeData={["files", "address_en"]}
        />
      )}
      <Dialog open={pay.open}>
        <div style={{ padding: "5px" }}>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setPay(false)} />
        </div>
        {/* <div className="mysr-form">
          {paymentRequest && (
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          )}
        </div> */}
        {/* <Checkout path={pay.id}/> */}
      </Dialog>
    </div>
  );
};

export default Receipt;
