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

let conversionHistory = []

const amountOne = document.getElementById("amount-one")
const amountTwo = document.getElementById("amount-two")
const currencyOne = document.getElementById("currency-one")
const currencyTwo = document.getElementById("currency-two")
const convertBtn = document.getElementById("convert-btn")
const historyList = document.getElementById("history-list")
const historyEmpty = document.getElementById("history-empty")
const historyCount = document.getElementById("history-count")
const clearHistoryBtn = document.getElementById("clear-history-btn")
const clearBtn = document.getElementById("clear-btn")
const resultBox = document.getElementById("result-box")
const rateText = document.getElementById("rate-text")
const updateTime = document.getElementById("update-time")
const swapBtn = document.getElementById("swap-btn")

const DEFAULT_CURRENCY_ONE = "USD"
const DEFAULT_CURRENCY_TWO = "THB"

let lastEdited = "one"

function convert(amount,fromCurrency, toCurrency) {
    const inUSD = amount / RATES[fromCurrency]
    return inUSD * RATES[toCurrency]
}


amountOne.addEventListener("input" , function() {
    lastEdited = "one"

    const val = parseFloat(amountOne.value)

    if (amountOne.value === "" || isNaN(val)) {
        amountTwo.value = ""
        return
    }

    const result = convert(val, currencyOne.value, currencyTwo.value)
    amountTwo.value = result.toFixed(4)
})

amountTwo.addEventListener("input" , function() {
    lastEdited = "two"

    const val = parseFloat(amountTwo.value)

    if (amountTwo.value === "" || isNaN(val)) {
        amountOne.value = ""
        return
    }

    const result = convert(val, currencyTwo.value, currencyOne.value)
    amountOne.value = result.toFixed(4)
})

currencyOne.addEventListener("change" , function() {
    if (lastEdited === "one" && amountOne.value) {
        amountOne.dispatchEvent(new Event("input"))
    }
})

swapBtn.addEventListener("click", function() {
    const tempCurrency = currencyOne.value
    currencyOne.value = currencyTwo.value
    currencyTwo.value = tempCurrency

    const tempAmount = amountOne.value
    amountOne.value = amountTwo.value
    amountTwo.value = tempAmount
})

function addHistory(fromVal, fromCur, toVal, toCur) {
    const item = {
        from: fromVal + " " + fromCur,
        to: toVal + " " + toCur,
        time: getTimeNow()
    }

    conversionHistory.unshift(item)

    if (conversionHistory.length > 10) {
        conversionHistory.pop()
    }

    renderHistory()
}

function renderHistory() {

    historyCount.textContent = conversionHistory.length + "รายการ"

    const oldItems = document.querySelectorAll(".history-item")
    oldItems.forEach(function(el) {
        el.remove()
    })

    if (conversionHistory.length === 0) {
        historyEmpty.style.display = "block"
        return
    }

    historyEmpty.style.display = "none"

    conversionHistory.forEach(function(item) {

        const div = document.createElement("div")
        div.className = "history-item"

        div.innerHTML = 
            '<span class="history-conversion">' +
              item.from +
              '<span class="arrow">→</span>' +
              item.to +
            '</span>' +
            '<span class="history-time">' + item.time + '</span>'
        
        historyList.appendChild(div)
    })
}

function getTimeNow() {
    const now = new Date()

    return now.toLocaleTimeString("th-TH" , {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Bangkok"
    })
}

clearHistoryBtn.addEventListener("click", function() {
    conversionHistory = []
    renderHistory()
})

function getFullTime() {
    const now = new Date()
    
    const date = now.toLocaleDateString("th-TH", {

        timeZone:"Asia/Bangkok",
        day:      "2-digit",
        month:    "2-digit",
        year:     "numeric"
    })

    const time = now.toLocaleTimeString("th-TH", {
        timeZone: "Asia/Bangkok",
        hour:     "2-digit",
        minute:   "2-digit",
        second:   "2-digit",
        hour12:   false 
    })

    return date + " " + time + " (ICT)"
}

function updateTimestamp() {
    updateTime.textContent = getFullTime()
}

updateTimestamp()

setInterval(updateTimestamp, 60000)

convertBtn.addEventListener("click", function() {
    const val = parseFloat(amountOne.value)
    if (!amountOne.value || isNaN(val) || val <= 0) return

    const from = currencyOne.value
    const to = currencyTwo.value
    const result = convert(val, from ,to)

    amountTwo.value = result.toFixed(4)

    const fromFormatted = val.toLocaleString("th-TH" , { minimumFractionDigits: 2})
    const toFormatted = result.toLocaleString("th-TH" , { minimumFractionDigits: 2})
    addHistory(fromFormatted, from, toFormatted, to)
    updateTimestamp()
})

function clearAll() {

    amountOne.value = ""
    amountTwo.value = ""

    currencyOne.value = DEFAULT_CURRENCY_ONE
    currencyTwo.value = DEFAULT_CURRENCY_TWO

    rateText.textContent = "เลือกสกุลเงินเพื่อดูอัตราแลกเปลี่ยน"

    lastEdited = "one"

    updateTime.textContent = "-"

    amountOne.focus()
}

clearBtn.addEventListener("click", clearAll)

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        clearAll()
    }
})
