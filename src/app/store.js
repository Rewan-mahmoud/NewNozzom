import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../features/table/clientSlice";
import categorySlice from "../features/table/categorySlice";
import unitSlice from "../features/table/unitSlice";
import productSlice from "../features/table/productSlice";
import taxesSlice from "../features/table/taxesSlice";
import stockSlice from "../features/table/stockSlice";
import salesOfferSlice from "../features/table/salesOfferSlice";
import salesSlice from "../features/table/salesSlice";
import salesRSlice from "../features/table/salesRSlice";
import purchaseSlice from "../features/table/purchaseSlice";
import SProductSlice from "../features/table/SProductSlice";
import purSlice from "../features/table/purSlice";
import receiptSlice from "../features/table/receiptSlice";
import voucherSlice from "../features/table/voucherSlice";
import paymentSlice from "../features/table/paymentSlice";
import billSlice from "../features/table/billSlice";
import fatorahSlice from "../features/table/fatorahSlice";
import authSlice from "./../features/auth/auth";
import logSlice from "../features/table/logSlice";
import productReportSlice from "../features/table/productReportSlice";
import taxRepSlice from "../features/table/taxRepSlice";
import stockrepSlice from "../features/table/stockrepSlice";
import stSuSlice from "../features/table/stSuSlice";
import i18nSlice from "../features/ln/i18nSlice";
import productSalesSlice from "../features/table/productSalesSlice";
import cartSlice from "../features/table/cartSlice";
import emplyeeSlice from "../features/table/emplyeeSlice";
import activeCompanySlice from "../features/table/activeCompanySlice";
import nonActiveCompanySlice from "../features/table/nonActiveCompanySlice";
import subSlice from "../features/table/subSlice";
import custAndVendSlice from "../features/table/custAndVendSlice";
import branchSlice from "../features/table/branchSlice";
import storeSlice from "../features/table/storeSlice";
import groupSlice from "../features/table/groupSlice";

const store = configureStore({
  reducer: {
    client: clientReducer,
    category: categorySlice,
    unit: unitSlice,
    product: productSlice,
    taxes: taxesSlice,
    stocks: stockSlice,
    salesOffer: salesOfferSlice,
    sales: salesSlice,
    salesR: salesRSlice,
    purchase: purchaseSlice,
    sproduct: SProductSlice,
    pur: purSlice,
    receipt: receiptSlice,
    voucher: voucherSlice,
    payment: paymentSlice,
    bill: billSlice,
    fatorah: fatorahSlice,
    auth: authSlice,
    log: logSlice,
    productReport: productReportSlice,
    taxReport: taxRepSlice,
    stockRep: stockrepSlice,
    stSu: stSuSlice,
    ln: i18nSlice,
    productsales: productSalesSlice,
    cart: cartSlice,
    emplyee: emplyeeSlice,
    activeCompany: activeCompanySlice,
    nonActiveCompany: nonActiveCompanySlice,
    sub: subSlice,
    custAndVend: custAndVendSlice,
    branch: branchSlice,
    store: storeSlice,
    groups: groupSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable ImmutableStateInvariantMiddleware
    }),
});

export default store;
