import "../../styles/Reporback.css";
import logo from "../../../public/log.png";
import { useRef } from "react";
import { useSelector } from "react-redux";

const CustomersVendorsRep = () => {
  const { data } = useSelector((state) => state["custAndVend"]);
  const ref = useRef();
  console.log(data)

  const handlePrint = () => {
    window.print(ref.current);
  };
  if (Object.keys(data).length > 0) {
    return (
      <div className="report-container" ref={ref}>
        <div className="head">
          <div className="company-info">
            <p>
              اسم الشركة: <span>{data.company.name}</span>
            </p>
            <p>
              عنوان الشركة: <span>{data.company.address}</span>
            </p>
            <p>
              هاتف الشركة: <span>{data.company.phone}</span>
            </p>
            <p>
              الرقم الضريبي: <span>{data.company.tax_number}</span>
            </p>
          </div>
          <div className="head-center">
            <h3>كشف حساب العملاء والموردين</h3>
          </div>
          <div className="company-logo">
            <img
              src={
                data.company.logo
                  ? `https://einvoice.nozzm.com/public/public/images/${data.company.logo}`
                  : logo
              }
              alt=""
            />
          </div>
        </div>
        <div className="report-body">
          <p className="date">
            الى الفترة: <span>{data.from_date}</span>
          </p>
          <p className="date">
            من الفترة: <span>{data.to_date}</span>
          </p>
          {/* <table>
            <thead>
              <tr>
                <th>اخر سعر بيع</th>
                <th>اخر سعر شراء</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.lastpricesall}</td>
                <td>{data.lastpricespurchers}</td>
              </tr>
            </tbody>
          </table> */}
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>تاريخ الفاتورة</th>
                <th>طريقة الدفع</th>
                <th>المجموع الفرعي</th>
                <th>قيمة الضريبة</th>
                <th>المجموع الكلي</th>
              </tr>
            </thead>
            <tbody>
              {data.receipts.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.invoice_number ? item.invoice_number : ""}</td>
                    <td>{item.invoiceIssueDate}</td>
                    <td>{item.paymentType}</td>
                    <td>{item.sub_total}</td>
                    <td>{item.tax}</td>
                    <td>{item.total}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>الاجمالي</td>
                <td>{data.total_quantity}</td>
              </tr>
            </tfoot>
          </table>

          <button
            onClick={handlePrint}
            className="btn"
            //   style={{ margin: "0 auto", position: 'fixed', bottom: 0 }}
          >
            طباعة
          </button>
        </div>
      </div>
    );
  }
};

export default CustomersVendorsRep;
