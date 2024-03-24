/* eslint-disable react/prop-types */
import "../../styles/Buttons.css";

const Buttons = ({
  inputHandler,
  clearInput,
  backspace,
  changePlusMinus,
  calculateAns,
}) => {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("equalbtn").click();
    }
  });

  return (
    <div className="show-btn">
      <button className="btnc clr" onClick={clearInput}>
        AC
      </button>
      <button className="btncc exp"></button>
      <button className="btncc exp"></button>
      <button className="btnc clr" onClick={backspace}>
        ⌫
      </button>

      {/* <button className="btnc exp" onClick={inputHandler}>
        %
      </button> */}
      <button className="btnc" onClick={inputHandler}>
        7
      </button>
      <button className="btnc" onClick={inputHandler}>
        8
      </button>
      <button className="btnc" onClick={inputHandler}>
        9
      </button>
      <button className="btnc exp" onClick={inputHandler}>
        ÷
      </button>

      {/* <button className="btnc exp" onClick={inputHandler}>
        x<sup>3</sup>
      </button> */}
      <button className="btnc" onClick={inputHandler}>
        4
      </button>
      <button className="btnc" onClick={inputHandler}>
        5
      </button>
      <button className="btnc" onClick={inputHandler}>
        6
      </button>
      <button className="btnc exp" onClick={inputHandler}>
        x
      </button>

      {/* <button className="btnc exp" onClick={inputHandler}>
        <sup>3</sup>√
      </button> */}
      <button className="btnc" onClick={inputHandler}>
        1
      </button>
      <button className="btnc" onClick={inputHandler}>
        2
      </button>
      <button className="btnc" onClick={inputHandler}>
        3
      </button>
      <button className="btnc exp" onClick={inputHandler}>
        -
      </button>

      {/* <button className="btnc exp" onClick={inputHandler}>
        !
      </button> */}
      <button className="btnc" onClick={inputHandler}>
        0
      </button>
      <button className="btnc exp" onClick={inputHandler}>
        .
      </button>

      {/* <button className="btnc exp" onClick={changePlusMinus}>
        
      </button> */}
      <button className="btnc exp" onClick={changePlusMinus}>
        ±
      </button>
      <button className="btnc exp" onClick={inputHandler}>
        +
      </button>
      <button className="btnc exp equal" id="equalbtn" onClick={calculateAns}>
        =
      </button>
    </div>
  );
};

export default Buttons;
