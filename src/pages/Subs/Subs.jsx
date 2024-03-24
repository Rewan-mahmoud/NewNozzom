import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
// import { GrView } from 'react-icons/gr';
import useAll from "../../hooks/useAll";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useParams } from "react-router-dom";
import { fetchSubs, postSubs, updateSubs } from "../../features/table/subSlice";
// import { useSelector } from 'react-redux';

const Subs = () => {
  const { t, i18n } = useTranslation();
  // const { language } = useSelector((state) => state.ln);
  const {id} = useParams()
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("sub", fetchSubs, id);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    company_id: id,
    strat_date: '',
    end_date: ''
  });
  const menuRef = useRef();
  useEffect(() => {
    setData(prev => ({...prev, company_id: id}))
    // console.log(data)
  }, [])

  // console.log(data)
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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: "بداية الاشتراك",
      dataIndex: "strat_date",
      key: "الاسم باللغة العربية",
    },
    {
      title: 'نهاية الاشتراك',
      dataIndex: "end_date",
      key: "الاسم باللغة الانجليزية",
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
                  // console.log(text);
                  // setlist(false)
                  setModal({ open: true, type: "edit", data: text });
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

  const modalData = [
    {
      title: 'بداية الاشتراك',
      name: "strat_date",
      id: 0,
      required: true,
      unique: false,
      validation: (value) => {},
      type: "date",
      error: t("warnArabic"),
    },
    {
      title: 'نهاية الاشتراك',
      name: "end_date",
      id: 1,
      unique: false,
      required: true,
      validation: (value) => {},
      type: "date",
      error: t("warnEnglish"),
    },
    
  ];

  // console.log(dataSource)

  return (
    <div className="page-wrapper">
      <PageHead
        btn={i18n.language === "ar" ? "+ اضافة اشتراك جديد" : "Add Tax +"}
        placeholder={
          i18n.language === "ar" ? "ابحث عن اشتراك" : "Search for a tax"
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
        total={total}
        perPage={perPage}
        fetch={fetchSubs}
      />
      {modal.open && (
        <Modal
        subs={true}
          postLoad={postLoad}
          dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postSubs}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          inputClass={"input"}
          updateMethod={updateSubs}
        />
      )}
    </div>
  );
};

export default Subs;
