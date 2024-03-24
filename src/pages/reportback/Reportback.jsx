import "../../styles/Reporback.css";
import logo from "../../../public/log.png";
import { useRef } from "react";
import { useSelector } from "react-redux";
 
const Reportback = () => {
  const { data } = useSelector((state) => state["stSu"]);
    const ref = useRef() 
    const handlePrint = () => {
        window.print(ref.current)
    }
    // console.log(data)
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
          <h3>تقرير ملخص المخزون</h3>
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
          الى الفترة: <span>{data.toDate}</span>
        </p>
        <table>
          <thead>
            <tr>
              <th>اسم المنتج</th>
              <th>اجمالي الكميات</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((item) => {
              return (
                <tr key={data[item].product_name}>
                  <td>{data[item].product_name}</td>
                  <td>{data[item].quantity}</td>
                </tr>
              );
            })}
          </tbody>
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

export default Reportback