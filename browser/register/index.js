function authenticate() {
  if (sessionStorage.getItem('role') == null) { window.location.assign("../AccessDenied/index.html"); }
}

function CreateUser() {
    // Find out what the role is for the new user
    const radios = document.getElementsByName('roleRadios');
    let role = '';
    for (let i=0; i<radios.length; i++) {
        if (radios[i].checked) {
            role = radios[i].value;
        }
    }
    let newUser = {
      username: document.getElementById('inputUsername4').value,
      password: document.getElementById('inputPassword4').value,
      firstName: document.getElementById('inputFirst4').value,
      lastName: document.getElementById('inputLast4').value,
      email: document.getElementById('inputEmail4').value,
      role: role
    }
    fetch('http://localhost:3000/users/', {
      body: JSON.stringify(newUser),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      method: 'POST',
      mode: 'cors'
    })
      .then(resp => {
          resp.json();
          // Follow the link on success
          window.location = "../sign-in/index.html";;
      })
      .catch(err => {
        console.log(err);
      });
  }