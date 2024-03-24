import { useState } from "react";
import { InputField, SelectInput } from "../../components/Input/Inputs";
import { useTranslation } from "react-i18next";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import Search from "../../components/Search/Search";
import useAll from "../../hooks/useAll";
import { BiSolidCalculator } from "react-icons/bi";
import "../../styles/salePoints.css";
import { useEffect } from "react";
import { fetchCategory } from "../../features/table/categorySlice";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import CalcModal from "../../components/CalcModal/CalcModal";
import cart from "../../assets/cart.jpg";
import { getToday } from "../../utils/Date";
import { fetchSales, postSales } from "../../features/table/salesSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleBodyData } from "../../utils/bodyData";
import { useNavigate } from "react-router-dom";
import { fetchProductsSales } from "../../features/table/productSalesSlice";
import { addData, addDiscount, calcTotal, clearData, decreaseData, deleteData, increaseData } from "../../features/table/cartSlice";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";


const SellPoints = () => {
  const { t, i18n } = useTranslation();
  const { dataSource, total: totalInvoice } = useAll("sales", fetchSales);
  const cartData = useSelector(state => state.cart)
  const {total, totalA, value} = cartData
  const [data, setData] = useState({
    // date: "",
    customer_id: "",
    items: [],
    invoice_number: totalInvoice + 1,
    paymentType: "",
    created_at: getToday(),

    files: "",
    invoice_description: "",
    total_amount_remaining: 0,
    purchase_order_date: "",
    original_invoice_number: "",
    purchase_order_num: "",
    purchase_order: 0,
  });
  const {
    dataSource: dSource,
    dataToFilter,
    loading,
    filterData,
  } = useAll("productsales", fetchProductsSales);
  const { dataSource: catData } = useAll(
    "category",
    // token,
    fetchCategory
  );
  const { token } = useToken();
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  const [filtered, setFiltered] = useState([...dataToFilter]);
  const [errors, setErrors] = useState({});
  // const [tabData, setTabData] = useState([]);
  // const [value, setValue] = useState({});
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const modalData = [
    {
      title: "customer",
      name: "customer_id",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      error: "",
      getOptions: () => printOptions("show_customer_all_sales", "customer"),
      // class: "input-group input-class",
      class: "report-input input-group",
    },
    {
      title: "payMethod",
      name: "paymentType",
      class: "report-input input-group",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        { name: "نقدي", value: "cash", id: 0 },
        { name: "شبكة", value: "network", id: 1 },
        { name: "بنكي", value: "bank", id: 2 },
        { name: "اجل", value: "installement", id: 3 },
      ],
      error: "",
    },
  ];


  useEffect(() => {
    setFiltered(dataToFilter);
  }, [dataToFilter]);

  const inputs = {
    select: (item) => (
      <SelectInput
        // note={note}
        // custom={custom}
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        className={"report-input"}
      />
    ),
  };

  // console.log(catData);
  const handleFilter = (item) => {
    if (item.name_ar !== "") {
      let filtered = dSource.filter((ele) => ele.category === item.name_ar);
      // console.log(filtered);
      setFiltered(filtered);
      setActive(item.name_ar);
    } else {
      setFiltered(dataToFilter);
      setActive("");
    }
  };

  const handleClick = (item) => {
    if (!cartData.data.some((ele) => ele.id === item.id)) {
      // setTabData((prev) => [
      //   ...prev,
      //   {
      //     product: item.id,
      //     quantity: value[item.id] ? value[item.id] : 1,
      //     piece_price: item.price,
      //     id: item.id,
      //     name: item.ar_name,
      //     category: item.category,
      //     tax: item.vat
      //   },
      // ]);
      dispatch(addData({item, value}))

      // setValue((prev) => ({ ...prev, [item.id]: 1 }));
    }
  };

  // const [total, setTotal] = useState(0);
  // const [totalA, setTotalA] = useState(0)
  const [addDisc, setAddDisc] = useState(false)

  const handleDis = (e, item) => {
    dispatch(addDiscount({item, e: e.target.value}))
  }

  useEffect(() => {
    if (cartData.data.length) {
      dispatch(calcTotal())
      setData((prev) => ({ ...prev, items: cartData.data }));
    }
  }, [cartData]);

  useEffect(() => {
    // setData((prev) => ({ ...prev, invoice_number: totalInvoice + 1 }));
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if(totalInvoice <= 0) {
    let newData = {}
      axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
        // setInvoiceNumber(res.data.data.StartingNumber[0].starting_sales);
        newData["perfix"] = res.data.data.StartingNumber[0].perfix_sales;
        newData["suffix"] = res.data.data.StartingNumber[0].suffix_sales;
        setData((prev) => ({
          ...prev,
          ...newData,
          invoice_number: res.data.data.StartingNumber[0].starting_sales,
        }));
      });
    } else {
      let newData = {};
      let ptn;
      let largest = Number(dataSource[0].invoice_number);

      for (var i = 0; i < dataSource.length; i++) {
        if (dataSource[i].invoice_number > largest) {
          largest = Number(dataSource[i].invoice_number);
        }
        // console.log(largest);
      }
      axios.post(`${apiUrl}show_company`, {}, { headers }).then((res) => {
        ptn = res.data.data.StartingNumber[0].starting_sales;
        //  const leadingZeros = ptn.match(/^0+/)[0].length;
        // setInvoiceNumber();
        newData["perfix"] = res.data.data.StartingNumber[0].perfix_sales;
        newData["suffix"] = res.data.data.StartingNumber[0].suffix_sales;
        setData((prev) => ({
          ...prev,
          ...newData,
          invoice_number: (largest + 1).toString().padStart(ptn.length, "0"),
        }));
      });
    }
  }, [totalInvoice]);

  // console.log(data)

  const handleDelete = (item) => {
    let newErr = { ...errors };
    delete newErr[item.product];
    // let newVal = { ...value };
    // delete newVal[item.product];
    // setValue(newVal);
    setErrors(newErr);
    dispatch(deleteData(item))
  };

  const handleClear = () => {
    // setTabData([]);
    dispatch(clearData())
    const newDat = { ...data };
    Object.keys(newDat).map((item) => {
      if (item !== "created_at" && item !== "invoice_number") {
        delete newDat[item];
      }
    });

    setData(newDat);
  };

  const handleErrors = (data, dataSource, modalData, hidden) => {
    let err = {};
    modalData.map((item) => {
      if (item.required) {
        // console.log("req");
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t("required") };
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
      if (hidden && hidden.length && hidden.includes(item.name))
        hidden.map((item) => delete err[item]);
    });
    return err;
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    let nestErr = {};
    //  console.log(token);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    err = handleErrors(data, dataSource, modalData);
    cartData.data.map((item) => {
      if (!value[item.product]) {
        nestErr[item.product] = "برجاء ادخال الكمية";
      }
    });
    setErrors((prev) => ({ ...prev, ...nestErr }));
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData(data, null, modalData);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // setLoading(true);
      dispatch(postSales({ form, body, token: headers["Authorization"] })).then(
        (res) => {
          navigate(`/report/preview-sales/${res.payload.data.id}/sales`);
        }
      );
    }
  };

  const handleAdd = (item) => {
    dispatch(increaseData(item))
  };

  const handleDeacrease = (item) => {
    if (value[item.id] > 1) {
      dispatch(decreaseData(item))
    }
  };

  const handleAddDisc = (item) => {
    if(addDisc === item.id) {
      return setAddDisc(false)
    }
    setAddDisc(item.id)
  }


  return (
    <div className="page-wrapper">
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className="upper">
            {/* <form> */}
            <div className="upper-right">
              {modalData.map((item) => {
                return inputs[`${item.type}`](item);
              })}
              <Search
                placeholder={
                  i18n.language === "ar"
                    ? "ابحث عن منتج"
                    : "Search for a product"
                }
                searchData={dSource}
                setDataToFilter={filterData}
              />
            </div>
            <div className="upper-left">
              <p>
                {t("invoiceNumber")}: {data["invoice_number"]}
              </p>
              <p>
                {t("date")}: {getToday()}
              </p>
              <button className="calculator" onClick={() => setModal(!modal)}>
                <BiSolidCalculator />
              </button>
              <button className="danger" onClick={handleClear}>
                {t("cancel")}
              </button>
            </div>
            {/* {dataToFilter.map()} */}
            {/* </form> */}
          </div>
          <div className="center">
            <div className="center-center">
              {filtered.map((item) => {
                if (item.active_pos) {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleClick(item)}
                      className="singlee"
                    >
                      <img
                        src={
                          item.files
                            ? `https://einvoice.nozzm.com/${item.files}`
                            : cart
                        }
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>{item.ar_name}</p>
                        <p>{item.price} SAR</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div className="very-left">
              <div className="center-left">
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
              </div>
              {cartData.data.length > 0 && (
                <div className="center-details">
                  <div className="center-detail">
                    <p>{t("prieceB")}</p>
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
          </div>
          <div className="lower">
            <div
              className="btn"
              onClick={handlSubmit}
              style={{ width: "400px", gap: "5px" }}
            >
              دفع{" "}
              <span>{cartData.data.length ? `${totalA} SAR` : "0 SAR"}</span>
            </div>
            <div className="center-right">
              <div
                className={"" === active ? "cat-btn active" : "cat-btn"}
                onClick={() => handleFilter({ name_ar: "" })}
              >
                <p>الجميع</p>
              </div>
              {catData.map((item) => {
                return (
                  <div
                    className={
                      item.name_ar === active ? "cat-btn active" : "cat-btn"
                    }
                    key={item.id}
                    onClick={() => handleFilter(item)}
                  >
                    <p>{item.name_ar}</p>
                  </div>
                );
              })}
            </div>
            {/* <div className="totaly">
              المبلغ الاجمالي: {tabData.length ? total : "-"}
            </div> */}
          </div>
          {modal && <CalcModal setModal={setModal} />}
        </>
      )}
    </div>
  );
};

export default SellPoints;
