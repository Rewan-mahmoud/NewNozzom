/* eslint-disable no-unused-vars */
import { useState } from "react";
import Table from "../../components/Table/Table";
import { InputField, SelectInput } from "../../components/Input/Inputs";
// import {  handleErrors } from "../../utils/submiterr";
import { handleBodyData } from "../../utils/bodyData";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { Navigate, useNavigate } from "react-router-dom";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { getOptions } from "../../utils/getOption";
import { useSelector } from "react-redux";
// import { Form } from "react-router-dom";

const YearReport = () => {
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
  const { t, i18n } = useTranslation();
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDay();
  // console.log(day)
  const months = {
    "01": { name: "يناير", en_name: "jan" },
    "02": { name: "فبراير", en_name: "jan" },
    "03": { name: "مارس", en_name: "jan" },
    "04": { name: "ابريل", en_name: "jan" },
    "05": { name: "مايو", en_name: "jan" },
    "06": { name: "يونيو", en_name: "jan" },
    "07": { name: "يوليو", en_name: "jan" },
    "08": { name: "اغسطس", en_name: "jan" },
    "09": { name: "سبتمبر", en_name: "jan" },
    10: { name: "اكتوبر", en_name: "jan" },
    11: { name: "نوفمبر", en_name: "jan" },
    12: { name: "ديسمبر", en_name: "jan" },
  };

  const [data, setData] = useState({
    // date: "",
    year,
  });
  const [errors, setErrors] = useState({});

  const modalData = [
    {
      title: t("year"),
      name: "year",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      error: "",
      options: [
        { name: "2023", value: "2023" },
        { name: "2024", value: "2024" },
        { name: "2025", value: "2025" },
        { name: "2026", value: "2026" },
        { name: "2027", value: "2027" },
        { name: "2028", value: "2028" },
        { name: "2029", value: "2029" },
        { name: "2030", value: "2030" },
      ],
      // class: "input-group input-class",
      class: "report-input input-group",
    },
    // {
    //   title: t("branch"),
    //   name: "branche_id",
    //   id: 19,
    //   unique: false,
    //   required: false,
    //   validation: () => {},
    //   type: "select",
    //   getOptions: () => printOptions("show_branches_all", "Branches"),
    //   error: "",
    //   class: "report-input input-group",
    //   inputClass: "input-field",
    // },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("date"),
      dataIndex: "time",
      key: "التاريخ",
    },
    {
      title: t("invoiceNumber"),
      dataIndex: "receipt_counts",
      key: "عدد الفواتير",
    },
    {
      title: t("totalSales"),
      dataIndex: "total_sales",
      key: "مجموع المبيعات",
    },
    {
      title: t("salesTax"),
      dataIndex: "taxes",
      key: "الضريبة على المبيعات",
    },
    {
      title: t("totalRe"),
      dataIndex: "total_returns",
      key: "مجموع المرتجعات",
    },
    {
      title: t("reTax"),
      dataIndex: "taxes1",
      key: "الضريبة على المرتجعات",
    },
    {
      title: t("netSales"),
      dataIndex: "total_total",
      key: "صافي المبيعات",
    },
    {
      title: t("netTax"),
      dataIndex: "total_tax",
      key: "صافي الضريبة",
    },

    // {
    //   title: "اجراء",
    //   dataIndex: "actions",
    //   key: "actions",
    //   render: (text) => (
    //     <div className="settCol">
    //       <button className="viewBtn" onClick={() => console.log(text)}>
    //         عرض <GrView />
    //       </button>
    //       {/* {Number(text.tranfire) ? null : (
    //       <button className="btn" onClick={() => handleTranfire(text)}>
    //         فاتورة
    //       </button>
    //     )} */}
    //     </div>
    //   ),
    // },
  ];

  const inputs = {
    select: (item) => (
      <SelectInput
        // note={note}
        // custom={custom}
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    year: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    month: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        inputClass={"inputClass"}
      />
    ),
  };

  const { token, role, permissions } = useToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [footer, setFooter] = useState({
    total_receipt_counts: "",
    total_sales_yearly: "",
    taxes_yearly_sales: "",
    total_returns_yearly: "",
    taxes_yearly_return: "",
    total_total_yearly: "",
    taxes_yearly_total: "",
    branche_id:branche_id ,
  });

  const [dataSource, setDataSource] = useState([]);

  const handleErrors = (data, dataSource, modalData, hidden) => {
    let err = {};
    modalData.map((item) => {
      if (item.required) {
        // console.log("req");
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t("required") };
      }

      if (item.unique)
        dataSource.map(
          (ele) =>
            ele[item.name] === data[item.name] &&
            (err[item.name] = {
              title: item.name,
              message: t("fieldExist"),
            })
        );
      if (
        item.validation &&
        item.validation(data[item.name]) &&
        item.required &&
        item.validation(data[item.name])
      ) {
        // console.log("validation");
        err[item.name] = {
          title: item.name,
          message: item.validation(data[item.name]),
        };
      }
      if (hidden && hidden.length && hidden.includes(item.name))
        hidden.map((item) => delete err[item]);
    });
    return err;
  };

  const handlSubmit = (e, uri) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    //  console.log(token);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    err = handleErrors(data, dataSource, modalData);
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData(data, null, modalData);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      setLoading(true);
      let newArr = [];
      let repo = {};
      axios
        .post(`${apiUrl}annualsalesreport`, { ...body }, { headers })
        .then((res) => {
          Object.keys(res.data.data.reports).map((item) => {
            repo = { ...res.data.data.reports };
          });
          const sortedRepo = Object.keys(repo).sort((a, b) => a - b);
          sortedRepo.map((item) =>
            newArr.push({
              ...repo[item],
              time: `${months[item].name}`,
            })
          );
          setDataSource(newArr);
          //  console.log(dataSource)
          setFooter((prev) => ({
            ...prev,
            total_total_yearly: res.data.data.total_total_yearly,
            total_returns_yearly: res.data.data.total_returns_yearly,
            total_sales_yearly: res.data.data.total_sales_yearly,
            taxes_yearly_sales: res.data.data.taxes_yearly_sales,
            taxes_yearly_return: res.data.data.taxes_yearly_return,
            taxes_yearly_total: res.data.data.taxes_yearly_total,
            total_receipt_counts: res.data.data.total_receipt_counts,
          }));
          setLoading(false);
          //  setDataSource(res.data.data.reports);
          //  dispatch(addTaxRep(res.data.data));
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          // dispatch(addProReb(err))
        });
    }
  };
  //  console.log(footer)

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  if (role === "employee" && !permissions.includes("years_reports")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      {/* <Form
        data={data}
        setFormData={setData}
        modalType={"page"}
        errors={errors}
        // error={error}
        setErrors={setErrors}
        // dispatchMethod={login}
        modalData={modalData}
        // loader={loading}
        mainClass={"mainClass formWrapper"}
      /> */}
      <form className="form-wrapper" onSubmit={(e) => handlSubmit(e, "")}>
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onSubmit={(e) => handlSubmit(e, "")}>
          {t("viewRep")}
        </button>
      </form>
      <Table
        loading={loading}
        dataSource={[...dataSource]}
        columns={columns}
        footer={true}
        footerData={footer}
        // total={total}
        // perPage={perPage}
        // fetch={fetchLogs}
      />
    </div>
  );
};

export default YearReport;
