import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

import "./App.css";

export const ACTIONS = {
	ADD_DIGIT: "add-digit",
	CHOOSE_OPERATION: "choose-operation",
	CLEAR: "clear",
	DELETE_DIGIT: "delete-digit",
	EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
	maximunFractionDigits: 0,
});

function formatOperand(operand) {
	if (operand == null) return null;
	const [integer, decimal] = operand.split(",");
	if (decimal == null)
		return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({
	currentOperand,
	previousOperand,
	operation,
}) {
	const previous = parseFloat(previousOperand);
	const current = parseFloat(currentOperand);

	if (isNaN(previous) || isNaN(current)) return "";
	let computation = "";
	switch (operation) {
		case "+":
			computation = previous + current;
			break;
		case "-":
			computation = previous - current;
			break;
		case "*":
			computation = previous * current;
			break;
		case "÷":
			computation = previous / current;
			break;
		default:
			computation = operation;
	}
	return computation.toString();
}

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (
				payload.digit === "0" &&
				state.currentOperand === "0"
			)
				return state;
			if (
				payload.digit === "." &&
				state.currentOperand.includes(".")
			)
				return state;
			if (state.overwrite) {
				return {
					...state,
					currentOperand: payload.digit,
					overwrite: false,
				};
			}
			break;
		case ACTIONS.CHOOSE_OPERATION:
			if (
				state.currentOperand == null &&
				state.previousOperand == null
			) {
				return state;
			}
			if (state.previousOperand == null) {
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: null,
				};
			}
			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}

			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: null,
			};
		case ACTIONS.CLEAR:
			return {};
		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: null,
				};
			}
			if (state.currentOperand == null) return state;
			if (state.currentOperand.length === 1) {
				return {
					...state,
					currentOperand: null,
				};
			}
			break;

		default:
			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			};

		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentOperand == null ||
				state.previousOperand == null
			) {
				return state;
			}
			return {
				...state,
				overwrite: true,
				previousOperand: null,
				operation: null,
				currentOperand: evaluate(state),
			};
	}

	return {
		...state,
		overwrite: true,
		currentOperand: `${state.currentOperand || ""}${
			payload.digit
		}`,
	};
}

export default function App() {
	const [
		{ currentOperand, previousOperand, operation },
		dispatch,
	] = useReducer(reducer, {});

	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operand">
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className="current-operand">
					{formatOperand(currentOperand)}
				</div>
			</div>
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
				AC
			</button>
			<button
				onClick={() =>
					dispatch({ type: ACTIONS.DELETE_DIGIT })
				}>
				DEL
			</button>
			<OperationButton operation="÷" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationButton operation="-" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<button
				className="span-two"
				onClick={() =>
					dispatch({ type: ACTIONS.EVALUATE })
				}>
				=
			</button>
		</div>
	);
}
