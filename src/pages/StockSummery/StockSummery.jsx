/* eslint-disable no-unused-vars */
import { useState } from "react";
import Form from "../../components/Form2/Form";
import { InputField, SelectInput } from "../../components/Input/Inputs";
import { Link, useNavigate } from "react-router-dom";
// import { handleErrors } from "../../utils/submiterr";
import { handleBodyData } from "../../utils/bodyData";
import Table from "../../components/Table/Table";
import { apiUrl } from "../../features/table/billSlice";
import axios from "axios";
import useToken from "../../hooks/useToken";
import { useDispatch, useSelector } from "react-redux";
import { addStockRep } from "../../features/table/stockrepSlice";
import { addStSu } from "../../features/table/stSuSlice";
import { useTranslation } from "react-i18next";
import { getOptions } from "../../utils/getOption";
import { useEffect } from "react";

const StockSummery = () => {
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
  const [data, setData] = useState({
    to_date: "",
    branche_id: branche_id,
  });
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();

  const modalData = [
    {
      title: t("date"),
      name: "to_date",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: "report-input input-group",
    },
  ];

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
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
      />
    ),
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    // {
    //   title: "رقم التسلسل",
    //   dataIndex: "log_date",
    //   key: "رقم التسلسل",
    // },
    {
      title: t("productName"),
      dataIndex: "product_name",
      key: "اسم المنتج",
    },
 
    {
      title: t("totalQua"),
      dataIndex: "quantity",
      key: "اجمالي الكميات",
    },
  ];

  const { token, role } = useToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataSource, setDataSource] = useState([]);

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

  const handlSubmit = (e, uri) => {
    e.preventDefault();
    let err = {};
    setErrors({});
    // console.log(token);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    err = handleErrors(data, dataSource, modalData);
    // to={`/report/${1}/tax`}
    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
    } else {
      const body = handleBodyData(data, null, modalData);
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // console.log(body);
      setLoading(true);
      axios
        .post(`${apiUrl}stocksummery`, { ...body }, { headers })
        .then((res) => {
          // console.log(res.data.data);
          let result = [];
          Object.keys(res.data.data).map((item) => {
            // console.log(typeof res.data.data[item]);
            if (typeof res.data.data[item] === "object" && item !== "company")
              result.push({
                product_name: res.data.data[item][0],
                quantity: res.data.data[item][1],
              });
          });
          console.log(result);
          setLoading(false);
          setDataSource(result);
          dispatch(
            addStSu({
              ...result,
              toDate: res.data.data["to_date"],
              company: res.data.data["company"],
            })
          );
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          // dispatch(addProReb(err))
        });
    }
  };

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // if (role === "company") {
  //   modalData.splice(0, 0, {
  //     title: t("branch"),
  //     name: "branche_id",
  //     id: 19,
  //     unique: false,
  //     required: false,
  //     validation: () => {},
  //     type: "select",
  //     getOptions: () => printOptions("show_branches_all", "Branches"),
  //     error: "",
  //     class: "report-input input-group",
  //     inputClass: "input-field",
  //   });
  // } else {
  //   modalData.splice(0, 0, {
  //     title: t("branch"),
  //     name: "branche_id",
  //     id: 19,
  //     unique: false,
  //     required: false,
  //     validation: () => {},
  //     type: "select",
  //     disable: true,
  //     error: "",
  //     placeholder: branche_name,
  //     class: "report-input input-group",
  //     inputClass: "input-field",
  //   });
  // }

  // modalData.splice(2, 0, {
  //   name: "store",
  //   title: "store",
  //   id: 2,
  //   unique: true,
  //   required: true,
  //   type: "select",
  //   validation: () => {},
  //   getOptions: () => printOptions("show_Store_all", "Store"),
  //   error: "",
  //   class: "report-input input-group",
  //   inputClass: "input-field",
  // });
  const handleNavigate = () => {
    if (dataSource.length > 0) navigate(`/report/`);
  };
  return (
    <div className="page-wrapper">
      <form className="form-wrapper" onSubmit={(e) => handlSubmit(e, "")}>
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onSubmit={(e) => handlSubmit(e, "")}>
          {t("viewRep")}
        </button>
      </form>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        // total={total}
        // perPage={perPage}
        // fetch={fetchLogs}
      />
      <button className="btn" onClick={handleNavigate}>
        {t("print")}
      </button>
    </div>
  );
};

export default StockSummery;

// to={`/report/${1}`}
