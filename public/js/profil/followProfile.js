const profilId = urlParams.get('id')
const mainProfilBtn = document.querySelector('.profilMainBtn')

// If user watch the profil of another person
if (accountId != profilId) {
    setFollowStatus()

    mainProfilBtn.addEventListener('click', () => {
        const isProfilFollowed = mainProfilBtn.classList.contains('profilFollowed') ? true : false
    
        if (isProfilFollowed) {
            mainProfilBtn.classList.remove('profilFollowed');
            mainProfilBtn.innerHTML = 'Suivre'
            unfollowProfil()
        } else {
            mainProfilBtn.classList.add('profilFollowed')
            mainProfilBtn.innerHTML = 'Suivis'
            followProfil()
        }
    })
}

async function setFollowStatus() {
    const followList = await getFollowOfUser()

    if (followList.length > 0) {
        let foundMatch = false

        for (let i = 0; i < followList.length; i++) {
            const followId = followList[i];

            if (followId == profilId) {
                mainProfilBtn.classList.add('profilFollowed')
                mainProfilBtn.innerHTML = 'Suivis'
                foundMatch = true
                break
            }
        }
        if (!foundMatch) mainProfilBtn.innerHTML = 'Suivre'
    } else mainProfilBtn.innerHTML = 'Suivre'
}

async function followProfil() {
    const data = {
        userId: accountId,
        profilId: profilId
    }
    await fetch('/db/followProfil', { method: 'POST', body: JSON.stringify(data) })
}
async function unfollowProfil() {
    const data = {
        userId: accountId,
        profilId: profilId
    }
    await fetch('/db/unfollowProfil', { method: 'POST', body: JSON.stringify(data) })
}
async function getFollowOfUser() {
    let toReturn
    await fetch('/db/getFollowOfUser', { method: 'POST', body: accountId })
    .then(response => response.json())
    .then(followList => toReturn = followList)

    return toReturn
}