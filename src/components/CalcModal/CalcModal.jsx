import ReactDOM from "react-dom";
import Calculator from "../Calculator/Calculator";
// import { VscChromeClose } from "react-icons/vsc";

const CalcModal = ({ setModal }) => {
  return ReactDOM.createPortal(
    <Calculator setModal={setModal} />,
    document.body
  );
};

export default CalcModal;
