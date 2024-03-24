import { useEffect, useState } from "react";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { fetchBills, handleUpdate } from "../../features/table/billSlice";
import useAll from "../../hooks/useAll";
import { BiEdit } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import { Link, Navigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { postBill } from "../../features/table/fatorahSlice";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import useToken from "../../hooks/useToken";

const ReceiptPaying = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("bill", fetchBills);
  const [modal, setModal] = useState({
    open: false,
    type: "",
    data: null,
    message: "",
  });

  const [reID, setReID] = useState("");

  const [data, setData] = useState({
    receipt_id: reID,
    price: "",
    notes: "",
  });
  const { t, i18n } = useTranslation();
  
  const { token, role, permissions } = useToken();

  // console.log()

  const [errors, setErrors] = useState({});
  const [tootal, setTotal] = useState(null);

  const modalData = [
    {
      title: t("cost"),
      name: "price",
      id: 0,
      unique: false,
      required: true,
      validation: (value) => {
        if (Number(value) <= 0) return "مبلغ غير صالح";
        if (tootal && tootal === 0) return "مبلغ غير صالح";
        
        if (tootal) {
          if (Number(value) > tootal) {
            return `المبلغ المتبقي ${tootal}`;
          }
        }
        if(!tootal) return "تم سداد الفاتورة";
      },
      type: "text",
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("notes"),
      name: "notes",
      id: 1,
      unique: false,
      required: false,
      validation: () => {},
      type: "text",
      error: "",
      // style: { gridColumn: "1/-1" },
    },
  ];

  const [message, setMessage] = useState(`${t("remaining")} ${tootal}`);

  useEffect(() => {
    // console.log(tootal)
    // if(tootal) {
    //   // setModalData([...modalData])
    //   if (data.price) {
    //     setMessage(`${t('remaining')} ${tootal - Number(data.price)}`);
    //     setModal(prev => ({...prev, message}))
    //     // console.log(tootal - Number(data.price));
    //   } else {
    //     setMessage(`${t('remaining')} ${tootal - 0}`);
    //     setModal(prev => ({...prev, message}))
    //       }
    // }
    // setModalData(modalData)
  }, [data, tootal, message]);
  // console.log(tootal, )

  const handleModal = (item) => {
    setModal({ type: "add", data: "", open: true });
    setReID(item.id);
    setData((prev) => ({ ...prev, receipt_id: item.id }));
    // setTotal(item.total)
    const too = dataSource.find((el) => el.id === item.id);
    setTotal(too.total - too.sadads_sum);
    // setTotal(too.total)
    // dataSource.map(e => console.log(e))
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
      title: t("voucherNum"),
      dataIndex: "sadads_count",
      key: "عدد السدادات",
    },
    {
      title: t("voucherSum"),
      dataIndex: "sadads_sum",
      key: "مجموع السدادات",
    },
    {
      title: t("remaining"),
      dataIndex: "total - sadads_sum",
      key: "المتبقي",
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
              <p onClick={() => handleModal(text)}>
                {t("addPay")} <BiEdit />
              </p>
              <Link
                to={`/fatorah/${text.id}`}
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

  if (role === "employee" && !permissions.includes("receipt_sadads")) {
    return <Navigate to="/categorys" />;
  }

  // console.log(data)

  return (
    <div className="page-wrapper">
      <PageHead
        // btn={"+ اضافة فاتورة"}
        // modal={modal}
        // setModal={setModal}
        placeholder={
          i18n.language === "ar" ? "ابحث عن فاتورة" : "Search for ivoice"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
      />

      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchBills}
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
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          dispatchMethod={postBill}
          secondMethod={handleUpdate}
          message={modal.message}
          // updateMethod={updateVouchers}
        />
      )}
    </div>
  );
};

export default ReceiptPaying;
