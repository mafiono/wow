import Vue from "vue";

Vue.filter("capitalize", (value) => {
  if (!value) return "";
  value = value.toString().toLowerCase(); // eslint-disable-line no-param-reassign
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("formatDate", (date) => {
  const d = date.substring(0, 2);
  const m = date.substring(3, 5);
  const y = date.substring(6, 10);
  const newDate = new Date(y, m - 1, d);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return newDate.toLocaleDateString("en-US", options);
});

Vue.filter("getTimeFromDateTime", (date) => {
  if (!date) return "";
  const d = date.substring(0, 2);
  const m = date.substring(3, 5);
  const y = date.substring(6, 10);
  const time = date.substring(11, 19);
  const newDate = new Date(`${y}-${m}-${d}T${time}`);
  return newDate.toLocaleTimeString("en-US");
});

Vue.filter("formatMoney", (amount, currency, locale = "en-US") => {
  let amountNoComma = amount;
  if (typeof amount === "string") {
    amountNoComma = amount.replace(",", "");
  }
  const amountFormatted = parseFloat(amountNoComma).toFixed(2);
  if (currency === "WOC") return `${amountFormatted} SC`;
  if (currency === "VBC") return `${amountFormatted} WOW`;

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 2 : undefined,
  });
  return formatter.format(amount);
});

export const getCurrencySymbol = Vue.mixin({
  methods: {
    getCurrencySymbol(currency, locale = "en-US") {
      if (currency === "WOC") return "SC";
      if (currency === "VBC") return "WC";

      const symbol = (0)
        .toLocaleString(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/\d/g, "")
        .trim();
      return symbol;
    },
  },
});

const dateToString = Vue.mixin({
  methods: {
    dateToString(date) {
      let shortDate = new Date(date).toUTCString();
      shortDate = shortDate.split(" ").slice(0, 4).join(" ").slice(5);
      const day = this.twoDigits(date.getDate());
      const month = this.twoDigits(date.getMonth() + 1);
      const year = this.twoDigits(date.getFullYear());
      shortDate = `${year}-${month}-${day}`;
      return shortDate;
    },
    twoDigits(number) {
      return number.toLocaleString("en-UK", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    },
  },
});
export default dateToString;

export const getDiffDates = Vue.mixin({
  methods: {
    getDiffDates(firstDate, secondDate) {
      const diffTime = secondDate.getTime() - firstDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      return diffDays;
    },
  },
});
