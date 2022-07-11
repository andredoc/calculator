import './App.css';
import { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

function App() {

  const [preValue, setPreValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [screen, setScreen] = useState("0");
  const [operator, setOperator] = useState(null);
  const [total, setTotal] = useState(false);

  const inputNum = (evt) => {
    if (currentValue.includes(".") && evt.target.innerText === ".") return;

    if (total) {
      setPreValue("");
    }

    currentValue 
      ? setCurrentValue((pre) => pre + evt.target.innerText) 
      : setCurrentValue(evt.target.innerText);
    setTotal(false);
  }

  useEffect(() => {
    setScreen(currentValue);
  }, [currentValue]);

  useEffect(()=>{
    setScreen("0");
  }, []);

  const operatorType = (evt) => {
    setTotal(false);
    setOperator(evt.target.innerText);
    if (currentValue === "") return;
    if(preValue !== "") {
      equals();
    } else {
      setPreValue(currentValue);
      setCurrentValue("");
      }
  };

  const equals = (evt) => { 
    if(evt?.target.innerText === "="){ 
      setTotal(true);
    }

    let calculate;
    switch (operator) {
      case "/":
        calculate = String(parseFloat(preValue) / parseFloat(currentValue));
        break;
      case "X":
        calculate = String(parseFloat(preValue) * parseFloat(currentValue));
        break;
      case "-":
        calculate = String(parseFloat(preValue) - parseFloat(currentValue));
        break;
      case "+":
        calculate = String(parseFloat(preValue) + parseFloat(currentValue));
        break;
        default:
          return
    }
    setScreen("");
    setPreValue(calculate);
    setCurrentValue("");
  }

  const minusPlus = () => {
    if(currentValue.charAt(0) === "-"){
      setCurrentValue(currentValue.substring(1));
    } else {
      setCurrentValue("-" + currentValue);
    }
  };

  const percent = () => {
    preValue
      ? setCurrentValue(String((parseFloat(currentValue)/100)*preValue))
      : setCurrentValue(String(parseFloat(currentValue) / 100));
  };

  const reset = (() => { 
    setPreValue("");
    setCurrentValue("");
    setScreen("0");
  })

  return (
    <div className='calculator'>
      <div className='wrapper'>
        <div className='screenView'> 
          {(screen !== "" || screen === "0") ? 
            (
              <NumberFormat
                value={screen}
                displayType={"text"}
                thousandSeparator={true}
              />
            ) 
            : 
            (
              <NumberFormat
                value={preValue}
                displayType={"text"}
                thousandSeparator={true}
              />
            )
          }
        </div>
        <div className='btn blue' onClick={reset}>AC</div>
        <div className='btn pink' onClick={minusPlus}>+/-</div>
        <div className='btn pink' onClick={percent}>%</div>
        <div className='btn orange' onClick={operatorType}>/</div>
        <div className='btn gray' onClick={inputNum}>7</div>
        <div className='btn gray' onClick={inputNum}>8</div>
        <div className='btn gray' onClick={inputNum}>9</div>
        <div className='btn orange' onClick={operatorType}>X</div>
        <div className='btn gray' onClick={inputNum}>4</div>
        <div className='btn gray' onClick={inputNum}>5</div>
        <div className='btn gray' onClick={inputNum}>6</div>
        <div className='btn orange' onClick={operatorType}>-</div>
        <div className='btn gray' onClick={inputNum}>1</div>
        <div className='btn gray' onClick={inputNum}>2</div>
        <div className='btn gray' onClick={inputNum}>3</div>
        <div className='btn orange' onClick={operatorType}>+</div>
        <div className='btn zero' onClick={inputNum}>0</div>
        <div className='btn gray' onClick={inputNum}>.</div>
        <div className='btn gray' onClick={equals}>=</div>
      </div>
    </div>
  );
}

export default App;
