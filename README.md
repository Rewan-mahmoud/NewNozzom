# Nozzom

this is a documentation for Nozzom frontend most used components, hooks and utils.

## Based Components

A description for most used hooks and components with example.

## Todo

-enhancements

### PageHead

```jsx
import PageHead from "../../components/PageHead/PageHead";

function App() {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("unit", fetchUnit);

  return (
    <PageHead
      btn={"+ اضافة عميل"}
      placeholder={"ابحث عن عميل"}
      modal={modal}
      setModal={setModal}
      searchData={dataSource}
      setDataToFilter={filterData}
    />
  );
}

export default App;
```

### Table

```jsx
import Table from "../../components/Table/Table";

function App() {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("unit", fetchUnit); // useAll hook😂 hook return the data passed to table, the loader, and the pagination data coming from the state management
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: "الاسم باللغة العربية",
      dataIndex: "name_ar",
      key: "الاسم باللغة العربية",
    },
    {
      title: "الاسم باللغة الانجليزية",
      dataIndex: "name_en",
      key: "الاسم باللغة الانجليزية",
    },
    {
      title: "طريقة العرض",
      dataIndex: "unit_shown",
      key: "طريقة العرض",
    },
    {
      title: "اجراء",
      dataIndex: "actions",
      key: "actions",
      render: (text) => (
        <div className="settCol">
          <button
            className="editBtn"
            onClick={() => setModal({ open: true, type: "edit", data: text })} //view the update modal
          >
            تعديل <BiEdit />
          </button>
          <button
            className="viewBtn"
            onClick={() => setModal({ open: true, type: "view", data: text })} //view the view details modal
          >
            عرض <GrView />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={dataToFilter}
      columns={columns}
      total={total}
      perPage={perPage}
      fetch={fetchUnit} // the fetchUnit can take number as a parameter to paginate
    />
  );
}

export default App;
```

### FormModel

```jsx
import Modal from "../../components/Modal/Modal";

function App() {
  const [modal, setModal] = useState({ open: false, type: "", data: null });
    const [data, setData] = useState({
      name_ar: "",
      name_en: "",
      unit_shown: "",
    });

    const modalData = [
      {
        title: "الاسم باللغة العربية",
        name: "name_ar", //name field should be the same as the key in the data object
        id: 0,
        unique: true,
        required: true,
        validation: (value) => {
          if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
            return "يجب ادخال احرف عربية";
          }
        },
        type: "text",
        error: "برجاء ادخال حروف عربية",
      },
      {
        title: "الاسم باللغة الانجليزية",
        name: "name_en",
        id: 1,
        unique: true,
        required: true,
        validation: (value) => {
          if (!/[a-zA-Z ]+$/g.test(value)) {
            return "يجب ادخال احرف انجليزية";
          }
        },
        type: "text",
        error: "برجاء ادخال حروف انجليزية",
      },
      {
        type: "text",
        title: "طريقة العرض",
        name: "unit_shown",
        unique: false,
        required: true,
        id: 2,
        style: {gridColumn: '1/-1'},
        validation: () => {},
        error: "",
      },
    ];

  const [errors, setErrors]= useState({})

  return (
    {modal.open && (
        <Modal
        dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postUnit} // the action when the user click save or create
          modalType={modal.type}
          modalValue={modal.data}
          error={error} // the error that came from the api or the statemanagement
          updateMethod={updateUnit} // the action when the user update
        />
      )}
  )
}

export default App
```
