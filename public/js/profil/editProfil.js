// If user watch his profil, set "edit profil" to main profil button
const editProfilForm = document.querySelector('.editProfilForm')
const updateProfilBtn = document.querySelector('.editProfilForm button')
const biographyContainer = document.querySelector('.descriptionProfil .description')
const backgroundProfilContainer = document.querySelector('.backgroundImage img')
const profilePictureContainer = document.querySelector('.profilImage img')
const wrongProfilImgLinkMsg = document.querySelector('.wrongProfilImgLinkMsg')
const wrongBackgroundProfilImgLinkMsg = document.querySelector('.wrongBackgroundProfilImgLinkMsg')

if (accountId == profilId) {
    const mainProfilBtn = document.querySelector('.profilMainBtn')
    mainProfilBtn.innerHTML = 'Éditer le profil'

    // Display the edit profil form
    mainProfilBtn.addEventListener('click', () => editProfilForm.style.display = 'flex')

    // Edit the prodil
    updateProfilBtn.addEventListener('click', (event) => {
        event.preventDefault()
        editProfil()
    })
}

async function editProfil() {
    const inputs = document.querySelectorAll('.editProfilForm input')
    const wrongProfilImgLinkMsg = document.querySelector('.wrongProfilImgLinkMsg')
    const wrongBackgroundProfilImgLinkMsg = document.querySelector('.wrongBackgroundProfilImgLinkMsg')

    const linkRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    let isInputsValid

    for (let i = 0; i < inputs.length; i++) {
        const value = inputs[i].value
        if (value != '' && i == 0) {
            isInputsValid = true
            updateProfil('Biography', value)
            .then(() => biographyContainer.innerHTML = value)
        }
        else if (value != '' && i == 1 && linkRegExp.test(value))  {
            isInputsValid = true
            updateProfil('ProfilImg', value)
            .then(() => profilePictureContainer.src = value)
        }
        // Case where the profil image link isn't a good link
        else if (value != '' && i == 1 && !linkRegExp.test(value)) {
            wrongProfilImgLinkMsg.style.display = 'block'
            isInputsValid = false
        }
        else if (value != '' && i == 2  && linkRegExp.test(value)) {
            isInputsValid = true
            updateProfil('BackgroundProfilImg', value)
            .then(() => backgroundProfilContainer.src = value)
        }
        // Case where the background profil image link isn't a good link
        else if (value != '' && i == 2 && !linkRegExp.test(value)) {
            wrongBackgroundProfilImgLinkMsg.style.display = 'block'
            isInputsValid = false
        }
    }
    if (isInputsValid) {
        // Reset the values of inputs
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
        }
        // Hide the edit profil form
        editProfilForm.style.display = 'none'
        // Reset error msg
        wrongProfilImgLinkMsg.style.display = 'none'
        wrongBackgroundProfilImgLinkMsg.style.display = 'none'
    }
}

async function updateProfil(toUpdate, body) {
    const data = {
        userId: userId,
        body: body
    }
    await fetch(`/db/update${toUpdate}`, { method: 'POST', body: JSON.stringify(data) })
}