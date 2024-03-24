import { BiEdit } from 'react-icons/bi';
import PageHead from '../../components/PageHead/PageHead';
import  Table  from '../../components/Table/Table';
import { GrView } from 'react-icons/gr';
import { fetchEmployees } from '../../features/table/emplyeeSlice';
import useAll from '../../hooks/useAll';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SlOptionsVertical } from 'react-icons/sl';
import { useTranslation } from 'react-i18next';

const Employee = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
    postLoad,
  } = useAll("emplyee", fetchEmployees);
  const menuRef = useRef();
  const [list, setlist] = useState(false);
  const { t, i18n } = useTranslation();
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
      title: t("companyName"),
      dataIndex: "name",
      key: "اسم الشركة",
    },
    {
      title: t("empName"),
      dataIndex: "name",
      key: "اسم الموظف",
    },
    {
      title: t("empMail"),
      dataIndex: "email",
      key: "البريد الالكتروني للموظف",
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
                to={`/add-employee/${text.id}`}
                // onClick={() => setModal({ open: true, type: "view", data: text })}
              >
                {t("edit")} <BiEdit />
              </Link>
              <p
                onClick={() => {
                  console.log(text);
                  // setlist(false)
                  // setModal({ open: true, type: "edit", data: text });
                }}
              >
                {t("view")} <GrView />
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <PageHead
        btn={
          i18n.language === "ar"
            ? "اضافة موظف +"
            : "Add Employee +"
        }
        placeholder={
          i18n.language === "ar"
            ? "ابحث عن موظف"
            : "Search for employee"
        }
        searchData={dataSource}
        setDataToFilter={filterData}
        navigate={`/add-employee`}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchEmployees}
      />
    </div>
  );
}

export default Employee