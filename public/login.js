const connectionBtn = document.querySelector('#connectionBtn')
const mailInput = document.querySelector('#email')

// Get local storage information
if (localStorage.getItem('twittrData') == null) {
    localStorage.setItem('twittrData', '{}')
}
  
//If user is connected, Redirection to main page
if (JSON.parse(localStorage.getItem('twittrData')).connected) {
    window.location.href = 'html/main.html'
}

connectionBtn.addEventListener('click', async (event) => {
    const loginInput = document.querySelectorAll('.formContainerlog input')
    // Don't reset the form
    event.preventDefault()

    // check if all inputs are filled and if the values aren't already taken
    let isInputsCorrect = await checklogInputs(loginInput)

    if (isInputsCorrect) {
        // set the user id in local storage
        let data = JSON.parse(localStorage.getItem('twittrData'))
        data.userId = await getUserId(loginInput[0].value)
        data.connected = true
        localStorage.setItem('twittrData', JSON.stringify(data))

        window.location.href = 'html/main.html'
    }
})

async function checklogInputs(inputs) {
    let emailRegexp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    // Wait for the execution of all functions
    let isEmailCorrect = await checklogEmail(inputs[0].value)
    let isPasswordCorrect = await checklogPassword(inputs[1].value, inputs[0].value)
    
    if (!emailRegexp.test(inputs[0].value)) {
        errorMsg('Email invalide')
        console.log("slt")
        return false
    } else if (!isEmailCorrect) {
        errorMsg('Cet email n\'est associée à aucun compte')
        return false
    }
    else if (!isPasswordCorrect) {
        errorMsg('Mot de passe incorrect')
        return false
    }
    return true
}

async function checklogEmail (email) {
    let accounts = await getAllAccounts()
    
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
            return true
        }
    }
    return false
}

async function checklogPassword (password, email) {
    let accounts = await getAllAccounts()

    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
            let match = await comparePasswords(accounts[i].password, password)

            if (match) {
                return true
            } else {
                break
            }
        }
    }
    return false
}

async function comparePasswords(hash, password) {
    let match
    let passwords = {
        hash: hash,
        password: password
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(passwords)
    }
    await fetch('/db/comparePasswords', options)
        .then((response) => response.status)
        .then((status) => {
            if (status == 200) {
                match = true
            } else {
                match = false
            }
        })
    return match

}

async function getAllAccounts() {
    let accounts
    await fetch('/db/getAccounts')
        .then((response) => response.json())
        .then((data) => accounts = data)
    return accounts
}

function errorMsg(msg) {
    const msgContainer = document.querySelector('.logMsgContainer')
    msgContainer.innerHTML = msg
    msgContainer.classList.remove('successMsg')
    msgContainer.classList.add('errorMsg')
}

async function getUserId(email) {
    // Get the id of a user with his email
    let accounts = await getAllAccounts()
    let id
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
            id = accounts[i]._id.toString()
            break
        }
    }
    return id
}

function showPasswords() {
    let password = document.getElementById('password');
    
    if (password.type === "password") {
        password.type = "text";
    } else{
        password.type = "password";
    }
}
