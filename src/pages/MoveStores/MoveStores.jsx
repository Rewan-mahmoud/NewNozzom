import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import Table from "../../components/Table/Table";
// import { GrView } from "react-icons/gr";
import useAll from "../../hooks/useAll";
import {fetchStoresTransfair, postStoreTransfair, updateStoreTransfair } from "../../features/table/moveStoresSlice";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Form from "../../components/Form/Form";
import { useRef } from "react";
import { useSelector } from "react-redux";
// import { apiUrl } from "../../features/table/moveStoresSlice";
import axios from "axios";

const MoveStores = () => {
  const {
    dataSource,
    dataToFilter,
    loading,
    error,
    filterData,
    total,
    perPage,
  } = useAll("storeTransfair",  fetchStoresTransfair);
  const [modal, setModal] = useState({ open: false, type: "", data: null });
 
  const [data, setData] = useState({
    from_store: 0,
    to_store: 0,
    date: "",
    items: [
        {
            product_id: 0,
            quantity: 0,
            transfair_id:0,
        }
    ],
});


const [products, setProducts] = useState([]);
const [quantities, setQuantities] = useState([]);

useEffect(() => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  axios
    .post(
      `https://cashiry.nozzm.com/api/show_store_product_store`,
      {},
      { headers }
    )
    .then((res) => {
      const dataStore = res.data.data.storeTransfair;
      
      const products = dataStore.map(item => ({
        name: item.ar_name, // Change to name_ar
        value: item.id
      }));
      setProducts(products);

      const quantities = dataStore.map(item => ({
        productId: item.id,
        quantity: item.items.length > 0 ? item.items[0].quantity : "" // Assuming quantity is stored in the first item
      }));
      setQuantities(quantities);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
}, []);

  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({});
  const { role, permissions, token } = useToken();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      // console.log(result)
      return result;
    } catch (error) {
      console.error(error);
    }
  }


  const groups = useSelector((state) => state.groups);
  console.log("groups" ,groups)
  const menuRef = useRef();
  const [list, setlist] = useState(false);

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

  const modalData = [
    {
      title: t("fromStore"),
      name: "from_store",
      id: 7,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_groupbranches_all", "Groupbrances") ,
      error: "",
    },
    {
      title: t("toStore"),
      name: "to_store",
      id: 3,
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_groupbranches_all", "Groupbrances") ,
      error: "",
    },
    {
      title: t("date"),
      name: "date",
      id: 4,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
        title: "نقل مخزن",
        name: "items",
        id: 5,
        type: "group",
        child: {
          item:[
            {
              title: t("products"),
              name: "product_id",
              id: 0,
              unique: true,
              required: true,
              type: "select",
             options :products,
              details: true,
       
           
         
            },
            {
              title: t("availableQuantity"),
              name:"quantity",
              id: 6,
              type: "text",                   
              error: "",
              unique: true,
              required: true,
              // style: { gridColumn: "1/2" },
              value: quantities.find(qty => qty.id === products.value)?.quantity || 0 ,// Assuming you have a selectedProductId state to keep track of the selected product

              class: "input-group input-class",
              inputClass: "input-field",
    
             
            },
  
            {
              title: t("transfairProduct"),
              name: "transfair_id",
              id: 1,
              unique: false,
              required: false,
              type: "text",
              details: true,
            },
          
    
          ],
        },
      },
    
   
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("fromStore"),
      dataIndex: "from_store",
      key: "من المخزن",
    },
    {
      title: t("toStore"),
      dataIndex: "to_store",
      key: "الي المخزن",
    },
    {
        title: t('date'),
        dataIndex: "date",
        key: "الكمية",
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
                    // setlist(false)
                    if (
                      permissions.includes("update_customer") &&
                      role === "employee"
                    ) {
                      setModal({ open: true, type: "edit", data: text });
                    } else if (role === "admin" || role === "company") {
                      setModal({ open: true, type: "edit", data: text });
                    }
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



  if (loading) return <LoadSpinner />;

  if (!loading) {
    return (
      <div className="page-wrapper">
        <PageHead
          btn={
            "+  نقل مخزن "
          }
          placeholder={
            i18n.language === "ar"
              ? "ابحث عن المخزن"
              : "Search for store"
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
        fetch={fetchStoresTransfair}
      />
      {modal.open && (
          <Modal
          dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postStoreTransfair}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          updateMethod={updateStoreTransfair}
          inputClass={"input"}
          invidiualStyle={true}
          // custom2={["productandservices_sales", "Products"]}
            // updateMethod={updateClients}
            // api={"show_opening_balances"}
          />
        )}
      </div>
    );
  }
};

export default MoveStores;
