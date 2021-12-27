import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import axios from 'axios'
import Scanner from './Scanner'
import { Fab, TextareaAutosize, Paper } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import moment from 'moment';


//737628064502

let form_object = {
  ean: String,
  product_name: String,
  brands: String,
  nutriscore_grade: String,
  image_url: String,
  category: String,
  note: String,
  date: String
}

const Navbar = () => {

  const [modalShow, setModalShow] = useState(false);

  const [modalShowcodebar, setModalShowcodebar] = useState(false);

  const [modalShowProduit, setModalShowProduit] = useState(false);

  const [data, setData] = useState([]);

  const [etat, setEtat] = useState(0);


  const [code, setCode] = useState('');

  const [formAjout, setFormAjout] = useState({});

  const [categorie, setCategorie] = useState([]);



  const _onDetected = (result) => {


    console.log("result");

    console.log(result);
  }


  function toggleOffcanvas() {

    document.querySelector('.sidebar-offcanvas').classList.toggle('active');

  }

  function toggleRightSidebar() {

    document.querySelector('.right-sidebar').classList.toggle('open');

  }


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


  const getApiData = async (code) => {

    if (!code) {
      return
  }

  


    let url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`

    axios
      .get(url)
      .then(res => {

        setEtat(res.data.status)

        if (res.data.status == 1) {
          setData(res.data.product)
        }

      });

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

  const ajouterPorduit = () => {

    if(!data){
      return
    }
 
    form_object.ean = data.id
    form_object.product_name = data.product_name
    form_object.brands =  data.brands
    form_object.nutriscore_grade = data.nutriscore_grade
    form_object.image_url =  data.image_url
    form_object.date = moment(new Date()).format("DD-MM-YYYY")

     let url =`http://localhost:3010/ajoutproduit`
    axios.post(url,{form_object}) 

  }



  function MyVerticallyCenteredModal(props) {

    return (
      [etat == 1 && (<Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form >

          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className='text-uppercase text-primary'>
              Produit Scanner
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className="text-success font-weight-bold"></h4>
            <div className="row" style={{ marginLeft: 30, marginRight: 30 }}>
              <img width={150} style={{ marginRight: 20, marginBottom: 20 }} src={data.image_url} alt="image produit" />

              <div> Marque :<span style={{ color: 'orange' }}> {data.brands} </span> <br />
                Nom :<span style={{ color: 'orange' }}> {data.product_name} </span> <br />
                Nutrigrade :<span className="text-uppercase" style={{ color: 'red' }}> {data.nutriscore_grade} </span> <br /> <br />

                <Form.Group>
                  <label className="text-info" htmlFor="exampleSelectGender">Catégories</label>
                  <select  onChange={(e) => {form_object.category = e.target.value }} style={{ width: 210 }} className="form-control text-success" id="exampleSelectGender">
                  <option value="">...</option>
                  {displayCategorieListe()}
                </select>
                </Form.Group>

                Note: <Form.Control

                  onChange={(e) => { form_object.note = e.target.value }}
                  style={{ color: 'white' }} type="text"
                  className="form-control"
                  placeholder="Entrer une note" />

              </div>


            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" onClick={() => ajouterPorduit()}>Ajouter à la BD</Button>
            <Button onClick={props.onHide}>Fermer</Button>
          </Modal.Footer>

        </Form>
      </Modal>)]
    );
  }

  const getModal = async () => {


    if (!code) {
      return
    }

    await getApiData(code)

    setModalShow(true)

  }

  const codeBar = () => {

    setModalShowcodebar(true)

  }


  function GetCodeBar(props) {

    return (
      [modalShowcodebar &&
        (<Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size={400}
        >
          <div>
            <Paper variant="outlined" style={{ marginTop: 30, width: 502, height: 324 }}>
              <Scanner style={{ marginTop: 30, width: 640, height: 320 }} onDetected={_onDetected()} />
            </Paper>
          </div>
        </Modal>
        )]
    )
  }


  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <button className="navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
          <span className="mdi mdi-menu"></span>
        </button>
        <ul className="navbar-nav w-100">
          <li className="nav-item w-100">
            <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
              <input type="text" value={code}
                onChange={(e) => { setCode(e.target.value) }}
                style={{ width: 380, marginRight: 52 }} className="form-control text-white" placeholder="code produit via API" />
              <span style={{ marginRight: 10 }}> <button type="button" onClick={() => getModal()} className="btn btn-primary btn-fw">Recherche</button></span>
{/*               <span style={{ marginRight: 10 }}> <button type="button" onClick={() => codeBar()} className="btn btn-danger btn-fw">scan code</button></span>
 */}
            </form>
          </li>
        </ul>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <GetCodeBar
        show={modalShowcodebar}
        onHide={() => setModalShowcodebar(false)}
      />


    </nav>
  );
}

export default Navbar;
