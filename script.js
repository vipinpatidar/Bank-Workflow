//Data
const account1 = {
  owner: "Michael Scott",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Vipin Patidar",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2022-11-06T18:49:59.371Z",
    "2022-11-02T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "hi-IN",
};

const account3 = {
  owner: "Dwight Schrute",
  movements: [600, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-IN", // de-DE
};

const account4 = {
  owner: "Pam Beesly",
  movements: [430, 2000, 700, 50, 90, -1000],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const guidelines = document.querySelector(".guidelines");

///////////////////////////////////////////////////////////////

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, "0");
    // const month = `${date.getMonth()}`.padStart(2, "0");
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Numrice vlaue accourding to countries

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";
  // sorting movements
  const sortMovements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  sortMovements.forEach((movement, i) => {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    // formating currency accourding to countries
    const formateMov = formatCurrency(
      movement,
      account.locale,
      account.currency
    );

    const html = ` 
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formateMov}</div>
        </div> 
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
    //  containerMovements.innerHTML += html;
  });
};

// Adding currencies
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  labelBalance.innerHTML = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

// calcDisplayBalance(account1.movements);

// display summary of movements
const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency
  );

  // outIncome
  const outIncome = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(outIncome),
    account.locale,
    account.currency
  );

  const rate = account.interestRate / 100;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * rate)
    .filter((interest) => interest >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

// calcDisplaySummary(account1.movements);

//Creating a username for each account holder like "stw" or "js"
const creatUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
creatUserName(accounts);

// Update Ui function
const updateUI = function (currentAccount) {
  // display movements
  displayMovements(currentAccount);
  // display Balance
  calcDisplayBalance(currentAccount);
  // display Summary
  calcDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 300;
  // Call the timer every second
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // console.log(min, sec);

    // in each call , print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 second , stop the timer and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = "0";
      guidelines.style.display = "block";
    }

    // Decrese is
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////////////
// Event Handler

let currentAccount, timer;

//Fake
// currentAccount = account2;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Login user with Event Handler
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    containerApp.style.opacity = "100";
    guidelines.style.display = "none";
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Date updating in UI
    const now = new Date();

    // internationalization Date
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //     const day = `${now.getDate()}`.padStart(2, "0");
    //     const month = `${now.getMonth()}`.padStart(2, "0");
    //     const year = now.getFullYear();
    //     const hour = `${now.getHours()}`.padStart(2, "0");
    //     const minute = `${now.getMinutes()}`.padStart(2, "0");

    //     labelDate.textContent = `
    // ${day}/${month}/${year}, ${hour}:${minute}`;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // updating the UI
    updateUI(currentAccount);
  }
});

//Transfer Money to other account
let transferAccount;
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  reciverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // console.log(reciverAccount);
  // console.log(reciverAccount?.movements);

  if (
    currentAccount.balance >= +inputTransferAmount.value &&
    +inputTransferAmount.value > 0 &&
    reciverAccount &&
    reciverAccount?.username !== currentAccount.username
  ) {
    // Doing Transfer
    currentAccount?.movements.push(-Number(inputTransferAmount.value));
    reciverAccount?.movements.push(Number(inputTransferAmount.value));

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAccount.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert("Please Check Your Balance,Put Valid Amount Or Username");
  }

  inputTransferAmount.value = inputTransferTo.value = "";
});

// Requesting for Loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  const checkCondition = currentAccount.movements.some(
    (mov) => mov >= amount * 0.1
  );

  if (amount > 0 && checkCondition) {
    setTimeout(function () {
      currentAccount.movementsDates.push(new Date().toISOString());
      // Adding loan to movements
      currentAccount.movements.push(amount);
      // Update UI
      updateUI(currentAccount);
      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  // Adding loan Date

  inputLoanAmount.value = "";
});

//Closing Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    // Delete Account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = "0";
    inputCloseUsername.value = inputClosePin.value = "";
  }
});
//Sorting movements
let isSorted = false;
btnSort.addEventListener("click", () => {
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"]
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//////////////////////////////////////

const arr = ["a", "b", "c", "d", "e"];

//SLICE

// console.log(arr.slice(-1))
// console.log(arr.slice(2,4))
// console.log(arr.slice(1,-2))
// console.log(arr.slice());

//SPLICE

// console.log(arr.splice(2,2,"v","p","g"));
// console.log(arr.splice(-2))
// console.log(arr.splice(-2,1))
// console.log(arr.splice(-2,1))

// console.log(arr);

//REVERSE
const arr2 = ["j", "i", "h", "g", "f"];
// console.log(arr2.reverse())
// console.log(arr2);

//CONCATE
const newArr = arr.concat(arr2);
// console.log(newArr);

//JOIN
// console.log(newArr.join(" - "))

//AT
const num = [12, 58, 36, 45];
// console.log(num.at(-1))

// forEach
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const movement of movements){
//   if(movement >0){
//     console.log("you have deposited "+ movement)
//   }else{
//     console.log(`you withdraw ${movement}`)
//   }
// }

// movements.forEach(movement=>{
//   if(movement>0){
//     console.log(`you have deposited ${movement}`)
//   }else{
//     console.log(`you withdraw ${movement}`);
//   }
// })

//forEach on Map
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);
// console.log(currencies)
// currencies.forEach((vlaue, key)=>{
//    console.log(`${key}, ${vlaue} `)
// })

// const setArr = ['usd', "eur" , "gbp", 'usd', "in", 'in']
// const unquieCurr = new Set(setArr)
// console.log(unquieCurr);

// unquieCurr.forEach((value, _)=>{
//   console.log( value)
// })
