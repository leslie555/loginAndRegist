import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/WarningRounded';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/HelpOutline';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

class MyDialog extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.props.dispatch({
      type:'appModel/updateState',
      payload:{
        dialogOpen:false
      }
    });
  }
  render(){
    const {dialogOpen, dialogOptions: {iconType, title, message, actions}, classes} = this.props;
    const Icon = variantIcon[iconType];
    return (
      <Dialog
        open={dialogOpen||false}
        onClose={this.handleClose}
        disableBackdropClick={Boolean(actions&&actions.length>1)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{paper: global.classes.dialogWidth}}
      >
        {
          title&&
          <DialogTitle id="alert-dialog-title">
            <span className={classes.flexCenter}>
              {Icon&&<Icon className={classNames(classes.icon, classes[iconType])}/>}
              {title}
            </span>
          </DialogTitle>
        }
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.flexCenter}>
            {!title&&Icon&&<Icon className={classNames(classes.icon, classes[iconType])}/>}
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            actions ?
              actions.map((action, index)=>{return (
                <Button color={action.color} key={index} autoFocus={action.autoFocus||false}
                  onClick={()=>{
                    if(action.cb) action.cb();
                    this.handleClose();
                  }}
                >
                  {action.text}
                </Button>
              );})
              :
              <Button color="primary" autoFocus
                onClick={this.handleClose}
              >
                知道了
              </Button>
          }
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = theme => ({
  success: {
    color: green[600],
  },
  error: {
    color: theme.palette.error.dark,
  },
  info: {
    color: theme.palette.primary.dark,
  },
  warning: {
    color: amber[700],
  },
  confirm: {
    color: theme.palette.primary.dark,
  },
  icon: {
    fontSize: 30,
    marginRight: theme.spacing.unit,
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});
const mapStateToProps = ({ appModel})=>({
  dialogOpen: appModel.dialogOpen, dialogOptions: appModel.dialogOptions||{}
});
export default connect(mapStateToProps)(withStyles(styles)(MyDialog));


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  confirm: HelpIcon,
};