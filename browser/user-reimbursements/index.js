function adminsOnly() {
  const status = sessionStorage.getItem('role');
  const navBody = document.getElementById('leftNav');
  if (status === 'admin') {
    let adminNav = document.createElement('li');
    adminNav.innerHTML = 
    `<li class="nav-item active">
      <a class="nav-link" href="../byStatus/index.html">Admins Page
        <span class="sr-only">(current)</span>
      </a>
    </li>`;
    navBody.appendChild(adminNav);
  }
}

function retreiveUserReims() {
  const username = sessionStorage.getItem('username');
  // const status = document.getElementById('staus-input').value;
  fetch('http://localhost:3000/reimbursements/username/'+username, {credentials: 'include'})
    .then(resp => resp.json())
    .then((reimbursements) => {

      // clear table
      const body = document.getElementById('user-table-body');
      body.innerHTML = '';

      // populate the table for each movie
      reimbursements.forEach(addReimbursement);
    })
    .catch(err => {
      console.log(err);
    });
}

function addReimbursement(reimbursements) {
  const body = document.getElementById('user-table-body');

  const headerRow = document.createElement('tr'); //create new header
  headerRow.setAttribute("class","header");
  let data = document.createElement('td'); // create <td>
  data.innerText = 'Entry:'; // assign value to the td
  
  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("onclick", `deleteReim(${reimbursements.timeSubmitted})`);
  // console.log(reimbursements.timeSubmitted);
  deleteButton.setAttribute("class", "btn btn-danger");
  deleteButton.setAttribute("type", "button");
  deleteButton.innerText = 'X';
  data.appendChild(document.createElement("br"));
  if (reimbursements.status === 'pending') {
    data.appendChild(deleteButton);
  }
  //-------------

  headerRow.appendChild(data); // append the td to the row
  data = document.createElement('td'); 
  data.innerText = reimbursements.username;
  data.setAttribute("id","username");
  headerRow.appendChild(data); 
  data = document.createElement('td');
  data.innerText = reimbursements.status; 
  headerRow.appendChild(data);

  //  Time submitted
  data = document.createElement('td');
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  data.innerText = new Date(reimbursements.timeSubmitted).toLocaleDateString('en-US', options);
  data.setAttribute("id","timeSubmitted");
  headerRow.appendChild(data);
  //  ---------------

  data = document.createElement('td');
  data.innerText = reimbursements.approver;
  headerRow.appendChild(data);
  body.appendChild(headerRow);
  //Add the items
  for (let i=0; i<reimbursements.items.length; i++) {
    let row = document.createElement('tr');
    data = document.createElement('td');
    data.innerText = `${i+1}:`;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items[i].title;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items[i].amount;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = new Date(reimbursements.items[i].timeOfExpense).toLocaleDateString('en-US', options);
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items[i].description;
    row.appendChild(data);
    body.appendChild(row); // append the row to the body
  }
}

function NextItem() {
  let title = document.getElementById('inputTitle4').value;
  let amount = document.getElementById('inputAmount4').value;
  let description = document.getElementById('inputDescription4').value;
  const options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  let timeOfExpense = new Date(document.getElementById('inputTime4').value).toLocaleDateString('en-US', options);

  newItem = 
  `{
    "title": "${title}",
    "amount": "${amount}",
    "description": "${description}",
    "timeOfExpense": "${timeOfExpense}"
  }`

  // if (localStorage.getItem("riarr").contains(title)) {
  //   document.getElementById('inputTitle4').setAttribute('placeholder','Title must be unique to this list');
  //   return;
  // }

  if (localStorage.getItem("riarr") === '[') { items = newItem; }
  else { items = localStorage.getItem("riarr") + ', ' + newItem; }
  localStorage.setItem("riarr", items); // riarr = reimbursement item array
}

function CreateReimbursement() {
  NextItem();
  // console.log('['+localStorage.getItem("riarr")+']');
  const itemlist = JSON.parse('[' + localStorage.getItem("riarr") + ']');
  // console.log(itemlist);
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  let reimburse = {
    username: sessionStorage.getItem('username'),
    timeSubmitted: Date.now(),
    items: itemlist,
    approver: 'pending',
    status: 'pending',
    receipts: []
  }

  fetch('http://localhost:3000/reimbursements/', {
    body: JSON.stringify(reimburse),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    method: 'POST',
    mode: 'cors'
  })
    .then(resp => {
      resp.json();
      location.reload(true);
    })
    .catch(err => {
      console.log(err);
    });
}

function deleteReim(timeOfSubmission) {
  let time = timeOfSubmission;
  let user = document.getElementById('username').innerText;
  // console.log(`${time}\n${user}`);
  fetch(`http://localhost:3000/reimbursements/delete/username/${user}/timestamp/${time}`, {
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    method: 'DELETE',
    mode: 'cors'
  })
    .then(resp => {
      resp.json();
      location.reload(true);
    })
    .catch(err => {
      console.log(err);
    })
}