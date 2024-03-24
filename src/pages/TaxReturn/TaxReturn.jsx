import { GrView } from "react-icons/gr";
import Table from "../../components/Table/Table";
import PageHead from "../../components/PageHead/PageHead";

const TaxReturn = () => {
    const dataToFilter = []
    const columns = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        render: (text) => <span>{text + 1}</span>,
      },
      {
        title: "اجمالي المبيعات",
        dataIndex: "user_name",
        key: "اجمالي المبيعات",
      },
      {
        title: "اجمالي المشتريات",
        dataIndex: "log_type",
        key: "اجمالي المشتريات",
      },
      {
        title: "الربع",
        dataIndex: "log_type",
        key: "الربع",
      },
      {
        title: "السنة",
        dataIndex: "log_type",
        key: "السنة",
      },
      {
        title: "صافي الضرائب المستحقة",
        dataIndex: "log_type",
        key: "صافي الضرائب المستحقة",
      },
      {
        title: "اجراء",
        dataIndex: "actions",
        key: "actions",
        render: (text) => (
          <div className="settCol">
            <button className="viewBtn" onClick={() => console.log(text)}>
              عرض <GrView />
            </button>
            {/* {Number(text.tranfire) ? null : (
            <button className="btn" onClick={() => handleTranfire(text)}>
              فاتورة
            </button>
          )} */}
          </div>
        ),
      },
    ];

  return (
    <div className="page-wrapper">
      <PageHead
        btn={"+ اضافة اقرار ضريبي"}
        // placeholder={"ابحث عن سعر"}
        // modal={modal}
        // setModal={setModal}
        // searchData={dataSource}
        // setDataToFilter={filterData}
        navigate={`/add-receipt/add`}
      />
      <Table
        columns={columns}
        dataSource={dataToFilter}
        // loading={loading}
        // total={total}
        // perPage={perPage}
        // fetch={fetchLogs}
      />
    </div>
  );
}

export default TaxReturn