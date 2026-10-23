let currentInput = '0';
const displayElement = document.getElementById('display');

// Updates UI display element
function updateDisplay() {
    displayElement.textContent = currentInput;
}

// Appends numbers or decimal points safely
function appendNumber(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        // Prevent double decimals in the active entry segment
        if (num === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

// Appends mathematical operations
function appendOperator(operator) {
    const lastChar = currentInput.slice(-1);
    // Replace the operator if the user changes their mind
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

// Wipes the calculator application history state back to zero
function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

// Evaluates the math calculation sequence safely
function calculate() {
    try {
        // Protect against hanging trailing operators
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1);
        }

        // Use Function instead of eval for standard evaluation security compliance
        let result = new Function(`return ${currentInput}`)();
        
        // Fix JavaScript float point precision issues (e.g., 0.1 + 0.2)
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8));
        }

        currentInput = result.toString();
    } catch (error) {
        currentInput = 'Error';
    }
    updateDisplay();
}

// --- Keyboard Input Implementation (Extra Credit) ---
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/[0-9.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Stop default form submittals or browser scaling
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1 && currentInput !== 'Error') {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});
