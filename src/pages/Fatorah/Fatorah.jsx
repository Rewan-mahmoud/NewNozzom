/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { fetchProduct } from "../../features/table/SProductSlice";
import useAll from "../../hooks/useAll";
import { deleteFatorah, fetchFatorah } from "../../features/table/fatorahSlice";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";

const Fatorah = () => {
  const { id } = useParams();
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
  } = useAll("fatorah", fetchFatorah, id);

  const dispatch = useDispatch();
  const {token} = useToken()
  const {t} = useTranslation()
  const handleDelete = (item) => {
    // console.log(item.id)
    dispatch(deleteFatorah({ id: item.id, token: `Bearer ${token}` }));
  };
//   console.log(
//     total_purchers_return,
//     total_sales_return,
//     total_purchers,
//     total_sales,
//     opening_balancess
//   );

// console.log(dataSource)

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t('payAmount'),
      dataIndex: "price",
      key: "سعر السداد",
    },
    {
      title: t('payDate'),
      dataIndex: "created_at",
      key: "تاريخ السداد",
    },
    {
      title: t('notes'),
      dataIndex: "notes",
      key: "الملاحظات",
    },
    {
      title: t('action'),
      dataIndex: "actions",
      key: "actions",
       render: (text) => (
        <button className="delBtn m-auto" onClick={() => handleDelete(text)}>
          <BsFillTrashFill />
        </button>
       )
    },
  ];
  
  return (
    <div className="page-wrapper">
      <PageHead
        // modal={modal}
        // setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        // fetch={fetchFatorah}
      />
    </div>
  );
};

export default Fatorah;
