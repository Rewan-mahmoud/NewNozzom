import "../../styles/Reporback.css";
import logo from "../../../public/log.png";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/Date";
import { useParams } from "react-router-dom";

const TaxReportBack = () => {
  const { data } = useSelector((state) => state["taxReport"]);
  const {type} = useParams()
  // console.log(type)
  const types = {
    'sales': 'المبيعات',
    'purchases': 'المشتريات',
    'salesReturns': 'مرتجع المبيعات',
    'purchasesReturns': 'مرتجع المشتريات',
    'total_purchases': 'صافي المشتريات',
    'total_sales': 'صافي المبيعات'
  }
  const ref = useRef();
  const handlePrint = () => {
    window.print(ref.current);
  };
  // console.log(data)
  if(Object.keys(data).length > 0) {
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
          <h3>تقرير ضريبة مرتجعات القيمة المضافة علي {types[type]}</h3>
        </div>
        <div className="company-logo">
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="report-body">
        <p className="date">
          الى الفترة: <span>{data.to_date}</span>
        </p>
        <p className="date">
          من الفترة: <span>{data.from_date}</span>
        </p>
        <table>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>تاريخ الفاتورة</th>
              <th>نوع السند</th>
              <th>اسم العميل</th>
              <th>الرقم الضريبي</th>
              <th>المجموع الفرعي</th>
              <th>قيمة الضريبة</th>
              <th>المجموع الكلي</th>
            </tr>
          </thead>
          <tbody>
            {data.receipts.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.invoice_number}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{item.type}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.tax_card}</td>
                  <td>{item.sub_total}</td>
                  <td>{item.tax}</td>
                  <td>{item.total}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>الاجمالي</td>
              <td colSpan={4}></td>
              <td>{data.all_sub_total}</td>
              <td>{data.all_tax}</td>
              <td>{data.all_total}</td>
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
  );}
};

export default TaxReportBack;
