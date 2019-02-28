import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import {connect} from 'react-redux'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

class MySnackbar extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(evt, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.props.dispatch({type:'appModel/updateState',payload:{snackbarOpen:false}});
  }
  render(){
    console.log('MySnackbar rendered');
    const {snackbarOpen, snackbarMessage, snackbarType, snackDuration, classes} = this.props;
    const Icon = variantIcon[snackbarType];
    return (
      <Snackbar
        open={snackbarOpen||false}
        ContentProps={{className: classes[snackbarType]}}
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)}/>
            {snackbarMessage}
          </span>
        }
        autoHideDuration={snackDuration||3000}
        onClose={this.handleClose}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            className={classes.close}
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon className={classes.icon}/>
          </IconButton>,
        ]}
      />
    );
  }
}


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const mapStateToProps = ({appModel: {snackbarOpen, snackbarType, snackbarMessage, snackDuration}})=>({
  snackbarOpen, snackbarType, snackbarMessage, snackDuration
});
export default connect(mapStateToProps)(withStyles(styles)(MySnackbar));