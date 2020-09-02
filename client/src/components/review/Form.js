import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import ImageUploader from 'react-images-upload';
import Button from "react-bootstrap/Button";
import { ENTRYPOINT } from '../../config/entrypoint';
import axios from 'axios';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    this.onDrop = this.onDrop.bind(this);
  }

static propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

renderField = data => {
  data.input.className = 'form-control';

  const isInvalid = data.meta.touched && !!data.meta.error;
  if (isInvalid) {
    data.input.className += ' is-invalid';
    data.input['aria-invalid'] = true;
  }

  if (this.props.error && data.meta.touched && !data.meta.error) {
    data.input.className += ' is-valid';
  }

  return (
    <div className={`form-group`}>
      <label
        htmlFor={`review_${data.input.name}`}
        className="form-control-label"
      >
        {data.input.name}
      </label>
      <input
        {...data.input}
        type={data.type}
        step={data.step}
        required={data.required}
        placeholder={data.placeholder}
        id={`review_${data.input.name}`}
      />
      {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
    </div>
  );
};

  onDrop(picture) {
    this.setState({
      selectedFile: picture[0]
    });
    this.props.change('photo', picture[0].name);
  }

  fileUploadHandler = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      'file',
      this.state.selectedFile,
      this.state.selectedFile.name,
    );
    formData.append('filename', this.state.selectedFile.name)
    axios.post(ENTRYPOINT+'/uploads', formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {console.log(res.statusText)});
  }

render() {
  return (
    <form onSubmit={this.props.handleSubmit}>
      <Field
        component={this.renderField}
        name="pseudo"
        type="text"
        placeholder=""
      />
      <Field
        component={this.renderField}
        name="email"
        type="text"
        placeholder=""
      />
      <Field
        component={this.renderField}
        name="rating"
        type="number"
        placeholder=""
        normalize={v => parseFloat(v)}
      />
      <Field
        component={this.renderField}
        name="comment"
        type="text"
        placeholder=""
      />
      <Field
        component={this.renderField}
        name="photo"
        type="text"
        placeholder=""
      />
      <ImageUploader
        withIcon={true}
        buttonText='Choose one photo'
        onChange={this.onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        singleImage={true}
      />
      <Button onClick={this.fileUploadHandler} variant="secondary">Upload</Button>
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
}
}

export default reduxForm({
  form: 'review',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);

