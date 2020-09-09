import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, reset } from '../../actions/review/create';
import Container from "react-bootstrap/Container";
import './review.css';

class Create extends Component {

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    eventSource: PropTypes.instanceOf(EventSource),
    reset: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    if (this.props.created)
      return (
        <Redirect
          to={`/`}
        />
      );

    return (
      <Container fluid className="container-md main-container">
        <h1>Nouvel avis - consommateur</h1>
        <Link to="." className="btn btn-secondary">
          Revenir à la liste d'avis
        </Link>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        <div className="review-form">
          <Form onSubmit={this.props.create} values={this.props.item} />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const eventSource = state.review.create.eventSource;
  const { created, error, loading } = state.review.create;
  return { created, error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
