/* eslint-disable no-prototype-builtins */
import { AiOutlineHome } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { FaCodeBranch } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { FiSettings } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { BsRecordCircleFill } from "react-icons/bs";
import { GrDocumentPerformance } from "react-icons/gr";
// eslint-disable-next-line no-unused-vars
import { FaCalculator, FaCashRegister } from "react-icons/fa";
import "../../styles/Navigation.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
// import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
import useToken from "../../hooks/useToken";

const Navigation = () => {
  const name = useLocation().pathname;
  const [menu, setMenu] = useState(true);
  const { role, permissions } = useToken();
  // const { language } = useSelector((state) => state.ln);
  const { t, i18n } = useTranslation();
  const items =
    role === "company" || role === "employee"
      ? [
          {
            title: t("dashboard"),
            icon: () => <AiOutlineHome />,
            id: 0,
            active: false,
            path: "/",
            children: [],
            perm: "view_home",
          },
          // {
          //   title: t("branch"),
          //   icon: () => <FaCodeBranch />,
          //   id: 15,
          //   active: false,
          //   // path: "/branches",
          //   children: [
          //     {
          //       title: t("branch"),
          //       path: "/branches",
          //       id: 0,
          //     },
          //     {
          //       title: t("groups"),
          //       path: "/groups",
          //       id: 0,
          //     },
          //   ],
          //   perm: "",
          // },
          // {
          //   title: t("store"),
          //   icon: () => <FaCodeBranch />,
          //   id: 16,
          //   active: false,
          
          //   children: [
          //     {
          //       title: t("store"),
          //       path: "/stores",
          //       id: 0,
          //     },
          //     {
          //       title: t("MoveStores"),
          //       path: "/MoveStores",
          //       id: 0,
          //     },
          //   ],
          //   perm: "",
          // },
          {
            title: t("records"),
            icon: () => <BsRecordCircleFill />,
            id: 1,
            active: false,
            children: [
              {
                title: t("client"),
                path: "/customersandvendors",
                id: 0,
                perm: "view_list_customers",
              },
              {
                title: t("categories"),
                path: "/categorys",
                id: 1,
              },
              {
                title: t("unites"),
                path: "/units",
                id: 2,
              },
              {
                title: t("proService"),
                path: "/productandservices",
                id: 3,
                perm: "view_list_products",
              },
              {
                title: t("openingBallance"),
                path: "/stockopeningballance",
                id: 4,
              },
              {
                title: t("taxes"),
                path: "/taxes",
                id: 5,
              },
              {
                title: t("employe"),
                path: "/users",
                id: 6,
              },
            ],
          },
          {
            title: t("sales"),
            icon: () => <GrDocumentPerformance className="icon" />,
            id: 3,
            active: false,
            children: [
              {
                title: t("qoutation"),
                path: "/quotations",
                id: 0,
              },
              {
                title: t("sales"),
                path: "/sales",
                id: 1,
                perm: "view_list_sales",
              },
              {
                title: t("saleReturn"),
                path: "/creditnote",
                id: 2,
                perm: "view_list_salesReturns",
              },
            ],
          },
          {
            title: t("purchase"),
            icon: () => <FaCashRegister />,
            id: 4,
            active: false,
            // path: "/purchases",
            children: [
              {
                title: t("purchaseOrder"),
                path: "/purchaseorder",
                id: 0,
                perm: "purchaseorder",
              },
              {
                title: t("purchase"),
                path: "/purchase",
                id: 1,
                perm: "view_list_purchases",
              },
              {
                // http://einvoice.nozzm.com/purchaseorder
                title: t("purReturn"),
                path: "/debitnote",
                id: 2,
                perm: "view_list_purchasesReturns",
              },
            ],
          },
          {
            title: t("account"),
            icon: () => <FaCalculator />,
            id: 5,
            active: false,
            // path: "/accounts",
            children: [
              {
                title: t("recVoucher"),
                path: "/receipt",
                id: 0,
                perm: "receipt_voucher",
              },
              {
                title: t("payVoucher"),
                path: "/payment",
                id: 1,
                perm: "receipt_cashing",
              },
              {
                title: t("credInvoiceColl"),
                path: "/billpayment",
                id: 2,
                perm: "receipt_sadads",
              },
            ],
          },
          {
            title: t("reports"),
            icon: () => <TbReportSearch />,
            id: 6,
            active: false,
            children: [
              {
                title: t("stockSumm"),
                id: 0,
                path: "/stocksummery/report",
              },
              // {
              //   title: "اقرار ضريبة القيمة المضافة",
              //   id: 1,
              //   path: "/vatreturn/report",
              // },
              {
                title: t("logs"),
                id: 2,
                path: "/logs",
                perm: "view_list_log",
              },
              {
                title: t("annualSale"),
                id: 3,
                path: "/annualsales/report",
                perm: "years_reports",
              },
              {
                title: t("monthSale"),
                id: 4,
                path: "/Monthlysales/report",
                perm: "months_reports",
              },
              {
                title: t("vatReport"),
                id: 5,
                path: "tax_report/report",
                perm: "tax_reports",
              },
              {
                title: t("stockMovement"),
                id: 7,
                path: "/stockitemmovement/report",
              },
              {
                title: t("Customer and Supplier Account Statement"),
                id: 8,
                path: "/CustomerandSupplierStatement/report",
              },
            ],
          },
        ]
      : [
          {
            title: t("dashboard"),
            icon: () => <AiOutlineHome />,
            id: 0,
            active: false,
            path: "/main/admin",
            children: [],
          },
          {
            title: "الشركات",
            icon: () => <BsRecordCircleFill />,
            id: 1,
            active: false,
            children: [],
            path: "/main/active-companies",
          },
          {
            title: "شركات غير مفعلة",
            icon: () => <AiOutlineHome />,
            id: 2,
            active: false,
            children: [],
            path: "/main/not-active-companies",
          },
        ];

        // console.log(permissions)

  return (
    <div className="main-nav">
      <div className="menu">
        <AiOutlineMenu onClick={() => setMenu(!menu)} />
      </div>
      <div className="nav" style={{ display: menu ? "flex" : "none" }}>
        {role === "employee"
          ? items.map((ele, i) => {
              if (
                ele.hasOwnProperty("perm") &&
                permissions.includes(ele.perm)
              ) {
                return (
                  <div key={ele.id} className="contItem">
                    {ele.path ? (
                      <>
                        <Link
                          className={`item ${name === ele.path && "active"}`}
                          key={ele.id}
                          to={ele.path}
                        >
                          <div>{ele.icon()}</div>
                          <p>{ele.title}</p>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div
                          className={`item ${name === ele.path && "active"}`}
                          key={ele.id}
                        >
                          <div>{ele.icon()}</div>
                          <p>{ele.title}</p>
                        </div>
                        {ele.children.length > 0 && (
                          <div
                            className="hover"
                            style={{
                              bottom:
                                (i === items.length - 1 ||
                                  i === items.length - 2) &&
                                0,
                              top:
                                (i === items.length - 1 ||
                                  i === items.length - 2) &&
                                "unset",
                              left: i18n.language === "ar" ? "-190px" : "unset",
                              right:
                                i18n.language === "en" ? "-190px" : "unset",
                            }}
                          >
                            {ele.children.map((item) => {
                              if (
                                item.hasOwnProperty("perm") &&
                                permissions.includes(item.perm)
                              ) {
                                return (
                                  <Link key={item.id} to={item.path}>{item.title}</Link>
                                );
                              } else if (!item.hasOwnProperty("perm")) {
                                return (
                                  <Link key={item.id} to={item.path}>{item.title}</Link>
                                );
                              }
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              } else if (!ele.hasOwnProperty("perm")) {
                return (
                  <div key={ele.id} className="contItem">
                    {ele.path ? (
                      <>
                        <Link
                          className={`item ${name === ele.path && "active"}`}
                          key={ele.id}
                          to={ele.path}
                        >
                          <div>{ele.icon()}</div>
                          <p>{ele.title}</p>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div
                          className={`item ${name === ele.path && "active"}`}
                          key={ele.id}
                        >
                          <div>{ele.icon()}</div>
                          <p>{ele.title}</p>
                        </div>
                        {ele.children.length > 0 && (
                          <div
                            className="hover"
                            style={{
                              bottom:
                                (i === items.length - 1 ||
                                  i === items.length - 2) &&
                                0,
                              top:
                                (i === items.length - 1 ||
                                  i === items.length - 2) &&
                                "unset",
                              left: i18n.language === "ar" ? "-170px" : "unset",
                              right:
                                i18n.language === "en" ? "-170px" : "unset",
                            }}
                          >
                            {ele.children.map((item) => {
                              if (
                                item.hasOwnProperty("perm") &&
                                permissions.includes(item.perm)
                              ) {
                                return (
                                  <Link key={item.id} to={item.path}>
                                    {item.title}
                                  </Link>
                                );
                              } else if (!item.hasOwnProperty("perm")) {
                                return (
                                  <Link key={item.id} to={item.path}>
                                    {item.title}
                                  </Link>
                                );
                              }
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              }
            })
          : items.map((ele, i) => {
              return (
                <div key={ele.id} className="contItem">
                  {ele.path ? (
                    <>
                      <Link
                        className={`item ${name === ele.path && "active"}`}
                        key={ele.id}
                        to={ele.path}
                      >
                        <div>{ele.icon()}</div>
                        <p>{ele.title}</p>
                      </Link>
                      {ele.children.length > 0 && (
                        <div
                          className="hover"
                          style={{
                            bottom:
                              (i === items.length - 1 ||
                                i === items.length - 2) &&
                              0,
                            top:
                              (i === items.length - 1 ||
                                i === items.length - 2) &&
                              "unset",
                            left: i18n.language === "ar" ? "-190px" : "unset",
                            right: i18n.language === "en" ? "-190px" : "unset",
                          }}
                        >
                          {ele.children.map((item) => {
                            return <Link key={item.id}>{item.title}</Link>;
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className={`item ${name === ele.path && "active"}`}
                        key={ele.id}
                      >
                        <div>{ele.icon()}</div>
                        <p>{ele.title}</p>
                      </div>
                      {ele.children.length > 0 && (
                        <div
                          className="hover"
                          style={{
                            bottom:
                              (i === items.length - 1 ||
                                i === items.length - 2) &&
                              0,
                            top:
                              (i === items.length - 1 ||
                                i === items.length - 2) &&
                              "unset",
                            left: i18n.language === "ar" ? "-190px" : "unset",
                            right: i18n.language === "en" ? "-190px" : "unset",
                          }}
                        >
                          {ele.children.map((item) => {
                            return (
                              <Link to={item.path} key={item.id}>
                                {item.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Navigation;
