import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { handleBodyData } from "../../utils/bodyData";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../../hooks/useToken";
import MultipleSelect, { CheckInput, InputField, RadioInput, SelectInput } from "../../components/Input/Inputs";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getOptions } from "../../utils/getOption";

const AddEmployee = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    branche_id: ''
  });
  const [permissionData, setPermessionData] = useState({
    view_home: "off",
    view_list_customers: "off",
    view_receipt_customer: "off",
    create_customer: "off",
    update_customer: "off",
    view_list_products: "off",
    create_product: "off",
    update_product: "off",
    view_tax_return: "off",
    create_tax_return: "off",
    view_list_sales: "off",
    create_sales: "off",
    print_sales: "off",
    salesReturns_request: "off",
    // view_sales_attachments: "off",
    // update_sales_attachments: "off",
    view_list_salesReturns: "off",
    update_salesReturns: "off",
    print_salesReturns: "off",
    // view_salesReturns_attachments: "off",
    // update_salesReturns_attachments: "off",
    view_list_purchases: "off",
    create_purchases: "off",
    update_purchases: "off",
    print_purchases: "off",
    purchasesReturns_request: "off",
    // view_purchases_attachments: "off",
    // update_purchases_attachments: "off",
    view_list_purchasesReturns: "off",
    update_purchasesReturns: "off",
    print_purchasesReturns: "off",
    // view_purchasesReturns_attachments: "off",
    // update_purchasesReturns_attachments: "off",
    view_list_log: "off",
    years_reports: "off",
    months_reports: "off",
    tax_reports: "off",
    receipt_voucher: "off",
    view_receipt_voucher: "off",
    add_receipt_voucher: "off",
    delete_receipt_voucher: "off",
    edit_receipt_voucher: "off",
    receipt_cashing: "off",
    view_receipt_cashing: "off",
    add_receipt_cashing: "off",
    delete_receipt_cashing: "off",
    edit_receipt_cashing: "off",
    price_offers: "off",
    view_price_offers: "off",
    add_price_offers: "off",
    delete_price_offers: "off",
    edit_price_offers: "off",
    receipt_sadads: "off",
    opeing_blance_create: "off",
    opeing_blance: "off",
    purchaseorder: "off",
    view_purchaseorder: "off",
    add_purchaseorder: "off",
    delete_purchaseorder: "off",
    edit_purchaseorder: "off",
    opeing_blance_edit: 'off'
  });
  const [errors, setErrors] = useState({});

  const modalData0 = [
    {
      title: "userName",
      name: "name",
      id: 5,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "email",
      name: "email",
      id: 11,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "phone",
      name: "phone",
      id: 6,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "",
      class: " w-100 input-group",
    },
    {
      title: "password",
      name: "password",
      id: 10,
      unique: false,
      required: true,
      validation: () => {},
      type: "password",
      error: "",
      class: " w-100 input-group",
    },
  ];
  const modalData1 = [
    {
      title: "مشاهدة الصفحة الرئيسية",
      name: "view_home",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 7,
    },
  ];
  const modalData2 = [
    {
      title: "عرض قائمة العملاء/ الموردين",
      name: "view_list_customers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "مشاهدة فواتير عميل/مورد",
      name: "view_receipt_customer",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "اضافة عميل/مورد",
      name: "create_customer",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 3,
    },
    {
      title: "تحديث عميل/مورد",
      name: "update_customer",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 4,
    },
  ];
  const modalData3 = [
    {
      title: "عرض جميع المنتجات",
      name: "view_list_products",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "اضافة منتج جديد",
      name: "create_product",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "تحديث منتج",
      name: "update_product",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 3,
    },
  ];
  const modalData4 = [
    {
      title: "عرض ضريبة القيمة المضافة",
      name: "view_tax_return",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 1,
    },
    // {
    //   title: "اضافة اقرار ضريبي",
    //   name: "taxes_unable",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "سماح", action: 0 },
    //     { name: "لا", action: 1 },
    //   ],
    //   id: 2,
    // },
  ];
  
  const modalData6 = [
    {
      title: "عرض فاتورة مبيعات",
      name: "view_list_sales",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "انشاء فاتورة مبيعات",
      name: "create_sales",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "طباعة فاتورة مبيعات",
      name: "print_sales",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 5,
    },
    {
      title: "انشاء طلب مرتجع للمبيعات",
      name: "salesReturns_request",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 6,
    },
    // {
    //   title: "مشاهدة مرفقات المبيعات",
    //   name: "view_sales_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 7,
    // },
    // {
    //   title: "تحديث مرفقات المبيعات",
    //   name: "update_sales_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 8,
    // },
    {
      title: "عرض مرتجع المبيعات",
      name: "view_list_salesReturns",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 9,
    },
    {
      title: "طباعة فاتورة مرتجع المبيعات",
      name: "print_salesReturns",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 11,
    },
    // {
    //   title: "مشاهدة مرفقات مرتجع المبيعات",
    //   name: "view_salesReturns_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 12,
    // },
    // {
    //   title: "تحديث مرفقات مرتجع المبيعات",
    //   name: "update_salesReturns_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: 'off' },
    //     { name: "سماح", action: 'on' },
    //   ],
    //   id: 13,
    // },
  ];
  const modalData8 = [
    {
      title: "عرض فاتورة مشتريات",
      name: "view_list_purchases",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "انشاء فاتورة مشتريات",
      name: "create_purchases",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "تحديث فاتورة مشتريات",
      name: "update_purchases",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 4,
    },
    {
      title: "طباعة فاتورة مشتريات",
      name: "print_purchases",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 5,
    },
    {
      title: "انشاء طلب مرتجع للمشتريات",
      name: "purchasesReturns_request",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 6,
    },
    // {
    //   title: "مشاهدة مرفقات المشتريات",
    //   name: "view_purchases_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 7,
    // },
    // {
    //   title: "تحديث مرفقات المشتريات",
    //   name: "update_purchases_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 8,
    // },
    {
      title: "عرض مرتجع المشتريات",
      name: "view_list_purchasesReturns",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 9,
    },
    {
      title: "تحديث فاتورة مرتجع المشتريات",
      name: "update_purchasesReturns",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 10,
    },
    {
      title: "طباعة فاتورة مرتجع المشتريات",
      name: "print_purchasesReturns",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 11,
    },
    // {
    //   title: "مشاهدة مرفقات مرتجع المشتريات",
    //   name: "view_purchasesReturns_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 12,
    // },
    // {
    //   title: "تحديث مرفقات مرتجع المشتريات",
    //   name: "update_purchasesReturns_attachments",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: 'off' },
    //     { name: "سماح", action: 'on' },
    //   ],
    //   id: 13,
    // },
  ];
  const modalData9 = [
    {
      title: "عرض السجل",
      name: "view_list_log",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 1,
    },
  ];
  const modalData10 = [
    {
      title: "التقارير السنوية",
      name: "years_reports",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 0,
    },
    {
      title: "التقارير الشهرية",
      name: "months_reports",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "تقارير الضرائب",
      name: "tax_reports",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },

    {
      title: "تقرير ملخص المخزون",
      name: "receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 3,
    },
    {
      title: "تقرير حركة الصنف",
      name: "view_receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 4,
    },
  ];
  const modalData11 = [
    {
      title: "سند القبض",
      name: "receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 0,
    },
    {
      title: "طباعة ومشاهدة سند القبض",
      name: "view_receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "اضافة سند القبض",
      name: "add_receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    // {
    //   title: "حذف سند القبض",
    //   name: "delete_receipt_voucher",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 3,
    // },
    {
      title: "تعديل سند القبض",
      name: "edit_receipt_voucher",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 4,
    },
  ];
  const modalData12 = [
    {
      title: "سند الصرف",
      name: "receipt_cashing",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 0,
    },
    {
      title: "طباعة ومشاهدة سند الصرف",
      name: "view_receipt_cashing",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "اضافة سند الصرف",
      name: "add_receipt_cashing",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    // {
    //   title: "حذف سند الصرف",
    //   name: "delete_receipt_cashing",
    //   type: "radio",
    //   unique: false,
    //   error: "",
    //   info: [
    //     { name: "لا", action: "off" },
    //     { name: "سماح", action: "on" },
    //   ],
    //   id: 3,
    // },
    {
      title: "تعديل سند الصرف",
      name: "edit_receipt_cashing",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 4,
    },
  ];
  const modalData13 = [
    {
      title: "عرض الاسعار",
      name: "price_offers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 0,
    },
    {
      title: "طباعة ومشاهدة عرض الاسعار",
      name: "view_price_offers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 1,
    },
    {
      title: "اضافة عرض الاسعار",
      name: "add_price_offers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 2,
    },
    {
      title: "حذف عرض الاسعار",
      name: "delete_price_offers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 3,
    },
    {
      title: "تعديل عرض الاسعار",
      name: "edit_price_offers",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 4,
    },
  ];
  const modalData7 = [
    {
      title: "طلبية شراء",
      name: "purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 0,
    },
    {
      title: "طباعة ومشاهدة طلبية شراء",
      name: "view_purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 1,
    },
    {
      title: "اضافة طلبية شراء",
      name: "add_purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 2,
    },
    {
      title: "حذف طلبية شراء",
      name: "delete_purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 3,
    },
    {
      title: "تعديل طلبية شراء",
      name: "edit_purchaseorder",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 4,
    },
  ];
  const modalData14 = [
    {
      title: "فواتير بسدادات",
      name: "receipt_sadads",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 0,
    },
  ];
  const modalData15 = [
    {
      title: "اضافة الارصدة الافتتاحية",
      name: "opeing_blance_create",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: "off" },
        { name: "سماح", action: "on" },
      ],
      id: 0,
    },
    {
      title: "تعديل الارصدة الافتتاحية",
      name: "opeing_blance_edit",
      type: "radio",
      unique: false,
      error: "",
      info: [
        { name: "لا", action: 'off' },
        { name: "سماح", action: 'on' },
      ],
      id: 1,
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
    password: (item) => (
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
    radio: (item) => (
      <RadioInput
        item={item}
        key={item.id}
        data={permissionData}
        // handleRadio={handleRadio}
        setFormData={setPermessionData}
        errors={errors}
        disabled={[]}
        setDisabled={() => {}}
      />
    ),
    checkbox: (item) => (
      <CheckInput
        item={item}
        key={item.id}
        data={permissionData}
        // handleRadio={handleRadio}
        setFormData={setPermessionData}
        errors={errors}
        disabled={[]}
        setDisabled={() => {}}
      />
    ),
    "multi-select": (item) => (
      <MultipleSelect
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
      />
    ),
  };

  const { token, role } = useToken();
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [id, setId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const {id: empId} = useParams()

  useEffect(() => {
    if(empId) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(`${apiUrl}show_employee/${empId}`, {}, { headers })
        .then((res) => {
          // Object.keys(res.data.data.permissions).map((ele) =>
          //   // console.log(res.data.data.permissions[ele])
          // );
          let formData = {...data}
          let permissData = {...permissionData}
          Object.keys(data).map(item => {
            formData[item] = res.data.data[item]
          })
          Object.keys(permissData).map(item => {
            // formData[item] = res.data.data.permissions[item];
            if(res.data.data.permissions.includes(item)) {
              permissData[item] = "on";
            } else {
              permissData[item] = "off";
            }
          })
          setData(formData)
          setPermessionData(permissData)
          setLoading(false);
        });
    }
  }, []);

  // console.log(data)


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

  const handlSubmit = (e) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if(!empId) {
      err = handleErrors(
        data,
        [],
        [
          ...modalData0,
          ...modalData1,
          ...modalData2,
          ...modalData3,
          ...modalData4,
          ...modalData10,
          ...modalData11,
          ...modalData12,
          ...modalData13,
          ...modalData14,
          ...modalData15,
        ]
      );
    }
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const permissions = {
          ...modalData10,
          ...modalData11,
          ...modalData12,
          ...modalData13,
          ...modalData14,
          ...modalData15,
      };
      const body = handleBodyData(data, null, [...modalData0]);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // console.log(body);
      // setLoading(true);
      setBtnLoader(true);
      if(empId) {
        axios
          .post(
            `${apiUrl}update_employee/${empId}`,
            { ...body, permissions: { ...permissionData } },
            { headers }
          )
          .then(() => {
            
            setBtnLoader(false);
            toast.success("تم تحديث الموظف بنجاح", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            // setSuccess(true);
            // navigate("/");
            // setLoading(false);
            // console.log(res.data.data.receipts);

            // dispatch(addTaxRep(res.data.data));
          })
          .catch((err) => {
            setLoading(false);
            setBtnLoader(false);
            console.log(err);
            toast.error("حدث خطأ ما", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            // dispatch(addProReb(err))
          });
      } else {
        axios
          .post(
            `${apiUrl}add_employee`,
            { ...body, permissions: { ...permissionData } },
            { headers }
          )
          .then(() => {
            // window.scrollTo({
            //   top: 0,
            //   behavior: "smooth",
            // });
            // setSuccess(true);
            toast.success("تم انضافة موظف بنجاح", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setBtnLoader(false);
            // navigate("/");
            // setLoading(false);
            // console.log(res.data.data.receipts);

            // dispatch(addTaxRep(res.data.data));
          })
          .catch((err) => {
            setLoading(false);
            toast.error("حدث خطأ ما", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setBtnLoader(false);
            console.log(err);
            // dispatch(addProReb(err))
          });
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
    }, 10000);
  }, [success]);

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  

  const [options, setOptions] = useState([]);

  

  if (role === "company") {
    modalData0.push({
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "multi-select",
      // getOptions: () => printOptions("show_branches_all", "Branches"),
      options,
      error: "",
      class: " w-100 input-group",
    });
  }

  useEffect(() => {
    printOptions("show_branches_all", "Branches").then((res) => {
      // options.push()
      let newOptions = [...options];
      newOptions.push(...res);
      setOptions(res);
    });
  }, []);

  return (
    <div className="page-wrapper">
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
          {success && (
            <div className="success">
              <p>
                {empId
                  ? "تم تعديل بيانات الموظف بنجاح"
                  : "تم اضافة الموظف بنجاح"}
              </p>
            </div>
          )}
          <form
            className="form-wrapper update"
            onSubmit={(e) => handlSubmit(e)}
            // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              {t("empInfo")}
            </h2>
            {modalData0.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              الصفحة الرئيسية
            </h2>
            {modalData1.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>{t("client")}</h2>
            {modalData2.map((item) => {
              return inputs[`${item.type}`](item);
            })}

            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>المنتجات</h2>
            {modalData3.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              اقرار ضريبة القيمة المضافة
            </h2>
            {modalData4.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>مبيعات</h2>
            {modalData6.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>مشتريات</h2>
            {modalData8.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>السجل</h2>
            {modalData9.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>التقارير</h2>
            {modalData10.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>سند القبض</h2>
            {modalData11.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>ايصال الصرف</h2>
            {modalData12.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>عروض الاسعار</h2>
            {modalData13.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>طلبية الشراء</h2>
            {modalData7.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              فواتير بسدادات
            </h2>
            {modalData14.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <h2 style={{ width: "100%", gridColumn: "1/-1" }}>
              الارصدة الافتتاحية
            </h2>
            {modalData15.map((item) => {
              return inputs[`${item.type}`](item);
            })}
            <button
              className="btn"
              onClick={(e) => handlSubmit(e)}
              disabled={btnLoader}
            >
              {btnLoader ? <LoadSpinner btn={true} /> : t("confirm")}
            </button>
            <ToastContainer />
          </form>
        </>
      )}
    </div>
  );
};

export default AddEmployee;
