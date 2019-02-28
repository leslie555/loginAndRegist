import React from 'react';
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import CreateFeedback from './CreateFeedback';
import FeedbackList from './FeedbackList';


class Feedback extends React.Component{
  UNSAFE_componentWillMount(){
    const {feedbackArr, dispatch} = this.props;
    if(!feedbackArr) {
      global.myFetch({url: global.serverBaseUrl+'/Myusers/me/feedbacks'})
        .then((feedbacks)=>{
          dispatch({type:'feedbacksModel/updateState', payload:{feedbackArr:feedbacks}})
        });
    }
  }
  render(){
    const {showCreateForm,showFeedbackList, dispatch, classes, width} = this.props;
    return (
      <div>
        <Paper className={classes.paper}>
          {(!showCreateForm&&!showFeedbackList)&&
            <div style={{height:'15rem',display:'flex', justifyContent:'center', alignItems:'center'}}>
              <Button variant="extendedFab" color="secondary" onClick={()=>{dispatch({type:'createFeedbackModel/updateState', payload:{showCreateForm:true}}) }}>
                <EditIcon/>
                我要反馈问题
              </Button>
            </div>
          }
          <CreateFeedback/>

          {(!showFeedbackList&&!showCreateForm)&&
            <div style={{height:'15rem',display:'flex', justifyContent:'center', alignItems:'center'}}>
              <Button variant="extendedFab" color="primary" 
                onClick={()=>{dispatch({type:'feedbacksModel/updateState', payload:{showFeedbackList:true}}) }}>
                <EditIcon/>
                我反馈的问题
              </Button>
            </div>
          }
          <FeedbackList/>
          
        </Paper>
      </div>
    )
  }
}


const styles=()=>({
  paper :{
    marginBottom:'1.5rem',
    padding: '2rem 1rem',
  },
  title :{
    display:'inline-block',
    marginTop: '0.7rem',
    padding: '0.5rem 0.8rem',
    height: '2.4rem',
    width: '8rem',
    borderRadius: '1.2rem',
    color: '#fff',
    textAlign: 'center'
  },
});
const mapStateToProps=({feedbacksModel:{showFeedbackList},createFeedbackModel:{showCreateForm}})=>{
  return {showFeedbackList,showCreateForm}
}
export default connect(mapStateToProps)(withStyles(styles)(withWidth()(Feedback)));

