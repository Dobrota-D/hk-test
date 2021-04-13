// Get twert ID from url
const url = window.location.search
const urlParams = new URLSearchParams(url)
const twertId = urlParams.get('id')

const accountId = JSON.parse(localStorage.getItem('twitt-r-data')).userId

displayTwert()
displayAllComments()

async function displayTwert() {
    const twert = await getTwert(twertId)
    const author = await getTwertAuthor(twert.authorId)

    // Display twert
    document.querySelector('.twertContainer').insertAdjacentHTML('afterbegin', `
        <div class="twert firstTwert" id="${twert._id}">
            <div class="twertUserAndBody">
                <div class="ppTwertContainer">
                    <div class="ppTwert">
                        <a href="profil.html?id=${author._id}"><img src="${author.profilImg}" alt="profilImage"></a>
                    </div>
                </div>
                <div class="twertInfoContainer">
                    <div class="twertInfo">
                        <a href="profil.html?id=${author._id}"><p class="username">${author.username}</p></a>
                        <p class="diffTime">${getDiffTime(twert.createdAt)} </p>
                    </div>
                    <div class="twertContent">
                        <p class="body">${twert.body}</p>
                    </div>
                </div>
                </div>
                <div class="interactContainer">
                <div class="comentContainer">
                    <button type="button" class="comentIcon btn" onclick="commentThisTwert('${twert._id}','${accountId}', '${author.username}', '${author._id}')"></button>
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
}
async function displayAllComments() {
    const twertComments = await getTwertComments(twertId)

    twertComments.forEach(comment => {
        displayComment(comment)
    })
}

async function displayComment(comment) {
    document.querySelector('.twertContainer .twertCommentsContainer').insertAdjacentHTML('afterbegin', `
        <div class="twert">
            <div class="twertUserAndBody">
            <div class="ppTwertContainer">
                <div class="ppTwert">
                    <a href="profil.html?id=${comment.authorId}"><img src="${comment.authorProfileImg}" alt="profilImage"></a>
                </div>
            </div>
            <div class="twertInfoContainer">
                <div class="twertInfo">
                    <a href="profil.html?id=${comment.authorId}"><p class="username">${comment.authorName}</p></a>
                    <p class="diffTime">${getDiffTime(comment.createdAt)}</p>
                </div>
                <div class="twertContent">
                    <p class="body">${comment.commentBody}</p>
                </div>
            </div>
        </div>
    `)
}

async function getTwertAuthor(id) {
    let toReturn

    await fetch('/db/getAccount', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}
async function getTwert(id) {
    let toReturn

    await fetch('/db/getMessageById', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}
async function getTwertComments(id) {
    let toReturn

    await fetch('/db/getAllCommentsOfTwert', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}