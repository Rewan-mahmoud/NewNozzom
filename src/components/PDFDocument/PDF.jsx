/* eslint-disable no-unused-vars */
import { forwardRef } from "react";
import logo from "../../../public/log.png";
import qr from "../../assets/qr.png";
import { formatDate } from "../../utils/Date";
import "../../styles/pdf.css";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";

// eslint-disable-next-line react/display-name
const PDFView = forwardRef((prop, ref) => {
  const { modalValue } = prop;
  console.log(modalValue)
  return (
    <table ref={ref} className="pdf-table">
      <thead>
        <tr style={{ border: "0px" }}>
          <td style={{ border: "0px" }}>
            {/* <div className="header"> */}
            <div dir="rtl" className="invoice-box">
              <header id="header" style={{ padding: "0 20px" }}>
                <div className="top_header" style={{ height: "100%" }}>
                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      width: "100%",
                      height: "100%",
                      whiteSpace: "nowrap",
                    }}
                  ></div>
                  <div>
                    <div className="image_header">
                      <img
                        className="img img-responsive"
                        src={logo}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                  </div>
                  <div className="fatorah-title">
                    <h2>Taxable Invoice </h2>
                    <hr className="pdf-line" />
                    <h2> فاتورة مشتريات</h2>
                  </div>

                  {/* <h2
                      style={{
                        position: "absolute",
                        top: "100px",
                        left: "46%",
                      }}
                    >
                      فاتورة مشتريات
                    </h2> */}
                </div>
              </header>
              <br />
            </div>
            {/* </div> */}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr style={{ border: "0px" }}>
          <td style={{ border: "0px", padding: "0" }}>
            <div className="content" style={{ height: "auto" }}>
              <div dir="rtl" className="invoice-box">
                <main>
                  <div className="top-table">
                    <div style={{ padding: "0 20px", width: '100%' }}>
                      <table className="noice_table">
                        <tr>
                          <td style={{ width: "150px", padding: '0' }}>رقم الفاتورة</td>
                          <td style={{ width: "150px" }}>
                            {modalValue.invoice_number}
                          </td>
                          <td style={{ width: "150px" }}>invoice num.</td>
                          <td style={{ width: "150px" }}>invoice date.</td>
                          <td style={{ width: "150px" }}>
                             {formatDate(modalValue["created_at"])}
                          </td>
                          <td style={{ width: "150px" }}>تاريخ الفاتورة</td>
                        </tr>
                      </table>
                      <br />
                      <div style={{display: 'flex', gap: '5px', alignItems: 'flex-start', flexDirection: 'column', width: '100%'}}>
                        <table
                          className="noice_table"
                          // style={{ marginTop: "10px" }}
                        >
                          <tr>
                            <td style={{ width: "150px" }}>اسم المورد</td>
                            <td style={{ width: "150px" }}>
                              {modalValue.customers.name}
                            </td>
                            <td style={{ width: "150px" }}>supplier name</td>
                          </tr>
                          <tr>
                            <td>رقم السجل التجاري</td>
                            <td>5555</td>
                            <td>CR Number</td>
                          </tr>
                          <tr>
                            <td>رقم تسجيل ضريبة القيمة المضافة </td>
                            <td>5555</td>
                            <td>vat Number</td>
                          </tr>
                          <tr>
                            <td>العنوان </td>
                            <td>كايرو</td>
                            <td>Official address</td>
                          </tr>
                        </table>
                        <br />
                        <table
                          className="noice_table"
                          // style={{ marginTop: "10px" }}
                        >
                          <tr>
                            <td style={{ width: "150px" }}>اسم العميل</td>
                            <td style={{ width: "150px" }}>
                              {modalValue.customers.name}
                            </td>
                            <td style={{ width: "150px" }}>Client Number</td>
                          </tr>
                          <tr>
                            <td style={{ width: "150px" }}>
                              رقم السجل التجاري
                            </td>
                            <td style={{ width: "150px" }}>
                              {modalValue.customers.cr}
                            </td>
                            <td style={{ width: "150px" }}>CR NO</td>
                          </tr>
                          <tr>
                            <td>رقم تسجيل ضريبة القيمة المضافة</td>
                            <td>
                              {modalValue.customers.tax_card
                                ? modalValue.customers.tax_card
                                : "لا يوجد"}
                            </td>
                            <td>VAT NO</td>
                          </tr>
                          <tr>
                            <td>العنوان</td>
                            <td>{modalValue.customers.address}</td>
                            <td>Address</td>
                          </tr>

                          <tr>
                            <td>jkjk </td>
                            <td>kjjk</td>
                            <td>OLD INVOICE</td>
                          </tr>

                          <tr>
                            <td>رقم امر الشراء</td>
                            <td>kjjk </td>
                            <td> Purchers order number</td>
                          </tr>
                          <tr>
                            <td>تاريخ امر الشراء</td>
                            <td>kjkj</td>
                            <td>Date Purchers Order</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>

                  <br />

                  <div
                    className="row"
                    style={{
                      width: "80%",
                      padding: "0 20px",
                    }}
                  >
                    <table
                      className="third_table"
                      style={{
                        direction: "ltr",
                        whiteSpace: "pre-wrap",
                        // marginTop: "10px",
                        // width: "80%",
                      }}
                    >
                      <thead className="report-header">
                        <tr style={{ lineHeight: "6px" }}>
                          <th>
                            <p className="h_l">Serial No.</p>
                             <p className="h_r">رقم التسلسل</p>
                          </th>

                          <th>
                            <p className="h_l"> Code </p>
                            <p className="h_r">كود الصنف</p>
                          </th>

                          <th>
                            <p className="h_l">Items Name </p>
                            <p className="h_r">اسم الصنف </p>
                          </th>

                          <th>
                            <p className="h_l">Items Description </p>
                            <p className="h_r">وصف الصنف </p>
                          </th>

                          <th>
                            <p className="h_l">Quantity</p>
                            <p className="h_r">الكمية</p>
                          </th>

                          <th>
                            <p className="h_l">Unit Price</p>
                            <p className="h_r">سعر الوحدة</p>
                          </th>

                          <th>
                            <p className="h_l">Discount</p>
                            <p className="h_r">الخصم</p>
                          </th>
                          <th>
                            <p className="h_l">Total excl vat</p>
                            <p className="h_r">المبلغ الخاضع للضريبة</p>
                          </th>
                          <th>
                            <p className="h_l">Tax Rate</p>
                            <p className="h_r">نسبة الضريبة</p>
                          </th>

                          <th>
                            <p className="h_l">Tax Amount </p>
                            <p className="h_r">مبلغ الضريبة</p>
                          </th>
                          <th>
                            <p className="h_l">Total(With VAT)</p>
                            <p className="h_r"> المجموع(بالضريبة)</p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {modalValue.items.map((item, k) => {
                          return (
                            <tr key={k}>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.product} بروداكت
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.receipt_id} ريسيت اي دي
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.type} النوع
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.description} الوصف
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.quantity} كمية
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.piece_price} سعر الوحدة
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.discount} الخصم
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.sub_total}
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                نسبة الضريبة
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.tax_price}
                              </td>
                              <td
                                style={{
                                  direction: "ltr",
                                  textAlign: "center",
                                }}
                              >
                                {item.total_after_tax}
                              </td>
                            </tr>
                          );
                        })}
                        {/* <tr>
                          <td>&nbsp;</td>
                        </tr> */}
                        <tr style={{ whiteSpace: "pre-wrap" }}>
                          {/* <tr > */}
                          <td colSpan={10} className="total_eng normal">
                            Total without Tax - الاجمالي بدون الضريبة
                          </td>

                          <td
                            //   colSpan="1"
                            className="normal"
                            //   style={{ direction: "ltr" }}
                          >
                            {modalValue["sub_total"]} SAR
                          </td>
                          {/* </tr> */}
                        </tr>
                        <tr>
                          <td colSpan={10} className="total_eng normal">
                            Total Discount - الخصومات
                          </td>
                          <td className="normal">0 SAR</td>
                        </tr>
                        <tr style={{ whiteSpace: "pre-wrap" }}>
                          <td colSpan={10} className="total_eng normal">
                            Total Taxable Amount - الاجمالي الخاضع للضريبة بعد
                            الخصم
                          </td>
                          <td className="normal">0 SAR</td>
                        </tr>

                        <tr>
                          <td colSpan={10} className="total_eng normal">
                            Total VAT - مجموع ضريبة القيمة المضافة
                          </td>
                          <td className="normal">{modalValue["tax"]} SAR</td>
                        </tr>

                        <tr>
                          <td colSpan={10}>
                            Total Amount Due with VAT - الإجمالي شامل ضريبة
                            القيمة المضافة
                          </td>

                          <td className="normal">{modalValue["total"]} SAR</td>
                        </tr>

                        {/* <tr>
                          <td className="total_written" colSpan="11">
                            kokko
                          </td>
                        </tr> */}
                        <tr style={{ whiteSpace: "pre-wrap" }}>
                          <td colSpan={11} style={{ direction: "ltr" }}>
                            {" "}
                            {toArabicWord(modalValue["total"])}{" "}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <div
                      style={{
                        position: "absolute",
                        left: "5%",
                        // padding: "0 20px",
                      }}
                    >
                      <img
                        style={{
                          textAlign: "center",
                          width: "250px",
                          height: "250px",
                          display: "inline-block",
                        }}
                        src={qr}
                        className="center-block"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div className="col-md-12">
                        <h5
                          style={{
                            textAlign: "right",
                            color: "black",
                            // marginRight: "20px",
                          }}
                        >
                          معلومات الدفع{" "}
                        </h5>
                        <br />
                      </div>
                      <div
                        className="col-md-12"
                        style={{
                          width: "80%",
                          float: "right",
                          // marginRight: "20px",
                        }}
                      >
                        <table
                          className="noice_table"
                          style={{
                            width: "100%",
                            float: "right",
                            // marginRight: "20px",
                          }}
                        >
                          <tr>
                            <td style={{ width: "150px" }}>اسم البنك</td>
                            <td style={{ width: "250px" }}>kmkmkm</td>
                            <td style={{ width: "150px" }}>Bank Name</td>
                          </tr>
                          <tr>
                            <td>رقم الحساب </td>
                            <td>kmkkj</td>
                            <td>Bank Account Number</td>
                          </tr>
                          <tr>
                            <td>رقم البنك الدولي</td>
                            <td>lkklk</td>
                            <td>IBAN</td>
                          </tr>

                          <tr>
                            <td>اسم الحساب البنكي</td>
                            <td>kmkm</td>
                            <td>Bank Account Name</td>
                          </tr>
                        </table>
                      </div>
                      <div className="col-md-12">
                        <br />
                        <br />
                        <h5
                          style={{
                            textAlign: "right",
                            color: "black",
                            // marginRight: "20px",
                          }}
                        >
                          الشروط واحكام
                        </h5>
                        {/* <p> kjkj </p> */}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      {/* <tfoot style={{ height: "100px" }}>
        <tr style={{ height: "100px", border: "0px" }}>
          <td style={{ border: "0px" }}>
            <div className="invoice-box">
              <div
                className="footer"
                style={{ position: "fixed", bottom: "0px" }}
              >
                <div className="footer">
                  <footer>
                    <div>
                      <img
                        style={{
                          maxHeight: "400px",
                          width: "100px",
                          height: "100px",
                        }}
                        src={logo}
                        className="img img-responsive"
                      />
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tfoot> */}
    </table>
  );
});

export default PDFView;
