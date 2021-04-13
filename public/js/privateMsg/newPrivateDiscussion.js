const newPrivateDiscussionBtn = document.querySelector('.newDiscussionImg')
const searchUserContainer = document.querySelector('.searchUserContainer')

fillSearchUserContainer()

async function fillSearchUserContainer() {
    // Display all user
    const userList = document.querySelector('.searchUserContainer .userList')
    const users = await getAllUsernames()

    users.forEach(user => {
        userList.insertAdjacentHTML('afterbegin', `<p onclick="createNewPrivateDiscussion('${user.userId}', '${user.username}')">${user.username}</p>`)
    })
}

// User search system
const searchInput = document.querySelector('.searchUserInput input')
const emptyUserList = document.querySelector('.emptyUserList')

searchInput.addEventListener('input', async () => {
    const toSearch = searchInput.value.toLowerCase()
    const usernames = document.querySelectorAll('.searchUser .userList p')
    
    usernames.forEach(usernameElement => {
        const username = usernameElement.innerHTML.toLowerCase();

        // If the username body doesn't match with the user input, hide the username
        if (username.indexOf(toSearch) == -1) usernameElement.style.display = 'none'
        else usernameElement.style.display = 'flex'
    })

    // If all usernames are hiden, display the error message
    let hiddenUsernames = 0

    usernames.forEach(username => {
        if (username.style.display == 'none') hiddenUsernames++
    })

    if (hiddenUsernames == usernames.length) emptyUserList.style.display = 'block'
    else emptyUserList.style.display = 'none'
})
async function createNewPrivateDiscussion(interlocutorId, interlocutor) {
    // Hide the search user section
    searchUserContainer.style.display = 'none'

    // Create the new private discussion in the database
    const discussion = {
        interlocutor: interlocutor,
        interlocutorId: interlocutorId,
        userId: userId
    }
    await fetch('/db/newPrivateDiscussion', { method: 'POST', body: JSON.stringify(discussion) })
    .then(() => displayNewPrivateDiscussion(discussion))
}
function displayNewPrivateDiscussion(discussion) {
    // Hide the empty discussion message
    const emptyPrivateDiscussionMsg = document.querySelector('.emptyPrivateDiscussionMsg')
    emptyPrivateDiscussionMsg.style.display = 'none'

    const privateMsgList = document.querySelector('.privateMsgList')
    privateMsgList.insertAdjacentHTML('afterbegin', `
        <div class="privateMsg" onclick="displayMessages('${discussion.interlocutorId}', '${discussion.interlocutor}', '${discussion._id}')" id='${discussion._id}'>
            <p class="privateMsgUsername">${discussion.interlocutor}</p>
            <p class="privateMsgDate">à l'instant</p>
        </div>
    `)
    // Show the discussion
    displayMessages(discussion.interlocutorId, discussion.interlocutor)
}

async function getAllUsernames() {
    let toReturn
    await fetch('/db/getAllUsernames')
    .then(response => response.json())
    .then(usernames => toReturn = usernames)
    
    return toReturn
}