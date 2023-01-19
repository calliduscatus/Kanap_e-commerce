////Récupération de l'id produit via la page visée////
const sofa = location.search.split("?id=").join("")

////Récupération données API de l'id de la page////
let sofaData = []

const requestProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${sofa}`)
    .then (resolve => resolve.json())
    .then (data => {
        sofaData = data
    })
}

////Fonction pour implanter les données de l'id produit sur la page////
async function sofaDisplay() {

    await requestProduct()

            let picture = document.querySelector('.item__img')
            picture.innerHTML = '<img src="' + sofaData.imageUrl + '" alt="' + sofaData.altText + '">'
            document.querySelector('#title').innerHTML = '' + sofaData.name + ''
            document.querySelector('#description').innerHTML = '' + sofaData.description + ''
            document.querySelector('#price').innerHTML = '' + sofaData.price + ''
            document.querySelector('#quantity').value = 0
                let optionSelection = document.getElementsByTagName('option')[0].setAttribute('value', Number(0))
                for (color of sofaData.colors) {
                    let option = document.createElement('option')
                    option.setAttribute('class', 'option')
                    option.setAttribute('class', 'colorKanap')
                    option.setAttribute('data-color', '' + color)
                    option.innerHTML = '' + color
                    option.value = '' + color
                    let optionPlaced = document.querySelector('#colors')
                    optionPlaced.appendChild(option)
                }   

        basketQuantityProducts(sofaData)

        message(sofaData)

}
sofaDisplay()

/*Fonction pour l'incrémentation des quantités produits 
  ainsi que leur enregistrement dans le localstorage*/
const basketQuantityProducts = () => {

    let button = document.querySelector('#addToCart')

    button.addEventListener('click', () => {

        let arrayBasket = JSON.parse(localStorage.getItem('sofaElements'))

        let select = document.querySelector('#colors')
        let numberArticle = document.querySelector('#quantity')
        totalityArticle = document.querySelector('#totalityArticle')
        
        const arrayBasketBis = {
            color : select.value,
            quantity : Number(numberArticle.value),
            totalityQuantity : Number(numberArticle.value),
            id : sofaData._id,
            imageUrl : sofaData.imageUrl,
            altTxt : sofaData.altTxt,
            name : sofaData.name
            }

            if (arrayBasket == null) {
                arrayBasket = []
                arrayBasket.push(arrayBasketBis)

                for (element of arrayBasket) {
                    if (element.quantity > 0 && select.value != "0") {
                        
                        return localStorage.setItem('sofaElements', JSON.stringify(arrayBasket))
                    }   
                }             
            }

            else if (arrayBasket != null) {
                for (let sofa of arrayBasket) {

                    if (sofa.id == sofaData._id && sofa.color == select.value && select.value != "0" && sofa.quantity != 0) {

                        sofa.quantity += Number(numberArticle.value)
                        sofa.totalityQuantity = sofa.quantity
                        return localStorage.setItem('sofaElements', JSON.stringify(arrayBasket))                            
                    }
                }

                    for (let sofa of arrayBasket) {
                        if ((sofa.id == sofaData._id && sofa.color != select.value && select.value != "0" && numberArticle.value != 0) || (sofa.id != sofaData._id && select.value != "0" && numberArticle.value != 0)) { 
                            
                            return arrayBasket.push(arrayBasketBis),
                            localStorage.setItem('sofaElements', JSON.stringify(arrayBasket))
                    }            
                }
            }
        }) 
   }

////Code pour empêcher les décimales et autres sémantiques mathématiques inappropriées////
let inputKey = document.querySelector('#quantity')
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

////Code pour enler le zéro si l'utilisatuer fait une saisie clavier de la quantité////
inputKey.addEventListener('focus', (e) => {
    if(inputKey.value == "0") {
        inputKey.value = ""
    }
})

////Code pour valider ou invalider le passage en panier avec la touche Entrée////
document.body.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        document.querySelector('#addToCart').click()
    }
})

/*Fonction pour envoi message si quantité et/ou couleur non choisies,
  ainsi que pour la mise du produit dans le panier après sa conforme
  sélection par l'utilisateur*/
const message = () => {

    let select = document.querySelector('#colors')
    let inputQuantity = document.querySelector('#quantity')
    let button = document.querySelector('#addToCart')
    let inplacedMessage = document.querySelector('.item__content__settings')

    
    let head = document.querySelector('head')
    let style = document.createElement('style')
    style.innerHTML = `.styleDivMessage {
width : 100%;
height : 60px;
max-width : 700px;
background-color : #FFFFFF;
border-radius: 12px;
border: 1px solid #767676;
display : flex;
align-items : center;
margin-right : auto;
margin-left : auto;
margin-top : -61px;
position : relative;
}

.styleMessage{
width : 100%;
font-family: 'Montserrat', sans-serif;
font-size: 16px;
color : #2d2f3e;
display : flex;
justify-content : space-around;
}

.buttonOk{
font-family: 'Montserrat', sans-serif;
font-size: 14px;
color : #FFFFFF;
background-color : #2c3e50;
border : 0;
}

.buttonOk:hover{
transform : scale(1.15)
}

@media only screen and (max-width: 768px) {
    .styleDivMessage {
        height : 120px;
        margin-top : -121px;
        position : relative;
    }
    .styleMessage {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        display : flex;
        flex-direction : column;
        text-align: center;
        //text-align-last: center;
    }
    .buttonOk {
        width : 20%;
        margin-top : 20px;
        margin-right : auto; 
        margin-left : auto;
    }

}
`

    head.appendChild(style)

    let contentMessageColor = `
    <span class="styleMessage">S'il vous plaît, veuillez choisir une couleur :-)<button class="buttonOk">OK</button></span>
    `
    let contentMessageQuantity = `
    <span class="styleMessage">S'il vous plaît, veuillez choisir une quantité :-)<button class="buttonOk">OK</button></span>
    `
    let contentMessageBasket = `
    <span class="styleMessage">Vos articles sont bien dans votre panier :-)</span>
    `

    button.onclick = () => {

        if (select.value == 0 && quantity.value == 0 || select.value == 0) {

            let divMessage = document.createElement('div')
            divMessage.classList.add('styleDivMessage')            
            divMessage.innerHTML = '' + contentMessageColor 
            inplacedMessage.appendChild(divMessage)

            button.disabled = true
            select.disabled = true
            inputQuantity.disabled = true

            clickOk = document.querySelector('.buttonOk')
            clickOk.addEventListener('click', () => {
                let divRemove = document.querySelector('.styleDivMessage')
                divRemove.remove()
                button.disabled = false
                select.disabled = false
                inputQuantity.disabled = false
            })
        }
        else if (quantity.value == 0 && select.value != 0) {

            let divMessage = document.createElement('div')
            divMessage.classList.add('styleDivMessage')          
            divMessage.innerHTML = '' + contentMessageQuantity
            inplacedMessage.appendChild(divMessage)

            button.disabled = true
            select.disabled = true
            inputQuantity.disabled = true

            clickOk = document.querySelector('.buttonOk')
            clickOk.addEventListener('click', () => {
                let divRemove = document.querySelector('.styleDivMessage')
                divRemove.remove()
                button.disabled = false
                select.disabled = false
                inputQuantity.disabled = false
            })
        }
        else if (quantity.value > 0 && select.value != 0) {

            let divMessage = document.createElement('div')
            divMessage.classList.add('styleDivMessage')
            divMessage.innerHTML = '' + contentMessageBasket
            inplacedMessage.appendChild(divMessage)

            button.disabled = true
            select.disabled = true
            inputQuantity.disabled = true
            inputQuantity.value = '0'
            select.value = '0'
            setTimeout(() => {
                let divRemove = document.querySelector('.styleDivMessage')
                divRemove.remove()
                button.disabled = false
                select.disabled = false
                inputQuantity.disabled = false
            }, 2000)
        }
    }
}
