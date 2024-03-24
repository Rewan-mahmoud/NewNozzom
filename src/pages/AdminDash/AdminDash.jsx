// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   ArcElement,
//   Legend,
// } from "chart.js";
// import { Line, Pie } from "react-chartjs-2";
import "../../styles/Dashboard.css";
import { TbReceiptTax } from "react-icons/tb";
import { HiReceiptTax } from "react-icons/hi";
import { MdPointOfSale } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import Card from "../../components/Card/Card";
import useToken from "../../hooks/useToken";
// import axios from "axios";
import { useEffect, useState } from "react";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
// import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
// import { t } from "i18next";
// import { apiUrl } from "../../features/table/billSlice";
// home

// const apiUrl = import.meta.env.VITE_APP_API;


//charts
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
//   ArcElement
// );

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   aspectRatio: 2,
//   scales: {
//     y: {
//       min: 10000,
//       max: 40000,
//       ticks: {
//         stepSize: 10000,
//       },
//     },
//   },
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: false,
//     },
//   },
// };

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// const data = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: "الرسم البياني للفواتير 2023",
//       data: [10000, 15000, 20000, 15000, 30000, 30000, 40000],
//       backgroundColor: [
//         "hsl(283, 27%, 52%)",
//         "#c5c3e3",
//         "#673147",
//         "#130e1f",
//         "#c3a0cb",
//         "#d5cbd8",
//         "#66153a",
//       ],
//       borderColor: "#fff",
//     },
//   ],
// };



const AdminDash = () => {
  const { i18n } = useTranslation();
  const cards = [
    {
      name: "users",
      // title: t("netSales"),
      title: "جميع المستخدمين",
      //   title: "netSales",
      details: "1,545,00",
      icon: () => <BiPurchaseTag />,
      id: 4,
    },
    {
      name: "usersEmployee",
      // title: t("taxSales"),
      title: "الموظفين",
      //   title: "taxSales",
      details: "1,545,00",
      icon: () => <HiReceiptTax />,
      id: 3,
    },
    {
      name: "usersCompany",
      //   title: "netPurchase",
      title: "الشركات",
      // title: t("netPurchase"),
      details: "1,545,00",
      icon: () => <MdPointOfSale />,
      id: 2,
    },
    {
      name: "userscompanyNotActive",
      //   title: "taxPurchase",
      title: "الشركات الغير مفعلة",
      // title: t("taxPurchase"),
      details: "1,545,00",
      icon: () => <TbReceiptTax />,
      id: 1,
    },
  ];
  const {token} = useToken()
  const [dataCard, setDataCard] = useState(cards)
  const [loading, setLoading] = useState(false)
  // const { language } = useSelector((state) => state.ln);
  
  const getDetails = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}admin_index`, {}, { headers })
      .then((res) => res);
  };

  useEffect(() => {
    setLoading(true)
    getDetails().then(res => {
      const newData = [...dataCard]
      newData.map(it => {
        it.details = `${res.data.data[it.name]}`;
      })
      setDataCard(newData)
      setLoading(false)
    })

  }, [])

  

  if(loading) {
    return (
      <LoadSpinner/>
    )
  }
  if(!loading) {
    return (
      <>
        <div
          className="right"
          style={{ direction: i18n.language === "en" ? "rtl" : "ltr" }}
        >
          {dataCard.reverse().map((ele) => {
            return (
              <Card
                key={ele.id}
                title={ele.title}
                details={ele.details}
                icon={ele.icon()}
              />
            );
          })}
        </div>
        {/* <div className="left">
          <h2>{t("companyReport")}</h2>
          <Line options={options} data={data} />
          <Pie data={data} />
        </div> */}
      </>
    );
  }
};

export default AdminDash;
