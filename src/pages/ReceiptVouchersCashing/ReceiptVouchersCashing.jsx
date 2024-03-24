import { BiEdit } from 'react-icons/bi';
import PageHead from '../../components/PageHead/PageHead';
import  Table  from '../../components/Table/Table';
import { GrView } from 'react-icons/gr';
import { fetchPayment, postPayment, updatePayment } from '../../features/table/paymentSlice';
import useAll from '../../hooks/useAll';
import { useState } from 'react';
import { getOptions } from '../../utils/getOption';
import Modal from '../../components/Modal/Modal';
import useToken from '../../hooks/useToken';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

const ReceiptVouchersCashing = () => {
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;

  const { token, role, permissions } = useToken();

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
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("payment", fetchPayment);
  const [modal, setModal] = useState({ open: false, type: "", data: null });

  // console.log(dataSource[0]);
  // const { token } = useToken();
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const [data, setData] = useState({
    customer_id: "",
    date: "",
    paying_type: "",
    for: "",
    money: "",
    bank_name: "",
    cheque_number: "",
    branche_id: branche_id
  });
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("name"),
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
              permissions.includes("edit_receipt_cashing") ? (
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
              permissions.includes("view_receipt_cashing") ? (
                <Link to={`/report/payment/${text.id}`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/payment/${text.id}`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ),
    },
  ];
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
        { name: "شيك", value: "cheque", id: 3 },
      ],
      action: ["bank_name", "cheque_number"],
      error: "",
      // style: { gridColumn: "1/-1" },
    },
    {
      title: t("sentTo"),
      name: "customer_id",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
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
      id: 6,
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

  if (role === "employee" && !permissions.includes("receipt_cashing")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("add_receipt_cashing") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" &&
                permissions.includes("add_receipt_cashing"))
            ? i18n.language === "ar"
              ? "اضافة سند صرف +"
              : "Add Payment voucher +"
            : i18n.language === "ar"
            ? "اضافة سند صرف +"
            : "Add Payment voucher +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن سند صرف"
            : "Search for Payment voucher"
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
        fetch={fetchPayment}
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
          dispatchMethod={postPayment}
          updateMethod={updatePayment}
        />
      )}
    </div>
  );
}

export default ReceiptVouchersCashing