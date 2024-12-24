/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Form from "../../components/Form2/Form";
import { InputField, RadioInput, SelectInput } from "../../components/Input/Inputs";
import { Link, useNavigate } from "react-router-dom";
// import { handleErrors } from "../../utils/submiterr";
import { handleBodyData } from "../../utils/bodyData";
import useToken from "../../hooks/useToken";
import { getOptions } from "../../utils/getOption";
import Table from "../../components/Table/Table";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProReb } from "../../features/table/custAndVendSlice";
import { useTranslation } from "react-i18next";

const CustomerandSupplierStatement = () => {
  const { t, i18n } = useTranslation();
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
  const [data, setData] = useState({
    type: 1,
    to_date: "",
    from_date: "",
    customer_id: "",
    branche_id: branche_id,
  });
  const [errors, setErrors] = useState({});
  const { token, role } = useToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const result = await printOptions(
          data.type === 1
            ? "show_customer_all_sales"
            : "show_customer_all_purchers",
          data.type === 1 ? "customer" : "vendors"
        );
        setOptions(result || []); // Ensure options is an array even if it's undefined
      } catch (error) {
        console.error(error);
      }
    };

    fetchOptions();
  }, [data.type]);

  const modalData = [
    {
      title: "type",
      name: "type",
      type: "radio",
      unique: false,
      class: "report-input input-group",
      error: "",
      info: [
        { name: "عميل", action: 1 },
        { name: "مورد", action: 0 },
      ],
      id: 10,
    },
    {
      title: data.type === 1 ? t("customerName") : t("vendorName"),
      name: "customer_id",
      id: 3,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options,
      error: "",
      class: "report-input input-group",
    },
    {
      title: t("dateFrom"),
      name: "from_date",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: "report-input input-group",
    },
    {
      title: t("toDate"),
      name: "to_date",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: "report-input input-group",
    },
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
    radio: (item) => (
      <RadioInput
        item={item}
        key={item.id}
        data={data}
        // handleRadio={handleRadio}
        setFormData={setData}
        errors={errors}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
      />
    ),
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
      title: t("invoiceDate"),
      dataIndex: "invoiceIssueDate",
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
  ];

  const [dataSource, setDataSource] = useState([]);
  const [footer, setFooter] = useState({
    // lastpricesall: "",
    // lastpricespurchers: "",
    total_quantity: "",
  });

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
    console.log(token);
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
      console.log(body);
      setLoading(true);
      axios
        .post(
          `${apiUrl}report_customer`,
          { ...body },
          { headers }
        )
        .then((res) => {
          console.log(res.data.data);
          setLoading(false);
          setDataSource(res.data.data.receipts);
          setFooter({
            // lastpricesall: res.data.data.lastpricesall,
            // lastpricespurchers: res.data.data.lastpricespurchers,
            total_quantity: res.data.data.total_quantity,
          });
          dispatch(addProReb(res.data.data));
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          // dispatch(addProReb(err))
        });
    }
  };

  const handleNavigate = () => {
    if (dataSource.length > 0) navigate(`/report/customer-vendors`);
  };
  return (
    <div className="page-wrapper" >
      <form className="form-wrapper" onSubmit={(e) => handlSubmit(e, "")}>
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onClick={(e) => handlSubmit(e)}>
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
      <button className="btn" onClick={handleNavigate}>
        {t("print")}
      </button>
    </div>
  );
};

export default CustomerandSupplierStatement;
