import React from 'react';
import MySnackbar from './MySnackbar';
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputDialog from './InputDialog';
import MyDialog from './MyDialog';
import HugeImg from './HugeImg';
import AddImgDialog from './AddImgDialog';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

class Container extends React.Component {
  UNSAFE_componentWillMount(){
    global.classes = this.props.classes;
  }
  render(){
    const { children, circularProgressShow } = this.props;
    return (
      <div style={{height: '100%'}}>
        <CssBaseline/>
        {children}
        <MySnackbar/>
        {circularProgressShow&&!global.disableCircularProgress&&
          <CircularProgress style={{position:'fixed',left:document.body.clientWidth/2-20,top:'50%',zIndex:2000}}/>
        }
        <InputDialog/>
        <MyDialog/>
        <HugeImg/>
        <AddImgDialog/>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
  const { appModel } = state;
  const { circularProgressShow } = appModel;
  return { circularProgressShow };
};
const mapDispatchToProps = (dispatch)=>{
  return {
    dispatch
  };
};
const styles = theme => {
  return ({
    wingBlank: {
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem'
    },
    textField: {
      marginTop: theme.spacing.unit*1.6,
      marginBottom: theme.spacing.unit*1.6,
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing.unit*1.0,
        marginBottom: theme.spacing.unit*1.0,
      }
    },
    submitBtn: {
      marginTop: theme.spacing.unit*6,
      marginBottom: theme.spacing.unit*2,
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing.unit*3,
        marginBottom: theme.spacing.unit*1.0,
      }
    },
    dialogWidth: {
      width: '96%',
      margin: '2%',
    }
  });
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Container));