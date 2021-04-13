const exploreInput = document.querySelector('.exploreInputContainer input')
const emptyTwertMsg = document.querySelector('.emptyTwertMsg')

exploreInput.addEventListener('input', () => {
    searchTwert(exploreInput.value.toLowerCase())
})

function setTrendsListener() {
    // When user click on a trend, search and display all twerts of this trend
    const trends = document.querySelectorAll('.exploreTrends li')
    
    for (let i = 0; i < trends.length; i++) {
        trends[i].addEventListener('click', () => {
            exploreInput.value = trends[i].querySelector('.trendBody').innerHTML
            searchTwert(exploreInput.value.toLowerCase())
        })
    }
}

function searchTwert(toSearch) {
    // Twert search system
    const twerts = document.querySelectorAll('.twertListContainer .twertCard')
    
    twerts.forEach(twertElement => {
        const twert = twertElement.querySelector('.twertContent .body').innerHTML.toLowerCase();

        // If the twert body doesn't match with the user input, hide the twert
        if (twert.indexOf(toSearch) == -1) twertElement.style.display = 'none'
        else twertElement.style.display = 'block'
    })

    // If all twerts are hiden, display the error message
    let hiddenTwert = 0

    twerts.forEach(twert => {
        if (twert.style.display == 'none') hiddenTwert++
    })

    if (hiddenTwert == twerts.length) {
        emptyTwertMsg.style.display = 'block'
        emptyTwertMsg.querySelector('span').innerHTML = toSearch
    }
    else emptyTwertMsg.style.display = 'none'
}