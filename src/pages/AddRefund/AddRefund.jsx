import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import { fetchSalesR, postSalesR } from "../../features/table/salesRSlice";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";

const AddRefund = () => {
  const {token, role} = useToken();
  const { dataSource, error, loading, total } = useAll("salesR", fetchSalesR);
  const {t} = useTranslation()

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
    paymentType: "", 
    created_at: getToday(),
    date_invoice: '',
    files: "",
    invoice_description: "",
    invoice_number: "",
    total_amount_remaining: 0,
    original_invoice_number: "",
    des_return: '',

  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "date",
      name: "created_at",
      style: { gridColumn: "2/2" },
      class: "input-group input-class",
      id: 2,
      disable: true,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: "originalInvoice",
      name: "original_invoice_number",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      id: 12,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
    },

    {
      title: "originalInvoiceDate",
      name: "date_invoice",
      class: "input-group input-class",
      style: { gridColumn: "2/2" },
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },

    {
      title: "payMethod",
      name: "paymentType",
      class: "input-group input-class",
      id: 1,
      style: { gridColumn: "1/2" },
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
      title: "customer",
      name: "customer_id",
      class: "input-group input-class",
      id: 0,
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      error: "",
      getOptions: () => printOptions("show_customer_all_sales", "customer"),
      style: { gridColumn: "2/2" },
      details: true,
    },
    {
      title: "returnReason",
      name: "des_return",
      id: 6,
      class: "input-group input-class",
      validation: () => {},
      unique: false,
      required: true,
      type: "text",
      error: "",
      // getOptions: printOptions2,
      style: { gridColumn: "1/2" },
      details: true,
    },

    {
      title: "اضافة عرض سعر",
      name: "items",
      id: 5,
      type: "group",
      child: {
        item: [
          {
            name: "product",
            title: "productName",
            id: 0,
            unique: true,
            required: true,
            type: "select",
            getOptions: () =>
              printOptions("productandservices_sales", "Products"),
            details: true,
          },

          {
            name: "description",
            title: "desc",
            id: 1,
            unique: false,
            required: false,
            type: "text",
            details: true,
          },
          {
            name: "quantity",
            title: "quantity",
            id: 2,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "piece_price",
            title: "piecePriceB",
            id: 3,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "discount",
            title: "discount",
            id: 4,
            value: 0,
            unique: false,
            required: true,
            type: "checkbox",
            details: true,
          },
        ],
      },
    },
    {
      title: "desc",
      name: "invoice_description",
      style: { gridColumn: "1/-1" },
      id: 3,
      unique: false,
      required: false,
      validation: () => {},
      type: "textarea",
      error: "",
      expand: false,
    },
    {
      title: "اضافة ملف",
      name: "files",
      style: { gridColumn: "1/-1" },
      id: 4,
      unique: false,
      required: false,
      validation: () => {},
      type: "file",
      error: "",
      expand: false,
    },
  ];


  // console.log(modalData)

  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data}
          setFormData={setData}
          totalNum={total}
          //   updateMethod={updateSales}
          modalType={"page"}
          // modalValue={modalValue}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postSalesR}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          // inputClass={"input-class"}
          details={true}
          custom={["show_customer_all_sales", "customer"]}
          custom2={["productandservices_sales", "Products"]}
          uri={"/creditnote"}
          // note={"sales"}
        />
      )}
    </div>
  );
};

export default AddRefund;
