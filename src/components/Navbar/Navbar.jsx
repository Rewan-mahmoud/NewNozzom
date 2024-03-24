import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { BiSolidBadgeDollar, BiSolidLogOut } from "react-icons/bi";
import { CgScreen } from "react-icons/cg";
// import {LiaSearchSolid} from 'react-icons/lia'
import cart from "../../assets/cart.jpg";
import "../../styles/Navbar.css";
import Search from "../Search/Search";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/auth";
// import { BsTranslate } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  addDiscount,
  decreaseData,
  deleteData,
  increaseData,
} from "../../features/table/cartSlice";

const Navbar = () => {
  const { t, i18n: lang } = useTranslation();
  // const cartData = useSelector((state) => state.cart);
  // const [value, setValue] = useState({});
  const menuRef = useRef();
  const [menu, setMenu] = useState(false);
  const cartData = useSelector((state) => state.cart);
  const { role, permissions, data } = useSelector((state) => state.auth);
  const { total, totalA, value } = cartData;
  const [showCart, setShowCart] = useState(false);
  // const [value, setValue] = useState({});

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenu(false);
      //  console.log('first')
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleLanguage = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("ar");
    } else {
      i18n.changeLanguage("en");
    }
  };

  //cart
  const [addDisc, setAddDisc] = useState(false);

  const handleDis = (e, item) => {
    dispatch(addDiscount({ item, e: e.target.value }));
  };
  const handleAdd = (item) => {
    dispatch(increaseData(item));
  };

  const handleDeacrease = (item) => {
    if (value[item.id] > 1) {
      dispatch(decreaseData(item));
    }
  };
  const handleDelete = (item) => {
    dispatch(deleteData(item));
  };

  const handleAddDisc = (item) => {
    if (addDisc === item.id) {
      return setAddDisc(false);
    }
    setAddDisc(item.id);
  };

  const handleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="navbar" style={{ direction: t("direction") }}>
      <div className="navright">
        <Link to="/">نُظم</Link>
      </div>

      <div className="center">
        <Search placeholder={t("search")} />
      </div>
      <div className="navleft">
        {role !== "admin" && (
          <div onClick={() => handleLanguage()}>
            <p
              style={{
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {lang.language === "en" ? "ar" : "en"}
            </p>
          </div>
        )}
        <div
          className="setting"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <p
            ref={menuRef}
            style={{
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setMenu(!menu)}
          >
            <FiSettings />
          </p>
          {menu && (
            <div
              className="nav-drop"
              style={{ left: i18n.language === "ar" ? "0" : "-140px" }}
            >
              {role !== "admin" ? (
                <>
                  <Link rel="stylesheet" href="" to="/setting">
                    {t("setting")}
                  </Link>
                  <Link rel="stylesheet" href="" to="/invoice-setting">
                    اعدادات ترقيم الفاتورة
                  </Link>
                  <Link rel="stylesheet" href="" to="/change-pass">
                    {t("passSett")}
                  </Link>

                  {/* <p onClick={() => handleLanguage()}>
                <span>{t("lang")}</span>
                <span>{i18n.language === "en" ? "ar" : "en"}</span>
              </p> */}
                  {role === "company" && permissions.includes("pos") ? (
                    data && data["zatacV2"] !== 1 ? (
                      <Link to={"/phase-two"}>{t("actPhase2")}</Link>
                    ) : null
                  ) : null}
                  <Link to={"/subscription"}>{t("subscription")}</Link>
                </>
              ) : null}
              <p className="logout" onClick={handleLogout}>
                {t("logout")} <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
              </p>
            </div>
          )}
        </div>
        {role === "company" && permissions.includes("pos") && (
          <div>
            <Link
              style={{
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              to="/sellpoints"
            >
              {/* <BiSolidBadgeDollar /> */}
              {/* <img src={icon} width={18} height={18} style={{fill: 'white'}}/> */}
              <CgScreen />
            </Link>
          </div>
        )}
        {role !== "admin" && (
          <div style={{ position: "relative" }} className="shp-cart">
            <p
              onClick={handleCart}
              style={{
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AiOutlineShoppingCart />
            </p>
            {showCart && (
              <div
                className="center-left"
                style={{
                  position: "absolute",
                  left: 0,
                  color: "black",
                  width: "315px",
                  top: "25px",
                  maxHeight: "595px",
                  boxShadow: "1px 1px 1px 1px black",
                }}
              >
                {cartData.data.length > 0 ? (
                  cartData.data.map((item) => {
                    return (
                      <div key={item.id} className="center-left-cart">
                        <div className="element">
                          <img
                            src={item.files ? item.files : cart}
                            alt=""
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                        <div
                          className="element"
                          style={{ alignItems: "flex-start" }}
                        >
                          <p>{item.name}</p>
                          <p>
                            {item.piece_price ? `${item.piece_price} SAR` : "-"}
                          </p>
                          <p
                            style={{ color: "blueviolet", cursor: "pointer" }}
                            onClick={() => handleAddDisc(item)}
                          >
                            اضافة خصم
                          </p>
                        </div>
                        <div className="element" style={{ gap: "5px" }}>
                          <div
                            className="valuee"
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              className="minus"
                              onClick={() => handleDeacrease(item)}
                            >
                              -
                            </span>
                            <span>
                              {value[item.product] ? value[item.product] : 1}
                            </span>
                            <span
                              className="plus"
                              onClick={() => handleAdd(item)}
                            >
                              +
                            </span>
                          </div>
                          {addDisc === item.id && (
                            <input
                              type="text"
                              onChange={(e) => handleDis(e, item)}
                              value={item.discount ? item.discount : ""}
                              style={{
                                borderRadius: "15px",
                                padding: "5px 10px",
                                width: "100%",
                              }}
                            />
                          )}
                          <p
                            style={{
                              color: "red",
                              cursor: "pointer",
                              width: "100%",
                              justifyContent: "space-between",
                              display: "flex",
                            }}
                            onClick={() => handleDelete(item)}
                          >
                            {t("delete")} <span>X</span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>{t("noRes")}</p>
                )}
                {cartData.data.length > 0 && (
                  <div className="center-details">
                    <div className="center-detail">
                      <p>الاجمالي قبل الضريبة</p>
                      <p>{cartData.data.length ? `${total} SAR` : "-"}</p>
                    </div>
                    <div className="center-detail">
                      <p>ضريبة القيمة المضافة</p>
                      <p>
                        {cartData.data.length
                          ? `${(totalA - total).toFixed(2)} SAR`
                          : "-"}
                      </p>
                    </div>
                    <div className="center-detail">
                      <p>الاجمالي بعد الضريبة</p>
                      <p>{cartData.data.length ? `${totalA} SAR` : "-"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
