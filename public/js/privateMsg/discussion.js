const discussionContainer = document.querySelector('.discussionContainer .discussion')   
const discussionInput = document.querySelector('.discussionInputContainer input')
const sendMsgBtn = document.querySelector('.discussionInputContainer button')
let interval

// If user hit the enter key when writing a message, send the message
discussionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMsg(discussionInput.getAttribute('interlocutor-id'))
})

async function displayMessages(interlocutorId, interlocutor, discussionId) {
    // Hide the empty discussion message
    document.querySelector('.emptyDiscussion').style.display = 'none'
    // Set the selected style to the private discussion
    setActivePrivateDiscussion(discussionId)

    // Check if the discussion isn't already displayed
    if (interlocutorId != discussionDisplayed) {
        discussionDisplayed = interlocutorId
        clearInterval(interval)

        // Set the good interlocutor ID for input and button
        discussionInput.placeholder = `Écrire à ${interlocutor}`
        discussionInput.setAttribute('interlocutor-id', interlocutorId)
        sendMsgBtn.setAttribute('onclick', `sendMsg('${interlocutorId}')`)

        // Display all messages of the discussion
        const data = {
           userId: userId,
           interlocutorId: interlocutorId 
        }
        // Get all messages between user and interlocutor
        await fetch('/db/getPrivateDiscussion', { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.json())
        .then(discussion => {
            const interlocutorNameElement = document.querySelector('.discussionContainer .discussionTitle p')
            const interlocutorNameLink = document.querySelector('.discussionContainer .discussionTitle a')
            
            // Set the name of the interlocutor
            interlocutorNameElement.innerHTML = discussion.interlocutor
            interlocutorNameLink.setAttribute('href', `profil.html?id=${discussion.interlocutorId}`)
    
            // Reset the discussion container
            const discussionMsg = document.querySelectorAll('.discussionContainer .discussion div')
            discussionMsg.forEach(msg => {
                discussionContainer.removeChild(msg)
            })

            // Display all messages of the discussion
            discussion.messages.forEach(msg => {
                displayMsg(msg)
            })

            // Scroll to the bottom of the discussion container
            discussionContainer.scrollTop = discussionContainer.scrollHeight
        })
        // Each 2 seconds, check if there is a new message
        interval = setInterval(async () => {
            let AllMessages = await getAllMessagesOfDiscussion(userId, interlocutorId);
            let messagesList = document.querySelectorAll('.discussionContainer .discussion .msgContainer')

            if (messagesList.length != AllMessages.length) {
                let diffMsg = AllMessages.length - messagesList.length

                for (let i = 1; i <= diffMsg; i++) {
                    const msg = AllMessages[AllMessages.length - i]
                    displayMsg(msg)
                }
            }  
        }, 2000)
    }
}
function displayMsg(msg) {
    discussionContainer.insertAdjacentHTML('beforeend', `
        <div class="msgContainer ${msg.author}">
            <p>${msg.body}</p>
        </div>
    `)
    // Scroll to the bottom of the discussion container
    discussionContainer.scrollTop = discussionContainer.scrollHeight
}
async function sendMsg(interlocutorId) {
    // Get message body
    const msgBody = discussionInput.value
    if (msgBody.length > 0) {
        discussionInput.value = ''
        
        // Display the message in the discussion container
        displayMsg({ author: 'user', body: msgBody })
    
        // Save the message in the database
        const data = {
            msgBody: msgBody,
            interlocutorId: interlocutorId,
            userId: userId
        }
        await fetch('/db/saveNewMsg', { method: 'POST', body: JSON.stringify(data) })
        // Update the date of the discussion
        document.querySelector('.privateMsgListContainer .active .privateMsgDate').innerHTML = 'à l\'instant'
    }
}
async function getAllMessagesOfDiscussion(userId, interlocutorId) {
    let toReturn
    const data = {
        userId: userId,
        interlocutorId: interlocutorId
    }
    await fetch('/db/getPrivateDiscussion', { method: 'POST', body: JSON.stringify(data) })
    .then(response => response.json())
    .then((discussion) => {
        toReturn = discussion.messages
    })
    return toReturn
}
function setActivePrivateDiscussion(discussionId) {
    // Delete the last active class
    const activePrivateDiscussion = document.querySelector('.privateMsgList .active')
    if (activePrivateDiscussion) activePrivateDiscussion.classList.remove('active')
    // Add the active class to the new active discussion
    document.getElementById(discussionId).classList.add('active')

}

// fetch('/db/createAccount', { method: 'POST', body: JSON.stringify({
//     username: 'Ougo 1',
//         email: 'ougo1@gmail.com',
//         password: 'azerty'
// }) })
// fetch('/db/createAccount', { method: 'POST', body: JSON.stringify({
//     username: 'Ougo 3',
//         email: 'ougo3@gmail.com',
//         password: 'azerty'
// }) }).then(response => console.log(response))