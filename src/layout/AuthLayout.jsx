import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import logo from "../../public/log.png";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { ready } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  // console.log(data)
  const isLoggedIn = ready;
  const path = useMemo(() => {
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
  }, [isLoggedIn]);
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex">
        <div class="info rightSide">
          <div
            className="right"
            style={{
              fontSize: "19px",
              justifyContent:
                i18n.language === "en" ? "flex-start" : "flex-end",
              fontWeight: "bold",
            }}
          >
            <Link
              to={"https://einvoice.nozzm.com"}
              style={{ color: "white", textDecoration: "none" }}
            >
              {t("backHome")}
            </Link>
          </div>
          <img src={logo} alt="" style={{ width: "70px"  , marginRight:"15px"}} />
          <h1 class="animate-charcter">Welcome To Nozom</h1>
        </div>

       
        <div className="auth-layout">{path}</div>
      </div>
    </>
  );
};

export default AuthLayout;
