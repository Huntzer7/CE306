// ดึง Elements จาก HTML มาใช้งาน
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

// ฟังก์ชันเพิ่มรายการใหม่
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: idCounter++,
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: categoryInput.options[categoryInput.selectedIndex].text // เอาชื่อหมวดหมู่พร้อมไอคอน
    };

    transactions.push(transaction);
    updateUI();

    // เคลียร์ค่าในช่องกรอก
    textInput.value = '';
    amountInput.value = '';
    textInput.focus();
}

// ฟังก์ชันอัปเดตหน้าจอ (ตาราง, ยอดเงิน, ค้นหา)
function updateUI() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // โจทย์ที่ 2: Filter ค้นหาแบบ Real-time
    const filteredTransactions = transactions.filter(t => 
        t.text.toLowerCase().includes(searchTerm)
    );

    list.innerHTML = '';

    // โจทย์ที่ 3: แสดงรายการเรียงตามลำดับ (ID, ประเภท, ชื่อ, หมวดหมู่, จำนวนเงิน)
    filteredTransactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add(t.type === 'income' ? 'plus' : 'minus');
        
        const typeText = t.type === 'income' ? 'รายรับ' : 'รายจ่าย';
        const sign = t.type === 'income' ? '+' : '-';

        // โจทย์ที่ 1: แสดงหมวดหมู่ในแท็ก <li>
        li.innerHTML = `
            <div class="li-header">
                <span>ID:${t.id} | ${t.text}</span>
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

// โจทย์ที่ 4: คำนวณยอดเงินรวม
function calculateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;

    // คำนวณจาก transactions ทั้งหมด (ไม่ใช่แค่ที่ค้นหาเจอ)
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

// โจทย์ที่ 5: ล้างข้อมูลทั้งหมดพร้อมแสดง confirm()
function clearAllData() {
    if(transactions.length === 0) {
        alert('ไม่มีข้อมูลให้ล้างครับ');
        return;
    }

    const isConfirmed = confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลประวัติทั้งหมด?\n(ข้อมูลจะถูกลบและยอดเงินจะเป็น ฿0.0)');
    
    if(isConfirmed) {
        transactions = [];
        idCounter = 1;
        searchInput.value = ''; // เคลียร์ช่องค้นหา
        updateUI();
    }
}

// Event Listeners
form.addEventListener('submit', addTransaction);
searchInput.addEventListener('input', updateUI); // ค้นหา Real-time เมื่อมีการพิมพ์
clearBtn.addEventListener('click', clearAllData);

// เริ่มต้นโปรแกรม (แสดงค่า 0)
updateUI();