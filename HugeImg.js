import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux'
import PicLoadingPng from '../loginAndRegist/picLoading.png';

class HugeImg extends React.Component {

  render(){
    const {hugeImgUrl, dispatch, classes} = this.props;
    if(!hugeImgUrl) return null;
    console.log('hugeImg')
    return (
      <div className={classes.hugImgBackground}
        onClick={()=>{dispatch({ type:'appModel/updateState',payload:{hugeImgUrl: undefined} });}}
      >
        <div className={classes.hugImgContainer}>
          <img src={hugeImgUrl} style={{width: '100%'}}/>
        </div>
      </div>
    );
  }
}
const styles=()=>({
  hugImgBackground: {
    position: 'fixed',
    top: 0,
    bottom:0,
    left:0, 
    right:0, 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundImage: `url(${PicLoadingPng})`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    zIndex:9999
  },
  hugImgContainer: {
    overflowY: 'auto',
    boxShadow: '0 0 15px #000', 
    maxHeight: '90%'
  },
});
export default connect(
  function({appModel: {hugeImgUrl}}){
    return ({hugeImgUrl});
  }
)(withStyles(styles)(HugeImg));