import axios from "axios";
import logo from "../../../public/log.png";
import { apiUrl } from "../../features/table/billSlice";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useToken from "../../hooks/useToken";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";

const ReceiptRep = () => {
  const { token } = useToken();
  const { id } = useParams();
  const [modalValue, setModalValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const handlePrint = () => {
    window.print(ref.current);
  };

  const fetchPrev = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}show_receipt/${id}`, { id }, { headers })
      .then((res) => {
        console.log(res.data.message);
        setLoading(false);
        setModalValue(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoading(true);
    fetchPrev();
  }, [id]);


  if (loading) return <LoadSpinner />;
  if(!loading && modalValue) {
    return (
      <div className="report-container" ref={ref}>
        <div className="head">
          <div className="company-info">
            <p>
              اسم الشركة: <span>{modalValue.company.name}</span>
            </p>
            <p>
              عنوان الشركة: <span>{modalValue.company.address}</span>
            </p>
            <p>
              هاتف الشركة: <span>{modalValue.company.phone}</span>
            </p>
            <p>
              الرقم الضريبي: <span>{modalValue.company.tax_number}</span>
            </p>
          </div>
          <div className="head-center">
            <h3>سند قبض</h3>
          </div>
          <div className="company-logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="body">
          <div className="body-row">
            <p>
              سند رقم: <span>{modalValue.serial}</span>
            </p>
            <p>
              التاريخ: <span>{modalValue.date}</span>
            </p>
          </div>
          <div className="body-row">
            <p>استلمنا من السيد/السادة:</p>
            <p>{modalValue.customers.name}</p>
            <p>Received from Mr/Messrs</p>
          </div>
          <div className="body-row">
            <p>مبلغ وقدره</p>
            <p>{modalValue.money}</p>
            <p>The sum of</p>
          </div>
          <div className="body-row">
            <p>نوع العملية:</p>
            <p>{modalValue.paying_type}</p>
            <p>Operation type</p>
          </div>
          <div className="body-row">
            <p>وذلك عن: </p>
            <p>{modalValue.for}</p>
            <p>For</p>
          </div>
          <div className="body-row">
            <div>
              <p>المستلم/Received by</p>
              <p>{modalValue.customers.name}</p>
            </div>
            <div>
              <p>توقيع المدير/manager sign</p>
              <p></p>
            </div>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="btn"
          style={{ margin: "0 auto" }}
        >
          طباعة
        </button>
      </div>
    );
  }
};

export default ReceiptRep;
