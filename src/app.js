const fs = require('fs');
const path = require("path");
const productsFile = path.join(__dirname, "./data/products.json");
const cartsFile = path.join(__dirname, "./data/carts.json");
const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"))
let carts = JSON.parse(fs.readFileSync(cartsFile, "utf-8"))


app.get("/api/products", (req, res) => {
    res.json(products)
})

app.get("/api/products/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const product = products.find(el => el.id == productId)

    if (!product) return res.status(404).json("Producto no encontrado");
    res.json(product)

})

app.get("/api/carts/:cid", (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(el => cartId === el.id);

    if (!cart) return res.status(404).json("Carrito no encontrado");
    res.json(cart.products)

})

app.post("/api/products", (req, res) => {
    const product = req.body;
    let productId = products.length + 1

    products.push({ id: productId, ...product })
    fs.writeFileSync(productsFile, JSON.stringify(products))
    res.json(product)

})
app.post("/api/carts", (req, res) => {

    const cartId = carts.length + 1
    const newCart = {
        id: cartId,
        products: []
    }

    carts.push(newCart)
    fs.writeFileSync(cartsFile, JSON.stringify(carts))
    res.json("Carrito nuevo creado!")
})

app.post("/api/carts/:cid/product/:pid", (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    const cartSelected = carts.find(el => el.id === cartId);
    const productSelected = products.find(el => el.id === productId);

    if (!cartSelected) res.status(404).json("Carrito no encontrado!");
    if (!productSelected) res.status(404).json("Producto no encontrado!");

    const productExist = cartSelected.products.find(el => el.product == productId);

    if (productExist) {
        carts.map(el => {
            if (el.id == cartId) {
                el.products.map(el => {
                    if (el.product == productId) {
                        el.quantity = el.quantity + 1
                    }
                })

            }
        })

        fs.writeFileSync(cartsFile, JSON.stringify(carts))
        res.json({
            productoAgregado: productId,
            cantidadAgregada: 1
        })

    } else {

        carts.map(el => {
            if (el.id == cartId) {
                el.products.push({ product: productId, quantity: 1 })

            }

        })
        fs.writeFileSync(cartsFile, JSON.stringify(carts))

        res.json({
            productoAgregado: productId,
            cantidadAgregada: 1
        })
    }


})


app.put("/api/products/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const productUpdated = req.body;

    let productSelected = products.find(el => el.id === productId)

    if (!productSelected) {
        res.status(404).json("Producto no encontrado");
    } else {

        productSelected = { ...productSelected, ...productUpdated }
        products = products.filter(el => el.id != productId);
        products.unshift(productSelected)
        fs.writeFileSync(productsFile, JSON.stringify(products))
        res.json({ productSelected })
    }

})

app.delete("/api/products/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)

    const productDelete = products.find(el => el.id === productId)
    if (!productDelete) {
        res.status(404).json("Producto no encontrado");
    } else {
        const newArrayProducts = products.filter(el => el.id != productId);
        fs.writeFileSync(productsFile, JSON.stringify(newArrayProducts))
        res.status(200).json("Producto eliminado!");


    }


})

app.listen(PORT, () => {
    console.log("servidor escuchado desde el puerto 8080")
})


