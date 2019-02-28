import React from 'react'
import {connect} from 'react-redux'
// import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import ConversationDialog from '../loginAndRegist/ConversationDialog';

// import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';

// import FormHelperText from '@material-ui/core/FormHelperText';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const rowsPerPage=10;
class TablePaginationActions extends React.Component {

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };
  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  render() {
    const {  count, page,  } = this.props;

    return (
      <div style={{flexShrink:0}}>
        
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / 10) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        
      </div>
    );
  }
}

class FeedbackList extends React.Component{
  
  state={
    statusCode:0,
    page:0,
  }

  handleFeedback=(e)=>{
    const picArr=[];
    for (let item of e.conversation){
      for(let pic of item.imgs){
        picArr.push(pic)
      }
    }
    this.props.dispatch({
      type:'conversationModel/replace',
      payload:{
        open:true,
        id:e.id,
        adminId:e.adminId,
        createDate:e.createDate,
        sender:e.sender,
        title:e.title,
        seriousLevel:e.seriousLevel,
        type:e.type,
        phone:e.phone,
        conversation:e.conversation,
        picArr:picArr,

      }
    });
  }
  handleChangePage=(event,page)=>{
    this.setState({page})
  }

  render(){
    const {page}=this.state;
    const {feedbackArr,showFeedbackList,dispatch} = this.props;
    if(!feedbackArr){return null}
    
    return(
      <div>
        {showFeedbackList&&
          <React.Fragment>
            <Button color='primary' variant="contained" onClick={()=>{dispatch({type:'feedbacksModel/updateState',payload:{showFeedbackList:false}})}}>返回</Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">ID</TableCell>
                  <TableCell padding="none"> 问题 </TableCell>
                  <TableCell padding="none"> 创建时间 </TableCell>
                  <TableCell padding="none"> 当前状态 </TableCell>
                  <TableCell padding="none">操作</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {feedbackArr.slice(rowsPerPage*page,rowsPerPage*page+rowsPerPage).map((feedback, index)=>{
                  return (
                    <TableRow key={index}>
                      <TableCell padding="none">{feedback.id}</TableCell>
                      <TableCell padding="none">{feedback.title}</TableCell>
                      <TableCell padding="none">{`${new Date(feedback.createDate).getFullYear()}-${new Date(feedback.createDate).getMonth()+1}-${new Date(feedback.createDate).getDate()}`}</TableCell>
                      <TableCell padding="none">{(feedback.statusCode===100||feedback.statusCode===101)?<span style={{backgroundColor:'#f00'}}>已关闭</span>:'处理中'}</TableCell>
                      <TableCell padding="none">
                        <Button color="primary" size="small" style={{padding:0, minWidth:0}}
                          onClick={()=>{this.handleFeedback(feedback)}}
                        >查看</Button>
                        {(new Date((feedback.conversation.filter(chat=>chat.sender==='admin').pop()||{}).chatDate).getTime()>new Date(feedback.feedbackerViewDate).getTime())?<Icon color='secondary'>info</Icon>:''}
                        <Button color="secondary" size="small" style={{marginLeft:'2rem', padding:0, minWidth:0}}
                          onClick={()=>{dispatch({type:'conversationModel/updateStatusCodeWithServer',payload:{id:feedback.id}})}}
                        >关闭问题</Button>
                        <Button color="secondary" size="small" style={{marginLeft:'2rem', padding:0, minWidth:0}}
                          // onClick={()=>{this.setState({changeStatusDialogOpen:true,feedbackItem:feedback})}}
                        >删除</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={5}
                    count={feedbackArr.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    SelectProps={{native: true, }}
                    onChangePage={this.handleChangePage}
                    rowsPerPageOptions={[]}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            <ConversationDialog/>
          </React.Fragment>
        }
      </div>
      
    );
  }

}
const mapStateToProps=({feedbacksModel:{feedbackArr,showFeedbackList}})=>{
  return ({feedbackArr,showFeedbackList});
}

const styles ={
};
export default connect(mapStateToProps)(withStyles(styles)(FeedbackList));

