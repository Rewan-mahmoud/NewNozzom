/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
import { fetchProduct } from "../../features/table/SProductSlice";
import useAll from "../../hooks/useAll";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const {id} = useParams()
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total_purchers_return,
    total_sales_return,
    total_purchers,
    total_sales,
    opening_balancess,
    name,
    totall
  } = useAll("sproduct", fetchProduct, id);
  const { t, i18n } = useTranslation();

  // console.log(totall)
  

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: "رقم السند",
      dataIndex: "num_rec",
      key: "رقم السند",
    },
    {
      title: t('type'),
      dataIndex: "type",
      key: "النوع",
    },
    {
      title: t('quantity'),
      dataIndex: "quantity",
      key: "الكمية",
    },
    {
      title: t('date'),
      dataIndex: "date",
      key: "التاريخ",
    },
  ];
  return (
    <div className="page-wrapper">
      <PageHead
        btn={i18n.language === 'ar' ? "+ اضافة صنف" : "Add product +"}
        placeholder={"ابحث عن صنف"}
        // modal={modal}
        // setModal={setModal}
        totall={totall}
        total_purchers={total_purchers}
        total_purchers_return={total_purchers_return}
        total_sales={total_sales}
        total_sales_return={total_sales_return}
        opening_balancess={opening_balancess}
        name={name}
        searchData={dataSource}
        setDataToFilter={filterData}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        // fetch={fetchProduct}
      />
    </div>
  );
};

export default SingleProduct;
