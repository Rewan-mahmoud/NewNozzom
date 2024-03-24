import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { apiUrl } from './../../features/table/billSlice';
import useToken from "../../hooks/useToken";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";


const Subscription = () => {
  const [yearsLeft, setYearsLeft] = useState(0);
  const [monthsLeft, setMonthsLeft] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [hrsLeft, setHrsLeft] = useState(0);
  const [minsLeft, setMinsLeft] = useState(0);
  const { token } = useToken();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); 
  const [loading, setLoading] = useState(false)
  const {t, i18n} = useTranslation()

    useEffect(() => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      setLoading(true)
      axios.post(`${apiUrl}subscriptions`, {}, { headers }).then((res) => {
        // console.log(res.data.data[0].end_date);
        setStartDate(res.data.data[0].strat_date); 
        setEndDate(res.data.data[0].end_date);
        setLoading(false)
      });
    }, []);

    useEffect(() => {
      const calculateTimeLeft = () => {
        const today = new Date();
        const bigDay = new Date(endDate);
        const msPerDay = 24 * 60 * 60 * 1000;
        const timeLeft = bigDay.getTime() - today.getTime();
        const totalDays = Math.floor(timeLeft / msPerDay);
        const years = Math.max(Math.floor(totalDays / 365), 0);
        const months = Math.max(Math.floor((totalDays % 365) / 30), 0);
        const days = Math.max(totalDays % 30, 0);
        const hours = Math.max(Math.floor(((timeLeft / msPerDay) % 1) * 24), 0);
        const minutes = Math.max(
          Math.floor((((timeLeft / msPerDay) % 1) * 24 - hours) * 60),
          0
        );

        setYearsLeft(years);
        setMonthsLeft(months);
        setDaysLeft(days);
        setHrsLeft(hours);
        setMinsLeft(minutes);
      };

      calculateTimeLeft();

      const timer = setInterval(calculateTimeLeft, 1000);

      return () => {
        clearInterval(timer); 
      };
    }, [endDate]);
  if(loading) return <LoadSpinner/>
  else {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "50px",
          padding: "80px 0",
        }}
      >
        <div className="sub-top">
          <h2 style={{ textAlign: "center", width: "100%" }}>
            متبقي على معاد التجديد القادم
          </h2>
          <div className="cal" style={{flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row'}}>
            <div>
              <span>{yearsLeft}</span>
              <span style={{ fontSize: "20px" }}>{t("year")}</span>
            </div>
            <div>
              <span>{monthsLeft}</span>
              <span style={{ fontSize: "20px" }}>{t('month')}</span>
            </div>
            <div>
              <span>{daysLeft}</span>
              <span style={{ fontSize: "20px" }}>{t('day')}</span>
            </div>
            <div>
              <span>{hrsLeft}</span>
              <span style={{ fontSize: "20px" }}>{t('hour')}</span>
            </div>
            <div>
              <span>{minsLeft}</span>
              <span style={{ fontSize: "20px" }}>{t('minute')}</span>
            </div>
          </div>
        </div>

        <div className="sub">
          <table>
            <thead>
              <tr>
                <th>{t('startDate')}</th>
                <th>{t('endDate')}</th>
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{endDate}</td>
                <td>{startDate}</td>
                <td
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <button className="btn" style={{ alignSelf: "center" }}>
                    {t('renew')}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Subscription