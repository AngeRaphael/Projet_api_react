import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Slider from "react-slick";
import { VectorMap } from "react-jvectormap"

import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../App.css'
import moment from "moment";
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

let form_object = {
  ean: String,
  product_name: String,
  brands: String,
  nutriscore_grade: String,
  image_url: String,
  category: String,
  note: String
}



const Dashboard = () => {

  const [offset, setOffset] = useState(0)
  const [perPage, setPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(null)
  const [pageCount, setPageCount] = useState(1)

  const [data, setData] = useState([]);

  //total data
  const [dataT, setDataT] = useState([]);

  const [modalShowProduit, setModalShowProduit] = useState(false);

  const [check, setCheck] = useState([]);

  const [categorie, setCategorie] = useState([]);

  const [produitsearch, setProduitsearch] = useState('');
  const [categoriesearch, setCategoriesearch] = useState('');

/*   const [cat, setCat] = useState([]);
 */

  //Liste des produit via la BD

  /********************************************** */


  const getApiData = async () => {

    let url = `http://localhost:3010/pagelisteproduits`

    axios
      .get(url)
      .then(res => {

        const slice = res.data.slice(offset, offset + perPage)

        setDataT(res.data)

        setPageCount(Math.ceil(res.data.length / perPage))

        setData(slice)

      });

  };


  const getApiCategorie = async () => {

    let url = `http://localhost:3010/category/list`

    axios
      .get(url)
      .then(res => {

        setCategorie(res.data)
        console.log(res.data)

      });

  };


  useEffect(() => {

    getApiCategorie();

  }, categorie)


  useEffect(() => {

    getApiData();

  }, data)

  useEffect(() => {
    
    //afficher la data de la categorie

    if (categoriesearch != '') {

      let url = `http://localhost:3010/pagelisteproduit/${categoriesearch}`

      axios
        .get(url)
        .then(res => {

          if (res.data === null ) {
            console.log("null")

          } else {

              console.log("pas null")
            
              const slice = res.data.slice(offset, offset + perPage)
      
              setPageCount(Math.ceil(res.data.length / perPage))
      
              setData(slice)

              console.log(slice)

        }

        });

    }else{

      getApiData()

    }

  }, [categoriesearch])


  useEffect(() => {
    
    //afficher la data de la categorie

    if (produitsearch != '') {

      let url = `http://localhost:3010/pagelisteproduit_ean/${produitsearch}`

      axios
        .get(url)
        .then(res => {

          if (res.data === null ) {
            console.log("null")

          } else {

              console.log("pas null")
            
              const slice = res.data.slice(offset, offset + perPage)
      
              setPageCount(Math.ceil(res.data.length / perPage))
      
              setData(slice)

              console.log(slice)

        }

        });

    }else{

      getApiData()

    }

  }, [produitsearch])

  const displayPics = () => {

    let cat =''

    return data.map(datas => {

      console.log(datas)

      categorie.map((item) =>{

        if(item._id === datas.category){

          cat = item.name

        }
      }
              
      )
      return (
        <div className="col-2">
          <img width={150} height={200} style={{ marginRight: 20, marginBottom: 20 }} src={datas.image_url} alt="image produit" />
          <p>
            <span style={{ color: 'orange' }}> {datas.brands} </span> <br /><br />
            Nom :<span style={{ color: 'orange' }}>  {(datas.product_name).split(" ")[0] + ' ' + [(datas.product_name).split(" ")[1] ? (datas.product_name).split(" ")[1] : '']}  </span> <br />
            Nutrigrade : <span className="text-uppercase" style={{ color: 'red' }}> {datas.nutriscore_grade} </span><br />
            Catégorie : <span className="text-uppercase" style={{ color: 'red' }}> {cat} </span><br />
            Note : <span className="text-uppercase" style={{ color: 'red' }}> {datas.note} </span><br />
            Code Barre : <span className="text-uppercase" style={{ color: 'red' }}> {datas.ean} </span><br />
            <span style={{ color: 'grey' }}> {datas.date ? `Date : ${datas.date}` : ''} </span>
            <br />

            <label type="button" onClick={() => modificationProduit(datas)} style={{ marginRight: 5 }} className="badge badge-info"><i className="mdi mdi-table-edit"></i></label>
            <label type="button" onClick={() => deleteProduit(datas)} className="badge badge-danger"><i className="mdi mdi-delete-forever"></i></label>
          </p>

        </div>
      )

    }
    )
  }

  const handlePageClick = (e) => {

    const selectedPage = e.selected ;
    const offset =  selectedPage * perPage

    setCurrentPage(selectedPage)
    setOffset(offset)

    const slice = dataT.slice(offset, offset + perPage)
    setPageCount(Math.ceil(dataT.length / perPage))

    setData(slice)
    
    console.log(selectedPage)

    displayPics()

  };



  const displayCategorieListe = () => {

    return categorie.map(datas => {

      console.log(datas)

      return (
        <option value={datas._id}>{datas.name}</option>
      )

    }
    )
  }

  function Modifications(props) {

    if (!check) {
      return
    }

    return (



      [check && (<Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className='text-uppercase text-primary'>
            Modification produit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="text-success font-weight-bold"></h4>
          <div className="row" style={{ marginLeft: 30, marginRight: 30 }}>
            <img width={160} height={160} style={{ marginRight: 20, marginBottom: 20 }} src={check.image_url} alt="image produit" />
            <div> Marque : {check.brands}<Form.Control onChange={(e) => { form_object.brands = e.target.value }} style={{ color: 'white' }} type="text" className="form-control" id="exampleInputUsername2" placeholder="Nouvelle Marque" /> <br />
              Nom: {check.product_name} <Form.Control onChange={(e) => { form_object.product_name = e.target.value }} style={{ color: 'white' }} type="text" className="form-control" id="exampleInputUsername2" placeholder="Nouveau Nom" /> <br />
              Nutrigrade : {check.nutriscore_grade} <Form.Control onChange={(e) => { form_object.nutriscore_grade = e.target.value }} style={{ color: 'white' }} type="text" className="form-control" id="exampleInputUsername2" placeholder="Nouvelle Nutrigrade" /> <br />
              Code Barre: {check.ean} <br />
              <br />
              Note : {check.note} <Form.Control onChange={(e) => { form_object.note = e.target.value }} style={{ color: 'white' }} type="text" className="form-control" id="exampleInputUsername2" placeholder="Nouvelle Nutrigrade" /> <br />

              <Form.Group>
                <label className="text-info" htmlFor="exampleSelectGender">Catégories</label>
                <select value={check.category} onChange={(e) => { form_object.category = e.target.value }} style={{ width: 210 }} className="form-control text-success" id="exampleSelectGender">
                  {displayCategorieListe()}
                </select>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateProduit()}>Modifier</Button>
          <Button onClick={props.onHide}>Fermer</Button>
        </Modal.Footer>
      </Modal>)]
    );
  }


  const modificationProduit = (datas) => {

    setCheck(datas)

    setModalShowProduit(true)

  }


  const deleteProduit = (datas) => {

    let url = `http://localhost:3010/produit/${datas.ean}`
    axios.delete(url)
    window.location.href = "http://localhost:3000/";

  }

  const updateProduit = () => {

    console.log(check)

    if (!check) {
      return
    }

    form_object.ean = check.ean
    form_object.image_url = check.image_url


    let url = `http://localhost:3010/modifierproduit`

    axios.put(url, form_object)

    window.location.href = "http://localhost:3000/";


  }


  return (

    <div>

      <div className="page-header">
        <h3 className="page-title">
          Liste Des Produits ({dataT.length} )

        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Admin</a></li>
            <li className="breadcrumb-item active" aria-current="page">Produits</li>
          </ol>
        </nav>
      </div>
      <div className='row'>
        <div className="col-3">
          <Form.Group>
            <label htmlFor="exampleSelectGender">Trié par Catégorie:</label>
            <select onChange={(e) => { setCategoriesearch(e.target.value) }} className="form-control" style={{ color: 'white' }} id="exampleSelectGender">
              <option value="">...</option>
              {displayCategorieListe()}
            </select>
          </Form.Group>
        </div>

        <div className="col-3">
          <Form.Group>
            <label htmlFor="exampleInputName1">Trié par code barre </label>
            <Form.Control type="text" onChange={(e) => { setProduitsearch(e.target.value) }} className="form-control text-white" id="exampleInputName1" placeholder="Code barre" />
          </Form.Group>
        </div>

      </div>

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">

            <div className="card-body">
              <div className="template-demo" style={{ marginLeft: 90 }}>
                <div className="row">
                  {data && displayPics()}

                </div>


              </div>
            </div>

          </div>
        </div>
      </div>




      <div className="row">


        <ReactPaginate
          previousLabel={"prec"}
          nextLabel={"suiv"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />
      </div>

      <Modifications
        show={modalShowProduit}
        onHide={() => setModalShowProduit(false)}
      />
    </div>





  );
}

export default Dashboard;