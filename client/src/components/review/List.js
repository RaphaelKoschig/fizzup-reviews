import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/review/list';
import { ENTRYPOINT } from '../../config/entrypoint';
import SlateReader from "../tools/SlateReader";
import ReactStars from "react-rating-stars-component";
import {Col, Container, Row, Image, Button} from "react-bootstrap";
import Moment from 'moment';
import './review.css'
import {extractHubURL, fetch, normalize} from "../../utils/dataAccess";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listReviews : null,
      orderDirection : 'asc'
    }
  }

  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page)
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  orderList = (orderName) => {
    let params = {};
    if (orderName === 'rating') params = { 'order[rating]' : this.state.orderDirection};
    if (orderName === 'createdAt') params = { 'order[createdAt]' : this.state.orderDirection}
    fetch('reviews', params )
      .then(response =>
        response
          .json()
          .then(newRetrieved => ({ newRetrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ newRetrieved, hubURL }) => {
        newRetrieved = normalize(newRetrieved)
        this.setState({listReviews : newRetrieved});
        console.log(newRetrieved);
        if (this.state.orderDirection ==='asc') {
          this.setState({orderDirection : 'desc'})
        }
        else {
          this.setState({orderDirection : 'asc'})
        }
      })
  }

  render() {
    Moment.locale('fr');

    const editableStars = {
      size: 40,
      edit: true,
      onChange: starValue => {
          fetch('reviews', { rating: starValue })
            .then(response =>
              response
                .json()
                .then(newRetrieved => ({ newRetrieved, hubURL: extractHubURL(response) }))
            )
            .then(({ newRetrieved, hubURL }) => {
              newRetrieved = normalize(newRetrieved)
              this.setState({listReviews : newRetrieved});
              console.log(newRetrieved);
            })
      }
    };

    let listOfReviews = this.props.retrieved;
    if (this.state.listReviews != null) {
      listOfReviews = this.state.listReviews;
    }

    return (
      <Container className="main-container">
        <h1>Liste des avis</h1>

        {this.props.loading && (
          <div className="alert alert-info">Chargement...</div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            {this.props.deletedItem['@id']} effacé.
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link to="create" className="btn btn-primary">
            Donner votre avis
          </Link>
        </p>
        <Row>
          <Col>
            <h5>Cherchez selon note : <ReactStars {...editableStars} /></h5>
          </Col>
          <Col className="col-4">
            <Button className="btn btn-info" onClick={() => {this.orderList('rating')}}>Trier par Note</Button>
            <Button className="btn btn-info" onClick={() => {this.orderList('createdAt')}}>Trier par Date</Button>
          </Col>
        </Row>


        {
          listOfReviews &&
          listOfReviews['hydra:member'].map(item => (
          <Container key={item['@id']} className="review-container">
              <Row className="justify-content-between">
                <Col>
                  <ReactStars value={item['rating']} edit={false}/>
                  <strong>{item['pseudo']}</strong>
                </Col>
                <Col className="col-4">
                  <Row>
                    Publié le {Moment(item['createdAt']).format('DD/MM/Y')} à {Moment(item['createdAt']).format('HH:mm')}
                  </Row>
                  <Row>
                    email : {item['email']}
                  </Row>
                </Col>
              </Row>
              <Row className="bg-light align-items-center">
                <Col className="col-8">
                  <SlateReader itemValue={item['comment']}/>
                </Col>
                <Col className="justify-content-center col-4">
                  <a href={ENTRYPOINT +'/photo/'+ item['photo']}>
                    <Image src={ENTRYPOINT +'/photo/'+ item['photo']} className="review-photo" thumbnail/>
                  </a>
                </Col>
              </Row>
          </Container>
        ))
        }
        {this.pagination()}
      </Container>
    );
  }

  pagination() {
    const view = this.props.retrieved && this.props.retrieved['hydra:view'];
    if (!view) return;

    const {
      'hydra:first': first,
      'hydra:previous': previous,
      'hydra:next': next,
      'hydra:last': last
    } = view;

    return (
      <nav aria-label="Page navigation" className="navigation">
        <Link
          to="."
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&lArr;</span> Première page
        </Link>
        <Link
          to={
            !previous || previous === first ? '.' : encodeURIComponent(previous)
          }
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&larr;</span> Précédent
        </Link>
        <Link
          to={next ? encodeURIComponent(next) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Suivant <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={last ? encodeURIComponent(last) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Dernière page <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
    );
  };
}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.review.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
