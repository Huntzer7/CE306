const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const list = document.getElementById('list');
const searchInput = document.getElementById('search');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('money-plus');
const expenseEl = document.getElementById('money-minus');
const clearBtn = document.getElementById('clear-btn');

let transactions = [];
let idCounter = 1;

function addTransaction(e) {
    e.preventDefault();
    const transaction = {
        id: idCounter++,
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: categoryInput.options[categoryInput.selectedIndex].text
    };

    transactions.push(transaction);
    updateUI();

    textInput.value = '';
    amountInput.value = '';
    textInput.focus();
}

function updateUI() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTransactions = transactions.filter(t => t.text.toLowerCase().includes(searchTerm));
    
    list.innerHTML = '';
    filteredTransactions.forEach(t => {
        const li = document.createElement('li');

        li.classList.add(t.type === 'income' ? 'plus' : 'minus');
        const typeText = t.type === 'income' ? 'รายรับ' : 'รายจ่าย';
        const sign = t.type === 'income' ? '+' : '-';

        li.innerHTML = `
            <div class="li-header">
                <span> ID:${t.id} | ${t.text}</span>
                <span>${sign}฿${t.amount.toFixed(2)}</span>    
            </div>
            <div class="li-details">
                <span>ประเภท: ${typeText}</span>
                <span>หมวดหมู่: ${t.category}</span>
            </div>
        `;
        list.appendChild(li);
    });

    calculateTotals();
}

function calculateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if(t.type === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    const netBalance = totalIncome - totalExpense;

    balanceEl.innerText = `฿${netBalance.toFixed(2)}`;
    incomeEl.innerText = `+฿${totalIncome.toFixed(2)}`;
    expenseEl.innerText = `-฿${totalExpense.toFixed(2)}`;
}

function clearAllData() {
    if(transactions.length === 0) {
        alert('ไม่มีข้อมูลให้ล้างนะจ๊ะ');
        return;
    }

    const isConfirmed = confirm('กด ยืนยัน ถ้าต้องการล้างข้อมูลประวัติทั้งหมด');


    if(isConfirmed) {
        transactions = [];
        idCounter = 1;
        searchInput.value = '';
        updateUI();
    }
}

form.addEventListener('submit' , addTransaction);
searchInput.addEventListener('input', updateUI);
clearBtn.addEventListener('click', clearAllData);

updateUI();