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

  localStorage.setItem("riarr",'[')
  const username = sessionStorage.getItem('username');
  // console.log(username);
  // console.log(document.getElementById('title'));
  document.getElementById('title').innerHTML = username+"'s Reimbursements";
  if (sessionStorage.getItem('role') == null) { window.location.assign("../AccessDenied/index.html"); }
}

function retreiveUserReims() {
  const username = sessionStorage.getItem('username');
  // const status = document.getElementById('staus-input').value;
  fetch('http://localhost:3000/reimbursements/username/'+username, {credentials: 'include'})
    .then(resp => resp.json())
    .then((reimbursements) => {

      // clear table
      const body = document.getElementById('cardstock');
      body.innerHTML = '';

      // populate the table for each movie
      reimbursements.forEach(addReimbursement);
    })
    .catch(err => {
      console.log(err);
    });
}

function removeElement(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

function addReimbursement(reimbursements) {
  const body = document.getElementById('cardstock');

  try {
    let card = document.createElement('div'); //card div
    card.setAttribute("class","card text-center");
      let title = document.createElement('div'); // title div
      title.setAttribute("class","title");
        let titleI = document.createElement('i');
        titleI.setAttribute("class","fab fa-telegram-plane");
        title.appendChild(titleI);
        let titleH2 = document.createElement('h4');
        let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
        titleH2.innerText = new Date(reimbursements.timeSubmitted).toLocaleDateString('en-US', options);
        title.appendChild(titleH2);
        card.appendChild(title);
      let value = document.createElement('div');
      value.setAttribute("class","price");
        let amount = Number(0);
        let valueAmount = document.createElement('h1');
          valueAmount.setAttribute("id","valueAmount");
        // let value$ = document.createElement('sup');
        // value$.innerHTML = '$';
        // valueAmount.appendChild(value$);
        valueAmount.innerHTML = `$${amount}`;
        value.appendChild(valueAmount);
        card.appendChild(value);
      let status = document.createElement('h3');
        status.innerText = reimbursements.status;
        card.appendChild(status);
      let approver = document.createElement('h4');
        approver.innerText = reimbursements.approver;
        card.appendChild(approver);  
      
      const table = document.createElement('table');
      let tbody = document.createElement('tbody');
      table.appendChild(tbody);
      let tableTitle = document.createElement('h2');
      let titleCell = document.createElement('tr');
      titleCell.setAttribute("colspan","2");
      tableTitle.innerText = 'Reimbursements:';
      titleCell.appendChild(tableTitle);
      tbody.appendChild(titleCell);

      //Add the items
      for (let i=0; i<reimbursements.items.length; i++) {
        amount += Number(reimbursements.items[i].amount);
        const row = document.createElement('tr');

        //Tool tip descriptions
        /*row.setAttribute("class","tooltip")
        let tipspan = document.createElement('span');
        tipspan.setAttribute("class","tooltiptext");
        tipspan.innerHTML = `Description: ${reimbursements.description}`;
        row.appendChild(tipspan);*/

        let data = document.createElement('td');
        options = { month: "short", day: "numeric", year: "numeric"};
        data.innerText = `${reimbursements.items[i].title}, $${reimbursements.items[i].amount}, ${new Date(reimbursements.items[i].timeOfExpense).toLocaleString('en-US',options)}`;
        row.appendChild(data);
        /*data = document.createElement('td');
        data.innerText = reimbursements.items[i].title;
        row.appendChild(data);
        data = document.createElement('td');
        data.innerText = reimbursements.items[i].amount;
        row.appendChild(data);
        data = document.createElement('td');
        data.innerText = new Date(reimbursements.items[i].timeOfExpense).toLocaleDateString('en-US', options);*/
        row.appendChild(data);
        tbody.appendChild(row); // append the row to the body
      }

      console.log(amount);
      let adjuster = document.getElementById('valueAmount'); 
      console.log(adjuster);
      //adjuster.innerText = `$${amount}`;
    card.appendChild(table);
    body.appendChild(card);
  } finally {
    if (body.innerHTML === '') {
      removeElement('cardstock');
      let card = document.createElement('div');
      card.setAttribute("class", "card text-center");
        let emptyMessage = document.createElement('h1');
        emptyMessage.innerHTML = `No reimbursements to show, for ${reimbursements.username}`;
    }
  }
  /*
  //Delete button
  if (reimbursements.status === 'pending') {
    // data.appendChild(deleteButton);
    card.setAttribute("onclick", `deleteReim(${reimbursements.timeSubmitted})`);
    card.setAttribute("type","button");
    card.setAttribute("id", "deleteBtn");
    card.setAttribute("cursor", "pointer");
    card.setAttribute("style", "background-color: #d3510e")
  }*/
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

  if (localStorage.getItem("riarr") === '[') { items = newItem; }
  else { items = localStorage.getItem("riarr") + ', ' + newItem; }
  localStorage.setItem("riarr", items); // riarr = reimbursement item array

  document.getElementById('inputTitle4').value = '';
  document.getElementById('inputAmount4').value = '';
  document.getElementById('inputDescription4').value = '';
  document.getElementById('inputTime4').value = '';
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
  localStorage.setItem("riarr",'[')
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