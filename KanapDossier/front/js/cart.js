////Récupération données API////
const url = 'http://localhost:3000/api/products'
let sofaData = [];

const request = async () => {
  await fetch(url)
  .then((resolve) => resolve.json())
  .then ((data) => {
    sofaData = data
  })
  .catch(function(error){
    alert('HTTP Error ' + error.status)
  })
}

/*Fonction pour afficher le prix de manière dynamique 
(sans une présence dans le localstorage de cette donnée sensible)*/
const priceDisplay = async () => {
  
  await request()
  await cartSofa

  for (sofa of cartSofa) {

    sofaData.forEach((element) => {

      if (sofa.id == element._id) {

        sofa.price = element.price
      }
    })
  }
}
priceDisplay()

/*Récupération dans le localstorage des données produits en instance
  de commande par l'utilisateur*/
let cartSofa = JSON.parse(localStorage.getItem('sofaElements'))

////Tableaux utiles pour des différentes fonctions ci-dessous////
let sofaTotalQuantity = []
let sofaTotalPrice = []

let orderProducts = []

////Fonction avec méthode pour implanter les données du localstorage dans le DOM////
const basketDisplay = async () => {

    await cartSofa
    await request()

      document.querySelector('#cart__items').innerHTML =  cartSofa.map(
        (sofa) => `
          <article class="cart__item" data-id="${sofa.id}" data-color="${sofa.color}">
              <div class="cart__item__img">
                <img src="${sofa.imageUrl}" alt="${sofa.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${sofa.name}</h2>
                  <p>${sofa.color}</p>
                  <p>${sofa.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p class="paragraphQuantity" >Qté : ${sofa.totalityQuantity}</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value="${sofa.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
            ` 
            ).join("")

            changeQuantityWithArrow()
            
            inputKeyLimit()
            
            inputKeydown()

            remove()

            removeByInput()

            buttonRemove()

            totalProduct()

            totalPrice()
      }

basketDisplay()

/*Fonction pour enregistrer dans le DOM les éventuels changements de quantité
  voulus par l'utilisateur*/
const changeQuantityWithArrow = async (basketDisplay) => {

  await basketDisplay
    
  let allInput = document.querySelectorAll('.itemQuantity')

  allInput.forEach((input) => {
    input.addEventListener('change', () => {
      let article = input.closest('article')
      let divSettingsQuantity = input.closest('.cart__item__content__settings__quantity')
      let paragraph = divSettingsQuantity.firstElementChild

      for (let sofa of cartSofa) {
        if (sofa.id == article.dataset.id && sofa.color == article.dataset.color && input.value > sofa.totalityQuantity) {
          paragraph.innerHTML = `Qté : ${input.value}`
          return sofa.totalityQuantity = input.value,
          sofa.quantity = input.value,
          localStorage.setItem('sofaElements', JSON.stringify(cartSofa)),
          cartSofa = JSON.parse(localStorage.getItem('sofaElements')),
          document.querySelector('#totalQuantity').innerHTML = `${totalProduct(cartSofa)}`,
          document.querySelector('#totalPrice').innerHTML = `${totalPrice(cartSofa)}`
        }
        else if (sofa.id == article.dataset.id && sofa.color == article.dataset.color && input.value < sofa.totalityQuantity) {
          paragraph.innerHTML = `Qté : ${input.value}`
          return sofa.totalityQuantity = input.value,
          sofa.quantity = input.value,
          localStorage.setItem('sofaElements', JSON.stringify(cartSofa)),
          cartSofa = JSON.parse(localStorage.getItem('sofaElements')),
          document.querySelector('#totalQuantity').innerHTML = `${totalProduct(cartSofa)}`,
          document.querySelector('#totalPrice').innerHTML = `${totalPrice(cartSofa)}`
        }
      }  
    })
  })
        
  return cartSofa = JSON.parse(localStorage.getItem('sofaElements'))
}

////Fonction pour empêcher les décimales et autres sémantiques mathématiques inappropriées////
const inputKeyLimit = async (basketDisplay) => {

  await basketDisplay

  let inputsKey = document.querySelectorAll('.itemQuantity')

    for (let inputKey of inputsKey) {
      
    inputKey.addEventListener('keydown', (e) => {
      if (e.keyCode == '188'){
          e.preventDefault()
      }
      else if (e.keyCode == '54'){
        e.preventDefault()
      }
      else if (e.keyCode == '110'){
        e.preventDefault()
      }
      else if (e.keyCode == '190'){
        e.preventDefault()
      }
    })
  }
}

/*Fonction pour rendre dynamique dans le DOM l'incrémentation ou la décrémentation
  si l'utilisateur entre directement sa quantité voulue dans l'input*/
const inputKeydown = async (basketDisplay) => {

  await basketDisplay
  
  let inputQuantity = document.querySelectorAll('.itemQuantity')
  inputQuantity.forEach((valueInput) => {
    valueInput.addEventListener('keyup', (e) => {
      let article = valueInput.closest('article')
      let divSettingsQuantity = valueInput.closest('.cart__item__content__settings__quantity')
      let paragraph = divSettingsQuantity.firstElementChild
      for (let sofa of cartSofa) {
        if (sofa.id == article.dataset.id && sofa.color == article.dataset.color) {
          paragraph.innerHTML = 'Qté : ' + e.target.value
        }
      }
    })
  }) 
}

/*Fonction pour supprimer du DOM et du localstorage tout produit
  dont la quantité serait égal à zéro par la décrémentation sur l'input
  du produit visé par l'utilisateur*/
const remove = async (basketDisplay) => {

  await basketDisplay
            
  let allInput = document.querySelectorAll('.itemQuantity')
      
    allInput.forEach((input) => {

      input.addEventListener('change', () => {

      let article = input.closest('article')
      
      for (i = 0; i < cartSofa.length; i++) {

        if (cartSofa[i].quantity == 0 && cartSofa.length > 1) {
        cartSofa.splice(i, 1)
        return localStorage.setItem('sofaElements', JSON.stringify(cartSofa)),
        article.remove()
        }
        else if (cartSofa[i].quantity == 0 && cartSofa.length == 1) {
        return localStorage.removeItem('sofaElements'),
        location.href = 'index.html' // Retour sur la page d'accueil en cas de panier vidé par l'utilisateur
        }
      }
    })
  })
}

/*Fonction pour supprimer du DOM et du localstorage tout produit
  dont la balise <p> de la quantité serait égal à "" via la décrémentation sur l'input
  du produit visé par l'utilisateur, et où serait par conséquent au produit visé, 
  la quantité dans le localstorage, égal à "*/
const removeByInput = async (basketDisplay) => {

  await basketDisplay
            
  let allInput = document.querySelectorAll('.itemQuantity')
      
    allInput.forEach((input) => {

      input.addEventListener('change', () => {

      let article = input.closest('article')
      
      for (i = 0; i < cartSofa.length; i++) {
      
        if (cartSofa[i].quantity == '' && cartSofa.length > 1) {
          cartSofa.splice(i, 1)
          return localStorage.setItem('sofaElements', JSON.stringify(cartSofa)),
          article.remove()
        }
        else if (cartSofa[i].quantity == '' && cartSofa.length == 1) {
        return localStorage.removeItem('sofaElements'),
        location.href = 'index.html' // Retour sur la page d'accueil en cas de panier vidé par l'utilisateur
        }
      }
    })
  })
}

/*Fonction pour supprimer du DOM et du localstorage par le click du bouton "supprimer",
  le produit visé par l'utilisateur*/
const buttonRemove = async (basketDisplay) => {
      
  await basketDisplay
  let buttonDelete = document.querySelectorAll('.deleteItem')
        
  buttonDelete.forEach((button) => {
      
    button.addEventListener('click', () => {
      
      let article = button.closest('article')
      for (i = 0; i < cartSofa.length; i++) {
      
        if (cartSofa[i].id == article.dataset.id && cartSofa[i].color == article.dataset.color && cartSofa.length > 1) {
          cartSofa.splice(i, 1)
          return localStorage.setItem('sofaElements', JSON.stringify(cartSofa)),
          document.querySelector('#totalQuantity').innerHTML = `${totalProduct(cartSofa)}`,
          document.querySelector('#totalPrice').innerHTML = `${totalPrice(cartSofa)}`,
          article.remove()
        }
        else if (cartSofa[i].id == article.dataset.id && cartSofa[i].color == article.dataset.color && cartSofa.length == 1) {
          return localStorage.removeItem('sofaElements'),
          location.href = 'index.html' // Retour sur la page d'accueil en cas de panier vidé par l'utilisateur
        }  
      } 
    })
  })
}

/* Fonction pour calculer la quantité totale de produits (articles), et afficher
  le résultat de manière dynamique sur la page*/
const totalProduct = () => {

if (cartSofa) {
  
  let totalArticle = 0

  cartSofa.forEach((sofa) => {
    totalArticle += Number(sofa.quantity)
    })
    return document.querySelector('#totalQuantity').innerHTML = '' + totalArticle
  }
}

/* Fonction pour calculer le prix total des produits (articles), et afficher
  le résultat de manière dynamique sur la page*/                     
const totalPrice = async (basketDisplay) => {
  await basketDisplay
  for (sofa of cartSofa) {

    sofaData.forEach((element) => {

      if (sofa.id == element._id) {

        sofa.price = element.price
      }
    })
  }
  if (cartSofa) { 

    let totalSumArticle = 0 
     
    cartSofa.forEach((sofa) => {
      
      totalSumArticle += Number(sofa.quantity) * sofa.price
    })
    return document.querySelector('#totalPrice').innerHTML = '' + totalSumArticle
  }   
}

////Code pour les Regex formulaire et leurs messages d'erreur////
const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const address = document.querySelector('#address')
const city = document.querySelector('#city')
const email = document.querySelector('#email')

let valueFirstName, valueLastName, valueAddress, valueCity, valueEmail

firstName.addEventListener('input', (e) => {

  let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg')

  if (e.target.value.length == 0) {
    firstNameErrorMsg.innerHTML = ''
    valueFirstName = null
  }
  if (e.target.value.length > 0 && e.target.value.length < 2) {
    firstNameErrorMsg.innerHTML = "Votre prénom doit contenir 2 caractères minimum"
    valueFirstName = null
  }
  if (e.target.value.length > 25) {
    firstNameErrorMsg.innerHTML = "Votre prénom ne peut contenir plus de 25 caratères maximum"
    valueFirstName = null
  }
  else if (!e.target.value.match(/^[a-zA-Z-]{0,25}$/)) {
    firstNameErrorMsg.innerHTML = "S'il vous plaît, veuillez ne pas mettre d'espace à la fin ou entre les caractères, ni de chiffres, ni de caractères spéciaux, hors les tirets si vous avez un prénom composé"
    valueFirstName = null
  }
  else if (e.target.value.match(/^[a-zA-Z-]{2,25}$/)){
    firstNameErrorMsg.innerHTML = ''
    valueFirstName = e.target.value
  }
})

lastName.addEventListener('input', (e) => {

  let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg')

  if (e.target.value.length == 0) {
    lastNameErrorMsg.innerHTML = ''
    valueLastName = null
  }
  if (e.target.value.length > 0 && e.target.value.length < 2) {
    lastNameErrorMsg.innerHTML = "Votre nom doit contenir 2 caractères minimum"
    valueLastName = null
  }
  if (e.target.value.length > 25) {
    lastNameErrorMsg.innerHTML = "Votre nom ne peut contenir plus de 25 caratères maximum"
    valueLastName = null
  }
  else if (!e.target.value.match(/^[a-z A-Z-]{0,25}$/)) {
    lastNameErrorMsg.innerHTML = "S'il vous plaît, veuillez ne pas mettre de chiffres ni de caractères spéciaux, hors les tirets si vous avez un nom composé"
    valueLastName = null
  }
  else if (e.target.value.match(/^[a-z A-Z-]{2,25}$/)) {
    lastNameErrorMsg.innerHTML = ''
    valueLastName = e.target.value
  }
})

address.addEventListener('input', (e) => {

  let addressErrorMsg = document.querySelector('#addressErrorMsg')

  if (e.target.value.length == 0) {
    addressErrorMsg.innerHTML = ''
    valueAddress = null
  }
  if (e.target.value.length > 0 && e.target.value.length < 5) {
    addressErrorMsg.innerHTML = "Votre adresse doit contenir 5 caractères minimum"
    valueAddress = null
  }
  if (e.target.value.length > 80) {
    addressErrorMsg.innerHTML = "Votre adresse ne peut contenir plus de 80 caratères maximum"
    valueAddress = null
  }
  else if (!e.target.value.match(/^[a-z A-Z-0-9]{0,80}$/)) {
    addressErrorMsg.innerHTML = "S'il vous plaît, veuillez ne pas mettre de chiffres ni de caractères spéciaux, hors des espaces entre les mots, et les tirets si votre rue, votre boulevard, ou votre bâtiment est un nom composé"
    valueAddress = null
  }
  else if (e.target.value.match(/^[a-z A-Z-0-9]{5,80}$/)) {
    addressErrorMsg.innerHTML = ''
    valueAddress = e.target.value
  }
})

city.addEventListener('input', (e) => {
  
let cityErrorMsg = document.querySelector('#cityErrorMsg')

  if (e.target.value.length == 0) {
    cityErrorMsg.innerHTML = ''
    valueCity = null
  }
  if (e.target.value.length > 0 && e.target.value.length < 2) {
    cityErrorMsg.innerHTML = "Votre ville doit contenir 2 caractères minimum"
    valueCity = null
  }
  if (e.target.value.length > 25) {
    cityErrorMsg.innerHTML = "Votre ville ne peut contenir que 25 caratères maximum"
    valueCity = null
  }
  else if (!e.target.value.match(/^[a-z A-Z-]{0,25}$/)) {
    cityErrorMsg.innerHTML = "S'il vous plaît, veuillez ne pas mettre de chiffres ni de caractères spéciaux, hors des espaces entres les mots, et les tirets si votre ville est un nom composé"
    valueCity = null
  }
  else if (e.target.value.match(/^[a-z A-Z]{2,25}$/)) {
    cityErrorMsg.innerHTML = ''
    valueCity = e.target.value
  }
})

email.addEventListener('input', (e) => {

  let emailErrorMsg = document.querySelector('#emailErrorMsg')

  if (e.target.value.length == 0) {
    emailErrorMsg.innerHTML = ''
    valueEmail = null
  }
  else if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/)) {
    emailErrorMsg.innerHTML = "Email invalide"
    valueEmail = null
  }
  else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/)) {
    emailErrorMsg.innerHTML = ''
    valueEmail = e.target.value
  }
})

/*Mise en majuscule de tous les caractères, sauf pour l'input email, 
  et celui de la valeur du bouton 'Commander !'*/
let allInputs = document.querySelectorAll('input')
  for (input of allInputs) {
    input.style.textTransform = 'uppercase';
  }
email.style.textTransform = 'lowercase';
  
let inputOrder = document.querySelector('#order')
inputOrder.style.textTransform = 'none';  

/*Code pour bloquer la touche Entrée tant que l'input en saisie
  n'est pas correctement rempli, et approfondir la couleur d'alerte
  du message erreur car la couleur originelle CSS choisie par l'équipe 
  ne réépond pas aux normes d'accessibilité*/
firstName.addEventListener('keydown', (e) => {
  if (valueFirstName == null && e.keyCode == '13') {
    e.preventDefault()
    firstNameErrorMsg.style.color = 'red'
    if (firstNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (firstNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})
  
lastName.addEventListener('keydown', (e) => {
  if (valueLastName == null && e.keyCode == '13')  {
    e.preventDefault()
    lastNameErrorMsg.style.color = 'red'
    if (lastNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (lastNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})

address.addEventListener('keydown', (e) => {
  if (valueAddress == null && e.keyCode == '13')  {
    e.preventDefault()
    addressErrorMsg.style.color = 'red'
    if (addressErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        addressErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (addressErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        addressErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})
city.addEventListener('keydown', (e) => {
  if (valueCity == null && e.keyCode == '13')  {
    e.preventDefault()
    cityErrorMsg.style.color = 'red'
    if (cityErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (cityErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})

////Code pour la soumission du formulaire avec la touche Entrée////
document.body.addEventListener('keydown', (e) => {
  if (valueFirstName && valueLastName && valueAddress && valueCity && valueEmail && e.keyCode == '13') {
        let keyEnterSubmit = document.querySelector('#order')
        keyEnterSubmit.click()
  }
})

/*Code pour la non-soumission de formulaire avec la touche Entrée si les 
informations remplies par l'utilisateur ne sont pas celles attendues*/
document.body.addEventListener('keydown', (e) => {

  if (valueFirstName == null && e.keyCode == '13' && firstName.value.length != 0 && lastName.value.length != 0
     && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    firstNameErrorMsg.style.color = 'red'
    if (firstNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (firstNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueLastName == null && e.keyCode == '13' && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    lastNameErrorMsg.style.color = 'red'
    if (lastNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (lastNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueAddress == null && e.keyCode == '13' && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    addressErrorMsg.style.color = 'red'
    if (addressErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        addressErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (addressErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueCity == null && e.keyCode == '13' && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    cityErrorMsg.style.color = 'red'
    if (cityErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (cityErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueEmail == null && e.keyCode == '13' && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    emailErrorMsg.style.color = 'red'
    if (emailErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        emailErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (emailErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        emailErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})

////Code pour la non-soumission de formulaire avec le bouton "Commander !"////
document.querySelector('#order').addEventListener('click', (e) => {

  if (valueFirstName == null && firstName.value.length != 0 && lastName.value.length != 0
     && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    firstNameErrorMsg.style.color = 'red'
    if (firstNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (firstNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueLastName == null && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    lastNameErrorMsg.style.color = 'red'
    if (lastNameErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (lastNameErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        lastNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueAddress == null && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    addressErrorMsg.style.color = 'red'
    if (addressErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        addressErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (addressErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        firstNameErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueCity == null && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    cityErrorMsg.style.color = 'red'
    if (cityErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (cityErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        cityErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
  if (valueEmail == null && firstName.value.length != 0 && lastName.value.length != 0
  && address.value.length !=0 &&city.value.length != 0 && email.value.length != 0) {
    e.preventDefault()
    emailErrorMsg.style.color = 'red'
    if (emailErrorMsg.innerHTML.length < 50) {
      setTimeout(() => {
        emailErrorMsg.removeAttribute('style')
      }, 2500)
    }
    else if (emailErrorMsg.innerHTML.length > 50) {
      setTimeout(() => {
        emailErrorMsg.removeAttribute('style')
      }, 7400)
    }
  }
})

/*Fonction pour envoyer les données en méthode post, et récupérer un id
  de commande généré par le back, et le placer dans l'url de la page commande*/
const order = () => {

    if (/* Mes constantes pour les regex*/valueFirstName && valueLastName && valueAddress && valueCity && valueEmail) {
      
      orderSofa = JSON.parse(localStorage.getItem('sofaElements'))
      productsId = []
      orderSofa.forEach((sofa) => {
        productsId.push(sofa.id)
      })

      const customerInformation = {
        contact : {
          firstName : valueFirstName,
          lastName : valueLastName,
          address : valueAddress,
          city : valueCity,
          email : valueEmail
        },
        products : productsId
      }

      fetch('http://localhost:3000/api/products/order', {
        method : 'POST',
        headers : {
        'Content-Type' : 'application/json'
        },
        body : JSON.stringify(customerInformation)
        })
        .then((resolve) => resolve.json())
        .then((promise) => {
        let responseServer = promise

      const orderDatas = {
        contact : responseServer.contact,
        orderId : responseServer.orderId,
        products : responseServer.products
      }
      localStorage.removeItem('sofaElements')
      return location.href = 'confirmation.html?id=' + responseServer.orderId
    })
    .catch(function(error){
      alert('HTTP Error ' + error.status)
    })
  }
}

////Appel de la fonction order()////
let orderButton = document.querySelector('.cart__order__form')

  orderButton.addEventListener('submit', (e) => {
    e.preventDefault()
    order()
})

/*Code pour empêcher l'utilisateur de tenter d'envoyer un formulaire
  alors que son panier est vide*/
if (cartSofa == null) {
  firstName.setAttribute('readonly', 'true')
  lastName.setAttribute('readonly', 'true')
  address.setAttribute('readonly', 'true')
  city.setAttribute('readonly', 'true')
  email.setAttribute('readonly', 'true')

  let orderButton = document.querySelector('#order')

  orderButton.addEventListener('click', (e) => {
    e.preventDefault()
  })
}