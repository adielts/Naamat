import './MainUserPage.css';
import $ from 'jquery';
import React, { Component } from 'react';
import { NavBar,   BottomBar, AfterMessage, CategoryCheckBox } from '../../Components.js';
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox";
import { FeedbackButton } from '../../forms/Forms';
import ReactDOM from 'react-dom';
import Firebase, { auth, storage, db } from '../../config/Firebase';
import { Dictionary } from '../../Dictionary';
import { Link } from 'react-router-dom';

class MainUserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      img: {},
      carouselSlids: 0,
      Admin: props.Admin
    }
  }
  render() {
    return (
      <div>
        <div id="mainUPWrapper" className="wrapper">
          <NavBar AdminPage={false} Admin={this.props.Admin} mainUserPage={true} />
          <PictursCarousel />
          <ShowPhotos />
        </div>
        <BottomBar />
      </div>
    );

  }
}
export default MainUserPage

export class ShowPhotos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: ["https://1pyiuo2cyzn53c8ors1kwg5l-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/%D7%A4%D7%9E%D7%99%D7%A0%D7%99%D7%96%D7%9D-4.jpg", "https://image.shutterstock.com/z/stock-vector-we-can-do-it-iconic-woman-s-fist-symbol-of-female-power-and-industry-cartoon-woman-with-can-do-244865542.jpg"]

    }

  }


  render() {
    return (

      <div id="photoContainer" >
        {/* 
                <SimpleReactLightbox>
                    <SRLWrapper>
                        <div id="lightBox">
                        {this.state.photos.map(photo => {
                            return (<div>
                                <img className="lightBoxImage" src={photo}></img>
                            </div>)

                        })}
                        </div>
                    </SRLWrapper>
                </SimpleReactLightbox> */}

      </div>
    );

  }
}

export class PictursCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: [],
      ids: ["גולדה מאיר1898-03-03","יעל ארד1967-05-01","אורנה ברביבאי1962-09-05", "Ada Fishman Maimon1893-10-08"],
      indicators: [],
      items: [],
      dataslide: 0,
    }
  }

  componentDidMount() {
    var active = true;
    var ids = this.state.ids;
    var indicators = [];
    var items = [];
    ids.forEach(id => {
      db.collection('women').doc(id).get().then(snapshot => {
        if (snapshot.data()) {
          var data = snapshot.data();
          if (data) {
            if (data["ProfilePic"] && data[Dictionary.getLanguage()]) {
              if (this.state.dataslide != 0)
                active = false;
              if (data[Dictionary.getLanguage()]["display"] && data[Dictionary.getLanguage()]["highlights"])
                indicators.push(<CarouselLi dataslide={this.state.dataslide} active={active} />);
              items.push(<CarouselSlide display={data[Dictionary.getLanguage()]["display"]} highlights={data[Dictionary.getLanguage()]["highlights"]} id={id} src={data["ProfilePic"]} active={active} />);
              this.setState({
                indicators: indicators,
                items: items,
                dataslide: this.state.dataslide + 1
              });

            }

          }
        }
      }).catch(error => console.log(error))

    })
  }
  render() {
    return (
      <div id="pictureCarousel">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
          <ol id="carouselIndicators" className="carousel-indicators">
            {this.state.indicators}
          </ol>
          <div id="carouselInner" className="carousel-inner">
            {this.state.items}
          </div>
          <a className="carousel-control-prev arrow" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">{Dictionary.prev}</span>
          </a>
          <a className="carousel-control-next arrow" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">{Dictionary.next}</span>
          </a>
        </div>
      </div>
    )
  }
}


export const CarouselSlide = props => {

  var clas = "carousel-item";
  if (props.active)
    clas = "carousel-item active";
  return (
    <div className={clas}>
      <Link to={`/womanPage/${props.id}`}>
        <div className="d-block w-100 " alt="example 1" height="500px" width="200px">
          <div className = "details">

          <h1 className="displayName">{props.display}</h1>
          <img src={props.src} className="roundedImg" alt="example 1" height="150px" width="150px" />
          </div>
        {/* <div className="carousel-caption d-none d-md-block pictureDiscription"> */}
          <a id="highlightsContainer"><h3 className="highlights">{props.highlights}</h3></a>
            {/* </div> */}
        </div>
      </Link>
    </div>
  )
}

export const CarouselLi = props => {
  var clas = "";
  if (props.active)
    clas = "active";
  return (
    <li data-target="#carouselExampleIndicators" data-slide-to={props.dataSlideTo} className={clas}></li>
  )
}






$(document).ready(() => {

  // handlePictures("/שלמה כרמי2020-06-09");
  //  getWoman("שלמה כרמי");
});


