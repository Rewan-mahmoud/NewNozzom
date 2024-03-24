import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import {
  fetchVoucher,
  postVoucher,
  updateVouchers,
} from "../../features/table/voucherSlice";
import { useState } from "react";
import useAll from "../../hooks/useAll";
import Modal from "../../components/Modal/Modal";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

const ReceiptVouchers = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("voucher", fetchVoucher);
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const { t, i18n } = useTranslation();
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const { token, role, permissions } = useToken();
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;

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

  // console.log(dataSource[0])
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("name"),
      // dataIndex: "customer_id",
      dataIndex: "customers.name",
      key: "الاسم",
    },
    {
      title: t("branch"),
      dataIndex: "branche_name",
      key: "branches",
    },
    {
      title: t("cost"),
      dataIndex: "money",
      key: "المبلغ",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "التاريخ",
    },
    {
      title: t("payMethod"),
      dataIndex: "paying_type",
      key: "طريقة الدفع",
    },
    {
      title: t("for"),
      dataIndex: "for",
      key: "وذلك مقابل",
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
              permissions.includes("edit_receipt_voucher") ? (
                <p
                  onClick={() =>
                    setModal({ type: "edit", data: text, open: true })
                  }
                >
                  {t("edit")} <BiEdit />
                </p>
              ) : role === "admin" || role === "company" ? (
                <p
                  onClick={() =>
                    setModal({ type: "edit", data: text, open: true })
                  }
                >
                  {t("edit")} <BiEdit />
                </p>
              ) : null}

              {role === "employee" &&
              permissions.includes("view_receipt_voucher") ? (
                <Link to={`/report/receipt/${text.id}`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/receipt/${text.id}`}>
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
  const [data, setData] = useState({
    cutomer_id: "",
    date: "",
    paying_type: "",
    for: "",
    money: "",
    bank_name: "",
    cheque_number: "",
    branche_id: branche_id,
  });

  const [errors, setErrors] = useState({});

  const modalData = [
    {
      title: t("date"),
      name: "date",
      id: 0,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("invoiceType"),
      name: "paying_type",
      id: 1,
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
      action: ["bank_name", "cheque_number"],
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("recievedFrom"),
      name: "customer_id",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_customer_all_sales", "customer"),
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("cost"),
      name: "money",
      id: 3,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("bankName"),
      name: "bank_name",
      id: 4,
      unique: false,
      required: false,
      validation: () => {},
      type: "text",
      error: "",
    },
    {
      title: t("Cheque"),
      name: "cheque_number",
      id: 5,
      unique: false,
      required: false,
      validation: () => {},
      type: "text",
      error: "",
    },
    {
      title: t("for"),
      name: "for",
      id: 4,
      unique: false,
      required: false,
      validation: () => {},
      type: "textarea",
      error: "",
      style: { gridColumn: "1/-1" },
    },
  ];

  if (role === "company") {
    modalData.splice(1, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_branches_all", "Branches"),
      error: "",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      inputClass: "input-field",
      // Add onChange event handler
    });
  } else {
    modalData.splice(1, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      disable: true,
      error: "",
      // style: { gridColumn: "1/2" },
      // class: "input-group input-class",
      inputClass: "input-field",
      placeholder: branche_name,
    });
  }

  if (role === "employee" && !permissions.includes("receipt_voucher")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("add_receipt_voucher") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" &&
                permissions.includes("add_receipt_voucher"))
            ? i18n.language === "ar"
              ? "اضافة سند قبض +"
              : "Add Receipt voucher +"
            : i18n.language === "ar"
            ? "اضافة سند قبض +"
            : "Add Receipt voucher +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن سند قبض"
            : "Search for Receipt voucher"
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
        fetch={fetchVoucher}
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
          dispatchMethod={postVoucher}
          updateMethod={updateVouchers}
        />
      )}
    </div>
  );
};

export default ReceiptVouchers;
