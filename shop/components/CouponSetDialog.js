import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'material-ui/DatePicker';
import {connect} from 'react-redux';
import {DateTimeFormat} from './CurrentSales';
import InputAdornment from '@material-ui/core/InputAdornment';

class CouponSetDialog extends React.Component{
  state={
    minus: undefined, 
    full: undefined, 
    totalNum: undefined,
    validDate: undefined
  };
  handleCancel = () => {
    this.props.dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:false}
    });
    this.setState({minus: undefined, full: undefined, totalNum: undefined,
      validDate: undefined});
  };
  handleConfirm = ()=>{
    const {confirmCallback} = this.props;
    let {minus, full, totalNum, validDate} = this.state;
    minus = parseInt(minus);//代金券的金额
    full = parseInt(full);  //付款满多少才可以使用
    totalNum = parseInt(totalNum);  //计划发放钟张数
    if(isNaN(full)||isNaN(minus)||isNaN(totalNum)||!validDate||
      full<=0||minus<=0||totalNum<=0||full<minus){
      global.Toast.error('输入错误！');
      return;
    }
    this.props.dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:false}
    });
    this.setState({
      minus: undefined, 
      full: undefined, 
      totalNum: undefined,
      validDate: undefined
    });
    confirmCallback( minus, full, totalNum, validDate);
  };
  handleChange=(fieldName, evt)=>{
    this.setState({[fieldName]: evt.target.value.trim()});
  }
  render(){
    const {open} = this.props;
    const {minus, full, totalNum, validDate} = this.state;
    console.log('CouponSetDialog rendered');
    return(
      <Dialog
        open={open}
        onClose={this.handleCancel}
        classes={{paper: global.classes.dialogWidth}}
      >
        <DialogTitle>创建新代金券：</DialogTitle>
        <DialogContent>
          <TextField id='minus' value={minus||''} fullWidth
            label="代金券金额" onChange={this.handleChange.bind(undefined, 'minus')}
            style={{marginTop: '1rem'}}
            InputProps={{
              endAdornment: <InputAdornment position="end">元</InputAdornment>,
            }}
          />
          <TextField id='full'  value={full||''} fullWidth
            label="使用条件" placeholder="满多少元才能使用该代金券" onChange={this.handleChange.bind(undefined, 'full')}
            style={{marginTop: '1rem'}}
            InputProps={{
              endAdornment: <InputAdornment position="end">元</InputAdornment>,
            }}
          />
          <TextField id='totalNum'  value={totalNum||''} fullWidth
            label="发放张数" onChange={this.handleChange.bind(undefined, 'totalNum')}
            style={{marginTop: '1rem'}}
            InputProps={{
              endAdornment: <InputAdornment position="end">张</InputAdornment>,
            }}
          />
          <DatePicker
            id='validDate'
            floatingLabelText="有效期截止日期"
            minDate={new global.ServerDate()}
            disableYearSelection={true}
            DateTimeFormat={DateTimeFormat}
            okLabel="确定"
            cancelLabel="取消"
            locale="zh"
            firstDayOfWeek={0}
            style={{width: '100%', }}
            textFieldStyle={{width: '100%'}}
            onChange={(evt, date)=>{
              date.setHours(23, 59, 59, 0);
              this.setState({validDate: date});
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel}>取消</Button>,
          {minus&&full&&totalNum&&validDate&&
            <Button color="primary" variant="contained" onClick={this.handleConfirm}>确定</Button>
          }
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps=({editCouponModel})=>{
  let open = editCouponModel.open?true:false;
  let confirmCallback;
  if(open) {
    confirmCallback = editCouponModel.confirmCallback;
  }
  return {open, confirmCallback};
};

const mapDispatchToProps = (dispatch)=>{
  return {dispatch};
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponSetDialog);
