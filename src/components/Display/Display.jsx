/* eslint-disable react/prop-types */
import { VscChromeClose } from "react-icons/vsc";
import "../../styles/Display.css";

const Display = ({ input, setInput, answer, setModal }) => {
  const onChangeTagInput = (e) => {
    const re = /^[!%(-+\x2D-9^glox\xF7\u221A]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      setInput(e.target.value);
    }
  };

  return (
    <>
      <div className="close-modal" style={{padding: '10px 10px', borderTopLeftRadius: '18px', borderTopRightRadius: '18px', background: 'white'}}>
        <span onClick={() => setModal(false)}>
          <VscChromeClose />
        </span>
      </div>
      <div className="display">
        {answer === "" ? (
          <>
            <input
              type="text"
              name="input"
              className="inputss"
              style={{ padding: "29px" }}
              value={input}
              placeholder="0"
              maxLength={12}
              // disabled
              onChange={onChangeTagInput}
              autoComplete="off"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="input"
              className="value"
              value={input}
              placeholder="0"
              maxLength={12}
              disabled
              style={{ backgroundImage: "unset" }}
            />
            <input
              type="text"
              name="value"
              className="inputss"
              value={answer}
              disabled
              style={{ backgroundImage: "unset" }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Display;
