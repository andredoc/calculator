import './App.css';
import DigiButton from './Components/DigitButton';
import OperationButton from './Components/OperationButton';
import { useReducer } from "react";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-opreation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

const reducer = (state, { type, payload }) => {
  try {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: payload.digit
          }
        }
        if (payload.digit === '0' && state.currentOperand === '0') return state
        if (payload.digit === '.' && state.currentOperand.includes('.')) return state
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`
        }
      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand === undefined && state.previousOperand === undefined) return state
        if (state.currentOperand === undefined) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        if (state.previousOperand === undefined) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: undefined
          }
        }

        return {
          ...state,
          operation: payload.operation,
          previousOperand: evaluate(state),
          currentOperand: undefined
        }
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: undefined
          }
        }

        if (state.currentOperand === undefined) return state
        if (state.currentOperand.length === 1) return { ...state, currentOperand: undefined }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.EVALUATE:
        if (state.previousOperand !== undefined && state.currentOperand !== undefined && state.operation !== undefined) {
          return {
            ...state,
            operation: undefined,
            overwrite: true,
            previousOperand: undefined,
            currentOperand: evaluate(state)
          }
        }
        return state
      default: return state
    }
  } catch (error) {
    throw new Error(error)
  }
}

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  try {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    let result
    switch (operation) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '*':
        result = prev * current
        break
      case '/':
        result = prev / current
        break
      default: return
    }

    return result.toString()
  } catch (error) {
    throw new Error(error)
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0
})

const formatOperand = (operand) => {
  try {
    if (operand === undefined) return
    const [integer, decimal] = operand.split('.')
    if (decimal === undefined) return INTEGER_FORMATTER.format(integer)

    return `${INTEGER_FORMATTER.format(integer)},${INTEGER_FORMATTER.format(decimal)}`
  } catch (error) {
    throw new Error(error)
  }
}

const App =()=> {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation} </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigiButton digit="1" dispatch={dispatch} />
      <DigiButton digit="2" dispatch={dispatch} />
      <DigiButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigiButton digit="4" dispatch={dispatch} />
      <DigiButton digit="5" dispatch={dispatch} />
      <DigiButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigiButton digit="7" dispatch={dispatch} />
      <DigiButton digit="8" dispatch={dispatch} />
      <DigiButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '.' } })} >,</button>
      <DigiButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  )
}

export default App;
