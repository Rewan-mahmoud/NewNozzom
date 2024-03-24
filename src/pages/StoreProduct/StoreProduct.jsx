/* eslint-disable no-unused-vars */
import { useState } from "react";
import Form from "../../components/Form2/Form";
import { InputField, SelectInput } from "../../components/Input/Inputs";
import { Link, useNavigate } from "react-router-dom";
// import { handleErrors } from "../../utils/submiterr";
import { handleBodyData } from "../../utils/bodyData";
import useToken from "../../hooks/useToken";
import { getOptions } from "../../utils/getOption";
import Table from "../../components/Table/Table";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProReb } from "../../features/table/productReportSlice";
import { useTranslation } from "react-i18next";

const StoreProduct = () => {
  const userData = useSelector((state) => state.auth.data);
  const branche_id = userData?.Branches?.[0]?.id;
  const branche_name = userData?.Branches?.[0]?.name_ar;
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    to_date: "",
    from_date: "",
    product_id: "",
    branche_id: branche_id,
  });
  const [errors, setErrors] = useState({});
  const { token, role } = useToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const modalData = [
    {
      title: t("dateFrom"),
      name: "from_date",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: "report-input input-group",
    },
    {
      title: t("toDate"),
      name: "to_date",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
      class: "report-input input-group",
    },

    {
      title: t("productName"),
      name: "product_id",
      id: 3,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("all_products_stock", "Products"),
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
        // className={"report-input"}
      />
    ),
    text: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
      />
    ),
    date: (item) => (
      <InputField
        item={item}
        key={item.id}
        data={data}
        setFormData={setData}
        errors={errors}
        // className={"report-input"}
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
    {
      title: t("serial"),
      dataIndex: "num_rec",
      key: "رقم التسلسل",
    },
    {
      title: t("branch"),
      dataIndex: "branche_name",
      key: "branches",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "نوع العملية",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "الكمية",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "التاريخ",
    },

    // {
    //   title: "اجراء",
    //   dataIndex: "actions",
    //   key: "actions",
    //   render: (text) => (
    //     <div className="settCol">
    //       <button className="viewBtn" onClick={() => console.log(text)}>
    //         عرض <GrView />
    //       </button>
    //       {/* {Number(text.tranfire) ? null : (
    //       <button className="btn" onClick={() => handleTranfire(text)}>
    //         فاتورة
    //       </button>
    //     )} */}
    //     </div>
    //   ),
    // },
  ];

  if (role === "company") {
    modalData.splice(1, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_branches_all", "Branches"),
      error: "",
      class: "report-input input-group",
      inputClass: "input-field",
    });
  } else {
    modalData.splice(1, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      disable: true,
      error: "",
      placeholder: branche_name,
      class: "report-input input-group",
      inputClass: "input-field",
    });
  }

  modalData.splice(2, 0, {
    name: "store",
    title: "store",
    id: 2,
    unique: true,
    required: true,
    type: "select",
    validation: () => {},
    getOptions: () => printOptions("show_Store_all", "Store"),
    error: "",
    class: "report-input input-group",
    inputClass: "input-field",
  });
  const [dataSource, setDataSource] = useState([]);
  const [footer, setFooter] = useState({
    // lastpricesall: "",
    // lastpricespurchers: "",
    total_quantity: "",
  });

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
    console.log(token);
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
      console.log(body);
      setLoading(true);
      axios
        .post(`${apiUrl}stockitemmovement`, { ...body }, { headers })
        .then((res) => {
          console.log(res.data.data);
          setLoading(false);
          setDataSource(res.data.data.stockitemmovement);
          setFooter({
            // lastpricesall: res.data.data.lastpricesall,
            // lastpricespurchers: res.data.data.lastpricespurchers,
            total_quantity: res.data.data.total_quantity,
          });
          dispatch(addProReb(res.data.data));
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          // dispatch(addProReb(err))
        });
    }
  };

  const handleNavigate = () => {
    if (dataSource.length > 0) navigate(`/report/product`);
  };
  return (
    <div className="page-wrapper">
      <form className="form-wrapper" onSubmit={(e) => handlSubmit(e, "")}>
        {modalData.map((item) => {
          return inputs[`${item.type}`](item);
        })}
        <button className="btn" onClick={(e) => handlSubmit(e)}>
          {t("viewRep")}
        </button>
      </form>
      <Table
        loading={loading}
        dataSource={[...dataSource]}
        columns={columns}
        footer={true}
        footerData={footer}
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

export default StoreProduct;
