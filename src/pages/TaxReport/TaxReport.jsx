/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Form from "../../components/Form2/Form";
import { InputField, SelectInput } from "../../components/Input/Inputs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleBodyData } from "../../utils/bodyData";
// import {  handleErrors } from "../../utils/submiterr";
import Table from "../../components/Table/Table";
import useToken from "../../hooks/useToken";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { addTaxRep } from "../../features/table/taxRepSlice";
import { useTranslation } from "react-i18next";
import { getOptions } from "../../utils/getOption";

const TaxReport = () => {
  const { t, i18n } = useTranslation();
  
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
    const [data, setData] = useState({
      to_date: "",
      from_date: "",
      type: "",
      branche_id:branche_id
    });
    const [errors, setErrors] = useState({});
    const modalData = [
      {
        title: t("dateFrom"),
        name: "from_date",
        id: 2,
        unique: false,
        required: true,
        validation: () => {},
        type: "date",
        error: "",
        // class: "input-group input-class",
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

      {
        title: t("invoiceType"),
        name: "type",
        id: 3,
        unique: false,
        required: true,
        validation: () => {},
        type: "select",
        options: [
          { name: t("sales"), value: "sales" },
          { name: t("purchase"), value: "purchases" },
          { name: t("salesReturn"), value: "salesReturns" },
          { name: t("purchaseReturn"), value: "purchasesReturns" },
          { name: t("netPurchase"), value: "total_purchases" },
          { name: t('netSales'), value: "total_sales" },
        ],
        error: "",
        // class: "input-group input-class",
        class: "report-input input-group",
      },
    ];

    const [columns, setColumns] = useState([
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
        dataIndex: "created_at",
        key: "تاريخ الفاتورة",
      },
      {
        title: "نوع السند",
        dataIndex: "type",
        key: "نوع السند",
      },
      {
        title: t("customerName"),
        dataIndex: "customer_name",
        key: "اسم العميل",
      },
      {
        title: t("vatNumber"),
        dataIndex: "tax_card",
        key: "الرقم الضريبي",
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
    ]);

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
    };

    const { token, role, permissions } = useToken();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [dataSource, setDataSource] = useState([]);
    const [footer, setFooter] = useState({
      all_total: "",
      all_tax: "",
      all_sub_total: "",
      branche_id: "",
    });
    // console.log(footer)
    useEffect(() => {
      let arr = [...columns];

      if (data.type.includes("purchases")) {
        const saleColumns = [
          {
            title: "رقم فاتورة المورد",
            dataIndex: "rescource_num",
            key: "رقم فاتورة المورد",
          },
          {
            title: "تاريخ فاتورة المورد",
            dataIndex: "purchase_order_date",
            key: "تاريخ فاتورة المورد",
          },
          {
            title: "طبيعة المشتريات",
            dataIndex: "purchers_type",
            key: "طبيعة المشتريات",
          },
        ];

        // Check if any of the saleColumns already exist in arr
        const existingSaleColumns = saleColumns.filter((column) =>
          arr.some((existingColumn) => existingColumn.key === column.key)
        );

        // Remove existingSaleColumns from arr
        arr = arr.filter(
          (column) =>
            !existingSaleColumns.some(
              (existingColumn) => existingColumn.key === column.key
            )
        );

        // Here, you can specify the index where you want to insert the saleColumns
        const insertIndex = 2;

        // Insert sortedSaleColumns into the specified index within arr
        arr.splice(insertIndex, 0, ...saleColumns);
      } else {
        // Remove saleColumns from arr if they exist
        arr = arr.filter(
          (column) =>
            ![
              "رقم فاتورة المورد",
              "تاريخ فاتورة المورد",
              "طبيعة المشتريات",
            ].includes(column.key)
        );
      }

      setColumns(arr);
    }, [data])

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

    const handleErrors = (data, dataSource, modalData, hidden) => {
      let err = {};
      modalData.map((item) => {
        if (item.required) {
          // console.log("req");
          if (data[item.name] === "")
            err[item.name] = { title: item.name, message: t('required') };
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

    const handlSubmit = (
      e,
      uri
    ) => {
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
        //  console.log(body);
         setLoading(true);
         axios
           .post(`${apiUrl}vatreturn`, { ...body }, { headers })
           .then((res) => {
             console.log(res.data.data);
             setLoading(false);
             setDataSource(res.data.data.receipts);
             setFooter({
               all_sub_total: res.data.data.all_sub_total,
               all_tax: res.data.data.all_tax,
               all_total: res.data.data.all_total,
             });
             dispatch(addTaxRep(res.data.data));
           })
           .catch((err) => {
             setLoading(false);
             console.log(err);
             // dispatch(addProReb(err))
           });
       }
    };

    const handleNavigate = () => {
      if (dataSource.length > 0) navigate(`/report/tax/${data['type']}`);
    };

    if (role === "employee" && !permissions.includes("tax_reports")) {
      return <Navigate to="/categorys" />;
    }
    
  return (
    <div className="page-wrapper">
      <form className="form-wrapper" onSubmit={(e) => handlSubmit(e)}>
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onClick={(e) => handlSubmit(e)}>
          {t('viewRep')}
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
        {t('print')}
      </button>
    </div>
  );
}

export default TaxReport