import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';

// import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';

import Header from './general Component/Header';
import Footer from './general Component/Footer';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      'title': '',
      'content': '',
      'boxShow': false,
      'token': null,
      'data': []
    }
  }

  componentDidMount() {
    this.getToken();
  }

  onTitleChange = e => {
    // keeping the inserted title value in state 
    this.setState({
      title: e.target.value
    });
  };

  onContentChange = e => {
    // keeping the inserted content value in state 
    this.setState({
      content: e.target.value
    });
  }

  addNote = (e) => {
    // showing note box
    this.setState({ 'boxShow': true });
  }

  getToken = () => {
    // sending requset to server for getting a token
    axios({
      method: 'post',
      url: 'https://challenge.ronash.co/react/api/v1/auth/token/',
      data: { email: 'pourebtehaj.z@gmail.com', password: '987654321' }
    }).then(res => {
      this.setState({ 'token': res.data.token }, function () {
        this.getData();
      });
    })
      .catch(error =>
        swal("You are not authorized to access this address !")
      );
  }

  sendData = () => {
    // sending requset to server for saving the notes
    let { token, title, content } = this.state;
    axios({
      method: 'post',
      url: 'https://challenge.ronash.co/react/api/v1/notes/',
      headers: {
        'Authorization': 'jwt ' + token
      },
      data: { title: title, content: content }
    }).then(res => {
      swal("Saving note was successfull. ")
      this.getData();
    })
      .catch(error =>
        swal("Oops! There was an error in saving notes !")
      );
  }

  getData = () => {
    // sending requset to server for fetching the created notes
    let { token } = this.state;
    axios({
      method: 'get',
      url: 'https://challenge.ronash.co/react/api/v1/notes/',
      headers: {
        'Authorization': 'jwt ' + token
      },
    }).then(res => {
      this.setState({ 'data': res.data, 'title': '', 'content': '' })
    })
      .catch(error =>
        swal("Oop! There was an error in fetching data!")
      );
  }

  deleteItem = (id) => {
    // sending requset to server for deleting the selected note
    let { token } = this.state;
    axios({
      method: 'delete',
      url: 'https://challenge.ronash.co/react/api/v1/notes/' + id,
      headers: {
        'Authorization': 'jwt ' + token
      },
    }).then(res => {
      swal("The note has been deleted successfully.");
      this.getData();
    })
      .catch(error =>
        swal("Oop! The item is not deleted yet!")
      );
  }


  discard = () => {
    // removing the values of input boxes and closing the box note
    this.setState({ 'boxShow': false, 'title': '', 'content': '' });
  }


  render() {
    let { data } = this.state;
    return <React.Fragment>
      <Header />
      <div className='container-fluid'>
        <div className='container'>
          <div className="card mt-4">
            <div className="card-body">
              <input type="text" className="form-control" id="note" value={this.state.content} placeholder="Take a note ..." onChange={this.onContentChange} />
              <button type="button" className="btn btn-primary float-right mt-3" onClick={this.addNote}>Add Note</button>
            </div>
          </div>
          {this.state.boxShow && <div className="card mt-4">
            <div className="card-body">
              <input type="text" className="form-control mb-3" id="note" value={this.state.title} placeholder="title ... (at least 5 characters long)" onChange={this.onTitleChange} />
              <textarea className="form-control mb-3" id="exampleFormControlTextarea1" value={this.state.content} placeholder="Take a note ..." rows="3" onChange={this.onContentChange}></textarea>
              <button type="button" className="btn btn-primary float-right ml-3" onClick={this.sendData}>Save</button>
              <button type="button" className="btn btn-primary float-right ml-3" onClick={this.discard}>Discard</button>
            </div>
          </div>}

          {data && Object.keys(data).map((key) => (
            <React.Fragment key={data[key]._id}>
              <div className="card mt-4 listBox" data-id={data[key]._id}>
                <div className="card-body">
                  <h2 className="card-title">{data[key].title}</h2>
                  <h4>{data[key].content}</h4>
                </div>

                <div className="dropdown">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <span> options
                    </span>
                  </button>
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => this.deleteItem(data[key]._id)}>delete</button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  }
}

export default Home;