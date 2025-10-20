import { useState } from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'
import { connect } from 'react-redux'
import { addItem } from '../actions/itemActions'
import PropTypes from 'prop-types'

const ItemModal = (props) => {

    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');

    const onChange = (e) => {
        setName(e.target.value);
    }

    const toggle = () => {
        setModal(!modal);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name: name
        };

        props.addItem(newItem);

        // Close modal
        toggle();
    };

    return (
        <div>
            <Button
                color="dark"
                style={{ marginBottom: '2rem' }}
                onClick={toggle}>
                Add Item
            </Button>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add to Shopping List</ModalHeader>
                <ModalBody>
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="item">Item</Label>
                            <Input
                                type="text"
                                name="name"
                                id="item"
                                placeholder="Add shopping item"
                                onChange={onChange}
                            />

                            <Button
                                color="dark"
                                style={{ marginTop: '2rem' }}
                                block>
                                Add
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

ItemModal.propTypes = {
    addItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect(mapStateToProps, { addItem })(ItemModal)
