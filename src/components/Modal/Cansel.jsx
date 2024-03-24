// import { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Cansel = ({modalType, setCansel}) => {
    
    const navigate = useNavigate();
    const {t} = useTranslation()
    console.log(t("wantToLEave"));

    const handleCloseModal = (e) => {
      e.preventDefault();
    //   console.log(setCansel)
      setCansel(false);
    };

    const handleClose = () => {
      if (modalType === "page") {
        navigate(-1);
      }
    };
  return ReactDOM.createPortal(
    <div className="custom-modal-backdrop">
      <div className="cansel-modal">
        <div className="close-modal">
          <span onClick={handleCloseModal}>
            <VscChromeClose />
          </span>
        </div>
        <div className="Cansele">
          <p>{t("wantToLEave")}</p>
          <div className="btns">
            <button className="btn dont" onClick={handleCloseModal}>
              {t("cansel")}
            </button>
            <button className="btn sure" onClick={handleClose}>
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
