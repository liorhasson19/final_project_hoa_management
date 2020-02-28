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
import Footer from "../../components/footer/Footer";
import NewVotingModal from "../../components/Voting/Modals/NewVotingModal";
import { Redirect } from "react-router-dom";
import VotingModel from "../../models/VotingModel";
import Parse from "parse";

export default class VotingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewVotingModal: false,
      votings: []
    };
  }
  async componentDidMount() {
    const { activeUser } = this.props;
    console.log(activeUser);

    if (activeUser) {
      const Voting = Parse.Object.extend("Voting");
      const query = new Parse.Query(Voting);
      query.equalTo("community", activeUser.community);
      const parseVotings = await query.find();
      const votings = parseVotings.map(
        parseVoting => new VotingModel(parseVoting)
      );
      this.setState({ votings });
    }
  }

  handleClose = () => {
    this.setState({
      showNewVotingModal: false
    });
  };

  handleNewVoting = newVoting => {
    this.props.handleNewVoting(newVoting);
  };

  render() {
    const { showNewVotingModal, votings } = this.state;
    const { activeUser } = this.props;
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
        <Container fluid className="vp-cont">
          <Row>
            <Col className="my-col vote-col" lg="6">
              <Row className="voting-page-title"> Active Votings</Row>
              <Row className="btn-input-row">
                <Button
                  size="sm"
                  onClick={() => {
                    this.setState({ showNewVotingModal: true });
                  }}
                >
                  New Voting
                </Button>
              </Row>
              <Row>
                <Accordion defaultActiveKey="1">{votingsComp}</Accordion>
              </Row>
            </Col>
            <Col className="my-col" lg="6">
              <Row>
                <div className="voting-page-title">Votings Results</div>
              </Row>
              <Row className="btn-input-row">
                <FormControl
                  size="sm"
                  placeholder="Filter by Text in Title and Details"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </Row>
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