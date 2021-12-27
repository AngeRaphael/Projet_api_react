const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const db = mongoose.connect("mongodb://localhost/initMongo", { useNewUrlParser: true })

const produitModel = require("./schemas/produits")
const categoryModel = require("./schemas/category")

const bodyParser = require("body-parser")


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())



/************************************** */
/*            GESTION PRODUIT           */
/************************************** */

//Get liste produit : ok
app.get("/pagelisteproduits", async function (req, res) {
    produitModel.find().then(listeProduits => res.json(listeProduits))
})

//Get liste produit : ok
app.get("/pagelisteproduit_ean/:ean", async function (req, res) {

    const ean = req.params.ean

    produitModel.find({ean:ean}).then(listeProduits => {
        res.json(listeProduits)
    })
})

//Get liste produit par categorie : ok
app.get("/pagelisteproduit/:category", async function (req, res) {

    const category = req.params.category

    produitModel.find({category:category}).then(listeProduits => res.json(listeProduits))
})





//Get produit à modifier :ok
app.get("/pagemodifierproduit/:ean", async function (req, res) {
    const { ean } = req.params
    produitModel.find().then(Produit => res.json(Produit[0]))
    //res.status(200).json(selectProduit)
})


//Ajouter un produit : ok
app.post("/ajoutproduit", async function (req, res) {

    const { form_object } = req.body

    console.log("**************")
    console.log(form_object)
    console.log("**************")


    const datas = await produitModel.create({
        _id: null,
        ean: form_object.ean,
        product_name: form_object.product_name,
        brands: form_object.brands,
        nutriscore_grade: form_object.nutriscore_grade,
        image_url: form_object.image_url,
        category: form_object.category,
        note: form_object.note,
        date:form_object.date
    })

    res.status(201).json({ id: datas["_id"] })
})


// Modifier un produit
app.put("/modifierproduit", async function(req,res){
    
    const form_object = req.body

    console.log(form_object)

     //update object
     await produitModel.updateOne({ ean: form_object.ean }, { 
       
        product_name: form_object.product_name,
        brands: form_object.brands,
        nutriscore_grade: form_object.nutriscore_grade,
        api_category: form_object.api_category,
        image_url: form_object.image_url,
        category: form_object.category,
        note: form_object.note

    }); 

    
})


// Supprimer un produit :ok

app.delete("/produit/:ean", async function (req, res) {

    const { ean } = req.params
    console.log(ean)

     produitModel.remove({ ean: ean }, function (err) {
        if (!err) {
            console.log("supp ok ")
        }
        else {
            console.log("supp not ok")
        }
    }); 



})


/************************************** */
/*            GESTION CATEGORIE         */
/************************************** */


// Créer une catégorie :ok
app.post("/category", async function (req, res) {
    const { name } = req.body.form_object
    const datas = await categoryModel.create({
        name
    })
    res.status(201).json({ id: datas["_id"] })
})


// Afficher la liste Catégorie : ok
app.get("/category/list", async function (req, res) {
    categoryModel.find({}, function (err, categories) {
        res.status(200).json(categories)
    })
})



// Supprimer un categorie : ok

app.delete("/categorie/:name", async function (req, res) {

    const { name } = req.params
    console.log(name)

     categoryModel.remove({ name: name }, function (err) {
        if (!err) {
            console.log("supp ok ")
        }
        else {
            console.log("supp not ok")
        }
    }); 


})


// Modifier catégories : ok

app.put("/modifiercategory", async function(req,res){
    
    const form_object = req.body

    console.log(form_object)

     await categoryModel.updateOne({ _id: form_object._id }, { 
       
        _id: form_object._id,
        name: form_object.name

    }); 

    
})
module.exports = app