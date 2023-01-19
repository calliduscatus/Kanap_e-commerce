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

////Fonction avec méthode pour implanter les données API dans le DOM////
const sofaList = async () => {

  await request()
  
    document.querySelector('#items').innerHTML = sofaData.map (
      (product) => `

    <a class="link-sofa" href="./product.html?id=${product._id}">
    <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
      </article>
    </a> `
    ).join("")
}

sofaList()