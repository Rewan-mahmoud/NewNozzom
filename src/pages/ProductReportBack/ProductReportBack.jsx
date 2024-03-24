import "../../styles/Reporback.css";
import logo from "../../../public/log.png";
import { useRef } from "react";
import { useSelector } from "react-redux";

const ProductReportBack = () => {
  const {data} = useSelector((state) => state["productReport"]);
  const ref = useRef();
  // console.log(data)
  
 

  const handlePrint = () => {
    window.print(ref.current);
  };
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
            <h3>تقرير المخزون {data.stockitemmovement[0].product.ar_name}</h3>
          </div>
          <div className="company-logo">
            <img src={
                data.company.logo
                  ? `https://einvoice.nozzm.com/public/public/images/${data.company.logo}`
                  : logo
              } alt="" />
          </div>
        </div>
        <div className="report-body">
          <p className="date">
            الى الفترة: <span>{data.from_date}</span>
          </p>
          <p className="date">
            من الفترة: <span>{data.to_date}</span>
          </p>
          <table>
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
          </table>
          <table>
            <thead>
              <tr>
                <th>رقم التسلسل</th>
                <th>نوع العملية</th>
                <th>الكمية</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {data.stockitemmovement.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.num_rec ? item.num_rec : ""}</td>
                    <td>{item.type}</td>
                    <td>{item.quantity}</td>
                    <td>{item.date}</td>
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

export default ProductReportBack;
