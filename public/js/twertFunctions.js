//localStorage.setItem('twitt-r-data', JSON.stringify({userId: '606c930e33ef3f96a9a49326'}))

setInterval(async () => {
    await checkLikeRtComent(accountId)
}, 2000); 
// Toggle Rt
async function toggleRt(idTwert, profileId) {
    const twert = await getMesageById(idTwert)
    if (twert.retweet.includes(profileId)) {
        await deleteRtThisTwert(idTwert, profileId)
    } else {
        await rtThisTwert(idTwert, profileId)
    }
}
// Rt the twert
async function rtThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/addARetweet', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.rtContainer p')
    allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        const retwertTextElement = allTwertsTextProfile[i]
        onclickContain = retwertElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
            retwertTextElement.innerHTML = twert.retweet.length + 1
        }
    }
}
async function commentThisTwert(twertId, userId, authorName, authorId) {
    const twertElement = document.getElementById(twertId)
    const allCommentsForm = twertElement.querySelectorAll('.commentTwertContainer')

    if (allCommentsForm.length == 0) {
        const twertElement = document.getElementById(twertId)
        twertElement.insertAdjacentHTML('beforeend', `
            <div class="commentTwertContainer">
                <input type="text" placeholder="Répondre à ${authorName}">
                <div class="commentBtnContainer" onclick="saveComment('${twertId}', '${userId}', '${authorId}')">
                    <p>Répondre</p>
                </div>
            </div>
        `)
        twertElement.querySelector('input').select()
        // If user hit Enter key, run the saveComment function
        document.querySelector('.commentTwertContainer input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveComment(twertId, userId, authorId)
        })
    } else {
        const commentTwertForm = twertElement.querySelector('.commentTwertContainer')
        twertElement.removeChild(commentTwertForm)
    }
}
function goToTwertPage(id) {
    window.location.href = `twert.html?id=${id}`
}
async function saveComment(twertId, userId, authorId) {
    event.preventDefault()
    const twertElement = document.getElementById(twertId)
    const commentTwertForm = twertElement.querySelector('.commentTwertContainer')
    const commentBtnContainer = commentTwertForm.querySelector('.commentBtnContainer')
    const commentBody = twertElement.querySelector('.commentTwertContainer input').value

    if (commentBody.length > 0) {
        const data = {
            userId: userId,
            authorId : authorId,
            twertId: twertId,
            commentBody: commentBody
        }
        await fetch('/db/commentThisTwert', { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.json())
        .then(comment => {
            // Increment the number of comments
            const totalCommentsElement = twertElement.querySelector('.interactContainer .comentContainer p')
            const totalComments = parseInt(totalCommentsElement.innerHTML)
            totalCommentsElement.innerHTML = totalComments + 1
            
            // If user is on the twert page, don't display the animation but display the comment
            if (window.location.href.indexOf('twert.html') != -1) {
                twertElement.removeChild(commentTwertForm)
                displayComment(comment)
            }
            // If user is on the profil page or on the home page, don't display the animation
            else if (window.location.href.indexOf('profil.html') != -1 || window.location.href.indexOf('main.html') != -1) {
                twertElement.removeChild(commentTwertForm)
            }
            // If user is on the explore page, display animation
            else {
                commentBtnContainer.removeChild(commentBtnContainer.querySelector('p'))
                commentBtnContainer.insertAdjacentHTML('afterbegin', `
                    <lottie-player src='../img/checkmark-animation.json' autoplay></lottie-player>
                `)
                setTimeout(() => {
                    // Remove the comment form
                    twertElement.removeChild(commentTwertForm)
                }, 1500)
            }
        })
    }
}
// Delete a retwert of a twert
async function deleteRtThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/deleteARetweet', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.rtContainer p')
    allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        const retwertTextElement = allTwertsTextProfile[i]
        onclickContain = retwertElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            retwertElement.style.backgroundImage = "url('../img/retweet.png')"
            retwertTextElement.innerHTML = twert.retweet.length - 1
        }
    }
    
}
// Toggle Like
async function toggleLike(idTwert, profileId) {
    const twert = await getMesageById(idTwert)
    if (twert.fav.includes(profileId)) {
        await deleteLikeThisTwert(idTwert, profileId)
    } else {
        await likeThisTwert(idTwert, profileId)
    }
}
// Like the twert
async function likeThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/addALike', options)
    const twert = await getMesageById(idTwert)
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        const likeTextElement = allLikeTextElements[i];
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            likeElement.style.backgroundImage = "url('../img/like-red.png')"
            likeTextElement.innerHTML = twert.fav.length + 1
        }
    }
}
// Delete a retwert of a twert
async function deleteLikeThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/deleteALike', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.favContainer p')
    allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        const likeTextElement = allTwertsTextProfile[i]
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            likeElement.style.backgroundImage = "url('../img/like.png')"
            likeTextElement.innerHTML = twert.fav.length - 1
        }
    }
}
// Check if the count of like or of retwert or of comment have changed
async function checkLikeRtComent(profileId){
    const twertList = await getAllMessages()
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    let allRtTextElements = document.querySelectorAll('.rtContainer p')
    let allRtElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < twertList.length; i++) {
        const twert = twertList[i];
        
        for (let j = 0; j < allLikeTextElements.length; j++) {
            const likeTextElement = allLikeTextElements[j];
            const likeElement = allLikeElements[j]
            if (likeTextElement.innerHTML != twert.fav.length.toString() && likeElement.getAttribute('onclick').includes(twert._id)) {
                if (twert.fav.includes(profileId)) {
                    likeElement.style.backgroundImage = "url('../img/like-red.png')"
                } else {
                    likeElement.style.backgroundImage = "url('../img/like.png')"
                }
                likeTextElement.innerHTML = twert.fav.length
            }
        }
        for (let j = 0; j < allRtTextElements.length; j++) {
            const rtTextElement = allRtTextElements[j];
            const retwertElement = allRtElements[j]
            if (rtTextElement.innerHTML != twert.retweet.length.toString() && retwertElement.getAttribute('onclick').includes(twert._id)) {                if (twert.retweet.includes(profileId)) {
                    retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
                } else {
                    retwertElement.style.backgroundImage = "url('../img/retweet.png')"
                }
                rtTextElement.innerHTML = twert.retweet.length
            }
        }
    }
}
function getDiffTime(createdAt) {
    const date = new Date(createdAt)
    const today = new Date()
    
    const diffMs = Math.abs(today - date)
    const diffMinutes = Math.round(diffMs / (1000 * 60))
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    else if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    else if (diffMinutes > 0) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    else return 'à l\'instant'
}
async function getMesageById(id) {
    let twert
    const options = {
        method: 'POST',
        body: id
    }
    await fetch('/db/getMessageById', options)
        .then(response => response.json())
        .then((data) => twert = data )
    return twert
}

async function getAllUserMessages(id){
    let msgList = await getAllMessages()
    let profilMsgList = []

    for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].authorId == id) {
            profilMsgList.push(msgList[i])
        }
    }
    return profilMsgList
}

async function getUser() {
    let user
    const options = {
        method: 'POST',
        body: userId
    }
    await fetch('/db/getAccount', options)
    .then(response => response.json())
    .then((data) => user = data )
    .catch(() => window.location.href = 'profilNotFound.html')
    return user
}

async function getAllMessages() {
    let messages
    await fetch('/db/getMessages')
        .then((response) => response.json())
        .then((data) => messages = data)
    return messages
}