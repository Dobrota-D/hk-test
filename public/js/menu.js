// Set the good link to go to the profil page
const userlocalId = JSON.parse(localStorage.getItem('twitt-r-data')).userId
const profilBtn = document.querySelector('.menuContainer .menuProfilLink a')
profilBtn.setAttribute('href', `profil.html?id=${userlocalId}`)