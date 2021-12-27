const app = require("./app")
const request = require("supertest")

const produitModel = require("./schemas/produits")
const categoryModel = require("./schemas/category")

/*********************************************/
/*               TEST PRODUIT                */ 
/*********************************************/

//liste produit

describe("Je test les endpoints de base",()=>{
    test("should return 200 for the endpoint (/pagelisteproduits)", async ()=>{
        const res = await request(app).get("/pagelisteproduits")
        expect(res.statusCode).toBe(200)
        expect(res.headers["content-type"]).toBe("application/json; charset=utf-8")
    })

})

//liste produit via code ean

 describe("Test endpoint (/pagelisteproduit_ean/:ean)", ()=>{
    it("should return product list with params ean",async ()=>{
        let ean = "3229820791074" 
        const res = await request(app).get(`/pagelisteproduit_ean/${ean}`)
        expect(res.statusCode).toBe(200)
    })

})

//liste produit par category

describe("Test endpoint (/pagelisteproduit/:category)", ()=>{
    it("should return product list with params nom",async ()=>{
        let category = "Vegetal" 
        const res = await request(app).get(`/pagelisteproduit/${category}`)
        expect(res.statusCode).toBe(200)
    })

}) 

//ajout de produit dans la BD

/* describe("test ajout produit endpoints", ()=>{

    let produit ="";

    it("should create product in database", async ()=>{

        const myForm = {

            _id: null,
            ean:"test",
            product_name:"test",
            brands:"Marque test",
            nutriscore_grade:"999",
            image_url:'https://images.openfoodfacts.org/images/products/322/982/079/1074/front_fr.89.400.jpg',
            category:"61ca062bb2be1d3aa6cda4c4",
            note:"test note",
            date:"21-12-2020"

        }

        const res = await request(app).post("/ajoutproduit").send(myForm)
        expect(res.statusCode).toBe(201)
        produit = res.body; 


        const prod = await produitModel.findById(produit);
        expect(prod.ean).toEqual("test")
        expect(prod.product_name).toEqual("test")
        expect(prod.nutriscore_grade).toEqual("999")

        await produitModel.deleteMany({product_name:"test"})  
    })
})  */