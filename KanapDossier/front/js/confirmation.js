////Récupérationn de l'id commande dans l'url////
let url = window.location.href
let newUrl = new URL(url)
let orderId = newUrl.searchParams.get('id')

////Placement de l'id commande dans le DOM////
document.querySelector('#orderId').innerHTML = `${orderId}`