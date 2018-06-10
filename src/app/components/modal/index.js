import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxHeight: '70%',
    overflow: 'auto'
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class ModalContainer extends React.Component {

  render() {
    const { classes, opened, children } = this.props;
    return (
      <div>
        <Modal onBackdropClick={this.props.onClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={opened}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            {children}
          </div>
        </Modal>
      </div>
    );
  }

}

ModalContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  opened: PropTypes.bool,
  onClose: PropTypes.func
};

// We need an intermediary variable for handling the recursive nesting.
const ModalWrapped = withStyles(styles)(ModalContainer);

export default ModalWrapped;
