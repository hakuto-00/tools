const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

buttons.forEach(btn => {
    btn.addEventListener('click', () => handleClick(btn.textContent));
});

function handleClick(value) {
    if (value === 'C') {
        display.textContent = '';
        return;
    }
    if (value === '=') {
        triggerConfetti();
        try {
            display.textContent = eval(display.textContent) || '';
        } catch (e) {
            display.textContent = 'Error';
        }
        return;
    }
    display.textContent += value;
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}
