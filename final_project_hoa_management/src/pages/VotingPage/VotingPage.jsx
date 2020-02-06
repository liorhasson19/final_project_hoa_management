import React, { Component } from "react";
import "./VotingPage.css";
import VotingComponent from "../../components/Voting/VotingComponent";
import {
  Accordion,
  Container,
  Form,
  FormControl,
  Row,
  Col,
  Button
} from "react-bootstrap";
import NewVotingModal from "../../components/Voting/Modals/NewVotingModal";
import { Redirect } from "react-router-dom";
import VotingModel from "../../models/VotingModel";
import Parse from "parse";
import Select from "react-select";

export default class VotingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewVotingModal: false,
      input: "",
      votings: [],
      selectedOption: { value: "", label: "Clear Voting Filter" },
      selectedSortOption: "date"
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
  //Function that handles the input field changes
  onChangeHandler = ev => {
    this.setState({
      input: ev.target.value
    });
    // console.log("this.state.input: " + this.state.input);
  };

  //Function that handles the select field changes
  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    // console.log(`this.state.selectedOption: `, selectedOption);
  };

  //Function that handles the radio field changes
  handleSortChange = ev => {
    this.setState({
      selectedSortOption: ev.target.value
    });
    // console.log(
    // "this.state.handleSortChange: " + this.state.selectedSortOption
    // );
  };

  //Function that handles the modals components to close
  handleClose = () => {
    this.setState({
      showNewVotingModal: false,
      showEditVotingModal: false
    });
  };

  //Function that adds a new voting to the parse database
  //and to the votings state
  handleNewVoting = newVoting => {
    console.log(this.state.date);
    const { activeUser } = this.props;
    const Voting = Parse.Object.extend("Voting");
    const newParseVoting = new Voting();
    newParseVoting.set("title", newVoting.title);
    newParseVoting.set("details", newVoting.details);
    newParseVoting.set("options", [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" }
    ]);
    newParseVoting.set("dueDate", newVoting.date);

    newParseVoting.set("createdBy", Parse.User.current());
    newParseVoting.set("community", activeUser.community);
    newParseVoting.save().then(
      theCreatedParseVoting => {
        console.log("Voting created", theCreatedParseVoting);
        this.setState({
          votings: this.state.votings.concat(
            new VotingModel(theCreatedParseVoting)
          )
        });
      },
      error => {
        console.error("Error while creating Voting: ", error);
      }
    );
  };

  //Function that deletes a new voting from the parse database
  // and from the issues state
  deleteVoting = votingId => {
    // const Voting = Parse.Object.extend("Voting");
    // const query = new Parse.Query(Voting);
    // query.get(votingId).then(object => {
    //   object.destroy().then(
    //     votingDeleted => {
    //       console.log("Voting deleted", votingDeleted);
    //     },
    //     error => {
    //       console.error("Error while deleting Voting: ", error);
    //     }
    //   );
    // });
    // const { votings } = this.state;
    // let votingsDel = votings;
    // let votingDelId = votings.findIndex(
    //   votingToDelete => votingToDelete.id === votingId
    // );
    // votingsDel.splice(votingDelId, 1);
    // // console.log(issuesDel);
    // this.setState({
    //   votings: votingsDel
    // });
  };

  render() {
    const { showNewVotingModal, input, votings, selectedOption } = this.state;
    const { activeUser } = this.props;

    const options = [
      { value: "", label: "Clear Voting Filter" },
      { value: "True", label: "Pending Votings" },
      { value: "False", label: "Expired Votings" }
    ];

    const styles = {
      row: {
        marginLeft: 0,
        marginRight: 0
      },
      col: {
        paddingLeft: 0,
        paddingRight: 0
      }
    };
    console.log(votings);
    // Funxtion that filters the votings array according
    // to the text entered in the input field
    let inputFilteredVotings = votings.filter(vot => {
      let boolResultofTitle = vot.title
        .toLowerCase()
        .includes(this.state.input.toLowerCase());
      let boolResultofDetails = vot.details
        .toLowerCase()
        .includes(this.state.input.toLowerCase());
      return boolResultofTitle || boolResultofDetails;
    });

    //Function that filters the votings array according to their isActive value
    let selectFilteredVotings = inputFilteredVotings.filter(vot => {
      if (this.state.selectedOption.value === "") {
        console.log(this.state.selectedOption.value);
        return true;
      } else if (this.state.selectedOption.value === "True" && vot.isActive) {
        return true;
      } else if (this.state.selectedOption.value === "False" && !vot.isActive) {
        return true;
      }
      return false;
    });

    //Sorting the votings by date or by status
    let sortedVotings = selectFilteredVotings;
    if (this.state.selectedSortOption === "date") {
      sortedVotings = selectFilteredVotings.sort(function(a, b) {
        return a.createdAt < b.createdAt;
      });
    } else if (this.state.selectedSortOption === "priority") {
      sortedVotings = selectFilteredVotings.sort(function(a, b) {
        if (a.selectedOption.value < b.selectedOption.value) {
          return -1;
        } else if (a.selectedOption.value > b.selectedOption.value) {
          return 1;
        } else return 0;
      });
    }

    const votingsView = sortedVotings.map((voting, index) => (
      // const votingsView = sortedVotings.map((voting, index) => (
      <VotingComponent
        ind={index}
        key={voting.id}
        voting={voting}
        activeUser={activeUser}
        editVoting={this.editVoting}
        deleteVoting={this.deleteVoting}
      />
    ));

    // const newVotingButton = activeUser.isCommitteMember ? (
    //   <Button
    //     size="sm"
    //     onClick={() => {
    //       this.setState({ showNewVotingModal: true });
    //     }}
    //   >
    //     New Voting
    //   </Button>
    // ) : null;

    const community = activeUser ? activeUser.community : null;

    if (!activeUser) {
      return <Redirect to="/" />;
    }

    return (
      <div className="votings-page">
        <Container fluid className="v-cont">
          <Form.Group>
            <Row className="votings-input-row" style={styles.row}>
              <Col lg="6" style={styles.col}>
                <FormControl
                  className="votings-input"
                  placeholder="Filter votings by text in Title and Details"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={input}
                  onChange={this.onChangeHandler}
                />
              </Col>
              <Col lg="3" style={styles.col}>
                <Select
                  className="votings-select"
                  value={selectedOption}
                  onChange={this.handleSelectChange}
                  options={options}
                  placeholder="Filter by Priority"
                  // defaultValue={{ label: "Clear Filter", value: "" }}
                />
              </Col>
              <Col lg="2.5" className="voting-sort" style={styles.col}>
                <Form className="votings-radio-btns">
                  <div>Sort by:&nbsp;&nbsp;</div>
                  {["radio"].map(type => (
                    <div key={`inline-${type}`} className="radio-btns">
                      <Form.Check
                        inline
                        label="Date"
                        type={type}
                        id={`inline-${type}-1`}
                        name="sort"
                        onChange={this.handleSortChange}
                        value="date"
                        checked={this.state.selectedSortOption === "date"}
                      />
                      <Form.Check
                        inline
                        label="Status"
                        type={type}
                        id={`inline-${type}-2`}
                        name="sort"
                        onChange={this.handleSortChange}
                        value="status"
                        checked={this.state.selectedSortOption === "status"}
                      />
                    </div>
                  ))}
                </Form>
              </Col>
            </Row>
          </Form.Group>
          <Row className="btn-input-row" style={styles.row}>
            <div className="voting-title-table">
              Community: {community.get("community")}
            </div>
            <Button
              size="sm"
              onClick={() => {
                this.setState({ showNewVotingModal: true });
              }}
            >
              New Voting
            </Button>
          </Row>
          <Row style={styles.row}>
            <Accordion defaultActiveKey="1" className="voting-accord">
              {votingsView}
            </Accordion>
          </Row>

          <NewVotingModal
            show={showNewVotingModal}
            handleClose={this.handleClose}
            handleNewVoting={this.handleNewVoting}
          />
        </Container>
      </div>
    );
  }
}
