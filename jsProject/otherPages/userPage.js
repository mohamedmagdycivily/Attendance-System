///////////////////////////////////////////////
/*
**notes**
-not allowed to confirm twice in the same day  
-not allowed to confirm before 8
-before 9 you are on time 
-before 10 you are late 
-after 10 you are absent 
*/
///////////////////////////////////////////////
const d = new Date();
const port = 5501;
////////////////////////////////////
//elements
const confirmTimeForm = document.querySelector("#confirmTime");
const dataTable = document.querySelector("#dataTable");
const popUpInfo = document.querySelector("#popUpInfo");
const p1 = document.querySelector("#p1");
const p2 = document.querySelector("#p2");

const button = document.querySelector(".button");

///////////////////////////////////////////////////////
//functions
const getLoginInfoFromJson = async function () {
  const totalLoginInfo = await fetch(
    `http://localhost:3000/users`
  ).then((response) => response.json());

  // const loginInfo = totalLoginInfo.map((obj) => obj.loginInfo);
  // return loginInfo;
  console.log(totalLoginInfo);
  return totalLoginInfo;
};
function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}
//render data
const render = async () => {
  const url = `http://localhost:3000/users?loginInfo.in=true`;

  const res = await fetch(url);
  const post = await res.json();
  console.log(post);
  document.querySelector(
    "#attendenceTimes"
  ).textContent += ` ${post[0].attendanceInfo.attendance}`;

  document.querySelector(
    "#lateTimes"
  ).textContent += ` ${post[0].attendanceInfo.Late}`;

  document.querySelector(
    "#absenceTimes"
  ).textContent += ` ${post[0].attendanceInfo.absence}`;

  document.querySelector(
    "#profile"
  ).textContent = `You attended at: ${post[0].attendanceInfo.attendance_time}`;
};
// render();

//////////////////////////////////////////////////////
//event handeler

confirmTimeForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const userName = document.querySelector(".loginAsAdmin_user_name").value;
  // Perform your AJAX/Fetch login
  //kintj
  const loginInfo = await getLoginInfoFromJson();
  try {
    let flag = false;
    loginInfo.forEach(function (obj) {
      if (userName === obj.loginInfo.userName && obj.loginInfo.in) {
        console.log("innnnnnnnnnn");
        console.log(obj.attendanceInfo.attendance_time.split("/"));
        // check if you are trying to confirm your time in the same day if so do not confirmTime=> dont allow him
        //check if he is trying to confirm before 8 am => dont allow him
        if (
          obj.attendanceInfo.attendance_time.split("/")[0] ===
            d.toLocaleString("en-au").split("/")[0] ||
          d.toLocaleTimeString("it-IT") < "08:00:00"
        ) {
          flag = true;
          console.log("in if");
          //confirmTimeForm.classList.add("hidden");
          //dataTable.classList.remove("hidden");
          confirmTimeForm.classList.add("hidden");
          popUpInfo.classList.remove("hidden");
          p1.textContent = userName;
          p2.textContent =
            obj.attendanceInfo.attendance_time.split(" ")[1] +
            " " +
            obj.attendanceInfo.attendance_time.split(" ")[2];
          render();
          console.log(1111111);
        } else {
          console.log("in else");
          flag = true;
          setFormMessage(confirmTimeForm, "error", "");
          confirmTimeForm.classList.add("hidden");
          popUpInfo.classList.remove("hidden");
          //set the pop up window data
          console.log(obj);
          p1.textContent = userName;
          p2.textContent = d.toLocaleTimeString();
          //edit the emp
          obj.attendanceInfo.attendance_time = d.toLocaleString("en-au"); //emp attendecnce
          // console.log(d.toLocaleTimeString("it-IT") < "08:00:00");
          if (d.toLocaleTimeString("it-IT") < "09:00:00") {
            //update nums of attendence
            obj.attendanceInfo.attendance += 1;
          } else if (d.toLocaleTimeString("it-IT") < "10:00:00") {
            //update nums of late
            obj.attendanceInfo.Late += 1;
          } else {
            //update nums of absence
            obj.attendanceInfo.absence += 1;
          }
          fetch(`http://localhost:3000/users/${obj.id}`, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" },
          }).catch((error) => {
            console.log(error);
          });
          render();
        }
      }
    });
    if (!flag) throw new Error("error");
  } catch (err) {
    console.log("in error");
    // console.error(err.message);
    setFormMessage(confirmTimeForm, "error", "Invalid username");
  }
});

popUpInfo.addEventListener("submit", async function (e) {
  e.preventDefault();
  dataTable.classList.remove("hidden");
  popUpInfo.classList.add("hidden");
});

button.addEventListener("click", async function (e) {
  const loginInfo = await getLoginInfoFromJson();
  loginInfo.forEach(function (obj) {
    if (obj.loginInfo.in) {
      obj.loginInfo.in = false;
      fetch(`http://localhost:3000/users/${obj.id}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      }).catch((error) => {
        console.log(error);
      });
    }
  });
  window.location.replace(`http://127.0.0.1:${port}/jsProject/index.html`);
});

///////////////////////////////////////////////////////////
//notes
// const minutes = d.getMinutes();
// const hour = d.getHours();
// const day = d.getDate();
// const month = d.getMonth();
// console.log(JSON.stringify({ mydate: d }));
// console.log(d.toLocaleTimeString()); //4:12:21 PM
// console.log(d.toLocaleString("en-au")); //10/02/2021, 4:12:21 pm
// console.log(typeof d);
// console.log(minutes, hour, day, month);
// const f = new Date(2021, 2);
// console.log(d.getFullYear());

// console.log("hiiiii");

// console.log(d.toLocaleTimeString("it-IT"));
// console.log(d.toLocaleTimeString());
// console.log(d.toLocaleString("en-au"));

// const x = d.toLocaleString("en-au");
// console.log(x.split("/")[0]);
// let y = x.split("/");
