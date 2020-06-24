import './AdminPage.css';
import $ from 'jquery';
import React, { Component } from 'react';
import { NavBar, PictursCarousel, DisplayModal, BottomBar, AfterMessage, usersManager } from '../../Components.js';
import { getWoman, WomenCard } from '../woman page/WomanPage';
import { Dictionary } from '../../Dictionary';
import { EditWomanModal, AddCategoryModal, FeedbackModal, AddNewUserForm } from '../../forms/Forms';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import { Link } from 'react-router-dom';
import { db } from '../../config/Firebase';
import ReactDOM from 'react-dom';

class AdminPage extends Component {
    render() {
        return (
            <div id="APcover" className="cover">
                <div id="mainAPWrapper" className="wrapper">
                    <NavBar AdminPage={true} Admin={true}/>
                    <EditWomanModal />
                    <AddCategoryModal />
                    <FeedbackModal />
                    <AddNewUserForm/>
                    <div class="backBtn">
                        {/* <Link to="/"><button id="backBtn" class="btn">{Dictionary.back}</button></Link> */}
                    </div>
                    <p id="adminTitle">{Dictionary.welcomeManager}</p>
                    <div id="allAdmin">
                        <button class="btnhover" type="button" id="btn1" data-toggle="modal" data-target="#staticBackdrop"> {Dictionary.adminAddWoman} </button>
                        <button class="btnhover" type="button" id="btn2" > {Dictionary.adminEditWoman} </button>
                        <button class="btnhover" type="button" id="feedbackBtn" onClick={() => { getData("feedbackBtn", "feedback", ["name", "email", "improvement", "score"]) }}> {Dictionary.adminFeedback} </button>
                        <button class="btnhover" type="button" id="btn5" data-toggle="modal" data-target="#categoryForm"> {Dictionary.adminAddCategory} </button>
                        <button class="btnhover" type="button" id="categoriesBtn" onClick={() => { getData("categoriesBtn", "categories", ["category"]) }}> {Dictionary.manageCategory} </button>
                        <button class="btnhover" type="button" id="userMngBtn" onClick={() => { getData("userMngBtn", "users", ["email", "admin"]) }}> {Dictionary.adminUserManagement} </button>
                        {/* <button class="btnhover" type="button" id="btn4"> {Dictionary.adminEditAbout} </button> */}

                    </div>
                    <div id="TableHolder"></div>
                </div>
                <BottomBar />
            </div >

        );
    }
}
export default AdminPage

//insert the collaction that you are looking to take data from and an array of the feilds that you are intrested in getting in your table
//note that if not all feilds will be full the row will not be presented. 
export function getData(btnId, collect, fields) {
    ShowHideFunc(["TableHolder"], ["allAdmin"])
    db.collection(collect).get().then(snapshot => {
        const data = [];
        //extract data from snapshot
        snapshot.forEach(doc => {
            const info = doc.data();
            if (info) {
                data.push(info);
            }
            else
                console.log("no data");

        });
        if (data.length === 0)
            alert(Dictionary.nothingToShow);
        else {
            //render the table
            ReactDOM.render(<DisplayData btnId={btnId} collect={collect} data={data} fields={fields} />, document.getElementById('TableHolder'));
        }

    }).catch(error => console.log(error))
}




//DisplayData will enter the data in to the table 
const DisplayData = (props) => {
    var fields = props.fields,//fields to search for in data
        collect = props.collect,//the collection that the data was taken from
        data = props.data,//the array that the data was pushed in to
        btnId = props.btnId,// get button id from props 
        id;//takes id from data
    const body = [];
    data.forEach(singleRow => {
        var col = [];
        var allCollsFull = true;
        //go through the data and take only the requierd feilds
        fields.forEach(field => {
            if (singleRow[field] != undefined || singleRow[field] != "")
                col.push(String(singleRow[field]));
            else
                allCollsFull = false;
        })
        //get id from the DB
        id = singleRow["id"];
        if (allCollsFull) {
            body.push(<BuildTableBody collect={collect} id={id} colls={col} />);
        }
        else {
            console.log("col no full so wasent added");
            console.log(col);
        }


    })

    const serviceButtons = [];
    serviceButtons.push(<button onClick={() => ShowHideFunc(["allAdmin"], ["TableHolder"])} id="backBtn" class="btn" >{Dictionary.back}</button>)
    if (btnId == "userMngBtn") {
        serviceButtons.push(<button class="btn" id="addUserBtn" data-toggle="modal" data-target="#newUserModal">{Dictionary.addUserBtn}</button>)
    }

    return (
        <div id="feedbackTable">
            <table class="table table-dark">
                <BuildTableHead fields={fields} />
                <tbody>
                    {body}
                </tbody>
                <div id="buttonsTable">
                    {serviceButtons}
                </div>
            </table>
        </div>
    )
}
//asks if action is inteded and renders the item out of the container
export function askAndDelete(collect, id) {
    return () => {
        var del = window.confirm(Dictionary.areYouSure);
        if (del == true)
            removeItem(collect, id);
    }
}
//delelte id in collaction and render it out of the container
export function removeItem(collect, id) {
    console.log(collect, id);
    if (id) {
        db.collection(collect).doc(id).delete().then(() => {
            ReactDOM.render(<a></a>, document.getElementById("tr" + id));
            console.log(collect, id);
            alert(Dictionary.collect + " " + Dictionary.deletedSuccessfully);//see how to make collect readable
        });
    }
    else
        alert(Dictionary.error);
}


//show everything in the show array and hide all from the hide array
export function ShowHideFunc(show, hide) {
    if (show)
        show.forEach(shower => {
            $("#" + shower).show();
        })
    if (hide)
        hide.forEach(hider => {
            $("#" + hider).hide();
        })
}

//gets all fuilds requierd and maks a table head
export const BuildTableHead = (props) => {
    var fields = props.fields;
    const res = []
    if (fields)
        fields.forEach(field => {
            res.push(<th class = "textAlign"> {field} </th>)
        })
    return (
        <thead>
            <tr>
                {res}
            </tr>
        </thead>
    )
}
//put a row of objects in to the table one collum at a time
export const BuildTableBody = (props) => {
    var colls = props.colls,//data colums
        collect = props.collect,
        id = props.id;

    var tds = [];

    colls.forEach(col => {
        tds.push(<td class = "textAlign"> {col} </td>);
    });
    tds.push(
        <td class ="deleteBtnTd" > <button class="btn-danger deleteBtn" onClick={askAndDelete(collect, id)} >{Dictionary.delete}</button></td>
    );
    return (
        <tr id={"tr" + id}>
            {tds}
        </tr>
    )
}


$(document).ready(() => {
    //    deleteWoman("דניאל רז2020-06-10");


});
