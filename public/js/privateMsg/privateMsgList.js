// const data = {
//     userId: '606c930e33ef3f96a9a49327'
// }
// localStorage.setItem('twitt-r-data', JSON.stringify(data))

const userId = JSON.parse(localStorage.getItem('twitt-r-data')).userId
let discussionDisplayed = '' // the ID of the interlocutor of the displayed discussion

getPrivateDiscussions()

//Each 2 seconds, check if a new private discussion was created
setInterval(async () => {
    let allPrivateDiscussion = await getAllPrivateDiscussions();
    let privateDiscussionList = document.querySelectorAll('.privateMsgList .privateMsg')

    // console.log('local  : '+privateDiscussionList.length);
    // console.log('in BDD : '+allPrivateDiscussion.length);

    if (privateDiscussionList.length != allPrivateDiscussion.length) {
        let diffDiscussion = allPrivateDiscussion.length - privateDiscussionList.length

        for (let i = 1; i <= diffDiscussion; i++) {
            const discussion = allPrivateDiscussion[allPrivateDiscussion.length - i]
            if (discussion.messages.length > 0) displayPrivateDiscussion(discussion)
        }
    }
}, 2000)

async function getPrivateDiscussions() {
    // Get all private discussion of a specific user
    await fetch('/db/getAllPrivateDiscussionOfUser', { method: 'POST', body: userId })
    .then(response => response.json())
    .then(privateDiscussionList => {
        if (privateDiscussionList.length > 0) {
            privateDiscussionList.forEach(discussion => {
                if (discussion.messages.length > 0) displayPrivateDiscussion(discussion)
                //displayPrivateDiscussion(discussion)
            })
        } else {
            // Display the empty discussion message
            document.querySelector('.emptyPrivateDiscussionMsg').style.display = 'block'
        }
    })
}
function displayPrivateDiscussion(discussion) {
    const privateMsgList = document.querySelector('.privateMsgList')
    privateMsgList.insertAdjacentHTML('afterbegin', `
        <div class="privateMsg" onclick="displayMessages('${discussion.interlocutorId}', '${discussion.interlocutor}', '${discussion._id}')" id='${discussion._id}'>
            <p class="privateMsgUsername">${discussion.interlocutor}</p>
            <p class="privateMsgDate">${displayDiffTime(discussion.messages[discussion.messages.length - 1].date)}</p>
        </div>
    `)
}
function displayDiffTime(lastMsgTime) {
    // Return the difference time between the last message sent and now
    const date = new Date(lastMsgTime)
    const today = new Date()
    
    const diffMs = Math.abs(today - date)
    const diffMinutes = Math.round(diffMs / (1000 * 60))
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays}j`
    else if (diffHours > 0) return `${diffHours}h`
    else if (diffMinutes > 0) return `${diffMinutes}m`
    else return 'à l\'instant'
}
async function getAllPrivateDiscussions() {
    let toReturn
    await fetch('/db/getAllPrivateDiscussionOfUser', { method: 'POST', body: userId })
    .then(response => response.json())
    .then(privateDiscussionList => toReturn = privateDiscussionList)

    return toReturn
}
