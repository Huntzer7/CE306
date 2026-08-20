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

const amountOne = document.getElementById("amount-one")
const amountTwo = document.getElementById("amount-two")
const currencyOne = document.getElementById("currency-one")
const currencyTwo = document.getElementById("currency-two")

let lastEdited = "one"

function convert(amount,fromCurrency, toCurrency) {
    const inUSD = amount / RATES[fromCurrency]
    return inUSD * RATE[toCurrency]
}


amountOne.addEventListener("input" , function() {
    lastEdited = "one"

    const val = parseFloat(amountOne.value)

    if (amountOne.value === "" || isNaN(val)) {
        amountTwo.textContent = "⚠️ โปรดกรอกจำนวนเงิน"
        return
    }

    const result = convert(val, currencyOne.value, currencyTwo.value)
    amountTwo.value = result.toFixed(4)
})

amountTwo.addEventListener("input" , function() {
    lastEdited = "two"

    const val = parseFloat(amountTwo.value)

    if (amountTwo.value === "" || isNaN(val)) {
        amountOne.textContent = "⚠️ โปรดกรอกจำนวนเงิน"
        return
    }

    const result = convert(val, currencyTwo.value, currencyOne.value)
    amountOne.value = result.toFixed(4)
})

currencyOne.addEventListener("change" , function() {
    if (lastEdited === "one" && amountTwo.value) {
        amountTwo.dispatchEvent(new Event("input"))
    }
})