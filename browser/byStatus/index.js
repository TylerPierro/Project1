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
  else (window.location.assign("../AccessDenied/index.html"));
}

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
  
  if (reimbursements.status === 'pending') {headerRow.setAttribute('onclick',`focusIn("${reimbursements.username}", "${reimbursements.timeSubmitted}")`);}
  
  let data = document.createElement('td'); // create <td>
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

function update(newStatus) {
  let reimbursements = localStorage.getItem('reimbursementItem');
  reimbursements = JSON.parse(reimbursements);
  const approver = sessionStorage.getItem('username');
  reimbursements.status = newStatus;
  reimbursements.approver = approver;
  
  console.log(approver);
  console.log(reimbursements);
  fetch('http://localhost:3000/reimbursements/username/'+reimbursements.username, {
    body: JSON.stringify(reimbursements),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    method: 'PUT'
  })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401) {
        throw 'Invalid Credentials';
      }
      if (resp.status === 200) {
        return resp.json();
      } 
      throw 'Unable to update at this time, please try again later';
    })
    .then(data => {
      location.reload(true);
    })
    .then(err => {
      console.log(JSON.stringify(err, null, 2));
    })
}

function focusIn(username, timeSubmitted) {
  fetch('http://localhost:3000/reimbursements/username/'+username+'/timestamp/'+String(timeSubmitted), {
    headers: {
      'content-type': 'application/json'
    },
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  })
    // .then(resp => console.log(resp.json()))
    .then(resp => {
      // clear table
      const body = document.getElementById('status-table-body');
      body.innerHTML = '';

      return resp.json();
      // populate the table for each movie
    })
    .then(data => {
      addIndividualReimbursement(data);
    })
    .catch(err => {
      console.log(err);
    });
}

function addIndividualReimbursement(reimbursements) {
  // let ri = '['
  console.log(JSON.stringify(reimbursements));
  localStorage.setItem('reimbursementItem',JSON.stringify(reimbursements));

  const body = document.getElementById('status-table-body');
  const top = document.getElementById('topopage');
  // Approve or deny buttons
  let approve = document.createElement('button');
  approve.setAttribute('class','btn approve');
  approve.setAttribute('onclick',`update("approved")`);
  let deny = document.createElement('button');
  deny.setAttribute('class','btn deny');
  deny.setAttribute('onclick','update("deny")');
  top.appendChild(approve);
  top.appendChild(deny); 

  const headerRow = document.createElement('tr'); //create new header
  headerRow.setAttribute("class","header");
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