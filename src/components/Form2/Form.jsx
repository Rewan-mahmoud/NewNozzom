/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FileInput,
  InputField,
  RadioInput,
  SelectInput,
  TableInput,
  TextareaInput,
} from "../Input/Inputs";
import { useNavigate, useParams } from "react-router-dom";
import DetailsCard from "../Details/DetailsCard";
import { getDetails, getOptions, getOptions2 } from "../../utils/getOption";
import { handleBodyData } from "../../utils/bodyData";
import LoadSpinner from "../LoadSpinner/LoadSpinner";
import { formatDate } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { Cansel } from "../Modal/Cansel";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";

const Form = ({
  data,
  setFormData,
  exludeData,
  updateMethod,
  setModal,
  btn,
  name,
  errors,
  setErrors,
  error,
  dataSource,
  dispatchMethod,
  modalType,
  modalData,
  className,
  mainClass,
  details,
  inputClass,
  uri,
  totalNum,
  api,
  refundMethod,
  custom,
  note,
  custom2,
  loader,
  anotherDataSource,
  anotherTotal,
}) => {
  const [info, setInfo] = useState(Array.from(modalData));
  const [disabled, setDisabled] = useState([]);
  const [nestedError, setNestedError] = useState({});
  const [nestedData, setNestedData] = useState(null);
  const dispatch = useDispatch();
  const [tax, setTax] = useState({});
  const [detail, setDetail] = useState({});
  const [bVat, setBVat] = useState({});
  const [total, setTotal] = useState({
    totalBtax: 0,
    totalBbtax: 0,
    totalBbbtax: 0,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bigLoading, setBigLoading] = useState(false);
  const [modalValue, setModalValue] = useState({});

  const { id, type } = useParams();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [hidden, setHidden] = useState([]);
  const { token, role, permissions } = useToken();
  const [oriInvoice, setOriInvoice] = useState(null);
  const { t, i18n } = useTranslation();
  const [cansel, setCansel] = useState(false);
  const [invoiceType, setInvoiceType] = useState("B2B");
  const [nation, setNation] = useState(true);
  const [withTax, setWithTax] = useState({
    with_tax: 1,
  });
  // const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [btnLoad, setBtnLoad] = useState(false);
  // const {  } = useToken();

  useEffect(() => {
    console.log(detail);
    setInvoiceType(detail.tax_card ? "B2B" : "B2C");
    Object.keys(detail).length &&
      setNation(detail.country === "Saudi Arabia" ? true : false);
  }, [detail]);
  //initialise values
  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // console.log(id, api)
    if (id && api) {
      setBigLoading(true);

      const item = dataSource.filter((ele) => ele.id === Number(id));
      getDetails(Number(id), api, token).then((res) => {
        setBigLoading(false);
        // console.log(res.data.data[0]);
        setModalValue(res.data.data[0]);
        if (Object.keys(res.data.data[0]).length) {
          setFormData({});
          let data = {};

          let initNested;
          info.map((item) => {
            if (item.type === "group") {
              if (nestedData && nestedData.length > 0) {
                // console.log(nestedData, "nnn");
                if (nestedData) initNested = [nestedData[0]];

                setNestedData(initNested);
              } else {
                let firstNested = {};
                info.map((ele) => {
                  if (ele.type === "group") {
                    ele.child.item.map((it) => {
                      if (it.hasOwnProperty("value")) {
                        firstNested[it.name] = it.value;
                      } else firstNested[it.name] = "";
                      // console.log(it.value)
                    });
                  }
                });
                initNested = [firstNested];
              }

              for (let i = 0; i < res.data.data[0][item.name].length - 1; i++) {
                initNested.push(initNested[0]);
              }
              res.data.data[0][item.name].map((it, i) => {
                Object.keys(it).map((e) => {
                  console.log(res.data.data[0][item.name][i].discount, e);
                  if (initNested[i].hasOwnProperty(e)) {
                    initNested[i] = {
                      ...initNested[i],
                      [e]: res.data.data[0][item.name][i][e],
                      discounts: [
                        {
                          discount: res.data.data[0][item.name][i].discount,
                          reason: res.data.data[0][item.name][i].discount,
                        },
                      ],
                      taxes: [
                        { tax: res.data.data[0][item.name][i].products.vat },
                      ],
                    };
                  }
                });
              });
              setNestedData(initNested);
            } else if (item.type === "date") {
              data = {
                ...data,
                [item.name]: formatDate(res.data.data[0][item.name]),
              };
            } else if (item.name === "customer_id") {
              setLoading(true);
              data[item.name] = res.data.data[0][item.name];
              if (custom) {
                // console.log(res.data.data[0][item.name], custom[0]);
                getOptions2(
                  Number(res.data.data[0][item.name]),
                  custom[0],
                  custom[1],
                  token
                )
                  .then((res) => {
                    setLoading(false);
                    console.log(res[0]);
                    setDetail(res[0]);
                  })
                  .catch((err) => console.log(err));
              }
            }
            //
            else {
              data = isNaN(Number(res.data.data[0][item.name]))
                ? { ...data, [item.name]: res.data.data[0][item.name] }
                : { ...data, [item.name]: Number(res.data.data[0][item.name]) };
            }
            if (invoiceNumber) {
              data = { ...data, ["invoice_number"]: invoiceNumber };
            }
          });
          data["total_amount_remaining"] = 0;
          setFormData(data);
          // console.log(type, uri);
          // console.log('refund', anotherTotal)
          if (type === "refund" && anotherTotal) {
            let newData = {};
            let ptn;
            let largest = Number(anotherDataSource[0].invoice_number);

            for (let i = 0; i < anotherDataSource.length; i++) {
              if (anotherDataSource[i].invoice_number > largest) {
                largest = Number(anotherDataSource[i].invoice_number);
              }
              //  console.log(largest);
            }
            if (uri === "/sales") {
              axios
                .post(`${apiUrl}show_company`, {}, { headers })
                .then((res) => {
                  ptn = res.data.data.StartingNumber[0].starting_sales;
                  //  const leadingZeros = ptn.match(/^0+/)[0].length;
                  setInvoiceNumber(
                    (largest + 1).toString().padStart(ptn.length, "0")
                  );
                  newData["perfix"] =
                    res.data.data.StartingNumber[0].perfix_sales;
                  newData["suffix"] =
                    res.data.data.StartingNumber[0].suffix_sales;
                  setFormData((prev) => ({
                    ...prev,
                    ...newData,
                    invoice_number: (largest + 1)
                      .toString()
                      .padStart(ptn.length, "0"),
                  }));
                });
            } else if (uri === "/purchase") {
              axios
                .post(`${apiUrl}show_company`, {}, { headers })
                .then((res) => {
                  ptn = res.data.data.StartingNumber[0].starting_purchase;
                  setInvoiceNumber(
                    (largest + 1).toString().padStart(ptn.length, "0")
                  );
                  newData["perfix"] =
                    res.data.data.StartingNumber[0].perfix_purchase;
                  newData["suffix"] =
                    res.data.data.StartingNumber[0].suffix_purchase;
                  setFormData((prev) => ({
                    ...prev,
                    ...newData,
                    invoice_number: (largest + 1)
                      .toString()
                      .padStart(ptn.length, "0"),
                  }));
                });
            }
          } else if (type === "refund" && anotherTotal === 0) {
            let newData = {};
            if (uri === "/sales") {
              axios
                .post(`${apiUrl}show_company`, {}, { headers })
                .then((res) => {
                  setInvoiceNumber(
                    res.data.data.StartingNumber[0].starting_sales
                  );
                  newData["perfix"] =
                    res.data.data.StartingNumber[0].perfix_sales;
                  newData["suffix"] =
                    res.data.data.StartingNumber[0].suffix_sales;
                  setFormData((prev) => ({
                    ...prev,
                    ...newData,
                    invoice_number:
                      res.data.data.StartingNumber[0].starting_sales,
                  }));
                });
            } else if (uri === "/purchase") {
              axios
                .post(`${apiUrl}show_company`, {}, { headers })
                .then((res) => {
                  setInvoiceNumber(
                    res.data.data.StartingNumber[0].starting_purchase
                  );
                  newData["perfix"] =
                    res.data.data.StartingNumber[0].perfix_purchase;
                  newData["suffix"] =
                    res.data.data.StartingNumber[0].suffix_purchase;
                  setFormData((prev) => ({
                    ...prev,
                    ...newData,
                    invoice_number:
                      res.data.data.StartingNumber[0].starting_purchase,
                  }));
                });
            }
          }
          if (
            (type === "refund" && uri === "/sales") ||
            (type === "refund" && uri === "/purchase") ||
            (type === "edit" && uri === "/purchasesReturns")
          ) {
            // console.log(res.data.data[0]["total_amount_remaining"]);
            // console.log(data);
            // console.log(res.data.data[0].purchase_order);
            const newData = {
              ...data,
              des_return: res.data.data[0].des_return
                ? res.data.data[0].des_return
                : "",
              // purchase_order: res.data.data[0].purchase_order,
              receipt_number_id: res.data.data[0].id,
              original_invoice_number: res.data.data[0]["invoice_number"],
              total_amount_remaining:
                res.data.data[0]["total_amount_remaining"] || 0,
            };
            setOriInvoice(res.data.data[0]["invoice_number"]);
            // console.log(res.data.data[0]);
            let cloneInfo = [];
            if (!res.data.data[0].des_return) {
              const newInfo = {
                title: t("returnReason"),
                name: "des_return",
                id: 11,
                validation: () => {},
                unique: false,
                required: true,
                type: "text",
                error: "",
                style: { gridColumn: "1/2" },
                class: "input-group input-class",
                details: true,
              };
              // console.log(modalValue)
              cloneInfo = [...info];
              cloneInfo.splice(1, 0, { ...newInfo });
              // eslint-disable-next-line no-unused-vars
              // info.map((item) => {
              //   // console.log(disabled);
              //   // if (disabled && disabled.length && disabled.includes(item.name)) {
              //   //   // console.log(true);
              //   //   if (item.name !== "original_invoice_number") {
              //   //     delete newData[item.name];
              //   //   }
              //   // }
              // });
            }
            setFormData(newData);
            if (cloneInfo.length > 0) setInfo(cloneInfo);
          }
        }
      });
      if (item.length) {
        setInvoiceNumber(item[0]["invoice_number"]);
      }
    }
  }, [id]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const initNested = {};
    info.map((ele) => {
      if (ele.type === "group") {
        ele.child.item.map((it) => {
          if (it.hasOwnProperty("value")) {
            initNested[it.name] = it.value;
          } else initNested[it.name] = "";
          // console.log(it.value)
        });
      }
    });
    setNestedData([initNested]);

    if (token) {
      if (totalNum <= 0 && type !== "edit") {
        let newData = {};
        if (uri === "/debitnote") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            console.log(res.data);
            setInvoiceNumber(
              res.data.data.StartingNumber[0].starting_debitnote
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_debitnote;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_debitnote;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/quotations") {
          // console.log('first')

          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            setInvoiceNumber(
              res.data.data.StartingNumber[0].starting_quotations
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_quotations;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_quotations;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/purchaseorder") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            setInvoiceNumber(
              res.data.data.StartingNumber[0].starting_purchaseorder
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_purchaseorder;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_purchaseorder;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/sales") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            setInvoiceNumber(res.data.data.StartingNumber[0].starting_sales);
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_sales;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_sales;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/purchase") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            console.log(res);
            setInvoiceNumber(res.data.data.StartingNumber[0].starting_purchase);
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_purchase;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_purchase;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/creditnote") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            setInvoiceNumber(
              res.data.data.StartingNumber[0].starting_creditnote
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_creditnote;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_creditnote;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        }
      } else if (type !== "edit") {
        let newData = {};
        let ptn;
        let largest = Number(dataSource[0].invoice_number);

        for (var i = 0; i < dataSource.length; i++) {
          if (dataSource[i].invoice_number > largest) {
            largest = Number(dataSource[i].invoice_number);
          }
          // console.log(largest);
        }
        if (uri === "/debitnote") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_debitnote;
            // const leadingZeros = ptn.match(/^0+/)[0].length;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_debitnote;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_debitnote;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/sales") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_sales;
            //  const leadingZeros = ptn.match(/^0+/)[0].length;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_sales;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_sales;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/quotations") {
          // console.log("first");
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_quotations;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_quotations;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_quotations;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/purchaseorder") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_purchaseorder;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_purchaseorder;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_purchaseorder;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/purchase") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_purchase;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_purchase;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_purchase;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/creditnote") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_creditnote;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] =
              res.data.data.StartingNumber[0].perfix_creditnote;
            newData["suffix"] =
              res.data.data.StartingNumber[0].suffix_creditnote;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        }
      } else if (type === "refund" && anotherTotal) {
        let newData = {};
        let ptn;
        let largest = Number(anotherDataSource[0].invoice_number);

        for (let i = 0; i < anotherDataSource.length; i++) {
          if (anotherDataSource[i].invoice_number > largest) {
            largest = Number(anotherDataSource[i].invoice_number);
          }
          // console.log(largest);
        }
        if (uri === "/sales") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_sales;
            //  const leadingZeros = ptn.match(/^0+/)[0].length;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_sales;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_sales;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        } else if (uri === "/purchase") {
          axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
            ptn = res.data.data.StartingNumber[0].starting_purchase;
            setInvoiceNumber(
              (largest + 1).toString().padStart(ptn.length, "0")
            );
            newData["perfix"] = res.data.data.StartingNumber[0].perfix_purchase;
            newData["suffix"] = res.data.data.StartingNumber[0].suffix_purchase;
            setFormData((prev) => ({ ...prev, ...newData }));
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (note === "sales") {
      if (details && nestedData && modalValue) {
        let vat = { ...tax };
        let b = { ...bVat };
        // console.log('render')
        nestedData.map((e, i) => {
          getOptions2(Number(e["product"]), custom2[0], custom2[1], token)
            .then((res) => {
              if (res[0]) {
                vat = {
                  ...vat,
                  [nestedData[i].product]: {
                    result:
                      Object.keys(detail).length &&
                      detail.hasOwnProperty("taxes_unable") &&
                      detail["tax_card"] !== null
                        ? res[0].vat
                        : 0,
                  },
                };
                b = {
                  ...b,
                  [nestedData[i].product]: {
                    bTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity),
                    bbTax: withTax.with_tax
                      ? (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) *
                        (Number(res[0].vat) / 100)
                      : 0,

                    bbbTax: withTax.with_tax
                      ? (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                          Number(nestedData[i].quantity) +
                        (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                          Number(nestedData[i].quantity) *
                          (Number(res[0].vat) / 100)
                      : (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity),
                  },
                };

                console.log(b);
                setBVat({ ...b });
                setTax({ ...vat });
              }
            })
            .catch((err) => console.log(err));
        });
      }
    } else {
      if (details && nestedData && modalValue) {
        let vat = { ...tax };
        let b = { ...bVat };
        nestedData.map((e, i) => {
          console.log(nestedData[i].product);
          getOptions2(Number(e["product"]), custom2[0], custom2[1], token)
            .then((res) => {
              if (res[0]) {
                vat = {
                  ...vat,
                  [nestedData[i].product]: {
                    result: withTax.with_tax ? res[0].vat : 0,
                  },
                };
                b = {
                  ...b,
                  [nestedData[i].product]: {
                    bTax:
                      (Number(nestedData[i].piece_price) -
                        Number(nestedData[i].discount)) *
                      Number(nestedData[i].quantity),
                    bbTax: withTax.with_tax
                      ? (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity) *
                        (Number(res[0].vat) / 100)
                      : 0,

                    bbbTax: withTax.with_tax
                      ? (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                          Number(nestedData[i].quantity) +
                        (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                          Number(nestedData[i].quantity) *
                          (Number(res[0].vat) / 100)
                      : (Number(nestedData[i].piece_price) -
                          Number(nestedData[i].discount)) *
                        Number(nestedData[i].quantity),
                  },
                };

                console.log(b);
                setBVat({ ...b });
                setTax({ ...vat });
              }
            })
            .catch((err) => console.log(err));
        });
      }
    }
  }, [nestedData, detail, withTax]);

  useEffect(() => {
    let disable = [];
    let hiden = [];
    if (type === "refund") {
      info.map((item) => {
        // console.log(item.type)
        if (item.type === "group") {
          // console.log(item);
          Object.keys(item.child).map((ele) =>
            item.child[ele].map((i) => disable.push(i.name))
          );
        } else if (item.type === "radio" && item.hasOwnProperty("action")) {
          if (
            data[item.name] === 0 ||
            data[item.name] === "0" ||
            data[item.name].length === 0
          ) {
            hiden.push(...item.action);
            // console.log('first')
          } else if (data[item.name] === 1) {
            hiden = hiden.filter((ele) => !item.action.includes(ele));
          }
        } else {
          //  &&   ? disable.push(item.name) : null
          if (item.name !== "des_return" && item.name !== "created_at") {
            disable.push(item.name);
            // console.log(item)
          }

          // if(item.name !== "date") disable.push(item.name)
        }
      });
      setHidden(hiden);
      setDisabled(disable);
      // console.log(disable);
    } else {
      info.map((item) => {
        if (item.type === "radio" && item.hasOwnProperty("action")) {
          if (
            data[item.name] === 0 ||
            data[item.name] === "0" ||
            !data[item.name]
          ) {
            // console.log(data[item.name]);
            disable.push(...item.action);
          } else if (data[item.name] === 1) {
            disable = disable.filter((ele) => !item.action.includes(ele));
          }
        }
      });
      setHidden(disable);
    }
    // setDisabled(disable);
    // console.log(disable)
  }, [modalValue, data]);

  // console.log(tax)

  const handleCreate = async (form, body) => {
    // console.log('create')
    try {
      // process.env.TEMP_FOLDER = `${require("os").tmpdir()}\\`;
      // let response;
      if (type === "add") {
        console.log(body);
        if (invoiceNumber) body["invoice_number"] = invoiceNumber;

        dispatch(
          dispatchMethod({
            form,
            body,
            token: `Bearer ${token}`,
          })
        ).then((res) => {
          console.log(true, res);
          if (res.payload && res.meta.requestStatus === "fulfilled") {
            let reset = { ...data };
            if (res.payload.status) {
              setBtnLoad(false);
              if (res.payload.status === "WARNING") {
                console.log("warn");

                res.payload.warningMessages.map((item) => {
                  if (item.type === "WARNING") {
                    console.log("warn");
                    toast.warning(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                  if (item.type === "PASS") {
                    console.log(item);
                    toast.success(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  } else {
                    toast.error(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                });
                // setTimeout(() => {
                //   if (uri) navigate(uri);
                // }, [5000])
                // if (uri) navigate(uri);
              }
              if (res.payload.status === "PASS") {
                console.log(res.payload);
                // toast.success('hoii')
                //b2b clearanceStatus
                toast.success(
                  invoiceType === "B2B"
                    ? res.payload.clearanceStatus
                    : res.payload.reportingStatus,
                  {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                  }
                );
                setTimeout(() => {
                  if (uri) navigate(uri);
                }, [5000]);
              }
              if (res.payload.status === "ERROR") {
                res.payload.warningMessages.map((item) => {
                  if (item.type === "WARNING") {
                    console.log("warn");
                    toast.warning(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                  if (item.type === "PASS") {
                    console.log(item);
                    toast.success(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  } else {
                    toast.error(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                });
                res.payload.errorMessages.map((item) => {
                  if (item.type === "WARNING") {
                    console.log("warn");
                    toast.warning(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                  if (item.type === "PASS") {
                    console.log(item);
                    toast.success(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  } else {
                    toast.error(item.message, {
                      position: "top-center",
                      autoClose: false,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      // progress: undefined,
                      theme: "light",
                    });
                  }
                });
                // setTimeout(() => {
                //   if (uri) navigate(uri);
                // }, [5000]);
              }
            } else {
              setBtnLoad(false);
              toast.success("completed", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                // progress: undefined,
                theme: "light",
              });
              setTimeout(() => {
                if (uri) navigate(uri);
              }, [5000]);
            }
            // console.log(reset)
            info.map((item) => {
              // console.log(item)
              setErrors({});
              if (item.type !== "radio") reset[item.name] = "";
              // let ele = item.title;
              setFormData({ ...reset });
            });
            // console.log(res.payload);
          } else {
            console.log("err");
          }
        });
      } else {
        // console.log(body)
        setBtnLoad(false);
        response = await dispatch(
          dispatchMethod({
            ...body,
          })
        );
      }

      //   console.log(response);
      // if (response.payload && response.meta.requestStatus === "fulfilled") {
      //   console.log(true, response.payload.status);
      //   let reset = { ...data };

      //   if (response.payload.status === "WARNING") {
      //     console.log("warn");
      //     toast.success('hii')
      //     // toast.success(response.payload.reportingStatus, {
      //     //   position: "top-center",
      //   autoClose: false,
      //     //   hideProgressBar: true,
      //     //   closeOnClick: true,
      //     //   pauseOnHover: true,
      //     //   draggable: true,
      //     //   // progress: undefined,
      //     //   theme: "light",
      //     // });

      //     // response.payload.warningMessages.map((item) => {
      //     //   if (item.type === "WARNING") {
      //     //     console.log('warn')
      //     //     toast.warning(item.message, {
      //     //       position: "top-center",
      //       autoClose: false,
      //     //       hideProgressBar: true,
      //     //       closeOnClick: true,
      //     //       pauseOnHover: true,
      //     //       draggable: true,
      //     //       progress: undefined,
      //     //       theme: "light",
      //     //     });
      //     //   }
      //     //   if (item.type === "PASS") {
      //     //     console.log(item)
      //     //     toast.success(item.message, {
      //     //       position: "top-center",
      //       autoClose: false,
      //     //       hideProgressBar: true,
      //     //       closeOnClick: true,
      //     //       pauseOnHover: true,
      //     //       draggable: true,
      //     //       progress: undefined,
      //     //       theme: "light",
      //     //     });
      //     //   } else {
      //     //     toast.error(item.message, {
      //     //       position: "top-center",
      //       autoClose: false,
      //     //       hideProgressBar: true,
      //     //       closeOnClick: true,
      //     //       pauseOnHover: true,
      //     //       draggable: true,
      //     //       progress: undefined,
      //     //       theme: "light",
      //     //     });
      //     //   }
      //     // });
      //   }
      //   if (response.payload.status === "PASS") {
      //     console.log('first')
      //     toast.success('hhhhh')
      //     toast.success(response.payload.reportingStatus, {
      //       position: "top-center",
      // autoClose: false,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       theme: "light",
      //     });
      //   }
      //   if (response.payload.status === "ERROR") {
      //     toast.error(response.payload.reportingStatus, {
      //       position: "top-center",
      // autoClose: false,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //     });
      //   }

      //   // console.log(reset)
      //   info.map((item) => {
      //     // console.log(item)
      //     setErrors({});

      //     if (item.type !== "radio") reset[item.name] = "";
      //     // let ele = item.title;
      //     setFormData({ ...reset });
      //   });
      //   console.log(response.payload);
      //   if (uri) navigate(uri);
      // } else {
      //   console.log("err");
      // }
      // if (response.error) {
      //   console.log(response.error.message, "err");
      // }
    } catch (err) {
      console.log(err, "error");
    }
  };

  const handleEdit = async (form, body) => {
    try {
      let result = await dispatch(
        updateMethod({
          form,
          body,
          id: modalValue.id,
          token: `Bearer ${token}`,
        })
      );
      // console.log(body);
      if (result.payload.success) {
        setBtnLoad(false);
        let reset = { ...data };
        info.map((item) => {
          setErrors({});
          if (item.type !== "radio") reset[item.title] = "";
          // let ele = item.title;
          setFormData(reset);
        });
        // if (fileName) setFileName("");
        // setModal({ open: false, type: "" });
        if (uri) navigate(uri);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefund = async (body) => {
    try {
      dispatch(
        refundMethod({
          body,
          token: `Bearer ${token}`,
        })
      ).then((res) => {
        setBtnLoad(false);
        console.log(res);
        if (!res.payload) {
          toast.error("something went wrong, try again later");
        } else {
          if (res.payload.status) {
            setBtnLoad(false);
            if (res.payload.status === "WARNING") {
              console.log("warn");
              res.payload.warningMessages.map((item) => {
                if (item.type === "WARNING") {
                  console.log("warn");
                  toast.warning(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                }
                if (item.type === "PASS") {
                  console.log(item);
                  toast.success(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                } else {
                  toast.error(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                }
              });
              // setTimeout(() => {
              //   if (uri) navigate(uri);
              // }, [5000])
              // if (uri) navigate(uri);
            }
            if (res.payload.status === "PASS") {
              console.log(res.payload);
              // toast.success('hoii')
              //b2b clearanceStatus
              toast.success(
                invoiceType === "B2B"
                  ? res.payload.clearanceStatus
                  : res.payload.reportingStatus,
                {
                  position: "top-center",
                  autoClose: false,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                }
              );
              setTimeout(() => {
                if (uri) navigate(uri);
              }, [5000]);
            }
            if (res.payload.status === "ERROR") {
              res.payload.errorMessages.map((item) => {
                if (item.type === "WARNING") {
                  console.log("warn");
                  toast.warning(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                }
                if (item.type === "PASS") {
                  console.log(item);
                  toast.success(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                } else {
                  toast.error(item.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // progress: undefined,
                    theme: "light",
                  });
                }
              });
              // setTimeout(() => {
              //   if (uri) navigate(uri);
              // }, [5000]);
            }
          }
        }
      });
      // console.log(result);
      // if (result.payload.success) {
      //   setBtnLoad(false)
      //   let reset = { ...data };
      //   // console.log()
      //   info.map((item) => {
      //     setErrors({});
      //     if (item.type !== "radio") reset[item.title] = "";
      //     // let ele = item.title;
      //     setFormData(reset);
      //   });

      //   // if (fileName) setFileName("");
      //   // setModal({ open: false, type: "" });
      //   if (uri) navigate(uri);
      // }
      // if (!result.payload.status) {
      //   console.log(result.payload);
      //   // setErrors("خطأ");
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleErrors = () => {
    let err = {};
    info.map((item) => {
      if (item.required) {
        // console.log("req");
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t("required") };
        // console.log(t('required'))
      }

      if (item.unique)
        dataSource.map(
          (ele) =>
            ele[item.name] === data[item.name] &&
            (err[item.name] = {
              title: item.name,
              message: t("fieldExist"),
            })
        );
      if (
        item.validation &&
        item.validation(data[item.name]) &&
        item.required &&
        item.validation(data[item.name])
      ) {
        // console.log("validation");
        err[item.name] = {
          title: item.name,
          message: item.validation(data[item.name]),
        };
      }

      // console.log(item)
      if (hidden && hidden.length && hidden.includes(item.name))
        hidden.map((item) => delete err[item]);
      if (item.type === "group") {
        // console.log(nestedData)
        // Object.keys(item.child).map((el, index) => {
        //   console.log(el, "el", item.child[el], item.child);
        //   item.child[el].map((i) => {
        //     // console.log(i,x, 'x', nestedData, index)
        //     if(nestedData[index][i.name] === '' && i.required) {
        //       console.log(index)
        //       err[index] = { message: "قم بادخال بيانات الصف او احذفه" };
        //     }
        //   })
        // })
        Object.keys(nestedData).map((ch) =>
          Object.keys(nestedData[ch]).map((it) => {
            // console.log(item.child, it)
            const match = item.child["item"].find((i) => i.name === it);
            if (nestedData[ch][it] === "" && match.required)
              err[ch] = { message: "قم بادخال بيانات الصف او احذفه" };
            // if (!nestedError.hasOwnProperty(ch)) delete err[ch]
            // console.log(nestedError[ch], ch)
          })
        );
      }
    });
    return err;
  };

  // console.log(permissions)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    setBtnLoad(true);

    try {
      if (type !== "edit" && type !== "refund") {
        err = handleErrors();
      }

      if (Object.keys(err).length > 0) {
        setErrors((prev) => ({ ...prev, ...err }));
      } else {
        const body = handleBodyData(data, exludeData, info, nestedData);
        console.log("Formatted body data:", body);

        const form = new FormData();
        Object.keys(body).forEach((key) => {
          form.append(key, body[key]);
        });

        console.log("FormData:", form);

        if (type === "edit") {
          await handleEdit(form, body);
        } else if (type === "refund") {
          await handleRefund(body);
        } else {
          await handleCreate(form, body);
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrors((prev) => ({ ...prev, submit: "Something went wrong." }));
    } finally {
      setBtnLoad(false);
    }
  };

  const handleCloseModal = () => {
    setCansel(true);
  };

  const setCanselTrue = () => {
    setCansel(false);
  };

  const inputs = {
    select: (item) => (
      <SelectInput
        // note={note}
        custom={custom}
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        errors={errors}
        detail={detail}
        setDetail={setDetail}
        inputClass={inputClass}
        loading={loading}
        setLoading={setLoading}
        api={api}
        disabled={disabled ? disabled : ""}
      />
    ),
    textarea: (item) => (
      <TextareaInput
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
      />
    ),
    file: (item) => (
      <FileInput
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    ),
    radio: (item) => (
      <RadioInput
        item={item}
        key={item.id}
        data={data}
        // handleRadio={handleRadio}
        setFormData={setFormData}
        errors={errors}
        disabled={hidden}
        setDisabled={setHidden}
      />
    ),
    group: (item) => (
      <TableInput
        key={item.id}
        item={item}
        className={className}
        total={total}
        bVat={bVat}
        disabled={disabled ? disabled : ""}
        details={details}
        info={info}
        modalData={modalData}
        nestedData={nestedData}
        nestedError={nestedError}
        setBVat={setBVat}
        setNestedData={setNestedData}
        setNestedError={setNestedError}
        setTax={setTax}
        tax={tax}
        setTotal={setTotal}
        detail={detail}
        api={api}
        note={note}
        custom2={custom2}
        errors={errors}
        setErrors={setErrors}
        // hidden={hidden}
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
    year: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
    month: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
    email: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
    password: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setFormData}
        disabled={disabled ? disabled : ""}
        errors={errors}
        inputClass={inputClass}
        // hidden={hidden}
      />
    ),
  };

  useEffect(() => {
    // console.log(formData)
    setFormData((prev) => ({ ...prev, active_tax: withTax.with_tax }));
  }, [withTax]);


  if (bigLoading) return <LoadSpinner />;
  if (!bigLoading) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={mainClass ? `${mainClass}` : ""}
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
          >
            {type !== "refund" && type !== undefined && invoiceNumber ? (
              <InputField
                item={{
                  name: "invoice_number",
                  title: t("invoiceNumber"),
                  style: { gridColumn: "1/2" },
                  class: "input-group input-class",
                  // inputClass: "input-class",
                }}
                data={{ invoice_number: invoiceNumber }}
                disabled={["invoice_number"]}
                errors={errors}
                inputClass={inputClass}
                // setFormData={setFormData}
              />
            ) : null}
            {oriInvoice ? (
              <InputField
                item={{
                  name: "invoice_number",
                  title: t("originalInvoice"),
                  style: { gridColumn: "1/2" },
                  class: "input-group input-class",
                }}
                data={{ invoice_number: data["original_invoice_number"] }}
                disabled={["invoice_number"]}
                errors={errors}
                inputClass={inputClass}
              />
            ) : null}

            {uri !== "/purchaseorder" &&
            uri !== "/quotations" &&
            Object.keys(detail).length ? (
              <div
                className="input-group input-class"
                style={{ gridColumn: "1 / 2" }}
              >
                <label>
                  <span>نوع الفاتورة </span>
                  <div
                    className="input-class"
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "30px",
                    }}
                  >
                    <input
                      placeholder="رقم الفاتورة"
                      disabled={true}
                      value={detail.tax_card ? "B2B" : "B2C"}
                      style={{ width: "100%" }}
                    />
                  </div>
                </label>
              </div>
            ) : null}

            {info.map((item) => {
              if (hidden && !hidden.includes(item.name)) {
                if (item.name === "customer_id") {
                  return <>{inputs[`${item.type}`](item)}</>;
                } else {
                  return inputs[`${item.type}`](item);
                }
              }
            })}

            {details && (
              <>
                <DetailsCard loading={loading} detail={detail} />
                {!nation ? (
                  <RadioInput
                    item={{
                      name: "with_tax",
                      title: t("with_tax"),
                      style: { gridArea: "5/3/5/6" },
                      class: "input-group input-class",
                      type: "radio",
                      info: [
                        { name: t("active"), action: 1 },
                        { name: t("notactive"), action: 0 },
                      ],
                    }}
                    data={withTax}
                    // handleRadio={handleRadio}
                    setFormData={setWithTax}
                    errors={errors}
                    disabled={hidden}
                    setDisabled={setHidden}
                  />
                ) : null}
              </>
            )}
          </div>

          <div
            className="modal-btns"
            style={{ borderTop: type && "1px solid gray" }}
          >
            {error && !Object.keys(errors).length && (
              <span style={{ color: "red" }}>{error}</span>
            )}
            {Object.keys(errors).length ? (
              <span style={{ color: "red" }}>{t("warn")}</span>
            ) : null}

            <div
              className="btnss"
              style={{
                justifyContent: type === "report" ? "flex-start" : "center",
              }}
            >
              {type === "add" &&
              invoiceType === "B2C" &&
              uri !== "/purchaseorder" &&
              uri !== "/quotations" &&
              uri !== "/purchase" &&
              role === "company" &&
              permissions.includes("zatcaV2") ? (
                <>
                  <button
                    className="confirm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        save_type: "confirm",
                      }));
                      console.log(data);
                    }}
                    disabled={btnLoad}
                  >
                    {t("confirm")}
                  </button>
                  <button
                    className="confirm"
                    onClick={handleSubmit}
                    // onClick={() => {
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     save_type: "save_and_confirm",
                    //   }));
                    //   console.log(data);
                    // }}
                    // disabled={btnLoad}
                  >
                    تاكيد واعتماد
                  </button>
                </>
              ) : type === "refund" &&
                invoiceType === "B2C" &&
                uri !== "/purchaseorder" &&
                uri !== "/quotations" &&
                role === "company" &&
                permissions.includes("zatcaV2") ? (
                <>
                  <button
                    className="confirm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        save_type: "save_and_confirm",
                      }));
                      console.log(data);
                    }}
                    disabled={btnLoad}
                  >
                    تاكيد واعتماد
                  </button>
                </>
              ) : type === "add" && !permissions.includes("zatcaV2") ? (
                <button
                  className="confirm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      save_type: "confirm",
                    }));
                    console.log(data);
                  }}
                  disabled={btnLoad}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : t("confirm")}
                </button>
              ) : type === "add" &&
                invoiceType === "B2B" &&
                uri !== "/purchaseorder" &&
                uri !== "/quotations" &&
                uri !== "/purchase" &&
                role === "company" &&
                permissions.includes("zatcaV2") ? (
                <button
                  className="confirm"
                  // onClick={handleSubmit}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      save_type: "save_and_confirm",
                    }));
                    console.log(data);
                  }}
                  disabled={btnLoad}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : "تاكيد واعتماد"}
                </button>
              ) : type === "refund" &&
                invoiceType === "B2B" &&
                uri !== "/purchaseorder" &&
                uri !== "/quotations" &&
                role === "company" &&
                permissions.includes("zatcaV2") ? (
                <button
                  className="confirm"
                  // onClick={handleSubmit}
                  disabled={btnLoad}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      save_type: "save_and_confirm",
                    }));
                    console.log(data);
                  }}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : "تاكيد واعتماد"}
                </button>
              ) : type === "edit" ? (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={btnLoad}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : t("edit")}
                </button>
              ) : type === "report" ? (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={btnLoad}
                  style={{ alignSelf: "flex-start" }}
                >
                  {t("showReport")}
                </button>
              ) : type === "add" || type === "refund" ? (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={btnLoad}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : t("confirm")}
                </button>
              ) : (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={btnLoad}
                >
                  {btnLoad ? <LoadSpinner btn={true} /> : t("login")}
                </button>
              )}
              {type && type !== "report" ? (
                <button
                  type="button"
                  className="cancel"
                  onClick={handleCloseModal}
                >
                  {t("cancel")}
                </button>
              ) : null}
            </div>
          </div>

          {cansel && <Cansel modalType={modalType} setCansel={setCansel} />}
          <ToastContainer />
        </form>
      </>
    );
  }
};

export default Form;
