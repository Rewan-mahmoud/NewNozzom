/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next';
import Table from '../../components/Table/Table'
import { fetchLogs } from '../../features/table/logSlice';
import useAll from '../../hooks/useAll';
import { Navigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';

const Logs = () => {
    const {
      dataSource,
      dataToFilter,
      loading,
      error,
      filterData,
      total,
      perPage,
    } = useAll("log", fetchLogs);
    const { t, i18n } = useTranslation();
    const { role, permissions } = useToken();

    // console.log(dataSource)

    const columns = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        render: (text) => <span>{text + 1}</span>,
      },
      {
        title: t('customerName'),
        dataIndex: "user_name",
        key: "اسم العميل",
      },
      {
        title: t('type'),
        dataIndex: "log_name",
        key: "النوع",
      },
      {
        title: t('log'),
        dataIndex: "log_type",
        key: "الحدث",
      },
      {
        title: t('date'),
        dataIndex: "log_date",
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

    if (role === "employee" && !permissions.includes("view_list_log")) {
      return <Navigate to="/categorys" />;
    }

  return (
    <div className="page-wrapper">
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        // fetch={fetchProducts}
        total={total}
        perPage={perPage}
        fetch={fetchLogs}
      />
    </div>
  );
}

export default Logs