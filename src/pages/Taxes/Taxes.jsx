import { BiEdit } from 'react-icons/bi';
import PageHead from '../../components/PageHead/PageHead';
import  Table  from '../../components/Table/Table';
// import { GrView } from 'react-icons/gr';
import { fetchTaxes, postTaxes, updateTaxes } from '../../features/table/taxesSlice';
import useAll from '../../hooks/useAll';
import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useRef } from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import useToken from '../../hooks/useToken';
import { getOptions } from '../../utils/getOption';
// import { useSelector } from 'react-redux';

const Taxes = () => {
  const { t, i18n } = useTranslation();
  // const { language } = useSelector((state) => state.ln);
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad
  } = useAll("taxes", fetchTaxes);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name_ar: "",
    name_en: "",
    vat: "",
    branche_id: ''
  });
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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("arabicName"),
      dataIndex: "name_ar",
      key: "الاسم باللغة العربية",
    },
    {
      title: t("englishName"),
      dataIndex: "name_en",
      key: "الاسم باللغة الانجليزية",
    },
    {
      title: t("vatRate"),
      dataIndex: "vat",
      key: "نسبة الضريبة",
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
                  console.log(text);
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
      title: t("arabicName"),
      name: "name_ar",
      id: 0,
      required: true,
      unique: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
    },
    {
      title: t("englishName"),
      name: "name_en",
      id: 1,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/^[^\u0600-\u06FF]+$/.test(value)) {
          return t("warnEnglish");
        }
      },
      type: "text",
      error: t("warnEnglish"),
    },
    {
      type: "text",
      title: t("vatRate"),
      name: "vat",
      id: 2,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/\d+$/g.test(value)) {
          return t('warnNumber');
        }
      },
      error: "",
    },
  ];

  const { role, permissions, token } = useToken();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="page-wrapper">
      <PageHead
        btn={i18n.language === 'ar' ? "+ اضافة ضريبة" : "Add Tax +"}
        placeholder={i18n.language === 'ar' ? "ابحث عن ضريبة" : "Search for a tax"}
        modal={modal}
        setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
      />
      <Table loading={loading} dataSource={dataToFilter} columns={columns} total={total} perPage={perPage} fetch={fetchTaxes} />
      {modal.open && (
        <Modal 
        postLoad={postLoad}
        dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postTaxes}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          inputClass={'input'}
          updateMethod={updateTaxes}
        />
      )}
    </div>
  );
}

export default Taxes