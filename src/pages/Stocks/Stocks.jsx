import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
// import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import {
  fetchStocks,
  postStock,
  updateStocks,
} from "../../features/table/stockSlice";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { useTranslation } from "react-i18next";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from "react";
import { useRef } from "react";

const Stocks = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("stocks", fetchStocks);
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [data, setData] = useState({
    decription: "",
    date: "",
    items: [],
    branche_id: "",
  });
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({});
  const { role, permissions, token } = useToken();
  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      // console.log(result)
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  const menuRef = useRef();
  const [list, setlist] = useState(false);

  // const handleClick = (i) => {
  //   console.log(i)
  //   if (list === i.id) {
  //     console.log('first')
  //     return setlist(false);
  //   }
  //   setlist(i.id);
  // };
  const handleClick = (e, text) => {
    // console.log('sec')
    e.stopPropagation();
    if (text.id === list) {
      setlist(false);
    } else {
      setlist(text.id);
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setlist(false);
      //  console.log('first')
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const modalData = [
    {
      title: t("desc"),
      name: "decription",
      id: 0,
      // validation: ,
      unique: false,
      required: true,
      validation: () => {},
      type: "text",
      error: "برجاء ادخال حروف عربية",
    },
    {
      title: t("date"),
      name: "date",
      id: 1,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: t("addProQ"),
      name: "items",
      id: 2,
      type: "group",
      child: {
        item: [
          {
            name: "product_id",
            title: t("product"),
            id: 0,
            unique: true,
            required: true,
            type: "select",
            getOptions: () =>
              printOptions("productandservices_purchers", "Products"),
          },
          {
            name: "quantity",
            title: t("quantity"),
            id: 1,
            unique: false,
            required: true,
            type: "text",
          },
          {
            name: "store",
            title: t("store"),
            id: 2,
            getOptions: () => printOptions("show_Store_all", "Store"),
            unique: true,
            required: false,
            type: "select",
          },
        ],
      },
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("desc"),
      dataIndex: "decription",
      key: "الوصف",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "التاريخ",
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions",
      render: (text) => (
        <div className="settCol" style={{ position: "relative" }} ref={menuRef}>
          <div
            onClick={(e) => handleClick(e, text)}
            style={{ cursor: "pointer" }}
          >
            <SlOptionsVertical />
          </div>
          {list && text.id === list && (
            <div className="list-sm">
              <p
                onClick={() => {
                  // setlist(false)
                  if (
                    permissions.includes("opeing_blance_edit") &&
                    role === "employee"
                  ) {
                    setModal({ open: true, type: "edit", data: text });
                  } else if (role === "admin" || role === "company") {
                    setModal({ open: true, type: "edit", data: text });
                  }
                }}
              >
                {t("edit")} <BiEdit />
              </p>
            </div>
          )}
          {/* <button
            className="editBtn"
            onClick={() => setModal({ open: true, type: "edit", data: text })}
          >
            {t("edit")} <BiEdit />
          </button> */}
        </div>
      ),
    },
  ];

  const [options, setOptions] = useState([]);

  if (role === "company") {
    modalData.unshift({
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      // getOptions: () => printOptions("show_branches_all", "Branches"),
      options,
      error: "",
      class: "  input-group ",
    });
  }

  useEffect(() => {
    printOptions("show_branches_all", "Branches").then((res) => {
      // options.push()
      let newOptions = [...options];
      newOptions.push(...res);
      setOptions(res);
    });
  }, []);

  if (loading) return <LoadSpinner />;

  if (!loading) {
    return (
      <div className="page-wrapper">
        <PageHead
          btn={
            (!permissions.includes("opeing_blance_create") &&
              role === "employee") ||
            dataSource.length
              ? false
              : role === "admin" ||
                role === "company" ||
                (role === "employee" && permissions.includes("create_product"))
              ? i18n.language === "ar"
                ? "+ اضافة ارصدة"
                : "Add stock opening ballance +"
              : i18n.language === "ar"
              ? "+ اضافة ارصدة"
              : "Add stock opening ballance +"
          }
          placeholder={
            i18n.language === "ar"
              ? "ابحث عن ارصدة"
              : "Search for stock opening ballance"
          }
          modal={modal}
          setModal={setModal}
          searchData={dataSource}
          setDataToFilter={filterData}
        />

        <Table
          loading={loading}
          dataSource={dataToFilter}
          columns={columns}
          fetch={fetchStocks}
          total={total}
          perPage={perPage}
        />
        {modal.open && (
          <Modal
            postLoad={postLoad}
            // dataSource={dataSource}
            // setModal={setModal}
            // modalData={modalData}
            // setFormData={setData}
            // errors={errors}
            // setErrors={setErrors}
            // data={data}
            dispatchMethod={postStock}
            // modalType={modal.type}
            // modalValue={modal.data}
            // error={error}
            updateMethod={updateStocks}
            dataSource={dataSource}
            setModal={setModal}
            modalData={modalData}
            setFormData={setData}
            errors={errors}
            setErrors={setErrors}
            data={data}
            // dispatchMethod={postClients}
            modalType={modal.type}
            modalValue={modal.data}
            error={error}
            inputClass={"input"}
            invidiualStyle={true}
            // updateMethod={updateClients}
            api={"show_opening_balances"}
          />
        )}
      </div>
    );
  }
};

export default Stocks;
