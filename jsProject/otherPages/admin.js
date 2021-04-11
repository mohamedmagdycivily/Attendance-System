//elements
const AllEmployees_tb = document.querySelector(".AllEmployees_tb");
const FullReport_tb = document.querySelector(".FullReport_tb");
const LateReport_tb = document.querySelector(".LateReport_tb");
const ExuseReport_tb = document.querySelector(".ExuseReport_tb");
const EmloyeeBrief_tb = document.querySelector(".EmloyeeBrief_tb");
const waitingEmployees_tb = document.querySelector(".waitingEmployees_tb");

/////////////////////////////////////////////////
//functions
const render = async () => {
  console.log(1);
  const url = `http://localhost:3000/users`;

  const res = await fetch(url);
  const employees = await res.json();
  let template = "";

  //reset the table
  AllEmployees_tb.innerHTML = "";
  FullReport_tb.innerHTML = "";
  LateReport_tb.innerHTML = "";
  ExuseReport_tb.innerHTML = "";
  EmloyeeBrief_tb.innerHTML = "";
  waitingEmployees_tb.innerHTML = "";

  employees.forEach((emp) => {
    //entering the emps into table if they are accepted
    if (emp.loginInfo.acceptance) {
      template = `
    <tbody>
    <tr>
      <th scope="row">${emp.createInfo.firstName + emp.createInfo.lastName}</th>
      <td>${emp.attendanceInfo.attendance}</td>
      <td>${emp.attendanceInfo.absence}</td>
      <td>${emp.attendanceInfo.Late}</td>
      <td>${emp.attendanceInfo.Excuse}</td>
    </tr>
  </tbody>
      `;
      AllEmployees_tb.innerHTML += template;

      //full report table
      template = `
    <tbody>
    <tr>
      <th scope="row">${emp.createInfo.firstName + emp.createInfo.lastName}</th>
      <td>${emp.loginInfo.userName}</td>
      <td>${emp.loginInfo.userPassword}</td>
      <td>${emp.attendanceInfo.attendance}</td>
      <td>${emp.attendanceInfo.absence}</td>
      <td>${emp.attendanceInfo.Late}</td>
      <td>${emp.attendanceInfo.Excuse}</td>
      </tr>
      </tbody>
      `;
      FullReport_tb.innerHTML += template;

      //late report table
      template = `
      <tbody>
      <tr>
      <th scope="row">${emp.createInfo.firstName + emp.createInfo.lastName}</th>
      <td>${emp.attendanceInfo.Late}</td>
      </tr>
      </tbody>
      `;
      LateReport_tb.innerHTML += template;

      //exuse report table
      template = `
      <tbody>
      <tr>
        <th scope="row">${
          emp.createInfo.firstName + emp.createInfo.lastName
        }</th>
        <td>${emp.attendanceInfo.Excuse}</td>
      </tr>
    </tbody>
        `;
      ExuseReport_tb.innerHTML += template;

      //Brief report table
      template = `
    <tbody>
    <tr>
    <th scope="row">${emp.createInfo.firstName + emp.createInfo.lastName}</th>
    <td>${emp.loginInfo.userName}</td>
    <td>${emp.loginInfo.userPassword}</td>
    <td>${emp.attendanceInfo.attendance}</td>
    </tr>
    </tbody>
    `;
      EmloyeeBrief_tb.innerHTML += template;
    }

    //enterting the emps into the acceptance or rejectance table (:
    if (!emp.loginInfo.acceptance) {
      template = `
        <tbody>
        <tr>
        <th scope="row">${
          emp.createInfo.firstName + emp.createInfo.lastName
        }</th>
        <td>
            <button class="button acc" id="${emp.id}">Accept</button>
        </td>
        <td>
            <button class="button rej" id="${emp.id}">Reject</button>
        </td>
        </tr>
        </tbody>
        `;
      waitingEmployees_tb.innerHTML += template;
    }
  });

  //handling accept and reject buttons
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.id;
      waiting_emp_url = `http://localhost:3000/users/${id}`;
      const res = await fetch(waiting_emp_url);
      const waiting_emp = await res.json(); //the object i want to edit

      //editing
      if (e.target.classList.contains("rej")) {
        //reject the emp
        waiting_emp.loginInfo.acceptance = true;
        await fetch(waiting_emp_url, {
          method: "DELETE",
          body: JSON.stringify(waiting_emp),
          headers: { "Content-Type": "application/json" },
        }).catch((error) => {
          console.log(error);
        });
        render();
      } else {
        //accept the emp
        waiting_emp.loginInfo.acceptance = true;
        await fetch(waiting_emp_url, {
          method: "PUT",
          body: JSON.stringify(waiting_emp),
          headers: { "Content-Type": "application/json" },
        }).catch((error) => {
          console.log(error);
        });
        render();
      }
    });
  });
};
render();
