import React, { Component } from 'react';
import './MessagesPage.css';
import MainNavbar from '../../components/Navbar/MainNavbar';
import Footer from '../../components/Footer/Footer';
// import { Container, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class IMessagesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // showNewRecipeModal: false
        }

        // this.handleClose = this.handleClose.bind(this);
        // this.handleNewRecipe = this.handleNewRecipe.bind(this);
    }
    render() {
        const { activeUser, handleLogout } = this.props;

        if (!activeUser) {
            return <Redirect to="/" />
        }
        console.log("activeUser:" + this.props.activeUser.id);

        return (
            <div className="messages-page">
                <MainNavbar activeUser={activeUser} handleLogout={handleLogout} />
                <div className="m-cont">
                    Messages Page
                </div>
                <Footer />
            </div>
        )
    }
}
