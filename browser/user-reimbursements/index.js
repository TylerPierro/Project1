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
  data.innerText = reimbursements.timeSubmitted;
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
    data.innerText = reimbursements.items[i].timeOfExpense;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items[i].description;
    row.appendChild(data);
    body.appendChild(row); // append the row to the body
  }
}