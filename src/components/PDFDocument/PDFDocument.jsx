/* eslint-disable react/prop-types */
import { useRef } from "react";
import logo from "../../../public/log.png";
// import qr from "../../assets/qr.png";
import "../../styles/pdftest.css";
import { formatDate } from "../../utils/Date";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
import useToken from "../../hooks/useToken";
import { apiUrl } from "../../features/table/billSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import LoadSpinner from "../LoadSpinner/LoadSpinner";
// import QRCode from "react-qr-code";
import QRCode from "qrcode";
import { Invoice } from "@axenda/zatca";
import { Buffer } from "buffer";
// eslint-disable-next-line react/display-name
window.Buffer = window.Buffer || Buffer;


const PDFDocument = () => {
  const { token, data, permissions } = useToken();
  const { id, type } = useParams();
  const [modalValue, setModalValue] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [arr, setArr]= useState([])
  const [number, setNumber] = useState({})
  const [email, setEmail] = useState(null)
  const ref = useRef();
  const handlePrint = () => {
    window.print(ref.current);
  };

  console.log(modalValue)

  const identity = {
    sales: {
      arName: "فاتورة ضريبية",
      enName: "Taxable Invoice",
      apiPath: "show_sale_invoice",
      perfix: number.perfix_sales,
      suffix: number.suffix_sales,
    },
    quotations: {
      arName: "عرض سعر",
      enName: "Quotations",
      apiPath: "show_quotations",
      perfix: number.perfix_quotations,
      suffix: number.suffix_quotations,
    },
    creditnote: {
      arName: "اشعار دائن لفاتورة ضريبية",
      enName: "Creditnotes",
      apiPath: "show_creditnote",
      perfix: number.perfix_creditnote,
      suffix: number.suffix_creditnote,
    },
    purchaseorder: {
      arName: "طلبية شراء",
      enName: "Purchase order",
      apiPath: "show_purchaseorder",
      perfix: number.perfix_purchaseorder,
      suffix: number.suffix_purchaseorder,
    },
    purchases: {
      arName: "فاتورة مشتريات",
      enName: "Purchase invoice",
      apiPath: "show_purchase",
      perfix: number.perfix_purchase,
      suffix: number.suffix_purchase,
    },
    depitnote: {
      arName: "اشعار مدين لفاتورة ضريبية",
      enName: "Depitnote",
      apiPath: "show_debitnote",
      perfix: number.perfix_debitnote,
      suffix: number.suffix_debitnote,
    },
  };
  // console.log(number)

  // console.log(data)
  const fetchPrev = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${apiUrl}show_company`, {}, { headers })
      .then((res) => {
        setEmail(res.data.data.id);
        setNumber({ ...res.data.data.StartingNumber[0] });
      });
    axios
      .post(`${apiUrl}${identity[type].apiPath}`, { id }, { headers })
      .then((res) => {
        setLoading(false);
        setModalValue(res.data.data);
      })
      .catch((err) => console.log(err));

      
  };

  useEffect(() => {
    setLoading(true);
    fetchPrev();
  }, [id]);

  const handleInvoice = async (data) => {
    try {
      

      
      const invoice = new Invoice({
        sellerName: data.company.name,
        vatRegistrationNumber: data.company.tax_number,
        invoiceTimestamp: new Date(data.created_at).toISOString(),
        invoiceTotal: String(data.total),
        invoiceVatTotal: String(data.tax),
      });

      const imageData = await invoice.toBase64();
      QRCode.toDataURL(imageData)
        .then((url) => {
          // console.log(url);
          setQr(url);
        })
        .catch((err) => {
          console.error(err);
        });
    // return {val}
    } catch(err) {
      console.log(err)
    }

  }

  // console.log(modalValue)
  const [qr, setQr] = useState(null);
  useEffect(() => {
    if (modalValue) {
      handleInvoice(modalValue)
    }
  }, [modalValue]);


  if (loading) return <LoadSpinner />;
  if (!loading && modalValue) {
    return (
      <div className="pdf-container" style={{ fontSize: "10px" }} ref={ref}>
        <div className="header">
          <img
            src={
              modalValue.company.header
                ? `https://einvoice.nozzm.com/public/public/images/${modalValue.company.header}`
                : logo
            }
            alt=""
          />
          <div className="reciept-title">
            <h2>
              {type === "sales" &&
              modalValue.customers.customer_type === "individual"
                ? `Simple ${identity[type].enName}`
                : type === "sales"
                ? identity[type].enName
                : type === "creditnote" &&
                  modalValue.customers.customer_type === "individual"
                ? `Simple ${identity[type].enName}`
                : type === "depitnote" &&
                  modalValue.customers.customer_type === "individual"
                ? `Simple ${identity[type].enName}`
                : identity[type].enName || identity[type].enName}
            </h2>
            <hr className="pdf-line" />
            <h2>
              {type === "sales" &&
              modalValue.customers.customer_type === "individual"
                ? `${identity[type].arName} مبسطة`
                : type === "sales"
                ? identity[type].arName
                : type === "creditnote" &&
                  modalValue.customers.customer_type === "individual"
                ? `${identity[type].arName} مبسطة`
                : type === "depitnote" &&
                  modalValue.customers.customer_type === "individual"
                ? `${identity[type].arName} مبسطة`
                : identity[type].arName || identity[type].arName}
            </h2>
          </div>
        </div>
        <table className="first-tt">
          <tr>
            <th style={{ width: "100px" }}>
              {type === "creditnote" || type === "depitnote"
                ? "رقم الاشعار"
                : "رقم الفاتورة"}{" "}
            </th>
            <th style={{ width: "100px" }}>
              {identity[type].perfix ? `${identity[type].perfix}/` : "-/"}
              {modalValue.invoice_number}
              {identity[type].suffix ? `/${identity[type].suffix}` : "/-"}
            </th>
            <th style={{ width: "100px" }}>
              {type === "creditnote"
                ? "Creditnote no."
                : type === "depitnote"
                ? "Depitnote no."
                : "Invoice no."}
            </th>
            <th style={{ width: "100px" }}>
              {type === "sales"
                ? "تاريخ ووقت الفاتورة"
                : type === "creditnote" || type === "depitnote"
                ? "تاريخ ووقت الاشعار"
                : "تاريخ الفاتورة"}
            </th>
            <th style={{ width: "100px" }}>
              {type === "sales" ||
              type === "depitnote" ||
              type === "creditnote" ||
              type === "purchases"
                ? formatDate(modalValue["created_at"])
                : formatDate(modalValue["created_at"])}
            </th>
            <th style={{ width: "100px" }}>
              {type === "creditnote"
                ? "Creditnote date"
                : type === "depitnote"
                ? "Depitenote date"
                : "Invoice date"}
            </th>
          </tr>
        </table>
        {type === "creditnote" || type === "depitnote" ? (
          <table className="first-tt">
            <tr>
              <th style={{ width: "100px" }}>رقم الفاتورة الاصلي </th>
              <th style={{ width: "100px" }}>
                {modalValue.original_invoice_number}
              </th>
              <th style={{ width: "100px" }}>Original invoice no.</th>
            </tr>
          </table>
        ) : null}
        <div className="table-group">
          <div style={{ width: "50%" }}>
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    style={{ textAlign: "center" }}
                    className="backgr"
                  >
                    بيانات المورد
                  </th>
                </tr>
                <tr>
                  {/* <th>customer name</th> */}
                  <th colSpan={1} style={{ width: "40%" }}>
                    <div className="th">
                      <span>اسم المورد</span>
                      <span>Vendor name</span>
                    </div>
                  </th>
                  <th style={{ width: "50%" }}>{modalValue.company.name}</th>
                </tr>
                <tr>
                  <th colSpan={1} style={{ width: "260px" }} className="w-150">
                    <div className="th">
                      <span>رقم السجل التجاري</span>
                      <span>C.R No</span>
                    </div>
                  </th>
                  <th colSpan={3} className="w-250">
                    {modalValue.company.cr ? modalValue.company.cr : "-"}
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} style={{ width: "260px" }} className="w-150">
                    <div className="th">
                      <span>الرقم الضريبي</span>
                      <span>Vat Number</span>
                    </div>
                  </th>
                  <th colSpan={3} className="w-250">
                    {modalValue.company.tax_number}
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} style={{ width: "260px" }} className="w-150">
                    <div className="th">
                      <span>العنوان</span>
                      <span>Address</span>
                    </div>
                  </th>
                  <th colSpan={1} className="w-250">
                    {modalValue.company.address}
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div style={{ width: "50%" }}>
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    style={{ textAlign: "center" }}
                    className="backgr"
                  >
                    بيانات العميل
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} style={{ width: "40%" }}>
                    <div className="th">
                      <span>اسم العميل</span>
                      <span>Customer name</span>
                    </div>
                  </th>
                  <th colSpan={3} style={{ width: "50%" }}>
                    {modalValue.customers.name}
                  </th>
                </tr>
                {modalValue.customers.tax_card ? (
                  <tr>
                    <th
                      colSpan={1}
                      style={{ width: "260px" }}
                      className="w-150"
                    >
                      <div className="th">
                        <span>رقم السجل التجاري</span>
                        <span>C.r no</span>
                      </div>
                    </th>
                    <th colSpan={3} className="w-250">
                      {modalValue.customers.cr ? modalValue.customers.cr : "-"}
                    </th>
                  </tr>
                ) : null}
                {modalValue.customers.tax_card ? (
                  <tr>
                    <th colSpan={1} style={{ width: "40%" }}>
                      <div className="th">
                        <span>الرقم الضريبي</span>
                        <span>Vat Number</span>
                      </div>
                    </th>
                    <th colSpan={3} className="w-250">
                      {modalValue.customers.tax_card
                        ? modalValue.customers.tax_card
                        : "-"}
                    </th>
                  </tr>
                ) : null}
                <tr>
                  <th colSpan={1} style={{ width: "50%" }}>
                    <div className="th">
                      <span>العنوان</span>
                      <span>ِAddress</span>
                    </div>
                  </th>
                  <th colSpan={3} className="w-250">
                    {modalValue.customers.address}
                  </th>
                </tr>
                {/* {type =} */}
              </thead>
            </table>
          </div>
        </div>
        <table className="body-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <p>S.No.</p>
                <p>الرقم</p>
              </th>
              {/* <th style={{ width: "160px" }}>
                <p>Code</p>
                <p>كود الصنف</p>
              </th> */}
              <th style={{ width: "200px" }}>
                <p>Item name</p>
                {email === 10 ? <p>مسمى التأشير</p> : <p>اسم الصنف</p>}
              </th>
              <th style={{ width: "200px" }}>
                <p>Item description</p>
                {email === 10 ? <p>جهة الاستقدام</p> : <p>وصف الصنف</p>}
                {/* <p>وصف الصنف</p> */}
              </th>
              <th style={{ width: "60px" }}>
                <p>Quantity</p>
                {email === 10 ? <p>العدد</p> : <p>الكمية</p>}
                {/* <p>الكمية</p> */}
              </th>
              <th style={{ width: "70px" }}>
                <p>Unit price</p>
                {email === 10 ? <p>السعر</p> : <p>سعر الوحد</p>}
                {/* <p>سعر الوحدة</p> */}
              </th>
              <th style={{ width: "60px" }}>
                <p>Discount</p>
                <p>الخصم</p>
              </th>
              <th style={{ width: "100px" }}>
                <p>Total excl vat</p>
                <p>المبلغ الخاضع للضريبة</p>
              </th>
              <th style={{ width: "100px" }}>
                <p>Tax rate</p>
                <p>نسبة الضريبة</p>
              </th>
              <th style={{ width: "100px" }}>
                <p>Tax amount</p>
                <p>مبلغ الضريبة</p>
              </th>
              <th style={{ width: "110px" }}>
                <p>Total (with vat)</p>
                <p>الاجمالي (بالضريبة)</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {modalValue.items.map((item, k) => {
              return (
                <tr key={k}>
                  <td>{k + 1}</td>
                  {/* <td>{item.products.cyril}</td> */}
                  <td>{item.products.ar_name} </td>
                  <td>{item.description ? item.description : "-"} </td>
                  <td>
                    {item.quantity
                      ? `${item.quantity} ${item.products.unite}`
                      : "-"}
                  </td>
                  <td>{item.piece_price}</td>
                  <td>{item.discount ? item.discount : "-"}</td>
                  <td>{item.sub_total}</td>
                  <td>{item.products.vat ? `${item.products.vat} %` : "-"}</td>
                  <td>{item.tax_price ? item.tax_price : "-"}</td>
                  <td>{item.total_after_tax}</td>
                </tr>
              );
            })}
            {Array.from({ length: 20 - modalValue.items.length }).map(
              (ele, i) => {
                return (
                  <tr key={i}>
                    <div style={{ padding: "10px", width: "100%" }}></div>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
        <table className="body-table" style={{ width: "100%" }}>
          <tr>
            <td colSpan={10}>الاجمالي بدون الضريبة - Total without Tax </td>
            <td>
              {modalValue.items.reduce(
                (total, item) =>
                  total + Number(item.quantity) * Number(item.piece_price),
                0
              )}{" "}
              SAR
            </td>
          </tr>
          <tr>
            <td colSpan={10}>الخصومات - Total Discount</td>
            <td>
              {modalValue.items.reduce(
                (totalDiscount, item) =>
                  totalDiscount + Number(item.discount) * Number(item.quantity),
                0
              )}{" "}
              SAR
            </td>
          </tr>
          <tr>
            <td colSpan={10}>
              الاجمالي الخاضع للضريبة بعد الخصم - Total Taxable Amount
            </td>
            <td>{modalValue.sub_total} SAR</td>
          </tr>
          <tr>
            <td colSpan={10}> مجموع ضريبة القيمة المضافة - Total VAT</td>
            <td>{modalValue["tax"]} SAR</td>
          </tr>

          <tr>
            <td colSpan={10}>
              الإجمالي شامل ضريبة القيمة المضافة - Total Amount Due with VAT
            </td>

            <td>{modalValue["total"]} SAR</td>
          </tr>
          <tr>
            <td colSpan={11}>
              {" "}
              {toArabicWord(modalValue["total"])} ريال سعودي
            </td>
          </tr>
        </table>
        <div className="table-footer">
          <div className="qr">
            {/* <img src={qr} alt="" /> */}
            {type === "sales" ||
            type === "creditnote" ||
            type === "depitnote" ? (
              <div style={{ width: "100%", height: "100%" }}>
                {/* <QRCode
                  value={
                    `company` +
                    // `${modalValue.company.name}` +
                    // modalValue.company.tax_number +
                    ` ${formatDate(modalValue.created_at)}` +
                    ` ${modalValue.total}` +
                    ` ${modalValue.tax}`
                  }
                  style={{ width: "100%", height: "100px" }}
                /> */}
                {qr && (
                  <img
                    src={permissions.includes("zatcaV2") ? modalValue.qr : qr}
                    style={{ width: "100%", height: "100px" }}
                  />
                )}
              </div>
            ) : type === "purchases" && modalValue.customers.tax_card ? (
              <div style={{ width: "100%", height: "100%" }}>
                {qr && (
                  <img
                    src={permissions.includes("zatcaV2") ? modalValue.qr : qr}
                    style={{ width: "100%", height: "100px" }}
                  />
                )}
              </div>
            ) : null}

            <button
              className="btn"
              onClick={handlePrint}
              style={{ height: "30px" }}
            >
              طباعة
            </button>
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ width: "50%", height: "50px" }}>
              <p
                className="backgr"
                style={{ width: "100%", color: "white", textAlign: "center" }}
              >
                الشروط والاحكام
              </p>
              <div style={{ padding: "5px 5px", textAlign: "start" }}>
                {/* نتابفغبغبا لغعبعبالاالاالا تعفغفغعاهات اعففعقفقلغ
                هغفف67غلعاتهنتىنت خاعهغعهفغعلعلعلاه عاعهغهفغلاهتىتلالا خااعاعاعا{" "} */}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th colSpan={2} className="backgr">
                    معلومات الدفع
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={1}>
                    <div className="th">
                      <span>اسم البنك</span>
                      <span>Bank name</span>
                    </div>
                  </td>
                  <td colSpan={1}>{modalValue.company.bank_name}</td>
                </tr>
                <tr>
                  <td colSpan={1}>
                    <div className="th">
                      <span>رقم الحساب</span>
                      <span>Bank account number</span>
                    </div>
                  </td>
                  <td colSpan={1}>{modalValue.company.bank_account_number}</td>
                </tr>
                <tr>
                  <td>
                    <div className="th">
                      <span>رقم البنك الدولي</span>
                      <span>IBAN</span>
                    </div>
                  </td>
                  <td>{modalValue.company.world_bank_code}</td>
                </tr>
                {/* <tr>
                <td>
                  <div className="th">
                    <span>اسم الحساب البنكي</span>
                    <span>Bank account name</span>
                  </div>
                </td>
                <td>ahm</td>
              </tr> */}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-tail">
          <div className="img" style={{ width: "100%", height: "60px" }}>
            <img
              src={
                modalValue.company.footer
                  ? `https://einvoice.nozzm.com/public/public/images/${modalValue.company.footer}`
                  : logo
              }
              alt=""
            />
          </div>
          {/* <div>
            <p>نظم</p>
          </div> */}
        </div>
      </div>
    );
  }
};

export default PDFDocument;


