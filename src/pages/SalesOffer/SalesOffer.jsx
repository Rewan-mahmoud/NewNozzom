/* eslint-disable no-prototype-builtins */
import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import {
  deleteOffer,
  fetchOffer,
  handleTranfiree,
  // updateOffer,
} from "../../features/table/salesOfferSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import Modal from "../../components/Modal/Modal";
import { Link, Navigate } from "react-router-dom";
import { BsFillTrashFill } from "react-icons/bs";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../../features/table/billSlice";
import {SlOptionsVertical} from 'react-icons/sl'

const SalesOffer = () => {
  // const [modal, setModal] = useState({ open: false, type: "", data: null });
  const {
    dataSource,
    dataToFilter,
    loading,
    filterData,
    total,
    perPage,
  } = useAll("salesOffer", fetchOffer);
  const dispatch = useDispatch();
  const { token, role, permissions } = useToken();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    date: "",
    files: "",
    invoice_number: "",
    invoice_description: "",
    items: [],
    branche_id: [],
  });

  // const [errors, setErrors] = useState({});

  const handleTranfire = async (body) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let newBody = { ...data };
    let copiedObject = JSON.parse(JSON.stringify(body));
    console.log(newBody, copiedObject)
    Object.keys(copiedObject).map((item) => {
      if (newBody.hasOwnProperty(item)) {
        if (typeof copiedObject[item] === "object" && copiedObject[item] !== null) {
          
          copiedObject[item].map((i) => {
            Object.keys(i).map((e) => i[e] === null && (i[e] = ""));
            // console.log(i)
          });
        }
        if(permissions.includes("zatcaV2")) {
          copiedObject["items"].map((item) => {
            item.discounts = [{ discount: item.discount, reason: item.reason ? item.reason : null }];
            item.taxes = [{ percentage: "" }];
          });
          // console.log(copiedObject["items"]);
          newBody = {
            ...newBody,
            [item]: copiedObject[item],
            save_type: "save_and_confirm",
          };
        } else {
          newBody = {
            ...newBody,
            [item]: copiedObject[item],
            save_type: "save_and_confirm",
          };

        }
      }
    });

    console.log(newBody)
    // let id = body.id;
    // // console.log(newBody)
    // // console.log(id)

    return axios
      .post(`${apiUrl}convert_quotations/${body.id}`, newBody, { headers })
      .then((res) => {
        console.log(res.response.data)
        if (permissions.includes("zatcaV2")) {
          if (res.response.data && res) {
            // let reset = { ...data };
            if (res.response.data.status) {
              // setBtnLoad(false);
              if (res.response.data.status === "WARNING") {
                console.log("warn");

                res.response.data.warningMessages.map((item) => {
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
              if (res.response.data.status === "PASS") {
                // console.log(res.payload);
                // toast.success('hoii')
                //b2b clearanceStatus
                toast.success(
                  invoiceType === "B2B"
                    ? res.response.data.clearanceStatus
                    : res.response.data.reportingStatus,
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
                // setTimeout(() => {
                //   if (uri) navigate(uri);
                // }, [5000]);
              }
              if (res.response.data.status === "ERROR") {
                res.response.data.warningMessages.map((item) => {
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
                res.response.data.errorMessages.map((item) => {
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
              // setBtnLoad(false);
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
              // setTimeout(() => {
              //   if (uri) navigate(uri);
              // }, [5000]);
            }
            // console.log(reset)
            // info.map((item) => {
            //   // console.log(item)
            //   setErrors({});
            //   if (item.type !== "radio") reset[item.name] = "";
            //   // let ele = item.title;
            //   setFormData({ ...reset });
            // });
            // console.log(res.payload);
          } else {
            console.log("err");
          }
          dispatch(handleTranfiree(id));
        } else {
          dispatch(handleTranfiree(id));
        }
      })
      .catch((err) => console.log(err));
  };


  const menuRef = useRef()
   const [list, setlist] = useState(false)

     const handleClick = (e,text) => {
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

  const handleDelete = (item) => {
    // console.log(item.id)
    dispatch(deleteOffer({ id: item.id, token }));
  };
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("invoiceNumber"),
      dataIndex: "invoice_number",
      key: "رقم الفاتورة",
    },
    {
      title: t("customerName"),
      dataIndex: "customers.name",
      key: "اسم العميل",
    },
    {
      title: t("branch"),
      dataIndex:"branches.name_ar",
      key: "branches",
    },
    {
      title: t("invoiceDate"),
      dataIndex: "date",
      key: "تاريخ الفاتورة",
    },
    {
      title: t("invoiceType"),
      dataIndex: "paymentType",
      key: "نوع الفاتورة",
    },
    {
      title: t("subTotal"),
      dataIndex: "sub_total",
      key: "المجموع الفرعي",
    },
    {
      title: t("vatAmount"),
      dataIndex: "tax",
      key: "قيمة الضريبة",
    },
    {
      title: t("totall"),
      dataIndex: "total",
      key: "المجموع الكلي",
    },
    {
      title: "حالة العرض",
      dataIndex: "tranfire",
      key: "حالة العرض",
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
              
              {role === "employee" &&
              permissions.includes("edit_price_offers") &&
              !Number(text.tranfire) ? (
                <Link to={`/add-receipt/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : (role === "admin" || role === "company") &&
                !Number(text.tranfire) ? (
                <Link to={`/add-receipt/edit/${text.id}`}>
                  {t("edit")} <BiEdit />
                </Link>
              ) : null}
              {role === "employee" &&
              permissions.includes("delete_price_offers") &&
              !Number(text.tranfire) ? (
                <p onClick={() => handleDelete(text)}>
                  {t("delete")}
                  <BsFillTrashFill />
                </p>
              ) : (role === "admin" || role === "company") &&
                !Number(text.tranfire) ? (
                <p onClick={() => handleDelete(text)}>
                  {t("delete")}
                  <BsFillTrashFill />
                </p>
              ) : null}
              {Number(text.tranfire) ? null : (
                <p onClick={() => handleTranfire(text)}>{t("invoice")}</p>
              )}
              {role === "employee" &&
              permissions.includes("view_price_offers") ? (
                <Link to={`/report/preview-sales/${text.id}/quotations`}>
                  {t("view")} <GrView />
                </Link>
              ) : role === "admin" || role === "company" ? (
                <Link to={`/report/preview-sales/${text.id}/quotations`}>
                  {t("view")} <GrView />
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ),
    },
  ];

  if (role === "employee" && !permissions.includes("price_offers")) {
    return <Navigate to="/categorys" />;
  }

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          !permissions.includes("add_price_offers") && role === "employee"
            ? false
            : role === "admin" ||
              role === "company" ||
              (role === "employee" && permissions.includes("add_price_offers"))
            ? i18n.language === "ar"
              ? "+ اضافة عرض سعر"
              : "Add qoutation +"
            : i18n.language === "ar"
            ? "+ اضافة عرض سعر"
            : "Add qoutation +"
        }
        placeholder={
          i18n.language === "ar" ? "ابحث عن سعر" : "Search for quotations"
        }
        // modal={modal}
        // setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-receipt/add`}
      />

      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchOffer}
      />
    </div>
  );
};

export default SalesOffer;
