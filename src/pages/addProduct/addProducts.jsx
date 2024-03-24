import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import Modal from "../../components/Modal/Modal";
import useAll from "../../hooks/useAll";
import { fetchProducts, postProduct, updateProduct } from "../../features/table/productSlice";
import { getOptions } from "../../utils/getOption";

const AddProduct = () => {
    const [cansel, setCansel] = useState(false);
    const [modal, setModal] = useState({ open: false, type: "", data: null });
    const { t, i18n } = useTranslation();
  
    const [data, setData] = useState({
        ar_name: "",
        en_name: "",
        cyril: "",
        purchaseprice: "",
        unite: "",
        barcode: "",
        unite_id: "",
        category_id: "",
        category: "",
        price: "",
        vat: "",
        reason: "",
        sales: 0,
        purchase: 0,
        active_pos: 0,
        type: 0,
        group_id: "",
        branche_id : [],
      });
      const {
        dataSource,
        error,
     
      } = useAll("product", fetchProducts);
      
    const [errors, setErrors] = useState({})
    // const []
    async function printOptions(path, output) {
        try {
          const result = await getOptions(path, output, token);
          console.log(result)
          return result;
        } catch (error) {
          console.error(error);
        }
      }
      const [options, setOptions] = useState([]);

      useEffect(() => {
          printOptions("show_branches_all", "Branches").then((res) => {
            // options.push()
            let newOptions = [...options];
            newOptions.push(...res);
            setOptions(res);
          });
        }, []);
       
        const [filterOptions, setFilterOptions] = useState([]);
       
       
        useEffect(() => {
          printOptions("show_groupbranches_all", "Groupbrances").then((res) => {
            // options.push()
            let newOptions = [...filterOptions];
            newOptions.push(...res);
            setFilterOptions(res);
            console.log("setFilterOptions",setFilterOptions)
          });
        }, []);
    const [modalData, setModalData] = useState([

        {
          title: t("groups"),
          name: "group_id",
          id: 40,
          unique: false,
          required: false,
          validation: () => {},
          type: "select",
          getOptions: () => printOptions("show_groupbranches_all", "Groupbrances"),
          error: "",
          // style: { gridColumn: "1/2" },
          // class: "input-group input-class",
          // inputClass: "input-field",
        },
        {
          title: t("type"),
          name: "type",
          id: 0,
          unique: false,
          required: true,
          type: "radio",
          info: [
            { name: t("product"), action: 1 },
            { name: t("service"), action: 0 },
          ],
          action: [],
          error: "",
        },
        {
          title: t("serial"),
          name: "cyril",
          id: 1,
          unique: false,
          required: false,
          validation: (value) => {
            if (!/\d+$/g.test(value)) {
              return t("warnNumber");
            }
          },
          type: "text",
          error: "برجاء ادخال حروف انجليزية",
        },
        {
          title: t("arabicName"),
          name: "ar_name",
          id: 2,
          unique: true,
          required: true,
          validation: (value) => {
            if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
              return t("warnArabic");
            }
          },
          type: "text",
          error: t("warnArabic"),
        },
        {
          title: t("englishName"),
          name: "en_name",
          id: 3,
          unique: true,
          required: true,
          validation: (value) => {
            if (!/^[^\u0600-\u06FF]+$/.test(value)) {
              return t("warnEnglish");
            }
          },
          type: "text",
          error: t("warnEnglish"),
        },
        {
          title: t("activePos"),
          name: "active_pos",
          id: 8,
          type: "radio",
          info: [
            { name: t("notActive"), action: 0 },
            { name: t("active"), action: 1 },
          ],
          // action: [""],
          error: "",
        },
        {
          title: t("isForSale"),
          name: "sales",
          id: 4,
          // unique: false,
          // required: true,
          type: "radio",
          info: [
            { name: t("notForSale"), action: 0 },
            { name: t("defineSale"), action: 1 },
          ],
          action: ["price"],
          error: "",
        },
        {
          title: t("salePrice"),
          name: "price",
          unique: false,
          required: true,
          id: 5,
          validation: (value) => {
            if (!/\d+$/g.test(value)) {
              return t("warnNumber");
            }
          },
          type: "text",
          error: t("warnNumber"),
        },
        {
          title: t("isForPurchase"),
          name: "purchase",
          id: 6,
          type: "radio",
          info: [
            { name: t("notForPurchase"), action: 0 },
            { name: t("definePurchase"), action: 1 },
          ],
          action: ["purchaseprice"],
          error: "",
        },
        {
          title: t("purchasePrice"),
          name: "purchaseprice",
          id: 7,
          unique: false,
          required: true,
          // validation: ,
          validation: (value) => {
            if (!/\d+$/g.test(value)) {
              return t("warnNumber");
            }
          },
          type: "text",
          error: t("warnNumber"),
        },
    
        {
          title: t("vatRate"),
          name: "vat",
          id: 12,
          validation: () => {},
          type: "select",
          // options: taxOptions,
          // getOptions: printOptions3,
          getOptions: () => printOptions("taxes_all", "taxes"),
          // options: [
          //   {name: 0, value: 0}
          // ],
          action: ["reason"],
          error: "",
          unique: false,
          required: true,
        },
        {
          title: t("reason"),
          name: "reason",
          id: 15,
          unique: false,
          required: false,
          validation: () => {},
          type: "select",
          getOptions: () => printOptions("taxes_reason", "Taxesreason"),
          error: "",
        },
    
        {
          title: t("proCat"),
          name: "category_id",
          id: 10,
          type: "select",
          // options: catOptions,
          // getOptions: printOptions,
          getOptions: () => printOptions("show_category_all", "category"),
          error: "",
          unique: false,
          required: true,
        },
        {
          title: t("proUnit"),
          name: "unite_id",
          id: 11,
          validation: () => {},
          type: "select",
          // options: unitOptions,
          // getOptions: printOptions2,
          getOptions: () => printOptions("unite_all", "Unites"),
          error: "",
          unique: false,
          required: true,
        },
    
        {
          title: t("barcode"),
          name: "barcode",
          id: 9,
          unique: false,
          required: false,
          validation: (value) => {
            // if (!/\d+$/g.test(value)) {
            //   return "يجب ادخال ارقام فقط";
            // }
            if (value.length < 12) return "يجب ادخال 12 رقم";
          },
          style: { gridColumn: "1/-1" },
          type: "text",
          error: "برجاء ادخال ارقام فقط",
        },
        {
          title: "الملف",
          name: "files",
          id: 13,
          unique: false,
          required: false,
          // validation: "",
          type: "file",
          error: "",
        },
    
        // {
        //   title: "نوع العميل",
        //   name: "customer_type",
        //   id: 10,
        //   // validation: "",
        //   type: "select",
        //   options: [
        //     { name: "فرد", value: "individual" },
        //     { name: "مؤسسة", value: "foundation" },
        //     { name: "شركة", value: "company" },
        //   ],
        //   error: "",
        // },
        // {
        //   title: "النوع",
        //   name: "type",
        //   id: 11,
        //   // validation: "",
        //   type: "select",
        //   options: [
        //     { name: "مورد", value: "supplier" },
        //     { name: "عميل", value: "customer" },
        //   ],
        //   error: "",
        // },
        // {
        //   title: "الملف",
        //   name: "files",
        //   id: 12,
        //   // validation: "",
        //   type: "file",
        //   error: "",
        // },
        ]);
        // const handleSubmit = () => {
        //     const cop = [...nestedData]
        //     // console.log(cop, index)
        //     // cop[index] = {
        //     //   ...cop[index],
        //     //   discount: data.discount,
        //     //   discounts: [{ reason: data.reason, discount: data.discount }],
        //     // };
        //     setData(cop)
        //     setModal({ open: false });
        //     console.log(nestedData)
    
        // }

    // console.log(modalValue.id)

    //formOperation
    const handleCloseModal = (e) => {
      e.preventDefault();
      setModal({ open: false });
    };

    const handleClose = () => {
      setModal({ open: false });
      
    };

  return (
    <>
    
        <Modal
          dataSource={dataSource}
          pro={true}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          inputClass={"input"}
        />

      
 </>
  );
};

export default AddProduct;
