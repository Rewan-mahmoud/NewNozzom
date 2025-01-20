import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import { fetchPur, postPur, refundPur, updatePur } from "../../features/table/purSlice";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { fetchReceipt } from "../../features/table/receiptSlice";
import { useTranslation } from "react-i18next";

const AddPur = () => {
  const {token, role} = useToken()
  const { dataSource, error, loading, total } = useAll("pur", fetchPur);
  const { dataSource: anotherDataSource, total: anotherTotal } = useAll(
    "receipt",
    fetchReceipt
  );
  

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
    files: "",
    invoice_description: "",
    invoice_number: "",
    total_amount_remaining: 0,
    purchase_order_date: "",
    original_invoice_number: "",
    purchase_order_num: "",
    purchase_order: 0,
    purchers_type: "",

  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "date",
      name: "created_at",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
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
      id: 1,
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
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
      id: 0,
      class: "input-group input-class",
      validation: () => {},
      unique: false,
      required: true, 
      type: "select",
      error: "",
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
      style: { gridColumn: "1/2" },
      details: true,
    },
    {
      title: "addVendorDetails",
      name: "purchase_order",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "yes", action: 1 },
        { name: "no", action: 0 },
      ],
      style: { gridColumn: "1/2" },
      action: [
        "purchase_order_date",
        "original_invoice_number",
        "purchase_order_num",
        "purchers_type",
      ],
      id: 10,
    },
    {
      title: "purchaseType",
      name: "purchers_type",
      id: 13,
      validation: () => {},
      unique: false,
      required: true,
      type: "text",
      error: "",
      class: "input-group input-class",
      // getOptions: printOptions2,
      // style: { gridColumn: "2/2" },
      details: true,
    },
    {
      title: "purOrderNum",
      name: "purchase_order_num",
      id: 6,
      validation: () => {},
      unique: false,
      required: false,
      type: "text",
      error: "",
      class: "input-group input-class",
      // getOptions: printOptions2,
      // style: { gridColumn: "2/2"},
      details: true,
    },
    {
      title: "vendorInvoice",
      name: "original_invoice_number",
      id: 7,
      validation: () => {},
      unique: false,
      required: true,
      type: "text",
      class: "input-group input-class",
      error: "",
      // getOptions: () => printOptions("show_customer_all_sales", "customer"),
      // style: { gridColumn: "2/2" },
      details: true,
    },
    {
      title: "vendorDate",
      name: "purchase_order_date",
      id: 8,
      validation: () => {},
      unique: false,
      required: true,
      type: "date",
      class: "input-group input-class",
      error: "",
      // getOptions: () => printOptions("show_customer_all_sales", "customer"),
      // style: { gridColumn: "2/2" },
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


  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data} 
          setFormData={setData}
          totalNum={total}
          updateMethod={updatePur}
          modalType={"page"}
          // modalValue={modalValue}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          anotherDataSource={anotherDataSource}
          anotherTotal={anotherTotal}
          dispatchMethod={postPur}
          error={error} 
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          // inputClass={"input-class"}
          details={true}
          uri={"/purchase"}
          api={"show_purchase"}
          refundMethod={refundPur}
          custom={["show_customer_all_purchers", "vendors"]}
          custom2={["productandservices_purchers", "Products"]}
          note={"sales"}
        />
      )}
    </div>
  );
};

export default AddPur;
