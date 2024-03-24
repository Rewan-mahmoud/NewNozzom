import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Navbar from "../components/Navbar/Navbar";
import { AiOutlineHome } from "react-icons/ai";
import {
  BsFillPersonFill,
} from "react-icons/bs";
import {
  BiLayer
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GrSettingsOption } from "react-icons/gr";

const MainLayout = () => {
  const param = useLocation().pathname;
  const { ready, role, data } = useSelector((state) => state.auth);
  const isLoggedIn = ready;
  const path = useMemo(() => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
  }, [isLoggedIn]);
  const { t } = useTranslation();
  const { id } = useParams();
  console.log(data)

  const title = {
    "/main/admin": {
      name: t("dashboard"),
      icon: () => <AiOutlineHome />,
    },
    "/main/active-companies": {
      name: "عرض الشركات",
      icon: () => <BsFillPersonFill />,
    },
    "/main/not-active-companies": {
      name: "عرض الشركات الغير مفعلة",
      icon: () => <GrSettingsOption />,
    },
    "/main/add-company": {
      name: "انشاء شركة",
      icon: () => <BiLayer />,
    },
    [`/main/add-company/${id}`]: {
      name: "تعديل شركة",
      icon: () => <BiLayer />,
    },
    [`/main/sub/${id}`]: {
      name: "تجديد اشتراك",
      icon: () => <BiLayer />,
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout" style={{ direction: t("direction") }}>
        {param !== "/sellpoints" && <Navigation />}
        <div
          className={param !== "/sellpoints" ? "container" : "sale-container"}
        >
          {/* {param !== "/" ? ( */}
          {param !== "/subscription" && param !== "/sellpoints" && (
            <div className="title">
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  flexDirection: "row-reverse",
                }}
              >
                {title[param].name} {title[param].icon()}
              </h2>
            </div>
          )}
          {/* ) : (
            <div className="subscription">
              <div className="desc-sub">
                <p
                  style={{
                    left: i18n.language === "ar" ? "unset" : "0",
                    right: i18n.language === "en" ? "unset" : "0",
                  }}
                >
                  15
                </p>
                <p>
                  <span>تاريخ الاشتراك</span>
                  <span>20-10-2023</span>
                </p>
                <p>
                  <span>معاد التجديد</span>
                  <span>20-10-2024</span>
                </p>
              </div>
              <div className="title">
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    flexDirection: "row-reverse",
                  }}
                >
                  {title[param].name} {title[param].icon()}
                </h2>
              </div>
            </div>
          )} */}
          {path}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
