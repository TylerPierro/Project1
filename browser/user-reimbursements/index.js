function retreiveUserReims() {
  //const username = document.getElementById('year-input').value;
  //const username = req.session.username;
  const username = 'TyPiRo';
  fetch('http://localhost:3000/reimbursements/username/' + username, {credentials: 'include'})
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

  const row = document.createElement('tr'); // create <tr>
  const headerRow = document.createElement('tr'); //create new header
  headerRow.setAttribute("class","header");
  let data = document.createElement('td'); // create <td>
  data.innerText = reimbursements.status; // assign value to the td
  headerRow.appendChild(data); // append the td to the row
  data = document.createElement('td');
  data.innerText = reimbursements.timeSubmitted;
  headerRow.appendChild(data);
  data = document.createElement('td');
  data.innerText = reimbursements.approver;
  headerRow.appendChild(data);
  body.appendChild(headerRow);
  for (let i=0; i<reimbursements.items.length; i++) {
    row = document.createElement('td');
    data = document.createElement('td');
    data.innerText = reimbursements.items.title;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items.amount;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items.description;
    row.appendChild(data);
    data = document.createElement('td');
    data.innerText = reimbursements.items.timeOfExpense;
    row.appendChild(data);
    body.appendChild(row); // append the row to the body
  }
    // body.innerHTML += `
  //   <tr>
  //     <td>${movie.year}</td>
  //     <td>${movie.title}</td>
  //     <td>${movie.rating}</td>
  //     <td>${movie.description}</td>
  //   </tr>
  // `;
}