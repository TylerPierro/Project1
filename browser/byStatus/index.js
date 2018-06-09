function retreiveUserReims(status='pending') {
  fetch('http://localhost:3000/reimbursements/status/'+status, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'GET'
  })
    .then(resp => resp.json())
    .then((reimbursements) => {

      // clear table
      const body = document.getElementById('status-table-body');
      body.innerHTML = '';

      // populate the table for each movie
      reimbursements.forEach(addReimbursement);
    })
    .catch(err => {
      console.log(err);
    });
}

function addReimbursement(reimbursements) {
  const body = document.getElementById('status-table-body');

  // Row buttons
  const headerRow = document.createElement('tr'); //create new header
  headerRow.setAttribute('onclick','focusIn()');

  let data = document.createElement('td'); // create <td>
  data.innerText = 'Entry:'; // assign value to the td
  
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
  console.log('['+localStorage.getItem("riarr")+']');
  const itemlist = JSON.parse('[' + localStorage.getItem("riarr") + ']');
  // const itemlist = JSON.parse('['+localStorage.getItem("riarr")+']');
  console.log(itemlist);
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  let reimburse = {
    username: 'currentUser',
    timeSubmitted: new Date(Date.now()).toLocaleString('en-US', options),
    /*JSON.parse(localStorage.getItem("riarr")*/
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

function deleteReim() {
  let time = String(Date.parse(document.getElementById('timeSubmitted').innerText));
  let user = document.getElementById('username').innerText;
  console.log(`${time}\n${user}`);
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