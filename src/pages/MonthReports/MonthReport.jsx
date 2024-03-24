/* eslint-disable no-unused-vars */
import { useState } from "react";
import Table from "../../components/Table/Table";
import { InputField, SelectInput } from "../../components/Input/Inputs";
// import { handleErrors } from "../../utils/submiterr";
import { handleBodyData } from "../../utils/bodyData";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { Navigate, useNavigate } from "react-router-dom";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { getOptions } from "../../utils/getOption";
import { useSelector } from "react-redux";
// import { Form } from "react-router-dom";

const MonthReport = () => {
  const [errors, setErrors] = useState({});
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const months = [
    { name: "يناير", value: "01" },
    { name: "فبراير", value: "02" },
    { name: "مارس", value: "03" },
    { name: "ابريل", value: "04" },
    { name: "مايو", value: "05" },
    { name: "يونيو", value: "06" },
    { name: "يوليو", value: "07" },
    { name: "اغسطس", value: "08" },
    { name: "سيبتمبر", value: "09" },
    { name: "اكتوبر", value: "10" },
    { name: "نوفمبر", value: "11" },
    { name: "ديسمبر", value: "12" },
  ];
  const { t, i18n } = useTranslation();
  // console.log(month);
  const [data, setData] = useState({
    month: months[month].value,
    year: String(year),
    type: "",
  });
  const { token, role, permissions } = useToken();

  // console.log(months[month]);

  const modalData = [
    {
      title: t('month'),
      name: "month",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      error: "",
      options: months,
      class: "report-input input-group",
    },
    {
      title: t('year'),
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
      class: "report-input input-group",
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
      title: t('totalSales'),
      dataIndex: "total_sales",
      key: "مجموع المبيعات",
    },
    {
      title: t('salesTax'),
      dataIndex: "taxes",
      key: "الضريبة على المبيعات",
    },
    {
      title: t('totalRe'),
      dataIndex: "total_returns",
      key: "مجموع المرتجعات",
    },
    {
      title: t('reTax'),
      dataIndex: "taxes1",
      key: "الضريبة على المرتجعات",
    },
    {
      title: t('netSales'),
      dataIndex: "total_total",
      key: "صافي المبيعات",
    },
    {
      title: t('netTax'),
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
        // className={"report-input"}
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
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
        className={"inputClass"}
      />
    ),
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [footer, setFooter] = useState({
    total_receipt_counts: "",
    total_sales_monthly: "",
    taxes_monthly: "",
    total_returns_monthly: "",
    taxes_monthly_return: "",
    total_total_monthly: "",
    taxes_monthly_total: "",
    branche_id: branche_id,
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
    // console.log(token);
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
      // console.log(body);
      delete body["month"];
      setLoading(true);
      axios
        .post(`${apiUrl}Monthlysalesreport`, { ...body }, { headers })
        .then((res) => {
          // console.log(res.data.data);
          let newArr = [];
          let repo = {}
          Object.keys(res.data.data.reports).map((item) => {
            // console.log(item, res.data.data.reports[item]);
            repo = { ...res.data.data.reports};
            // newArr.push({
            //   ...res.data.data.reports[item],
            //   time: `${item} - ${months[month].value} - ${year}`,
            // });
            setFooter((prev) => ({
              ...prev,
              total_total_monthly: res.data.data.total_total_monthly,
              total_returns_monthly: res.data.data.total_returns_monthly,
              total_sales_monthly: res.data.data.total_sales_monthly,
              taxes_monthly: res.data.data.taxes_monthly,
              taxes_monthly_return: res.data.data.taxes_monthly_return,
              taxes_monthly_total: res.data.data.taxes_monthly_total,
              total_receipt_counts: res.data.data.total_receipt_counts,
            }));
            // newArr.push(res.data.data.reports[item]);
          });
          const sortedRepo = Object.keys(repo).sort((a,b) => a - b)
          sortedRepo.map((item) =>
            newArr.push({
              ...repo[item],
              time: `${item} - ${months[month].value} - ${year}`,
            }))
          console.log(newArr);
          setDataSource(newArr);
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

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  if (role === "company") {
    modalData.splice(0, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_branches_all", "Branches"),
      error: "",
      class: "report-input input-group",
      inputClass: "input-field",
    });
  } else {
    modalData.splice(0, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      disable: true,
      error: "",
      placeholder: branche_name,
      class: "report-input input-group",
      inputClass: "input-field",
    });
  }

  if (role === "employee" && !permissions.includes("months_reports")) {
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
          {t('viewRep')}
        </button>
      </form>
      <Table
        loading={loading}
        dataSource={dataSource}
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

export default MonthReport;
