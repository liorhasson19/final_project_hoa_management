import React, { Component } from "react";
import "./VotingPage.css";
import VotingComponent from "../../components/Voting/VotingComponent";
import {
  Accordion,
  Container,
  FormControl,
  Row,
  Col,
  Button
} from "react-bootstrap";
import MainNavbar from "../../components/Navbar/MainNavbar";
import Footer from "../../components/Footer/Footer";
import NewVotingModal from "../../models/NewVotingModal";
import { Redirect } from "react-router-dom";
import VotingModel from "../../models/VotingModel";
import votingData from "../../data/votingData";

export default class VotingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewVotingModal: false,
      votings: votingData.map(voting => new VotingModel(voting))
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleNewVoting = this.handleNewVoting.bind(this);
  }

  handleClose() {
    this.setState({
      showNewVotingModal: false
    });
  }

  handleNewVoting(newVoting) {
    this.props.handleNewVoting(newVoting);
  }

  render() {
    const { showNewVotingModal, votings } = this.state;
    const { activeUser, handleLogout } = this.props;
    console.log("activeUser:" + activeUser);

    const votingsComp = votings.map((voting, index) => (
      <VotingComponent ind={index} key={index} voting={voting} />
    ));

    console.error(votingsComp);
    //  console.log(votingsComp);

    if (!activeUser) {
      return <Redirect to="/" />;
    }

    return (
      <div className="voting-page">
        <MainNavbar activeUser={activeUser} handleLogout={handleLogout} />
        <Container fluid className="vp-cont">
          <Row>
            <Col className="my-col vote-col" lg="6">
              <row className="voting-page-title"> Active Votings</row>
              <row className="btn-input-row">
                <Button
                  size="sm"
                  onClick={() => {
                    this.setState({ showNewVotingModal: true });
                  }}
                >
                  New Voting
                </Button>
              </row>
              <Row>
                <Accordion defaultActiveKey="1">{votingsComp}</Accordion>
              </Row>
            </Col>
            <Col className="my-col" lg="6">
              <row>
                <div className="voting-page-title">Votings Results</div>
              </row>
              <row className="btn-input-row">
                <FormControl
                  size="sm"
                  placeholder="Filter by Text in Title and Details"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </row>
              <VotingComponent />
            </Col>
          </Row>
          <NewVotingModal
            show={showNewVotingModal}
            handleClose={this.handleClose}
            handleNewVoting={this.handleNewVoting}
          />
        </Container>
        <Footer />
      </div>
    );
  }
}

/* <div className="voting-page">
<MainNavbar activeUser={activeUser} handleLogout={handleLogout} />
<Container fluid className="vp-cont">
  <Row>
    <Col className="my-col vote-col" lg="6">
      <row className="voting-page-title"> Active Votings</row>
      <row className="btn-input-row">
        <Button
          size="sm"
          onClick={() => {
            this.setState({ showNewVotingModal: true });
          }}
        >
          New Voting
        </Button>
      </row>
      <VotingComponent />
    </Col>
    <Col className="my-col" lg="6">
      <row>
        <div className="voting-page-title">Votings Results</div>
      </row>
      <row className="btn-input-row">
        <FormControl
          size="sm"
          placeholder="Filter by Text in Title and Details"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </row>
      <VotingComponent />
    </Col>
  </Row>
  <NewVotingModal
    show={showNewVotingModal}
    handleClose={this.handleClose}
    handleNewVoting={this.handleNewVoting}
  />
</Container>
<Footer />
</div>
);
}
} */
