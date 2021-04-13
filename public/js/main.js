// const data = {
//     userId: '606c930e33ef3f96a9a49326'
// }
// localStorage.setItem('twitt-r-data', JSON.stringify(data))

const twertListContainer = document.querySelector('.twertListContainer')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId

displayTimeLine()

// Set the profil img and the link to the profil page
setProfilImgAndLink()

// Set the textarea listener
const textarea = document.querySelector('.createNewTwertInputContainer textarea')
textarea.addEventListener('input', () => {
    document.querySelector('.createNewTwertInputContainer span').innerHTML = textarea.value.length + '/255'
})

async function displayTimeLine() {
    // Get twerts ans retwerts of all followed profil of the user
    const followedProfilsActivity = await fetch('/db/getFollowedProfilsActivity', { method: 'POST', body: accountId }).then(response => response.json())

    followedProfilsActivity.forEach(async twert => {
        const user = await getTwertAuthor(twert.authorId)
        displayTwert(twert, user)
    })
}
async function displayAllTwerts() {
    const twertList = await getAllTwerts()

    twertList.forEach(async twert => {
        const user = await getTwertAuthor(twert.authorId)
        displayTwert(twert, user)
    })
}
function displayTwert(twert, user) {
    document.querySelector('.twertListContainer').insertAdjacentHTML('afterbegin', `
        <div class="twertCard" id="${twert._id}">
            ${twert.isRetwert ? `
                <div class="retwertMsgContainer">
                    <img src="../img/retweet2.png" alt="retwerter">
                    <p class="retwertMsg"><a href="profil.html?id=${twert.retwertAuthorId}">${twert.retwertAuthor}</a> a retwerté</p>
                </div>
            ` : ''}
            <div class="twertUserAndBody" onclick="goToTwertPage('${twert._id}')">
                <div class="ppTwertContainer">
                    <div class="ppTwert">
                        <img src="${user.profilImg}" alt="profilImage">
                    </div>
                </div>
                <div class="twertInfoContainer">
                    <div class="twertInfo">
                        <p class="username">${user.username}</p>
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
                    <button type="button" class="rtIcon btn" onclick="rtThisTwert('${twert._id}','${accountId}')"></button>
                    <p>${twert.retweet.length}</p>
                </div>
                <div class="favContainer">
                    <button type="button" class="favIcon btn" onclick="likeThisTwert('${twert._id}','${accountId}')"></button>
                    <p>${twert.fav.length}</p>
                </div>
            </div>
        </div>
    `)
}
async function setProfilImgAndLink() {
    // Set the profil img
    const user = await getTwertAuthor(accountId)
    document.querySelector('.profilImgContainer img').src = user.profilImg 

    // Set the profil link
    document.querySelector('.profilImgContainer a').setAttribute('href', `profil.html?id=${accountId}`)
}
async function validTextArea(){
    let authorId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId
    let authorName = await getAuthorName(authorId);
    let msg = document.querySelector('#msgArea').value

    if (msg.length > 0) {
        let messageData = {
            authorId: authorId,
            authorName: authorName,
            body: msg
        }
    
        let sendData = {
            method: 'POST',
            body: JSON.stringify(messageData)
        }
        await fetch ('/db/sendMsg', sendData).then(() => document.getElementById('msgArea').value = '')
    }
}
async function getAuthorName(authorId){
    let options = {
        method: 'POST',
        body: authorId
    }
    let x;
    await fetch ('/db/getAuthorName', options)
    .then(response=>response.text())
    .then(username=>{
        x=username;
    })
    return x
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
async function getAllTwerts() {
    let toReturn

    await fetch('/db/getMessages')
    .then(response => response.json())
    .then(twertList => toReturn = twertList)

    return toReturn
}

async function getTwertAuthor(id) {
    let toReturn

    await fetch('/db/getAccount', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}

async function rtThisTwert(idTwert, userId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addARetweet', options)
}
async function likeThisTwert(idTwert, userId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addALike', options)
}


