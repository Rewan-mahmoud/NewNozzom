import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import { VscChromeClose } from "react-icons/vsc";
import { InputField } from "../Input/Inputs";

const AddReason = ({ setModal, setDataa, nestedData, index}) => {
    const [cansel, setCansel] = useState(false);
    const { t, i18n } = useTranslation();
    const [data, setData] = useState({
        reason: '',
        discount: ''
    })
    const [errors, setErrors] = useState({})
    // const []
    console.log(index)
    const handleSubmit = () => {
        const cop = [...nestedData]
        // console.log(cop, index)
        cop[index] = {
          ...cop[index],
          discount: data.discount,
          discounts: [{ reason: data.reason, discount: data.discount }],
        };
        setDataa(cop)
        setModal({ open: false });
        console.log(nestedData)

    }


    // console.log(modalValue.id)

    //formOperation
    const handleCloseModal = (e) => {
      e.preventDefault();
      setModal({ open: false });
    };

    const handleClose = () => {
      setModal({ open: false });
      
    };
  return ReactDOM.createPortal(
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="close-modal">
          <span onClick={handleCloseModal}>
            <VscChromeClose />
          </span>
        </div>

        {/* <form> */}
        <div
          className={"formrapper"}
          style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
        >
          <InputField
            item={{
              name: "discount",
              title: t("discount"),
              style: { gridColumn: "1/2" },
              class: "input-group input-class",
              // inputClass: "input-class",
            }}
            data={data}
            setFormData={setData}
            errors={errors}
            setErrors={setErrors}
          />
          <InputField
            item={{
              name: "reason",
              title: t("Reason"),
              style: { gridColumn: "1/2" },
              class: "input-group input-class",
              // inputClass: "input-class",
            }}
            data={data}
            setFormData={setData}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="modal-btns">
          {Object.keys(errors).length ? (
            <span style={{ color: "red", textAlign: "center" }}>
              {t("warn")}
            </span>
          ) : null}
          <div
            className="btnss"
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
          >
            <button className="confirm" onClick={handleSubmit}>
              {t("confirm")}
            </button>

            <button className="cancel" onClick={handleCloseModal}>
              {t("cancel")}
            </button>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>,
    document.body
  );
};

export default AddReason;
