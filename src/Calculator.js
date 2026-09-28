import React, { useState, useEffect, useCallback } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState(null);

  const calculate = useCallback((previous, current, op) => {
    switch (op) {
      case '+':
        return previous + current;
      case '-':
        return previous - current;
      case '×':
        return previous * current;
      case '÷':
        if (current === 0) return 'Error';
        return previous / current;
      default:
        return current;
    }
  }, []);

  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
    setError(null);
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const performOperation = useCallback((nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const result = calculate(currentValue, inputValue, operator);

      if (result === 'Error') {
        setError('Cannot divide by zero');
        setDisplay('Error');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    setError(null);
  }, [display, operator, previousValue, calculate]);

  const handleEquals = useCallback(() => {
    if (!operator || previousValue === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operator);

    if (result === 'Error') {
      setError('Cannot divide by zero');
      setDisplay('Error');
    } else {
      setDisplay(String(result));
    }

    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, operator, previousValue, calculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (key >= '0' && key <= '9') {
        inputDigit(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+' || key === '-') {
        performOperation(key);
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === 'Backspace') {
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, handleEquals, handleClear, display]);

  const Button = ({ onClick, className, children }) => (
    <button
      onClick={onClick}
      className={`
        ${className}
        h-16 sm:h-20 text-2xl font-semibold rounded-2xl
        transform transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-300
        shadow-lg hover:shadow-xl
        flex items-center justify-center
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Calculator
      </h1>

      {/* Display */}
      <div className="mb-6">
        <div className={`
          bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 text-right
          border-2 border-gray-200
          ${error ? 'from-red-50 to-red-100 border-red-300' : ''}
          transition-all duration-300
        `}>
          <div className="text-xs text-gray-400 h-5 mb-1 font-medium">
            {previousValue !== null ? `${previousValue} ${operator || ''}` : ''}
          </div>
          <div className={`
            text-4xl sm:text-5xl font-bold truncate
            ${error ? 'text-red-600' : 'text-gray-800'}
            transition-colors duration-300
          `}>
            {display}
          </div>
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {/* Row 1 */}
        <Button onClick={handleClear} className="bg-gradient-to-br from-red-500 to-red-600 text-white col-span-2 hover:from-red-600 hover:to-red-700">
          Clear
        </Button>
        <Button onClick={() => performOperation('÷')} className="bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600">
          ÷
        </Button>
        <Button onClick={() => performOperation('×')} className="bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600">
          ×
        </Button>

        {/* Row 2 */}
        <Button onClick={() => inputDigit('7')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          7
        </Button>
        <Button onClick={() => inputDigit('8')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          8
        </Button>
        <Button onClick={() => inputDigit('9')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          9
        </Button>
        <Button onClick={() => performOperation('-')} className="bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600">
          −
        </Button>

        {/* Row 3 */}
        <Button onClick={() => inputDigit('4')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          4
        </Button>
        <Button onClick={() => inputDigit('5')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          5
        </Button>
        <Button onClick={() => inputDigit('6')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          6
        </Button>
        <Button onClick={() => performOperation('+')} className="bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600">
          +
        </Button>

        {/* Row 4 */}
        <Button onClick={() => inputDigit('1')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          1
        </Button>
        <Button onClick={() => inputDigit('2')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          2
        </Button>
        <Button onClick={() => inputDigit('3')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          3
        </Button>
        <Button onClick={handleEquals} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 row-span-2">
          =
        </Button>

        {/* Row 5 */}
        <Button onClick={() => inputDigit('0')} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 col-span-2">
          0
        </Button>
        <Button onClick={inputDecimal} className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300">
          .
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400 text-center mt-6 font-medium">
        ⌨️ Use keyboard: 0-9, +, -, *, /, Enter, Esc
      </p>
    </div>
  );
};

export default Calculator;
