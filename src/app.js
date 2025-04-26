const fs = require('fs');
const path = require("path");
const productsFile = path.join(__dirname, "./data/products.json");
const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"))


app.get("/api/products", (req, res) => {
    res.json(products)
})

app.get("/api/products/:pid", (req, res) => {
    const idProduct = parseInt(req.params.pid)
    const product = products.find(el => el.id == idProduct)

    if (!product) return res.status(404).json("Producto no encontrado");
    res.json(product)

})

app.post("/api/products",(req,res) => {
     const product = req.body;
     let productId = products.length+1

      products.

     productId

     products.push({id:productId,...product})
     fs.writeFileSync(productsFile,JSON.stringify(products))
     res.json(product)

})

app.listen(PORT, () => {
    console.log("servidor escuchado desde el puerto 8080")
})


