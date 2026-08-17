// ========================================
// EXCHANGE RATES (base: USD)
// ========================================
const RATES = {
  USD: 1,
  THB: 35.45,
  EUR: 0.922,
  GBP: 0.786,
  JPY: 149.82,
  CNY: 7.24,
  KRW: 1328.5,
  SGD: 1.342,
  AUD: 1.531,
  HKD: 7.824,
  MYR: 4.695
};

// ========================================
// STATE
// ========================================
let conversionHistory = [];
let lastEdited = 'one';

// ========================================
// DOM ELEMENTS
// ========================================
const amountOne       = document.getElementById('amount-one');
const amountTwo       = document.getElementById('amount-two');
const currencyOne     = document.getElementById('currency-one');
const currencyTwo     = document.getElementById('currency-two');
const resultText      = document.getElementById('result-text');
const resultPlaceholder = document.getElementById('result-placeholder');
const rateText        = document.getElementById('rate-text');
const updateTime      = document.getElementById('update-time');
const directionHint   = document.getElementById('direction-hint');
const historyList     = document.getElementById('history-list');
const historyEmpty    = document.getElementById('history-empty');
const historyCount    = document.getElementById('history-count');

// ========================================
// CORE FUNCTIONS
// ========================================

/**
 * แปลงจำนวนเงินจากสกุล from → to
 */
function convert(amount, from, to) {
  if (from === to) return amount;
  const inUSD = amount / RATES[from];
  return inUSD * RATES[to];
}

/**
 * จัดรูปแบบตัวเลขตามสกุลเงิน
 */
function formatAmount(value, currency) {
  if (currency === 'JPY' || currency === 'KRW') {
    return Math.round(value).toLocaleString('th-TH');
  }
  return parseFloat(value.toFixed(4)).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
}

/**
 * คำนวณอัตราแลกเปลี่ยน 1 หน่วย
 */
function getRate(from, to) {
  return convert(1, from, to);
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

/**
 * อัปเดตแถบแสดงอัตราแลกเปลี่ยน
 */
function updateRateDisplay() {
  const from = currencyOne.value;
  const to   = currencyTwo.value;
  const rate     = getRate(from, to);
  const rateBack = getRate(to, from);

  rateText.innerHTML =
    `<strong>1 ${from}</strong> = <strong>${formatAmount(rate, to)} ${to}</strong>` +
    ` &nbsp;|&nbsp; ` +
    `<strong>1 ${to}</strong> = <strong>${formatAmount(rateBack, from)} ${from}</strong>`;
}

/**
 * โจทย์ที่ 4: อัปเดตเวลาที่แสดงผล (เวลาไทย ICT)
 */
function updateTimestamp() {
  const now = new Date();
  const formatted = now.toLocaleString('th-TH', {
    timeZone:  'Asia/Bangkok',
    year:      'numeric',
    month:     '2-digit',
    day:       '2-digit',
    hour:      '2-digit',
    minute:    '2-digit',
    second:    '2-digit',
    hour12:    false
  });
  updateTime.textContent = formatted + ' (ICT)';
}

/**
 * แสดงผลลัพธ์ในกล่องผลลัพธ์
 */
function showResult(fromVal, fromCur, toVal, toCur) {
  resultPlaceholder.style.display = 'none';
  resultText.style.display = 'block';
  resultText.textContent =
    `${formatAmount(fromVal, fromCur)} ${fromCur} = ${formatAmount(toVal, toCur)} ${toCur}`;
}

/**
 * โจทย์ที่ 3: ล้างช่องกรอกและคืนสถานะเริ่มต้น
 */
function clearAll() {
  amountOne.value = '';
  amountTwo.value = '';

  resultPlaceholder.style.display = 'block';
  resultText.style.display = 'none';

  rateText.textContent = 'เลือกสกุลเงินเพื่อดูอัตราแลกเปลี่ยน';
  updateTime.textContent = '—';
  directionHint.textContent = 'พิมพ์ในช่องใดช่องหนึ่งเพื่อแปลงสองทิศทาง';

  currencyOne.value = 'USD';
  currencyTwo.value = 'THB';
  lastEdited = 'one';

  updateRateDisplay();
}

// ========================================
// โจทย์ที่ 2: HISTORY FUNCTIONS
// ========================================

/**
 * เพิ่มรายการประวัติ (เก็บสูงสุด 10 รายการ)
 */
function addHistory(fromVal, fromCur, toVal, toCur) {
  const now     = new Date();
  const timeStr = now.toLocaleTimeString('th-TH', {
    hour:     '2-digit',
    minute:   '2-digit',
    second:   '2-digit',
    hour12:   false,
    timeZone: 'Asia/Bangkok'
  });
  const dateStr = now.toLocaleDateString('th-TH', {
    day:      '2-digit',
    month:    '2-digit',
    timeZone: 'Asia/Bangkok'
  });

  conversionHistory.unshift({
    from: `${formatAmount(fromVal, fromCur)} ${fromCur}`,
    to:   `${formatAmount(toVal, toCur)} ${toCur}`,
    time: `${dateStr} ${timeStr}`
  });

  if (conversionHistory.length > 10) {
    conversionHistory.pop();
  }

  renderHistory();
}

/**
 * วาดรายการประวัติใหม่ทั้งหมด
 */
function renderHistory() {
  historyCount.textContent = `${conversionHistory.length} รายการ`;

  // ลบรายการเก่าออกก่อน
  document.querySelectorAll('.history-item').forEach(el => el.remove());

  if (conversionHistory.length === 0) {
    historyEmpty.style.display = 'block';
    return;
  }

  historyEmpty.style.display = 'none';

  conversionHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <span class="history-conversion">
        ${item.from}<span class="arrow">→</span>${item.to}
      </span>
      <span class="history-time">${item.time}</span>
    `;
    historyList.appendChild(div);
  });
}

// ========================================
// โจทย์ที่ 1: BIDIRECTIONAL CONVERSION
// ========================================

/**
 * เมื่อพิมพ์ในช่องต้นทาง → คำนวณไปปลายทาง
 */
amountOne.addEventListener('input', () => {
  lastEdited = 'one';
  if (amountOne.value === '') {
    amountTwo.value = '';
    resultPlaceholder.style.display = 'block';
    resultText.style.display = 'none';
    directionHint.textContent = 'พิมพ์ในช่องใดช่องหนึ่งเพื่อแปลงสองทิศทาง';
    return;
  }
  const val = parseFloat(amountOne.value);
  if (isNaN(val) || val < 0) return;

  const result = convert(val, currencyOne.value, currencyTwo.value);
  amountTwo.value = result.toFixed(4);
  directionHint.textContent = '↑ คำนวณจากช่องต้นทาง → ปลายทาง';
  showResult(val, currencyOne.value, result, currencyTwo.value);
});

/**
 * เมื่อพิมพ์ในช่องปลายทาง → คำนวณย้อนกลับมาต้นทาง
 */
amountTwo.addEventListener('input', () => {
  lastEdited = 'two';
  if (amountTwo.value === '') {
    amountOne.value = '';
    resultPlaceholder.style.display = 'block';
    resultText.style.display = 'none';
    directionHint.textContent = 'พิมพ์ในช่องใดช่องหนึ่งเพื่อแปลงสองทิศทาง';
    return;
  }
  const val = parseFloat(amountTwo.value);
  if (isNaN(val) || val < 0) return;

  const result = convert(val, currencyTwo.value, currencyOne.value);
  amountOne.value = result.toFixed(4);
  directionHint.textContent = '↓ คำนวณย้อนกลับจากช่องปลายทาง → ต้นทาง';
  showResult(val, currencyTwo.value, result, currencyOne.value);
});

/**
 * เมื่อเปลี่ยนสกุลเงินต้นทาง → คำนวณใหม่
 */
currencyOne.addEventListener('change', () => {
  updateRateDisplay();
  if (lastEdited === 'one' && amountOne.value) {
    amountOne.dispatchEvent(new Event('input'));
  } else if (lastEdited === 'two' && amountTwo.value) {
    amountTwo.dispatchEvent(new Event('input'));
  }
});

/**
 * เมื่อเปลี่ยนสกุลเงินปลายทาง → คำนวณใหม่
 */
currencyTwo.addEventListener('change', () => {
  updateRateDisplay();
  if (lastEdited === 'one' && amountOne.value) {
    amountOne.dispatchEvent(new Event('input'));
  } else if (lastEdited === 'two' && amountTwo.value) {
    amountTwo.dispatchEvent(new Event('input'));
  }
});

// ========================================
// BUTTON EVENTS
// ========================================

/** ปุ่มแปลงสกุลเงิน → บันทึกประวัติด้วย */
document.getElementById('convert-btn').addEventListener('click', () => {
  const val = parseFloat(amountOne.value);

  if (!amountOne.value || isNaN(val) || val <= 0) {
    amountOne.focus();
    amountOne.style.outline = '2px solid #111111';
    setTimeout(() => { amountOne.style.outline = ''; }, 1000);
    return;
  }

  const from   = currencyOne.value;
  const to     = currencyTwo.value;
  const result = convert(val, from, to);

  amountTwo.value = result.toFixed(4);
  showResult(val, from, result, to);
  addHistory(val, from, result, to);
  updateTimestamp();
});

/** ปุ่มสลับสกุลเงิน */
document.getElementById('swap-btn').addEventListener('click', () => {
  const tempCur = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = tempCur;

  const tempAmt = amountOne.value;
  amountOne.value = amountTwo.value;
  amountTwo.value = tempAmt;

  updateRateDisplay();

  if (amountOne.value) {
    const val    = parseFloat(amountOne.value);
    const result = convert(val, currencyOne.value, currencyTwo.value);
    amountTwo.value = result.toFixed(4);
    showResult(val, currencyOne.value, result, currencyTwo.value);
  }
});

/** โจทย์ที่ 3: ปุ่มล้างข้อมูล */
document.getElementById('clear-btn').addEventListener('click', clearAll);

/** ปุ่มล้างประวัติ */
document.getElementById('clear-history-btn').addEventListener('click', () => {
  conversionHistory = [];
  renderHistory();
});

// ========================================
// INIT
// ========================================
updateRateDisplay();
updateTimestamp();

// โจทย์ที่ 4: อัปเดตเวลาอัตโนมัติทุก 1 นาที
setInterval(updateTimestamp, 60000);