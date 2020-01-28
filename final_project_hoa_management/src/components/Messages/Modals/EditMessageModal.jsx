import React, { Component } from "react";
import { Modal, Image, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import Parse from "parse";

export default class EditMessageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.message.id,
      title: this.props.message.title,
      details: this.props.message.details,
      comments: this.props.message.comments,
      createdBy: this.props.message.createdBy,
      createdAt: this.props.message.createdAt,
      selectedOption: this.props.message.selectedOption,
      fileImg: {
        file: undefined,
        URL: undefined
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.editMessage = this.editMessage.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    // this.handleClose = this.handleClose.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  editMessage(message) {
    const { title, details, selectedOption, fileImg } = this.state;
    console.log(message.id);
    console.log("title", this.state.title);
    const Message = Parse.Object.extend("Message");
    const query = new Parse.Query(Message);
    // here you put the objectId that you want to update
    query.get(message.id).then(object => {
      object.set("title", title);
      object.set("details", details);
      object.set("selectedOption", selectedOption);
      object.set("image", new Parse.File(fileImg.file.name, fileImg.file));
      object.save().then(
        console.log("message was updated") //TODO: Check how to change the message in the state
        // response => {
        //   // You can use the "get" method to get the value of an attribute
        //   // Ex: response.get("<ATTRIBUTE_NAME>")
        //   if (typeof document !== "undefined")
        //     document.write(`Updated Message: ${JSON.stringify(response)}`);
        //   console.log("Updated Message", response);
        // },
        // error => {
        //   if (typeof document !== "undefined")
        //     document.write(
        //       `Error while updating Message: ${JSON.stringify(error)}`
        //     );
        //   console.error("Error while updating Message", error);
        // }
      );
    });
    this.props.handleClose();
  }

  handleFileChange(event) {
    let newFileImg;
    if (event.target.files[0]) {
      newFileImg = {
        file: event.target.files[0],
        URL: URL.createObjectURL(event.target.files[0])
      };
    } else {
      newFileImg = {
        file: undefined,
        URL: undefined
      };
    }

    this.setState({ fileImg: newFileImg });
  }

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  //   handleClose() {
  //     this.setState({
  //       showEditMessageModal: false
  //     });
  //   }

  render() {
    const { show, handleClose, message } = this.props;
    const { title, details, fileImg, selectedOption } = this.state;

    const priorityOptions = [
      { value: "Information", label: "Information" },
      { value: "Important", label: "Important" }
    ];
    console.log("selectedOption", this.state.selectedOption);
    console.log("details", this.state.details);
    console.log("massage", this.props.message);

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="formHorizontalTitle">
              <Form.Label column lg={3}>
                Title
              </Form.Label>
              <Col lg={9}>
                <Form.Control
                  type="text"
                  placeholder="Edit message title"
                  name="title"
                  value={title}
                  onChange={this.handleInputChange}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalDetails">
              <Form.Label column sm={3}>
                Details
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  placeholder="Edit message details"
                  name="details"
                  value={details}
                  onChange={this.handleInputChange}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalOptions">
              <Form.Label column lg={3}>
                Priority
              </Form.Label>
              <Col lg={9}>
                <Select
                  value={selectedOption}
                  //   defaultValue={{
                  //     label: message.priority,
                  //     value: message.priority
                  //   }}
                  onChange={this.handleSelectChange}
                  options={priorityOptions}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalEndDate">
              <Form.Label column lg={3}>
                Image URL
              </Form.Label>
              <Col lg={4}>
                <Form.Control type="file" onChange={this.handleFileChange} />
              </Col>
              <Col lg={4}>
                <Image src={fileImg.URL} fluid width="300px" />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const editMessage = this.editMessage;
              editMessage(message);
              console.log(message);
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
