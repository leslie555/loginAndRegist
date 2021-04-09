import React from 'react';
import {connect} from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

class InputDialog extends React.Component{
  onCancel = () => {
    this.props.onCancel();
    this.props.dispatch({
      type:'inputDialogModel/updateState',
      payload:{open:false, errorText: undefined, newText: undefined}
    });
  };
  onOk=() => {
    const {newText, errorText, onOk, dispatch} = this.props;
    if(errorText) return;
    const trimedNewText = newText&&newText.trim();
    if(!trimedNewText) {
      dispatch({
        type:'inputDialogModel/updateState',
        payload:{errorText: '输入不能为空！'}
      });
      return;
    }
    onOk(trimedNewText);
    //先关闭对话框，再清除errText, newText,是为了避免关闭对话框前出现“闪变”，因为关闭对话框是一个持续一段时间的
    //过程
    dispatch({
      type:'inputDialogModel/updateState',
      payload:{open:false}
    });
    setTimeout(()=>{
      dispatch({
        type:'inputDialogModel/updateState',
        //这里之所以再次加上open:false，是因为店铺端新建Region对话框点击回车键对话框不关闭，什么原因不知道
        payload:{open:false, errorText: undefined, newText: undefined}
      });
    },400)
  };
  handleInputChange=(e)=>{
    console.log('c000000');
    console.log('c1111111');
    const newText = e.target.value;
    this.props.dispatch({
      type: 'inputDialogModel/updateState', 
      payload: {newText, errorText:this.props.validateFn(newText)}
    });
  };
  render(){
    console.log('RegionNameEditDialog rendered');
    const {title, message, initText, newText, open, errorText, classes} = this.props;
    // return(
    //   <Modal
    //     title={title}
    //     visible={open}
    //     okText="确定"
    //     cancelText="取消"
    //     onCancel={this.onCancel}
    //     bodyStyle={{padding: '15px'}}
    //     onOk={this.onOk}
    //     zIndex={2000}
    //   >
    //     <Input value={newText===undefined||newText===null?initText:newText}
    //       onChange={this.handleInputChange}
    //     />
    //     <p style={{color: 'red'}}>{errorText}</p>
    //   </Modal>
    // )
    return (
      <Dialog
        open={open||false}
        onClose={this.onCancel}
        // disableBackdropClick
        aria-labelledby="alert-dialog-title"
        classes={{paper: global.classes.dialogWidth}}
      >
        <DialogTitle id="alert-dialog-title">
          {`请输入${title}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
          <TextField
            error={Boolean(errorText)}
            helperText={errorText}
            label={title}
            value={newText===undefined||newText===null?initText:newText}
            onChange={this.handleInputChange}
            fullWidth
            onKeyDown={(evt)=>{
              if(evt.keyCode===13) this.onOk();
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel}>取消</Button>
          <Button color="primary" autoFocus 
            disabled={newText===undefined||newText===null}
            onClick={this.onOk} 
            onKeyDown={(evt)=>{
              if(evt.keyCode===13) this.onOk();
            }}
          >确定</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps=({
  inputDialogModel:{title, message, initText, newText, open, errorText, onOk, onCancel, validateFn}
})=>{
  return {title, message, initText, newText, open, errorText, onOk, onCancel, validateFn};
}

const styles = () => {
  return ({
  });
};

export default connect(mapStateToProps)(withStyles(styles)(InputDialog));
