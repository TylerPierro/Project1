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

let items = [];
function NextItem() {
  let newItem = {
    title : '',
    amount : 0,
    description : 'lorem ipsum',
    timeOfExpense : new Date()
  }
  for (let i=0; i<items.length; i++)  {
    if (items[i].title === document.getElementById('inputTitle4')) 
    {
      documeent.getElementById('inputTitle4').setAttribute('placeholder','Title must be unique to this list');
      return;
    }
  }
  newItem.title = document.getElementById('inputTitle4');
  newItem.amount = document.getElementById('inputAmount4');
  newItem.description = document.getElementById('inputDescription4');
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  newItem.timeOfExpense = new Date(document.getElementById('inputTime4')).toLocaleDateString('en-US', options);
  items.push(newItem);
}

function createReimbursement() {
  NextItem();
  let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
  let reimburse = {
    username: 'currentUser',
    timeSubmitted: new Date(Date.now()).toLocaleDate('en-US', options),
    items: items,
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
    //Credentials needs to be set back to include instead of same-origin
    credentials: 'include',
    method: 'POST',
    mode: 'cors'
  })
    .then(resp => resp.json())
    .catch(err => {
      console.log(err);
    });
}