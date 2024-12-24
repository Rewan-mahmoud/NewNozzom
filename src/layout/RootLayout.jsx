import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Navbar from "../components/Navbar/Navbar";
import { AiOutlineHome, AiOutlineStock } from "react-icons/ai";
import {
  BsArrowReturnLeft,
  BsCashCoin,
  BsFillPeopleFill,
  BsFillPersonFill,
} from "react-icons/bs";
import {
  BiCategory,
  BiLayer,
  BiReceipt,
  BiShoppingBag,
  BiSolidOffer,
} from "react-icons/bi";
import {
  MdAssignmentReturn,
  MdOutlineAdUnits,
  MdOutlinePolicy,
  MdPayment,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { HiReceiptTax } from "react-icons/hi";
import { TbTruckReturn } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import { GrSettingsOption } from "react-icons/gr";
import { FaCodeBranch } from "react-icons/fa";

const RootLayout = () => {
  const param = useLocation().pathname;
  const { id } = useParams();
  const { ready, role, data } = useSelector((state) => state.auth);
  const isLoggedIn = ready
  // console.log(data)
  
  const path = useMemo(() => {
    if (isLoggedIn && (role === "company" || role === "employee")) {
      return <Outlet />;
    } else if (isLoggedIn && role === "admin") {
      return <Navigate to={"/main/admin"} />;
    } else {
      return <Navigate to="/auth/login" />;
    }
  }, [isLoggedIn, role]);
  const { t } = useTranslation();
 
  const title = {
    "/": {
      name: t("dashboard"),
      icon: () => <AiOutlineHome />,
    },
    "/new": {
      name: t("dashboard"),
      icon: () => <AiOutlineHome />,
    },
    "/customersandvendors": {
      name: t("client"),
      icon: () => <BsFillPersonFill />,
    },
    "/change-pass": {
      name: t("passSettings"),
      icon: () => <GrSettingsOption />,
    },
    "/invoice-setting": {
      name: "اعدادات الفاتورة",
      icon: () => <BiLayer />,
    },
    "/MoveStores": {
      name:t("MoveStores") ,
      icon: () => <BiLayer />,
    },
    "/categorys": {
      name: t("categories"),
      icon: () => <BiCategory />,
    },
    "/units": {
      name: t("unites"),
      icon: () => <MdOutlineAdUnits />,
    },
    "/productandservices": {
      name: t("proService"),
      icon: () => <MdProductionQuantityLimits />,
    },
    "/stockopeningballance": {
      name: t("openingBallance"),
      icon: () => <AiOutlineStock />,
    },
    "/taxes": {
      name: t("taxes"),
      icon: () => <HiReceiptTax />,
    },
    "/users": {
      name: t("employe"),
      icon: () => <BsFillPeopleFill />,
    },
    "/branches": {
      name: t("branch"),
      icon: () => <FaCodeBranch />,
    },
    "/groups": {
      name: t("groups"),
      icon: () => <FaCodeBranch />,
    },
    "/stores": {
      name: t("store"),
      icon: () => <FaCodeBranch />,
    },
    "/MoveStores": {
      name: t("MoveStores"),
      icon: () => <FaCodeBranch />,
    },
    "/quotations": {
      name: t("qoutation"),
      icon: () => <BiSolidOffer />,
    },
    "/sales": {
      name: t("sales"),
      icon: () => <BiReceipt />,
    },
    "/creditnote": {
      name: t("saleReturn"),
      icon: () => <TbTruckReturn />,
    },
    "/purchaseorder": {
      name: t("purchaseOrder"),
      icon: () => <MdAssignmentReturn />,
    },
    "/purchase": {
      name: t("purchase"),
      icon: () => <BiShoppingBag />,
    },
    "/debitnote": {
      // name: ,
      name: t("purReturn"),
      icon: () => <BsArrowReturnLeft />,
    },
    "/receipt": {
      name: t("recVoucher"),
      icon: () => <MdOutlinePolicy />,
    },
    "/payment": {
      name: t("payVoucher"),
      icon: () => <BsCashCoin />,
    },
    "/billpayment": {
      name: t("credInvoiceColl"),
      icon: () => <MdPayment />,
    },
    "/add-receipt/add": {
      name: t("quotation"),
      icon: () => <MdPayment />,
    },
    [`/add-receipt/edit/${id}`]: {
      name: "تعديل عرض سعر",
      icon: () => <MdPayment />,
    },
    "/add-sales/add": {
      name: t("addInvoice"),
      icon: () => <MdPayment />,
    },
    [`/add-sales/refund/${id}`]: {
      name: t("reqReturn"),
      icon: () => <MdPayment />,
    },
    [`/add-pur/edit/${id}`]: {
      name: t("editInvoice"),
      icon: () => <MdPayment />,
    },
    [`/add-pur/refund/${id}`]: {
      name: t("reqReturn"),
      icon: () => <MdPayment />,
    },
    [`/add-refund/add`]: {
      name: t("addRefund"),
      icon: () => <MdPayment />,
    },
    [`/add-purchase/add`]: {
      name: t("addPurchaseOrder"),
      icon: () => <MdPayment />,
    },
    [`/add-purchase/edit/${id}`]: {
      name: t("editPurchaseOrder"),
      icon: () => <MdPayment />,
    },
    [`/add-pur/add`]: {
      name: t("addPurchase"),
      icon: () => <MdPayment />,
    },
    [`/add-refund-sale/add`]: {
      name: t("addReInvoice"),
      icon: () => <MdPayment />,
    },
    [`/add-refund-sale/edit/${id}`]: {
      name: t("editReinv"),
      icon: () => <MdPayment />,
    },
    [`/product/${id}`]: {
      name: t("productDetails"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/fatorah/${id}`]: {
      name: t("invDetails"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/stocksummery/report`]: {
      name: t("stockSumm"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/logs`]: {
      name: t("logs"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/tax_report/report`]: {
      name: t("vatReport"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/vatreturn/report`]: {
      name: "عرض ضريبة القيمة المضافة",
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/stockitemmovement/report`]: {
      name: t("stockMovement"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/CustomerandSupplierStatement/report`]: {
      name: t("Customer and Supplier Account Statement"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/pdf/${id}`]: {
      name: "pdf",
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/Monthlysales/report`]: {
      name: t("monthSale"),
      icon: () => <MdProductionQuantityLimits />,
    },
    [`/annualsales/report`]: {
      name: t("annualSale"),
      icon: () => <MdProductionQuantityLimits />,
    },
    ["/setting"]: {
      name: t("setting"),
      icon: () => <FiSettings />,
    },
    [`/add-employee`]: {
      name: "اضافة موظف",
      icon: () => <FiSettings />,
    },
    [`/phase-two`]: {
      name: t("actPhase2"),
      icon: () => <FiSettings />,
    },
    [`/add-employee/${id}`]: {
      name: "تعديل موظف",
      icon: () => <FiSettings />,
    },
  };

  return (
    <>
      <Navbar />
      <div className="layout" style={{ direction: t("direction") }}>
        {param !== '/sellpoints' && <Navigation />}
        <div className={param !== '/sellpoints' ? "container" : 'sale-container'}>
          {/* {param !== "/" ? ( */}
            {(param !== '/subscription' && param !== '/sellpoints') && <div className="title">
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
            </div>}
          {path}
        </div>
      </div>
    </>
  );
};

export default RootLayout;
