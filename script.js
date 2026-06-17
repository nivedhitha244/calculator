const screen = document.getElementById('screen');
const equationDisplay = document.getElementById('equation');
let displayValue = '';
let evaluated = false;

// Global math functions for the evaluator
window.sin = (deg) => Math.sin(deg * (Math.PI / 180));
window.cos = (deg) => Math.cos(deg * (Math.PI / 180));
window.tan = (deg) => {
    if (deg % 180 === 90 || deg % 180 === -90) return NaN;
    return Math.tan(deg * (Math.PI / 180));
};
window.log = (val) => Math.log10(val);
window.sqrt = (val) => Math.sqrt(val);

function evaluateExpression(expr) {
    let jsExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/²/g, '**2')
        .replace(/√/g, 'sqrt');
    return new Function('return ' + jsExpr)();
}

function updateScreen() {
    equationDisplay.innerText = displayValue;
    if (displayValue === '') {
        screen.value = '0';
        return;
    }
    
    if (evaluated) return;

    try {
        const result = evaluateExpression(displayValue);
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            const cleanResult = Math.round(result * 100000000) / 100000000;
            screen.value = cleanResult.toString();
        }
    } catch (error) {
        // Syntax error (incomplete expression like 'sin('), keep previous result
    }
}

function clearScreen() {
    displayValue = '';
    evaluated = false;
    updateScreen();
}

function deleteLast() {
    if (evaluated) {
        clearScreen();
        return;
    }
    if (displayValue.length > 0) {
        displayValue = displayValue.slice(0, -1);
    }
    updateScreen();
}

function appendValue(val) {
    if (evaluated) {
        // If starting with an operator after equals, continue from result
        if (['+', '-', '×', '÷', '²'].includes(val)) {
            displayValue = screen.value;
        } else {
            displayValue = '';
        }
        evaluated = false;
    }
    
    displayValue += val;
    updateScreen();
}

function calculate() {
    if (evaluated || displayValue === '') return;
    try {
        const result = evaluateExpression(displayValue);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Math Error");
        }
        
        const cleanResult = Math.round(result * 100000000) / 100000000; 
        
        displayValue += ' =';
        equationDisplay.innerText = displayValue;
        screen.value = cleanResult.toString();
        // Set displayValue to the result so further appends continue from it
        displayValue = cleanResult.toString();
        evaluated = true;
    } catch (error) {
        screen.value = 'Error';
        setTimeout(clearScreen, 1500);
    }
}
