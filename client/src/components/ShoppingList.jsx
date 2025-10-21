import { Container, ListGroup, ListGroupItem, Button, Alert } from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { connect } from 'react-redux'
import { getItems, deleteItem, addItem } from '../actions/itemActions'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const ShoppingList = (props) => {
    const { items } = props.item;
    const [error, setError] = useState(null);

    const deleteItem = (id) => {
        props.deleteItem(id);
    }

    useEffect(() => {
        // Call getItems - it doesn't return a Promise, so we can't use .catch()
        try {
            props.getItems();
        } catch (err) {
            console.error('Error calling getItems:', err);
            setError('Failed to load items. Please check your network connection and API configuration.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            {error && <Alert color="danger">{error}</Alert>}
            <ListGroup>
                <TransitionGroup className="shopping-list">
                    {items.map((item) => (
                        <CSSTransition key={item._id} timeout={500} classNames="fade">
                            <ListGroupItem>
                                <Button
                                    className='remove-btn'
                                    color='danger'
                                    size='sm'
                                    onClick={() => deleteItem(item._id)}
                                >&times;
                                </Button>
                                {item.name}
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
        </Container>
    )
}

ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect(mapStateToProps, { getItems, deleteItem, addItem })(ShoppingList)