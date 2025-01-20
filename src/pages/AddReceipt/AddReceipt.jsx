import { useEffect,useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import {
  fetchOffer,
  postOffer,
  updateOffer,
} from "../../features/table/salesOfferSlice";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import axios from "axios";
const AddReceipt = () => {
  const { dataSource, error, loading, total } = useAll(
    "salesOffer",
    fetchOffer
  );
  const { token, role } = useToken();
  const { t } = useTranslation();

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
    date: "",
    files: "",
    invoice_number: "",
    invoice_description: "",
    items: [],
    branche_id: ''
  });



  // console.log(t('date'))
  const [errors, setErrors] = useState({});








  const modalData = [
    {
      title: "date",
      name: "date",
      style: { gridColumn: "1/2" },
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      class: "input-group input-class",
      type: "date",
      error: "",
      // inputClass: "input-class",
    },
    {
      title: "paymentType",
      name: "paymentType",
      id: 1,
      style: { gridColumn: "1/2" },
      unique: false,
      required: true,
      class: "input-group input-class",
      validation: () => {},
      type: "select",
      // inputClass: "input-class",
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
      getOptions: () => printOptions("show_customer_all_sales", "customer"),
      style: { gridColumn: "1/2" },
      details: true,
      // inputClass: "input-class",
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
            id: 3,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "piece_price",
            title: "piecePriceB",
            id: 4,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "discount",
            title: "discount",
            id: 5,
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
      title: t('desc'),
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
          updateMethod={updateOffer}
          totalNum={total}
          modalType={"page"}
          // modalValue={modalValue}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postOffer}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          inputClass={"input-class"}
          details={true}
          uri={"/quotations"}
          custom={["show_customer_all_sales", "customer"]}
          custom2={["productandservices_sales", "Products"]}
          api={"show_quotations"}
          // note={"sales"}
          // note={'sales'}
        />
      )}
    </div>
  );
};

export default AddReceipt;
