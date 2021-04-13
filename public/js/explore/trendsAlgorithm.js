// This algorithm automatically search trends in function of the total twerts number of the trend subject

searchTrends()

async function searchTrends() {
    const allTwerts = await getAllTwerts()
    searchForHashtag(allTwerts)

}

function searchForHashtag(allTwerts) {
    let hashtagArray = []
    
    // Parcour all twerts and get the total number of mention for each hashtag
    allTwerts.forEach(twert => {
        // Detect if a the body of the twert contains a hashtag
        const hashtagRegexp = /#[a-zA-Z0-9]+/
        const match = twert.body.match(hashtagRegexp)

        // Add match to hashtagArray
        if (match) {
            const newHashtag = match[0].toLowerCase()
            addHashtagToHashtagArray(hashtagArray, newHashtag)
        }
    })
    // Detect the most trending hashtag with the total number of mentions
    displayTrends(hashtagArray)
}

function addHashtagToHashtagArray(hashtagArray, newHashtag) {
    let foundHashtag = false
    
    for (let i = 0; i < hashtagArray.length; i++) {
        const hashtag = hashtagArray[i];

        // If the hashtag is already in the array, increment the total number of the hashtag
        if (hashtag.body == newHashtag) {
            foundHashtag = true
            hashtagArray[i].counter += 1
        }
    }
    // If the hashtag isn't in the array, create a new hashtag in the array
    if (!foundHashtag) {
        const obj = {
            body: newHashtag,
            counter: 1
        }
        hashtagArray.push(obj)
    }
}

function displayTrends(hashtagArray) {
    const trendsContainer = document.querySelector('.exploreTrends ul')

    // Reorganize the hashtagArray to sort hit in decreasing order
    // Based on the counter of each hashtag
    hashtagArray.sort((a, b) => b.counter - a.counter)
    
    // Display trends
    const maxTrendsToDisplay = 4

    for (let i = 0; i < maxTrendsToDisplay; i++) {
        const trend = hashtagArray[i];
        trendsContainer.insertAdjacentHTML('beforeend', `
            <li>
                <p class="trendBody">${trend.body}</p>
                <p class="trendTotalTwert">${trend.counter} twert${trend.counter > 1 ? 's' : ''}</p>
            </li>
        `)
    }
    // When all trends are displayed, set a listener on each of them
    setTrendsListener()
}

async function getAllTwerts() {
    let toReturn

    await fetch('/db/getMessages')
    .then(response => response.json())
    .then(twertList => toReturn = twertList)

    return toReturn
}