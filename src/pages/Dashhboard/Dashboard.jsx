import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ArcElement,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import "../../styles/Dashboard.css";
import { TbReceiptTax } from "react-icons/tb";
import { HiReceiptTax } from "react-icons/hi";
import { MdPointOfSale } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import Card from "../../components/Card/Card";
import useToken from "../../hooks/useToken";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
// import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { apiUrl } from "../../features/table/billSlice";
import { Navigate } from "react-router-dom";
// home

// const apiUrl = import.meta.env.VITE_APP_API;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);

const options = {
  responsive: true,
  // maintainAspectRatio: false,
  // aspectRatio: 2,
  layout: {
    height: 100
  },
  scales: {
    y: {
      min: 0,
      max: 2000000,
      ticks: {
        stepSize: 1000000,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: true, // Enable tooltips
      callbacks: {
        label: function (tooltipItem) {
          // Return the label for the tooltip (e.g., data value)
          return tooltipItem.formattedValue;
        },
      },
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July", 'August', 'September', 'October', 'November', 'December'];





const Dashboard = () => {
  const [inner, setInner]= useState([])
  const data = {
    labels,
    datasets: [
      {
        // fill: true,
        label: "الرسم البياني للفواتير 2023",
        // data: [0, 0, 1500, 500, 400, 350, 250],
        data: inner,
        backgroundColor: [
          "hsl(283, 27%, 52%)",
          "#c5c3e3",
          "#673147",
          "#130e1f",
          "#c3a0cb",
          "#d5cbd8",
          "#66153a",
        ],
        borderColor: "#66153a",
      },
    ],
  };
  const { i18n } = useTranslation();
  const cards = [
    {
      name: "sales_total",
      // title: t("netSales"),
      title: "netSales",
      details: "1,545,00",
      icon: () => <BiPurchaseTag />,
      id: 4,
    },
    {
      name: "sales_tax",
      // title: t("taxSales"),
      title: "taxSales",
      details: "1,545,00",
      icon: () => <HiReceiptTax />,
      id: 3,
    },
    {
      name: "purchases_total",
      title: "netPurchase",
      // title: t("netPurchase"),
      details: "1,545,00",
      icon: () => <MdPointOfSale />,
      id: 2,
    },
    {
      name: "purchase_tax",
      title: "taxPurchase",
      // title: t("taxPurchase"),
      details: "1,545,00",
      icon: () => <TbReceiptTax />,
      id: 1,
    },
  ];
  const { token, role, permissions } = useToken();
  const [dataCard, setDataCard] = useState(cards);
  const [loading, setLoading] = useState(false);
  const [zatcaData, setZatcaData] = useState({})

  const getDetails = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(`${apiUrl}home`, {}, { headers }).then((res) => {
      // console.log(res)
      return res
    });
  };
  const getDetailss = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}sent_to_zatca_status_report`, {}, { headers })
      .then((res) => {
        // console.log(res)
        return res;
      });
  };

  useEffect(() => {
    setLoading(true);
    getDetails().then((res) => {
      const newData = [...dataCard];
      let innerData = [];
      res.data.data.chart.map((ele) => innerData.push(ele.value));
      // console.log(res.data.data.chart)
      newData.map((it) => {
        it.details = `${res.data.data[it.name]}`;
      });
      setInner(innerData)
      setDataCard(newData);
      setLoading(false);
    });
    getDetailss().then(res => {
      console.log(res.data.data)
      setZatcaData(res.data.data)
    })
  }, []);

  // console.log(zatcaData)

  // console.log(inner)


  if (loading) {
    return <LoadSpinner />;
  }

  if (role === "employee" && !permissions.includes("view_home")) {
    return <Navigate to="/categorys" />;
  }
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
            <div className="home-center">
              <div className="warn">
                <p>عدد الفواتير التحذيرية {zatcaData?.WARNING ? zatcaData.WARNING : "-"}</p>
              </div>
              <div className="error">
                <p>عدد الفواتير الخاطئة {zatcaData.ERROR ? zatcaData.ERROR : "-"}</p>
              </div>
              <div className="succcess">
                <p>عدد الفواتير الصحيحة {zatcaData?.PASS ? zatcaData.PASS : "-"}</p>
              </div>
            </div>
            <div className="left">
              <h2>{t("companyReport")}</h2>
              <Line
                options={options}
                data={data}
                style={{
                  maxHeight: "300px",
                  height: "300px",
                  backgroundColor: "#fff",
                }}
              />
              <Pie
                data={data}
                style={{
                  maxHeight: "500px",
                  height: "500px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </>
        );
};

export default Dashboard;
