// Get user id from url
const url = window.location.search
const urlParams = new URLSearchParams(url)
const userId = urlParams.get('id')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId
const totalTwertsElements = document.querySelectorAll('.twertsCounter span')
const descriptionElement = document.querySelector('.description')
const followAndFollowersElements  = document.querySelectorAll('.counterFollow span')
const twertsContainerElement = document.querySelector('.twertsContainer')

setUserData()

async function setUserData() {  

    // Get user profile from id
    let user = await getUser(userId)

    // Set background profile picture 
    const backgroundProfilContainer = document.querySelector('.backgroundImage img')
    backgroundProfilContainer.src = user.backgroundProfilImg

    // Set profile picture 
    const profilePictureContainer = document.querySelector('.profilImage img')
    profilePictureContainer.src = user.profilImg

    // Set the username on each span who contains the class "username"
    const usernameSpanList = document.querySelectorAll('.username')
    for (let i = 0; i < usernameSpanList.length; i++) {
        usernameSpanList[i].innerHTML = user.username
    }

    // Set the total twerts counter
    const totalTwertsCounter = await getAllUserMessagesCount(userId)
    totalTwertsElements[0].innerHTML = totalTwertsCounter
    totalTwertsElements[1].innerHTML = `Twert${totalTwertsCounter > 1 ? 's' : ''}`

    // Set the description of the profile
    const descriptionProfile = user.description
    descriptionElement.innerHTML = descriptionProfile

    // Set the count of follow and followers
    const followersCount = user.followers
    const followCount = user.follow
    followAndFollowersElements[0].innerHTML = followersCount.length + ' '
    followAndFollowersElements[1].innerHTML = ` abonné${followersCount.length > 1 ? 's' : ''}`
    followAndFollowersElements[2].innerHTML = followCount.length + ' '
    followAndFollowersElements[3].innerHTML = ` abonnement${followCount.length > 1 ? 's' : ''}`
    
    $('.twertsOfProfilBtn').click()
}
// Display all the message for this profile
async function displayTwertProfile() {
    $('.twertsOfProfilBtn').css({"color": "rgb(29, 161, 242)" , "border-bottom": "2px solid rgb(29, 161, 242)"})
    $('.twertsLikeOfProfilBtn').css({"color": "rgb(136, 153, 166)" , "border-bottom": "0"})
    const twertsElements = document.querySelectorAll('.twertsContainer .twertCard')
    // Get user profile from id
    let user = await getUser(userId)
    // Delete all twerts in the container
    for (let i = 0; i < twertsElements.length; i++) {
        twertsContainerElement.removeChild(twertsElements[i]);
    }
    let msgCounter = 0
    // Display all the twerts
    const allTwertsProfile = await getAllUserMessages(userId)
    for (let i = 0; i < allTwertsProfile.length; i++) {
        const twert = allTwertsProfile[i];
        twertsContainerElement.insertAdjacentHTML('afterbegin', `
            <div class="twertCard" id="${twert._id}">
                <div class="twertUserAndBody" onclick="goToTwertPage('${twert._id}')">
                    <div class="ppTwertContainer">
                        <div class="ppTwert">
                            <a href="profil.html?id=${user._id}"><img src="${user.profilImg}" alt="profilImage"></a>
                        </div>
                    </div>
                    <div class="twertInfoContainer">
                        <div class="twertInfo">
                            <a href="profil.html?id=${user._id}"><p class="username">${user.username}</p></a>
                            <p class="diffTime">${getDiffTime(twert.createdAt)} </p>
                        </div>
                        <div class="twertContent">
                            <p class="body">${twert.body}</p>
                        </div>
                    </div>
                </div>
                <div class="interactContainer">
                    <div class="comentContainer">
                        <button type="button" class="comentIcon btn" onclick="commentThisTwert('${twert._id}','${accountId}', '${user.username}', '${user._id}')"></button>
                        <p>${twert.comments.length}</p>
                    </div>
                    <div class="rtContainer">
                        <button type="button" class="rtIcon btn" onclick="toggleRt('${twert._id}','${accountId}')"></button>
                        <p>${twert.retweet.length}</p>
                    </div>
                    <div class="favContainer">
                        <button type="button" class="favIcon btn" onclick="toggleLike('${twert._id}','${accountId}')"></button>
                        <p>${twert.fav.length}</p>
                    </div>
                </div>
            </div>
        `)
        msgCounter++
        let allRetwertElements = document.querySelectorAll('.rtIcon')
        for (let i = 0; i < allRetwertElements.length; i++) {
            const retwertElement = allRetwertElements[i];
            onclickContain = retwertElement.getAttribute('onclick')
            if (onclickContain.includes(twert._id) && twert.retweet.includes(accountId)) {
                retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
            }
        }
        let allLikeElements = document.querySelectorAll('.favIcon')
        for (let i = 0; i < allLikeElements.length; i++) {
            const likeElement = allLikeElements[i];
            onclickContain = likeElement.getAttribute('onclick')
            if (onclickContain.includes(twert._id) && twert.fav.includes(accountId)) {
                likeElement.style.backgroundImage = "url('../img/like-red.png')"
            }
        }
    }
    // If user has no message, display the empty message
    if (msgCounter == 0) {
        document.querySelector('.twertsContainer .emptyMsgAlert').style.display = 'block'
    }
}
// Display all the message that the profile liked
async function displayLikedTwertProfile() {
    $('.twertsOfProfilBtn').css({"color": "rgb(136, 153, 166)" , "border-bottom": "0"})
    $('.twertsLikeOfProfilBtn').css({"color": "rgb(29, 161, 242)" , "border-bottom": "2px solid rgb(29, 161, 242)"})
    const twertsElements = document.querySelectorAll('.twertsContainer .twertCard')
    // Get user profile from id
    let user = await getUser(userId)
    // Delete all twerts in the container
    for (let i = 0; i < twertsElements.length; i++) {
        twertsContainerElement.removeChild(twertsElements[i]);
    }
    let msgCounter = 0
    // Display all the twerts
    const allTwerts = await getAllMessages()
    for (let i = 0; i < allTwerts.length; i++) {
        const twert = allTwerts[i];
        if (twert.fav.includes(userId)) {
            let userLiked = await getUser(twert.authorId)
            twertsContainerElement.insertAdjacentHTML('afterbegin', `
            <div class="twertCard" id="${twert._id}">
                <div class="twertUserAndBody" onclick="goToTwertPage('${twert._id}')">
                    <div class="ppTwertContainer">
                        <div class="ppTwert">
                            <img src="${userLiked.profilImg}" alt="profilImage">
                        </div>
                    </div>
                    <div class="twertInfoContainer">
                        <div class="twertInfo">
                            <p class="username">${twert.authorName}</p>
                            <p class="diffTime">${getDiffTime(twert.createdAt)}</p>
                        </div>
                        <div class="twertContent">
                            <p class="body">${twert.body}</p>
                        </div>
                    </div>
                </div>
                <div class="interactContainer">
                    <div class="comentContainer">
                        <button type="button" class="comentIcon btn" onclick="commentThisTwert('${twert._id}','${accountId}')"></button>
                        <p>${twert.comments.length}</p>
                    </div>
                    <div class="rtContainer">
                        <button type="button" class="rtIcon btn" onclick="toggleRt('${twert._id}','${accountId}')"></button>
                        <p>${twert.retweet.length}</p>
                    </div>
                    <div class="favContainer">
                        <button type="button" class="favIcon btn" onclick="toggleLike('${twert._id}','${accountId}')"></button>
                        <p>${twert.fav.length}</p>
                    </div>
                </div>
            </div>
        `)
        msgCounter++
        }
        let allRetwertElements = document.querySelectorAll('.rtIcon')
        for (let i = 0; i < allRetwertElements.length; i++) {
            const retwertElement = allRetwertElements[i];
            onclickContain = retwertElement.getAttribute('onclick')
            if (onclickContain.includes(twert._id) && twert.retweet.includes(accountId)) {
                retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
            }
        }
        let allLikeElements = document.querySelectorAll('.favIcon')
        for (let i = 0; i < allLikeElements.length; i++) {
            const likeElement = allLikeElements[i];
            onclickContain = likeElement.getAttribute('onclick')
            if (onclickContain.includes(twert._id) && twert.fav.includes(accountId)) {
                likeElement.style.backgroundImage = "url('../img/like-red.png')"
            }
        }
    }
    // If user has no message, display the empty message
    if (msgCounter == 0) {
        document.querySelector('.twertsContainer .emptyMsgAlert').style.display = 'block'
    }
}

async function getUser(authorId) {
    let user
    const options = {
        method: 'POST',
        body: authorId
    }
    await fetch('/db/getAccount', options)
    .then(response => response.json())
    .then((data) => user = data )
    .catch(() => window.location.href = 'profilNotFound.html')
    return user
}

async function getAllUserMessagesCount(id) {
    let msgList = await getAllMessages()
    let msgCounter = 0

    for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].authorId == id) {
            msgCounter++
        }
    }
    return msgCounter
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

async function getAllMessages() {
    let messages
    await fetch('/db/getMessages')
        .then((response) => response.json())
        .then((data) => messages = data)
    return messages
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