import React, { Component } from "react";
import "./MessageComponent.css";
import EditMessageModal from "../../components/Messages/Modals/EditMessageModal";
import CommentModel from "../../models/CommentModel";
import {
  Card,
  Accordion,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Form
} from "react-bootstrap";
import Parse from "parse";

export default class MessageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditMessageModal: false,
      input: "",
      newComment: "",
      readMessageState: false
    };
    // this.addComment = this.addComment.bind(this);
  }

  onChangeHandler = ev => {
    this.setState({ input: ev.target.value });
    console.log("this.state.input: " + this.state.input);
  };

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  changeReadMessageState = message => {
    this.setState({
      readMessageState: true
    });
    console.log(this.state.readMessageState);
  };

  handleClose = () => {
    this.setState({
      showEditMessageModal: false
    });
  };

  handleNewComment = (newComment, message) => {
    console.log(message);
    const Message = Parse.Object.extend("Message");
    const query = new Parse.Query(Message);
    // here you put the objectId that you want to update
    query.get(message.id).then(object => {
      object.set("comments", newComment);
      object.save().then(
        console.log(newComment)
        // theCreatedParseMessage => {
        //   console.log("Message created", theCreatedParseMessage);
        //   this.setState({
        //     messages: this.state.messages.concat(
        //       new MessageModel(theCreatedParseMessage)
        //     )
        //   });
        // },
        // error => {
        //   console.error("Error while creating Message: ", error);
        // }
      );
    });
  };

  addComment(event, message) {
    const { input } = this.state;
    const newComment = input;

    //   // Function that is triggered only by the Enter key
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleNewComment(newComment, message);
      //     //     // console.log(this.state.list)
    }
  }

  render() {
    const { message } = this.props;
    const { showEditMessageModal, input } = this.state;

    const styles = {
      row: {
        marginLeft: 0,
        marginRight: 0
      },
      col: {
        paddingLeft: 15,
        paddingRight: 15
      }
    };
    // console.log(message.priority);
    // adds important/information icon to each message according to its priority
    let priorityImage = "";
    if (message.selectedOption.value === "Important") {
      priorityImage = require("./images/exclamation.png");
    } else {
      priorityImage = require("./images/info.png");
    }

    const readClass = this.state.readMessageState
      ? "message-title-read"
      : "message-title-unread";
    // console.log("readclass", this.state.readMessageState);

    console.log("message.createdAt: ", message.createdAt);
    return (
      <Card className="message-comp">
        <Accordion.Toggle
          as={Card.Header}
          eventKey={this.props.ind}
          className={readClass}
          onClick={() => {
            const changeReadMessageState = this.changeReadMessageState;
            changeReadMessageState(message);
            // console.log(message);
          }}
        >
          <div className="message-title">
            {this.props.message.title}{" "}
            <span className="message-createdat">
              Created at {message.createdAt.toLocaleString()}
            </span>
          </div>
          <div>
            <img
              src={priorityImage}
              alt="Message priority icon"
              width="25px"
            ></img>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.ind}>
          <Card.Body>
            <Row style={styles.row}>
              <Col lg="6" style={styles.col}>
                <Row>
                  <Col lg="3">
                    <Card.Img variant="top" src={message.img} />
                  </Col>
                  <Col lg="9" style={styles.col} className="message-mid-col">
                    <Row style={styles.row} className="message-row">
                      <Col lg="3" style={styles.col}>
                        Details:
                      </Col>
                      <Col lg="9" style={styles.col}>
                        {message.details}
                      </Col>
                    </Row>
                    <Row style={styles.row}>
                      <Col lg="3" style={styles.col}>
                        Priority:
                      </Col>
                      <Col lg="9" style={styles.col}>
                        {message.priority}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>

              <Col style={styles.col} lg="6">
                <Row className="message-row">
                  <div>Comments: {message.comments}</div>
                </Row>
                <Row style={styles.row}>
                  <Col lg="8">
                    <Form>
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control
                          as="textarea"
                          rows="2"
                          className="comment-textArea"
                          value={input}
                          onChange={this.onChangeHandler}
                          onKeyUp={this.addComment(message)}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col className="comment-buttons">
                    <ButtonToolbar>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          this.setState({ showEditMessageModal: true });
                        }}
                        handleClose={this.handleClose}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const deleteMessage = this.props.deleteMessage;
                          deleteMessage(message.id);
                          console.log(message.id);
                        }}
                      >
                        Delete
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Accordion.Collapse>
        <EditMessageModal
          show={showEditMessageModal}
          handleClose={this.handleClose}
          handleEditMessage={this.handleEditMessage}
          message={this.props.message}
        />
      </Card>
    );
  }
}
