const port = 5501;
/////////////////////////////////////////////////////
//elements
const loginUserForm = document.querySelector("#loginUser");
const loginAdminForm = document.querySelector("#loginAdmin");
const createAccountForm = document.querySelector("#createAccount");

const linkCreateAccount = document.querySelector("#linkCreateAccount");
const linkCreateAccountInAdmin = document.querySelector(
  "#linkCreateAccountInAdmin"
);
const linkUserLogin = document.querySelector("#linkUserLogin");
const linkAdminLogin = document.querySelector("#linkAdminLogin");

const form = document.querySelector(".form");
console.log(form);
///////////////////////////////////////////////////
// Functions
function checkInputs(firstName, lastName, address, email, age) {
  let flag = true;
  if (!checkStringInput(firstName, "firstName")) flag = false;
  if (!checkStringInput(lastName, "lastName")) flag = false;
  if (!checkStringInput(address, "address")) flag = false;
  if (!isEmail(email)) flag = false;
  if (age > 60 || age < 20) {
    setElementCreateMessage(
      createAccountForm,
      "error",
      `age must be in range [20 - 60] characters`,
      "age"
    );
    flag = false;
  }
  return flag;
}
function checkStringInput(string, name) {
  let flag = true;
  // let message;
  if (string === "") {
    // message = `${name} cannot be blank`;
    setElementCreateMessage(
      createAccountForm,
      "error",
      `${name} cannot be blank`,
      name
    );
    flag = false;
  } else if (string.length > 15) {
    setElementCreateMessage(
      createAccountForm,
      "error",
      `${name} must be less than 15 characters`,
      name
    );
    flag = false;
  } else if (string.length < 3) {
    setElementCreateMessage(
      createAccountForm,
      "error",
      `${name} must be more than 3 characters`,
      name
    );
    flag = false;
  }
  return flag;
}

function isEmail(email) {
  let flag = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
  if (!flag) {
    setElementCreateMessage(
      createAccountForm,
      "error",
      "not valid email",
      "Email"
    );
  }
  return flag;
}

function setElementCreateMessage(formElement, type, message, name) {
  const messageElement = formElement.querySelector(`.${name}`);
  // // console.log(name);
  // // console.log(messageElement);

  // console.log(message);
  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}

function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = "";
}

//advanced functions
const getLoginInfoFromJson = async function () {
  const totalLoginInfo = await fetch(
    `http://localhost:3000/users`
  ).then((response) => response.json());

  // const loginInfo = totalLoginInfo.map((obj) => obj.loginInfo);
  return totalLoginInfo;
};

//////////////////////////////////////////////////////////
// Event handlers

linkCreateAccount.addEventListener("click", (e) => {
  console.log("hi");
  e.preventDefault();
  loginUserForm.classList.add("form--hidden");
  loginAdminForm.classList.add("form--hidden");
  createAccountForm.classList.remove("form--hidden");
});

linkUserLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginUserForm.classList.remove("form--hidden");
  loginAdminForm.classList.add("form--hidden");
  createAccountForm.classList.add("form--hidden");
});

linkAdminLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginUserForm.classList.add("form--hidden");
  loginAdminForm.classList.remove("form--hidden");
  createAccountForm.classList.add("form--hidden");
});

linkCreateAccountInAdmin.addEventListener("click", (e) => {
  console.log("hi");
  e.preventDefault();
  loginUserForm.classList.add("form--hidden");
  loginAdminForm.classList.add("form--hidden");
  createAccountForm.classList.remove("form--hidden");
});

// login as user(kintj : 373873)
loginUserForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userName = document.querySelector(".login_user_name").value;
  const userPass = Number(document.querySelector(".login_password").value);

  // Perform your AJAX/Fetch login
  const loginInfo = await getLoginInfoFromJson();
  try {
    let flag = false;
    loginInfo.forEach(function (obj) {
      if (
        userName === obj.loginInfo.userName &&
        userPass === obj.loginInfo.userPassword &&
        obj.loginInfo.acceptance
      ) {
        flag = true;
        //change in attribute from false to true
        obj.loginInfo.in = true;
        fetch(`http://localhost:3000/users/${obj.id}`, {
          method: "PUT",
          body: JSON.stringify(obj),
          headers: { "Content-Type": "application/json" },
        }).catch((error) => {
          console.log(error);
        });
        //delete any warrning messages
        setFormMessage(loginUserForm, "error", "");
        //redirect to user page
        window.location.href = `http://127.0.0.1:${port}/jsProject/otherPages/userPage.html`;
      }
    });
    if (!flag) throw new Error("error");
  } catch (err) {
    setFormMessage(
      loginUserForm,
      "error",
      "Invalid username/password combination"
    );
  }
});

//login as admin (iti : iti)
loginAdminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Perform your AJAX/Fetch login
  const userName = document.querySelector(".loginAsAdmin_user_name").value;
  const userPass = document.querySelector(".loginAsAdmin_password").value;
  if (userName === "iti" && userPass === "iti") {
    window.location.href = `http://127.0.0.1:${port}/jsProject/otherPages/admin.html`;
  } else {
    setFormMessage(
      loginAdminForm,
      "error",
      "Invalid username/password combination"
    );
  }
});

//create account validation
document.querySelectorAll(".form__input").forEach((inputElement) => {
  inputElement.addEventListener("blur", (e) => {
    if (
      e.target.id === "partOfUserName" &&
      e.target.value.length > 0 &&
      e.target.value.length < 3
    ) {
      setInputError(
        inputElement,
        "Username must be at least 3 characters in length"
      );
    }
  });

  inputElement.addEventListener("input", (e) => {
    clearInputError(inputElement);
  });
});
/////////////////////////////////////////////////////////////////////////////////////
//submit
//mail
const sendEmailToAdmin = function (body, email) {
  // console.log(body);
  Email.send({
    Host: "smtp.gmail.com",
    Username: "mohamedmagdyjs@gmail.com",
    Password: "yrliabyuuemfinof",
    To: "mohamedmagdyjs@gmail.com",
    From: email,
    Subject: "New registeration",
    Body: body,
  }).then((message) => {
    console.log("sendEmailToAdmin :", message);
    if (message === "OK") {
      alert("OK, check your mail for userName & password");
    } else {
      alert(message);
    }
  });
};
const sendEmailToUser = function (body, email) {
  Email.send({
    Host: "smtp.gmail.com",
    Username: "mohamedmagdyjs@gmail.com",
    Password: "yrliabyuuemfinof",
    To: email,
    From: "mohamedmagdyjs@gmail.com",
    Subject: "New registeration",
    Body: body,
  }).then((message) => {
    console.log("sendEmailToUser :", message);
  });
};
//random name generator
const randomNameGenerator = (num) => {
  let res = "";
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * 27);
    res += String.fromCharCode(97 + random);
  }
  return res;
};

//case press submit create  account
createAccountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ////////////////////////////////////////100- do some validation on the data entred

  // Perform your AJAX/Fetch login
  let firstName = document.querySelector("#formCreateAccFirstName").value;
  let lastName = document.querySelector("#formCreateAccLastName").value;
  let address = document.querySelector("#formCreateAccAdress").value;
  let email = document.querySelector("#formCreateAccEmail").value;
  let age = Number(document.querySelector("#formCreateAccAge").value);
  if (
    checkInputs(
      firstName.trim(),
      lastName.trim(),
      address.trim(),
      email.trim(),
      age
    )
  ) {
    console.log("innnnnnnnnnn");
    setFormMessage(createAccountForm, "success", "");
    // function setFormMessage(formElement, type, message) {
    //   const messageElement = formElement.querySelector(".form__message");

    //   messageElement.textContent = message;
    //   messageElement.classList.remove(
    //     "form__message--success",
    //     "form__message--error"
    //   );
    //   messageElement.classList.add(`form__message--${type}`);
    // }

    const body = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      email: email,
      age: age,
    };
    const userPassword = Math.trunc(Math.random() * 1000000);
    const userName = randomNameGenerator(5);

    sendEmailToAdmin(body, email);
    sendEmailToUser({ userName: userName, userPassword: userPassword }, email);

    //get data from server
    //
    //
    const getUserFromJson = function (id) {
      fetch(`http://localhost:3000/users/${id}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        });
    };
    // getUserFromJson(1);

    //post data into server  ---------------------> why refreshing the page ????????????????
    //
    //
    const postUserIntoJson = function () {
      const userDataInJson = {
        createInfo: body,
        loginInfo: {
          userName: userName,
          userPassword: userPassword,
          acceptance: false,
          in: false,
        },
        attendanceInfo: {
          attendance: 0,
          absence: 0,
          Late: 0,
          Excuse: 0,
          attendance_time: "0/0",
        },
      };
      fetch(`http://localhost:3000/users`, {
        method: "post",
        body: JSON.stringify(userDataInJson),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        });
    };
    postUserIntoJson();
  } else {
    console.log("not innnnnnnnnnnnnnnn");
    //validation
    setFormMessage(createAccountForm, "error", "Invalid entry");
  }
});
