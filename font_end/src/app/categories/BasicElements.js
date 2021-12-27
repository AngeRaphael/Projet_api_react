import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import ReactPaginate from 'react-paginate'
import '../App.css'
import axios from 'axios'




let form_object = {

  _id: String,
  name: String
 
}


const BasicElements = () => {


  const [offset, setOffset] = useState(0)
  const [perPage, setPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(null)
  const [pageCount, setPageCount] = useState(1)

  const [categorie, setCategorie] = useState([]);

  const [edit, setEdit] = useState();

  //total data
  const [dataT, setDataT] = useState([]);

  const getApiData = async () => {

  let url = `http://localhost:3010/category/list`

    axios
      .get(url)
      .then(res => {

        const slice = res.data.slice(offset, offset + perPage)

        setDataT(res.data)
        
        setPageCount(Math.ceil(res.data.length / perPage))

        setCategorie(slice)

        console.log(slice)

      });

  };


  const deleteCategorie = (datas) =>{

    let url =`http://localhost:3010/categorie/${datas.name}`
    axios.delete(url)
    window.location.href = "http://localhost:3000/form-elements/basic-elements";

  }

  const editCategorie = (datas) => {

   setEdit(datas)

  }

  const editCategorie_api = () =>{

    let url = `http://localhost:3010/modifiercategory`

    form_object._id = edit._id

    axios.put(url, form_object)

  }

  useEffect(() => {

    getApiData();

  }, categorie)

  const displayPics = () => {

    return categorie.map(datas => {

      return (
        <tr>
          <td style={{ color: 'white' }}>{datas.name}</td>
          <td>
            <label type="button" onClick={() => editCategorie(datas)} style={{ marginRight: 20 }} className="badge badge-warning"><i className="mdi mdi-table-edit"></i></label>
            <label type="button" onClick={() => deleteCategorie(datas)} className="badge badge-danger"><i className="mdi mdi-delete-forever"></i></label>
          </td>
        </tr>
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

    setCategorie(slice)

    console.log(selectedPage)

    displayPics()
    
  };


  const ajourCategorie=()=>{
    
    console.log(form_object)
    let url =`http://localhost:3010/category`
    axios.post(url,{form_object})
    window.location.href = "http://localhost:3000/form-elements/basic-elements"

  }
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Gestion Des Categories </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Admin</a></li>
            <li className="breadcrumb-item active" aria-current="page">Catégories</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-warning">Listes des Catégorie ({dataT.length})</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-info">NOMS CATEGORIES</th>
                        <th className="text-info">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>

                      {displayPics()}


                    </tbody>
                  </table>


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

              </div>

            </div>
          </div>
        </div>
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {edit && <h4 className="card-title text-warning">Gestion Des Catégories ({edit.name})</h4>}
              {!edit && <h4 className="card-title text-warning">Gestion Des Catégories</h4>}

              <br />
              <br />
              <form className="forms-sample">

               { edit && ( <Form.Group className="row">
                  <label  htmlFor="exampleInputUsername2" className="col-sm-3 col-form-label text-primary">Ancien Nom :  <strong> {edit ? edit.name : ''} </strong></label>

                </Form.Group>)}
                <Form.Group className="row">
                  {edit && <label htmlFor="exampleInputUsername2" className="col-sm-3 col-form-label">Entrer la nouvelle : </label>}
                  {!edit && <label htmlFor="exampleInputUsername2" className="col-sm-3 col-form-label">Nom de la catégorie</label>}

                  <div className="col-sm-9">
                    <Form.Control   onChange={(e) => { form_object.name = e.target.value }} type="text" className="form-control text-white" id="exampleInputUsername2" placeholder="Nom" />
                  </div>
                </Form.Group>

                <br />
                <br />

                <span style={{ marginRight: 10 }}>
                 {edit && ( <button type="submit" onClick={()=>editCategorie_api()} className="btn btn-secondary">Modifier</button>)}
                 {!edit && ( <button onClick={()=>ajourCategorie()} type="button" className="btn btn-primary">Ajouter</button>)}
                </span>
                <button type="submit" className="btn btn-danger">Annuler</button>

              </form>
            </div>
          </div>
        </div>



      </div>
    </div>
  )
}

export default BasicElements
