import { useRef } from 'react';
import '../../styles/Reciept.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { apiUrl } from '../../features/table/billSlice';
import QRCode from "qrcode";
import { Invoice } from "@axenda/zatca";
import { QRCodeSVG } from "qrcode.react";

const Recipt = () => {
    const ref = useRef();
  const handlePrint = () => {
    window.print(ref.current);
  };
  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  const { id } = useParams();
  const [modalValue, setModalValue] = useState(null);
  const [company, setCompany]= useState(null)
  const fetchPrev = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${apiUrl}show_company`, {}, { headers })
      .then((res) => setCompany({ ...res.data.data}));
    axios
      .post(`${apiUrl}show_sale_invoice`, { id }, { headers })
      .then((res) => {
        setLoading(false);
        setModalValue(res.data.data[0]);
        console.log(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  };

  // const handleInvoice = async (data) => {
  //   try {
  //     const invoice = new Invoice({
  //       sellerName: data.company.name,
  //       vatRegistrationNumber: data.company.tax_number,
  //       invoiceTimestamp: new Date(data.created_at).toISOString(),
  //       invoiceTotal: String(data.total),
  //       invoiceVatTotal: String(data.tax),
  //     });

  //     const imageData = await invoice.toBase64();
  //     QRCode.toDataURL(imageData)
  //       .then((url) => {
  //         // console.log(url);
  //         setQr(url);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //     // return {val}
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // console.log(modalValue)
  const [qr, setQr] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPrev();
  }, [id]);

  return (
    <>
      <div id="invoice-POS" ref={ref}>
        <center id="top">
          <div className="logo">
            <img
              style={{ width: "100%", height: "100%" }}
              src={`https://einvoice.nozzm.com/public/public/images/${company?.header}`}
              alt={company?.company_name}
            />
          </div>
          <div className="info">
            <p>ايصال الكتروني</p>
            <p>{modalValue?.invoice_number}</p>
            <p>{modalValue?.created_at}</p>
            <h2>{company?.company_name}</h2>
          </div>
        </center>

        <div id="mid">
          <div className="info">
            <h2>معلومات العميل</h2>
            <p>
              اسم العميل: {modalValue?.customers.name}
              <br />
              العنوان: {modalValue?.customers.address}
              <br />
              الرقم الضريبي:{" "}
              {modalValue?.customers.tax_number
                ? modalValue.customers.tax_number
                : "-"}{" "}
              <br />
              الهاتف:{" "}
              {modalValue?.customers.phone
                ? modalValue.customers.phone
                : "-"}{" "}
              <br />
              <br />
            </p>
          </div>
        </div>

        <div id="bot">
          <div id="table">
            <table>
              <tr className="tabletitle">
                <td className="item">
                  <h2>المنتج</h2>
                </td>
                <td className="Hours">
                  <h2>الكمية</h2>
                </td>
                <td className="Rate">
                  <h2>الاجمالي</h2>
                </td>
              </tr>

              {modalValue?.items.map((item) => (
                <tr className="service" key={item.id}>
                  <td className="tableitem">
                    <p className="itemtext">{item.products.ar_name}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext">{item.quantity}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext">{item.sub_total}</p>
                  </td>
                </tr>
              ))}
              {/* <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">Communication</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">5</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">$375.00</p>
                </td>
              </tr>

              <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">Asset Gathering</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">3</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">$225.00</p>
                </td>
              </tr>

              <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">Design Development</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">5</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">$375.00</p>
                </td>
              </tr>

              <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">Animation</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">20</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">$1500.00</p>
                </td>
              </tr>

              <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">Animation Revisions</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">10</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">$750.00</p>
                </td>
              </tr> */}

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h2>الاجمالي غير شامل ضريبة</h2>
                </td>
                <td className="payment">
                  <h2>{modalValue?.sub_total}</h2>
                </td>
              </tr>
              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h2>ضريبة</h2>
                </td>
                <td className="payment">
                  <h2>{modalValue?.tax}</h2>
                </td>
              </tr>

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h2>الاجمالي شامل الضريبة</h2>
                </td>
                <td className="payment">
                  <h2>{modalValue?.total}</h2>
                </td>
              </tr>
            </table>
          </div>

          <div id="legalcopy">
            <p className="legal">
              <strong>Payment by qr code and link</strong>
            </p>
            <a
              href={`https://einvoices-git-frontend-ahmedsameh74.vercel.app/checkout/${id}`}
              style={{ textDecoration: "none" }}
            >
              pay with credit card
            </a>
          </div>
          <div
            id="legalcopy"
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <QRCodeSVG
              value={`https://einvoices-git-frontend-ahmedsameh74.vercel.app/checkout/${id}`}
              style={{
                width: "100px",
                height: "100px",
                padding: "5px",
                border: "8px solid rgb(31 48 169)",
              }}
            />
            <p
              style={{
                width: "100px",
                color: "white",
                background: "rgb(31 48 169)",
                textAlign: "center",
                padding: "5px 0",
              }}
            >
              scan to pay
            </p>
            {/* <img src={qr} style={{ width: "100px", height: "100px" }} /> */}
            {/* <p className="legal">
              <strong>شكرا لثقتك بنا!</strong>
            </p> */}
          </div>
          <div id="legalcopy">
            <p className="legal">
              <strong>شكرا لثقتك بنا!</strong>
            </p>
          </div>
        </div>
      </div>
      <button
        className="btn"
        onClick={handlePrint}
        style={{ height: "30px", display: "block", margin: "5px auto" }}
      >
        طباعة
      </button>
    </>
  );
}

export default Recipt