function retreiveUserReims() {
  //const username = document.getElementById('year-input').value;
  //const username = req.session.username;
  //const username = 'TyPiRo';
  fetch('http://localhost:3000/reimbursements/username/', {credentials: 'include'})
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
  headerRow.appendChild(data); // append the td to the row
  data = document.createElement('td'); 
  data.innerText = reimbursements.username;
  headerRow.appendChild(data); 
  data = document.createElement('td');
  data.innerText = reimbursements.status; 
  headerRow.appendChild(data);
  data = document.createElement('td');
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  data.innerText = new Date(reimbursements.timeSubmitted).toLocaleDateString('en-US', options);
  headerRow.appendChild(data);
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

/*$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})*/

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
  /*for (let i=0; i<localStorage.getItem("riarr").length; i++)  {
    if (items[i].title === document.getElementById('inputTitle4')) 
    {
      document.getElementById('inputTitle4').setAttribute('placeholder','Title must be unique to this list');
      return;
    }
  }*/
  if (localStorage.getItem("riarr") === '[') { items = newItem; }
  else { items = localStorage.getItem("riarr") + ', ' + newItem; }
  console.log(items);
  localStorage.setItem("riarr", items); // riarr = reimbursement item array
}

function CreateReimbursement() {
  NextItem();
  console.log('['+localStorage.getItem("riarr")+']');
  const itemlist = JSON.parse('['+localStorage.getItem("riarr")+']');
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  let reimburse = {
    username: 'currentUser',
    timeSubmitted: new Date(Date.now()).toLocaleDate('en-US', options),
    items: JSON.parse(localStorage.getItem("riarr")),
    approver: 'pending',
    status: 'pending',
    receipts: []
  }
  console.log(items.toString);
  fetch('http://localhost:3000/reimbursements/', {
    body: JSON.stringify(reimburse),
    /*headers: {
      'content-type': 'application/json'
    },*/
    credentials: 'include',
    method: 'POST',
    mode: 'cors'
  })
    .then(resp => resp.json())
    .catch(err => {
      console.log(err);
    });
}