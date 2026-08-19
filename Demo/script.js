const RATE_USD_TO_THB = 35.45

const amountInput = document.getElementById("amount")
const resultBox = document.getElementById("result-box")
const convertBtn = document.getElementById("convert-btn")
const clearBtn = document.getElementById("clear-btn")

function convertMoney() {

    const rawValue = amountInput.value

    const usd = parseFloat(rawValue)

    if (rawValue === "" || isNaN(usd) || usd < 0) {
        resultBox.textContent = "⚠️ โปรดกรอกจำนวนเงิน"
        return
    }

    const thb = usd * RATE_USD_TO_THB

    const usdFormatted = usd.toLocaleString("th-TH" , { minimumFractionDigits: 2})
    const thbFormatted = thb.toLocaleString("th-TH" , { minimumFractionDigits: 2})

    resultBox.textContent = usdFormatted + " USD = " + thbFormatted + " THB"
}

function clearData() {
    amountInput.value = ""
    resultBox.textContent = "Result"
    amountInput.focus()
}

convertBtn.addEventListener("click" , convertMoney)
clearBtn.addEventListener("click" , clearData)

amountInput.addEventListener("Keydown" , function(Event) {
    if (event.key === "Enter") {
        convertMoney()
    }
})