/* eslint-disable no-prototype-builtins */
import ReactDOM from "react-dom";
import { AiOutlineIdcard } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import "../../styles/Modal.css";
import { useRef, useState } from "react";
import Form from "../Form/Form";
import { formatDate } from "../../utils/Date";
import { useReactToPrint } from "react-to-print";
// import PDFDocument from "../PDFDocument/PDFDocument";
// import PDFView from "../PDFDocument/PDF";
import { useDispatch } from "react-redux";
import { clearError } from "../../features/table/stockSlice";
// import { clearError } from "../../features/table/builderCases";
// import { clearError } from "../../features/table/clientSlice";
import PDFDocument from "../PDFDocument/PDFDocument";
import { useTranslation } from "react-i18next";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import { MyDocument } from "../PDFDocument/PDFDocument";
// import PDFDocument from './../PDFDocument/PDFDocument';
// import AddPur from './../../pages/AddPur/AddPur';

export default function Modal({
  subs,
  dataSource,
  errors,
  dispatchMethod,
  error,
  updateMethod,
  exludeData,
  setModal,
  modalData,
  setFormData,
  name,
  setErrors,
  data,
  modalType,
  modalValue,
  api,
  secondMethod,
  postLoad,
  inputClass,
  message,
  pro,
  invidiualStyle
}) {
  const [disabled, setDisabled] = useState([]);
  const {t, i18n} = useTranslation()
  const dispatch = useDispatch()
  const [cansel, setCansel]=useState(false)
  // const []
  // const [modal, setModal] = useState({ open: false, type: "" });
  // console.log(modalData)

  // console.log(modalValue.id)

  //formOperation
  const handleCloseModal = (e) => {
    e.preventDefault();
    setCansel(true)
  };

  const handleClose = () => {
    setModal({ open: false, type: "" });
    let reset = { ...data };
    console.log("dataaxlose" ,reset )
    modalData.map((item) => {
      // console.log(item);
      // setError(null)
      setErrors({});
      if (item.type !== "radio") reset[item.name] = "";
      else if (item.type === "radio") reset[item.name] = item.info[0].action;
      // let ele = item.title;
      setFormData({ ...reset });
    });
    if (message) setModal((prev) => ({ ...prev, message: "" }));
    // if (fileName) setFileName("");
    setErrors({});
    dispatch(clearError());
  }

  // const print = (ref) => {
  //   return (
  //     <PDFDocument ref={ref} />
  //   )
  // }

  //modalViews
  const ViewModal = () => {
    // console.log(modalValue)
    const ref= useRef()
    const handlePrint = useReactToPrint({
      content: () => ref.current,
    });
    
    return (
      <>
        <div className="view">
          {modalValue && (
            <>
            <div style={{display: 'none'}}>
              <PDFDocument ref={ref} modalValue={modalValue}/>
            </div>
              <div className="modal-card">
                <p>
                  <AiOutlineIdcard /> {"اسم العميل"}{" "}
                </p>
                <p>{modalValue["customers"].name}</p>
              </div>
              <div className="modal-card">
                <p>
                  <AiOutlineIdcard /> {"الضرائب"}{" "}
                </p>
                <p>{modalValue["tax"]}</p>
              </div>
              <div className="modal-card">
                <p>
                  <AiOutlineIdcard /> {"التاريخ"}{" "}
                </p>
                <p>{formatDate(modalValue["created_at"])}</p>
              </div>
              <div className="modal-card">
                <p>
                  <AiOutlineIdcard /> {"المبلغ بعد الضريبة"}{" "}
                </p>
                <p>{modalValue["total"]}</p>
              </div>
              <div className="modal-card">
                <p>
                  <AiOutlineIdcard /> {"المبلغ قبل الضريبة"}{" "}
                </p>
                <p>{modalValue["sub_total"]}</p>
              </div>
            </>
          )}
        </div>
        <div className="modal-btns">
          {/* <PDFDownloadLink document={<MyDocument />} filename="FORM">
            {({ loading }) =>
              loading ? (
                <button className="confirm" onClick={handlePrint}>
                  برجاء الانتظار
                </button>
              ) : (
                
              )
            }
          </PDFDownloadLink> */}
          <button className="confirm" onClick={() =>handlePrint(ref)}>
            طباعة
          </button>

          <button className="cancel" onClick={handleCloseModal}>
            خروج
          </button>
        </div>
      </>
    );
  };

  // console.log(modalValue)

  return ReactDOM.createPortal(
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="close-modal">
          <span onClick={handleCloseModal}>
            <VscChromeClose />
          </span>
        </div>
        {modalType !== "view" && (
          <Form
          pro={pro}
            subs={subs}
            postLoad={postLoad}
            data={data}
            setFormData={setFormData}
            exludeData={exludeData}
            updateMethod={updateMethod}
            disabled={disabled}
            setDisabled={setDisabled}
            errors={errors}
            setErrors={setErrors}
            dataSource={dataSource}
            dispatchMethod={dispatchMethod}
            name={name}
            // error={error}
            handleCloseModal={handleCloseModal}
            modalData={modalData}
            modalType={modalType}
            modalValue={modalValue}
            setModal={setModal}
            api={api}
            secondMethod={secondMethod}
            inputClass={inputClass}
            message={message}
            invidiualStyle={invidiualStyle}
            
            />
        )}

        {modalType === "view" && <ViewModal />}
        {cansel && (
          <div className="custom-modal-backdrop">
            <div className="cansel-modal">
              <div className="close-modal">
                <span onClick={() => setCansel(false)}>
                  <VscChromeClose />
                </span>
              </div>
              <div className="Cansele">
                <p>{t("wantToLEave")}</p>
                <div className="btns" style={{flexDirection: i18n.language === 'en' ? 'row-reverse' : 'row'}}>
                  <button className="btn dont" onClick={() => setCansel(false)}>
                    {t("cancel")}
                  </button>
                  <button className="btn sure" onClick={handleClose}>
                    {t("confirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
