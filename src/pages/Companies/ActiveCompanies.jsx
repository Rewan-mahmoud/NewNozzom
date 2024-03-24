import { useEffect, useRef, useState } from "react";
import useAll from "../../hooks/useAll";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import {
  fetchClients,
  postClients,
  updateClients,
} from "../../features/table/clientSlice";
import "../../styles/Clients.css";
import { BiEdit } from "react-icons/bi";
// import { GrView } from "react-icons/gr";
import "react-select-search/style.css";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslation } from "react-i18next";
import { deActivateCompany, fetchActiveCom } from "../../features/table/activeCompanySlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activated } from "../../features/table/nonActiveCompanySlice";
import axios from "axios";
import { apiUrl } from "../../features/table/billSlice";
import useToken from "../../hooks/useToken";

const ActiveCompanies = () => {
  const { t, i18n } = useTranslation();
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("activeCompany", fetchActiveCom);
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const dispatch = useDispatch()
  const {token} = useToken()

  // console.log(dataSource)
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

  const deactive = async (text) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${apiUrl}noactive_company/${text.id}`, {}, { headers })
      .then((res) => {
        dispatch(deActivateCompany(text.id));
        dispatch(activated(text));
        console.log(res);
      });
    
  }

  // const ref = useClickAway(() => {
  //   setlist(false);
  // });
  // console.log(list)
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: "اسم الشركة",
      dataIndex: "company_name",
      key: "الاسم باللغة العربية",
    },
    {
      title: "هاتف الشركة",
      dataIndex: "company_phone",
      key: "الاسم باللغة الانجليزية",
    },
    {
      title: "عنوان الشركة",
      dataIndex: "company_address",
      key: "رقم الهاتف",
    },
    {
      title: "الرقم الضريبي",
      dataIndex: "tax_number",
      key: "الرقم الضريبي",
    },
    {
      title: "الشهور المتبقية",
      dataIndex: "months",
      key: "نوع المستخدم",
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
              <Link
                to={`/main/add-company/${text.id}`}
                // onClick={() => setModal({ open: true, type: "view", data: text })}
              >
                {t("edit")} <BiEdit />
              </Link>
              {/* <p onClick={() => console.log(text)}>تفعيل وحدة القياس</p> */}
              <p onClick={() => deactive(text)}>الغاء التفعيل</p>
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

  

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          i18n.language === "ar"
            ? "انشاء شركة جديدة +"
            : "Add client or vendor +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن شركة"
            : "Search for client or vendor"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/main/add-company`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchActiveCom}
      />
    </div>
  );
};

export default ActiveCompanies;
