import "./App.css";
import './styles/style.css'
// import Navigation from './components/Navigation/Navigation'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// import { useTransition, ini } from "i18next";
import Dashboard from "./pages/Dashhboard/Dashboard";
import RootLayout from "./layout/RootLayout";
import Clients from "./pages/Clients/Clients";
import Categories from "./pages/Categories/Categories";
import Units from "./pages/Units/Units";
import Products from "./pages/Products/Products";
import Stocks from "./pages/Stocks/Stocks";
import Taxes from "./pages/Taxes/Taxes";
import Employee from "./pages/Employee/Employee";
import SalesOffer from "./pages/SalesOffer/SalesOffer";
import Receipt from "./pages/Receipt/Receipt";
import SalesReturn from "./pages/SalesReturn/SalesReturn";
import PurchasesOrder from "./pages/PurchasesOrder/PurchasesOrder";
import Purchases from "./pages/Purchases/Purchases";
import PurchasesReturns from "./pages/PurchasesReturns/PurchasesReturns";
import ReceiptVouchers from "./pages/ReceiptVouchers/ReceiptVouchers";
import ReceiptVouchersCashing from "./pages/ReceiptVouchersCashing/ReceiptVouchersCashing";
import ReceiptPaying from "./pages/ReceiptPaying/ReceiptPaying";
import AddReceipt from "./pages/AddReceipt/AddReceipt";
import AddSales from "./pages/AddSales/AddSales";
import AddRefund from "./pages/AddRefund/AddRefund";
import AddPurchase from "./pages/AddPurchase/AddPurchase";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import AddPur from "./pages/AddPur/AddPur";
import AddRefundSale from "./pages/AddRefundSale/AddRefundSale";
import Fatorah from "./pages/Fatorah/Fatorah";
// import Login from './pages/Signup/Signup';
import AuthLayout from "./layout/AuthLayout";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import StockSummery from "./pages/StockSummery/StockSummery";
import Logs from "./pages/Logss/Logs";
import TaxReport from "./pages/TaxReport/TaxReport";
import TaxReturn from "./pages/TaxReturn/TaxReturn";
import StoreProduct from "./pages/StoreProduct/StoreProduct";
import PDFLayout from "./layout/PDFLayout";
import Reportback from "./pages/reportback/Reportback";
import TaxReportBack from "./pages/taxReportBack/TaxreportBack";
import ProductReportBack from "./pages/ProductReportBack/ProductReportBack";
import MonthReport from "./pages/MonthReports/MonthReport";
import YearReport from "./pages/yearReport/YearReport";
import PDFDocument from "./components/PDFDocument/PDFDocument";
import ReceiptRep from "./pages/ReceiptRep/ReceiptRep";
// import { useSelector } from "react-redux";
import PaymentRep from "./pages/PaymentRep/PaymentRep";
import EditProfile from "./pages/EditProfile/EditProfile";
import InvoiceSetting from "./pages/InvoiceSettings/InvoiceSetting";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Subscription from "./pages/Subscribtion/Subscription";
import SellPoints from "./pages/SellPoints/SellPoints";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import MainLayout from "./layout/MainLayout";
import AdminDash from "./pages/AdminDash/AdminDash";
import ActiveCompanies from "./pages/Companies/ActiveCompanies";
import NonAcCompanies from "./pages/Companies/NonAcCompanies";
import AddCompany from "./pages/AddCompany/AddCompany";
import Subs from "./pages/Subs/Subs";
import Recipt from "./components/Reciept/Recipt";
import CreditCard from "./pages/checkout/Checkout";
import Phase2 from "./pages/Phase2/Phase2";
import CustomerandSupplierStatement from "./pages/CustomerandSupplierStatement/CustomerandSupplierStatement";
import CustomersVendorsRep from "./pages/customersVendorsRep/customersVendorsRep";
import Branches from "./pages/Branches/Branches";
import Stores from "./pages/Stores/Stores";
import MoveStores from "./pages/MoveStores/MoveStores";
import Groups from "./pages/Groups/Groups";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/customersandvendors",
        element: <Clients />,
      },
      {
        path: "/categorys",
        element: <Categories />,
      },
      {
        path: "/units",
        element: <Units />,
      },
      {
        path: "/productandservices",
        element: <Products />,
      },
      {
        path: "/stockopeningballance",
        element: <Stocks />,
      },
      {
        path: "/taxes",
        element: <Taxes />,
      },
      {
        path: "/branches",
        element: <Branches />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/stores",
        element: <Stores />,
      },
      {
         path:"/MoveStores",
         element:<MoveStores/>
      },
      {
        path: "/users",
        element: <Employee />,
      },

      {
        path: "/subscription",
        element: <Subscription />,
      },
      {
        path: "/quotations",
        element: <SalesOffer />,
      },
      {
        path: "/sales",
        element: <Receipt />,
      },
      {
        path: "/creditnote",
        element: <SalesReturn />,
      },
      {
        path: "/change-pass",
        element: <ForgetPassword />,
      },
      {
        path: "/purchaseorder",
        element: <PurchasesOrder />,
      },
      {
        path: "/purchase",
        element: <Purchases />,
      },
      {
        path: "/debitnote",
        element: <PurchasesReturns />,
      },
      {
        path: "/receipt",
        element: <ReceiptVouchers />,
      },
      {
        path: "/payment",
        element: <ReceiptVouchersCashing />,
      },
      {
        path: "/sellpoints",
        element: <SellPoints />,
      },
      {
        path: "/setting",
        element: <EditProfile />,
      },
      {
        path: "/billpayment",
        element: <ReceiptPaying />,
      },
      {
        path: "/add-receipt/:type/:id?",
        element: <AddReceipt />,
      },
      {
        path: "/add-sales/:type/:id?",
        element: <AddSales />,
      },
      {
        path: "/add-refund/:type/:id?",
        element: <AddRefund />,
      },
      {
        path: "/add-refund-sale/:type/:id?",
        element: <AddRefundSale />,
      },
      {
        path: "/add-purchase/:type/:id?",
        element: <AddPurchase />,
      },
      {
        path: "/add-pur/:type/:id?",
        element: <AddPur />,
      },
      {
        path: "/phase-two",
        element: <Phase2 />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/fatorah/:id",
        element: <Fatorah />,
      },
      {
        path: "/logs",
        element: <Logs />,
      },
      {
        path: "/invoice-setting",
        element: <InvoiceSetting />,
      },
      {
        path: "/stocksummery/:type",
        element: <StockSummery />,
      },
      {
        path: "/tax_report/:type",
        element: <TaxReport />,
      },
      {
        path: "/vatreturn/:type",
        element: <TaxReturn />,
      },
      {
        path: "/stockitemmovement/:type",
        element: <StoreProduct />,
      },
      {
        path: "/Monthlysales/:type",
        element: <MonthReport />,
      },
      {
        path: "/annualsales/:type",
        element: <YearReport />,
      },
      {
        path: "/CustomerandSupplierStatement/:type",
        element: <CustomerandSupplierStatement />,
      },
      {
        path: "add-employee/:id?",
        element: <AddEmployee />,
      },
    ],
  },
  {
    path: "/report/",
    element: <PDFLayout />,
    children: [
      {
        path: "",
        element: <Reportback />,
      },
      {
        path: "tax/:type",
        element: <TaxReportBack />,
      },
      {
        path: "credit/:id",
        element: <CreditCard />,
      },
      {
        path: "product",
        element: <ProductReportBack />,
      },
      {
        path: "customer-vendors",
        element: <CustomersVendorsRep />,
      },
      {
        path: "preview-sales/:id/:type?",
        element: <PDFDocument />,
      },
      {
        path: "receipt/:id",
        element: <ReceiptRep />,
      },
      {
        path: "payment/:id",
        element: <PaymentRep />,
      },
      {
        path: "new/:id",
        element: <Recipt />,
      },
    ],
  },
  {
    path: "/checkout/:id",
    element: <CreditCard />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/main",
    element: <MainLayout />,
    children: [
      {
        path: "admin",
        element: <AdminDash />,
      },
      {
        path: "active-companies",
        element: <ActiveCompanies />,
      },
      {
        path: "not-active-companies",
        element: <NonAcCompanies />,
      },
      {
        path: "add-company/:id?",
        element: <AddCompany />,
      },
      {
        path: "sub/:id",
        element: <Subs />,
      },
    ],
  },
]);



function App() {
  // const {language} = useSelector(state => state.ln)
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
