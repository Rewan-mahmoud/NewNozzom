import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import { fetchReceipt, postReceipt, updateReceipt } from "../../features/table/receiptSlice";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";

const AddRefundSale = () => {
  const { dataSource, error, loading, total } = useAll("receipt", fetchReceipt);
  const { token, role } = useToken();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const {t} = useTranslation()

  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    created_at: getToday(),
    date_invoice: "",
    files: "",
    invoice_description: "",
    invoice_number: "",
    total_amount_remaining: 0,
    original_invoice_number: "",
    purchase_order: 0,
    des_return: "",
  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "date",
      name: "created_at",
      style: { gridColumn: "2/2" },
      id: 2,
      unique: false,
      required: true,
      class: "input-group input-class",
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: "originalInvoice",
      name: "original_invoice_number",
      style: { gridColumn: "1/2" },
      id: 12,
      unique: false,
      required: true,
      class: "input-group input-class",
      validation: () => {},
      type: "text",
      error: "",
    },

    {
      title: "originalInvoiceDate",
      name: "date_invoice",
      style: { gridColumn: "2/2" },
      id: 2,
      unique: false,
      required: true,
      class: "input-group input-class",
      validation: () => {},
      type: "date",
      error: "",
    },

    {
      title: "payMethod",
      name: "paymentType",
      id: 1,
      style: { gridColumn: "1/2" },
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      class: "input-group input-class",
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
      id: 0,
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      error: "",
      class: "input-group input-class",
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
      style: { gridColumn: "2/2" },
      details: true,
    },
    {
      title: "returnReason",
      name: "des_return",
      id: 6,
      validation: () => {},
      unique: false,
      required: true,
      type: "text",
      error: "",
      class: "input-group input-class",
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
              printOptions("productandservices_purchers", "Products"),
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

  // console.log(modalData);



  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data}
          setFormData={setData}
          totalNum={total}
          updateMethod={updateReceipt}
          modalType={"page"}
          // modalValue={modalValue}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postReceipt}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          inputClass={"input-class"}
          details={true}
          uri={"/debitnote"}
          api={"show_debitnote"}
          custom={["show_customer_all_purchers", "vendors"]}
          custom2={["productandservices_purchers", "Products"]}
          note={"sales"}
        />
      )}
    </div>
  );
};

export default AddRefundSale;
