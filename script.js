(async function dataFetching(){
    let url= "https://dummyjson.com/products?limit=194"
    let main= document.querySelector("main")

    let apiRes= await fetch(url)
    let resData= await apiRes.json()

    //console.log(resData.products)

    let products= resData.products;
    //console.log(products)

    products.map((el)=>{
        let anchor= document.createElement("a")
        let outerDiv= document.createElement("div")
        let heading= document.createElement("h2")
        let image= document.createElement("img")
        let description= document.createElement("p")

        let price_cart= document.createElement("div")
        let price= document.createElement("p")
        let cart= document.createElement("button")

        heading.innerText= el.title
        image.src= el.thumbnail
        description.innerText= el.description
        price.innerText= `Rs${Math.ceil(el.price*95)}/-`
        cart.innerText= "Add to Cart"

        outerDiv.classList.add("outerDiv")
        price_cart.classList.add("price-cart")
        cart.style.backgroundColor= "black"
        cart.style.color= "white"
        cart.style.padding= "10px 20px"
        cart.style.border="none"
        cart.style.fontWeight= "bold"

        anchor.href= `product.html?id=${el.id}`

        price_cart.append(price, cart)
        outerDiv.append(heading, image, description, price_cart)
        anchor.append(outerDiv)
        main.append(anchor)
    })
})();