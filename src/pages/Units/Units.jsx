// import { GrView } from 'react-icons/gr';
import PageHead from '../../components/PageHead/PageHead';
import  Table  from '../../components/Table/Table';
import { BiEdit } from 'react-icons/bi';
import { useState } from 'react';
import { fetchUnit, postUnit, updateUnit } from '../../features/table/unitSlice';
import Modal from '../../components/Modal/Modal';
import useAll from '../../hooks/useAll';
import { useTranslation } from 'react-i18next';
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from 'react';
import { useRef } from 'react';
import useToken from '../../hooks/useToken';
import { getOptions } from '../../utils/getOption';
import { Switch, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

const Units = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  // const { language } = useSelector((state) => state.ln);
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    postLoad,
    perPage,
  } = useAll("unit", fetchUnit);
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
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    // console.log(event)
    if (event.active) {
      dispatch(updateUnit({ body: event, token }));
    } else {
      dispatch(postUnit({body: event, token}));
    }
  };

  // useEffect(() => {
  //   window.addEventListener("click", handleOutsideClick);

  //   return () => {
  //     window.removeEventListener("click", handleOutsideClick);
  //   };
  // }, []);
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
        title: t("disName"),
        dataIndex: "unit_shown",
        key: "طريقة العرض",
      },
      {
        title: t("action"),
        dataIndex: "actions",
        key: "actions",
        render: (text) => (
          // <div
          //   className="settCol"
          //   style={{ position: "relative" }}
          //   ref={menuRef}
          // >
          //   <div
          //     onClick={(e) => handleClick(e, text)}
          //     style={{ cursor: "pointer" }}
          //   >
          //     <SlOptionsVertical />
          //   </div>
          //   {list && text.id === list && (
          //     <div className="list-sm">
          //       <p
          //         onClick={() => {
          //           console.log(text);
          //           // setlist(false)
          //           setModal({ open: true, type: "edit", data: text });
          //         }}
          //       >
          //         {t("edit")} <BiEdit />
          //       </p>
          //     </div>
          //   )}
          //   {/* <button
          //   className="editBtn"
          //   onClick={() => setModal({ open: true, type: "edit", data: text })}
          // >
          //   {t("edit")} <BiEdit />
          // </button> */}
          // </div>
          <Tooltip placement='top' title={text.active ? 'الغاء التفعيل' : 'تفعيل'}>
            <Switch
              checked={text.active}
              onChange={() => handleChange(text)}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Tooltip>
        ),
      },
    ];

    const [modal, setModal] = useState({ open: false, type: "", data: null });
    const [data, setData] = useState({
      name_ar: "",
      name_en: "",
      unit_shown: "",
      branche_id: ''
    });

    const modalData = [
      {
        title: t('arabicName'),
        name: "name_ar",
        id: 0,
        // validation: ,
        unique: true,
        required: true,
        validation: (value) => {
          if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
            return t('warnArabic');
          }
        },
        type: "text",
        error: t('warnArabic'),
      },
      {
        title: t('englishName'),
        name: "name_en",
        id: 1,
        unique: true,
        required: true,
        validation: (value) => {
          if (!/^[^\u0600-\u06FF]+$/.test(value)) {
            return t('warnEnglish');
          }
        },
        type: "text",
        error: t('warnEnglish'),
      },
      {
        type: "text",
        title: t('disName'),
        name: "unit_shown",
        unique: false,
        required: true,
        id: 2,
        style: { gridColumn: "1/-1" },
        validation: () => {},
        error: "",
      },
    ];

    const [errors, setErrors] = useState({});
    const { role, permissions, token } = useToken();

    async function printOptions(path, output) {
      try {
        const result = await getOptions(path, output, token);
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    if (role === "company") {
      modalData.unshift({
        title: t("branch"),
        name: "branche_id",
        id: 19,
        unique: false,
        required: false,
        validation: () => {},
        type: "select",
        getOptions: () => printOptions("show_branches_all", "Branches"),
        error: "",
        style: { gridColumn: "1/-1" },
      });
    }

  return (
    <div className="page-wrapper">
      <PageHead
        // btn={i18n.language === 'ar' ? "+ اضافة وحدة قياس" : "Add unite +"}
        placeholder={i18n.language === 'ar' ? "ابحث عن وحدة قياس" : 'Search for unite'}
        // modal={modal}
        // setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchUnit}
      />
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
          dispatchMethod={postUnit}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          inputClass={"input"}
          updateMethod={updateUnit}
        />
      )}
    </div>
  );
}

export default Units