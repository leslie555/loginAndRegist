import React from 'react';
import {connect} from 'react-redux'
import areIntlLocalesSupported from 'intl-locales-supported';
import Table from '@material-ui/core/Table';
import DatePicker from 'material-ui/DatePicker';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

let DateTimeFormat;
if (areIntlLocalesSupported(['zh-CN'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/zh');
}

class UsedCouponTable extends React.Component{
  state={
    startDate:new global.ServerDate(),
    endDate:new global.ServerDate(),
    targetCashier:'全部',
    sortType:'usedDateDesc',
    cashiers: this.props.cashiers,

  }
  componentDidMount(){
    const {cashiers, gettedCouponArr} = this.props;
    const tmp = {};
    for(let item of cashiers){
      tmp[item] = 1;
    }
    for(let item of gettedCouponArr){
      if(item.cashier) tmp[item.cashier] = 1;
    }
    this.setState({cashiers: Object.keys(tmp)});
  }
  render(){
    const {gettedCouponArr, theme, width} = this.props;
    if(!gettedCouponArr) return null;
    const {startDate, endDate, targetCashier, cashiers, sortType} = this.state;
    const filteredCouponArr = this.filter();
    const mainColor = theme.palette.primary.main;
    return (
      <React.Fragment>
        <div style={{display:'flex', alignItems:'center'}}>
          <Typography variant="h6" style={{marginTop: '1rem'}}>筛选：</Typography>
          <DatePicker
            id='startDatePicker'
            floatingLabelText="开始日期："
            value={startDate}
            maxDate={endDate}
            disableYearSelection={true}
            DateTimeFormat={DateTimeFormat}
            okLabel="确定"
            cancelLabel="取消"
            locale="zh"
            firstDayOfWeek={0}
            onChange={(evt, date)=>{
              this.setState({ startDate:date});
              setTimeout(this.calculate, 0);
            }}
            style={{width: '7rem', marginLeft:'1rem'}}
            textFieldStyle={{width: '7rem'}}
          />
          <DatePicker
            id='endDatePicker'
            floatingLabelText="截止日期："
            value={endDate}
            minDate={startDate}
            maxDate={new global.ServerDate()}
            disableYearSelection={true}
            DateTimeFormat={DateTimeFormat}
            okLabel="确定"
            cancelLabel="取消"
            locale="zh"
            firstDayOfWeek={0}
            onChange={(evt, date)=>{
              this.setState({ endDate:date});
              setTimeout(this.calculate, 0);
            }}
            style={{width: '7rem', marginLeft:'1rem'}}
            textFieldStyle={{width: '7rem'}}
          />
          
          <FormControl
            style={{width: '7rem', marginLeft:'1rem', marginTop:'9px'}}
          >
            <InputLabel>收银员</InputLabel>
            <Select
              value={targetCashier||''}
              onChange={(evt) => {
                this.setState({targetCashier: evt.target.value});
              }}
            >
              {
                ['全部'].concat(cashiers).map((value)=>{
                  return <MenuItem value={value} key={value}>{value}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </div>
        <Typography variant="body2">注：点击表头的“金额”和“使用时间”还可以切换排序方式</Typography>
        <Table >
          <TableHead
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableCell style={{padding:'0px',color: mainColor}}>收银员</TableCell>
              <TableCell style={{padding:'0px',color: mainColor, cursor:'pointer'}}
                onClick={()=>{
                  if(sortType&&sortType!=='minusDesc') this.setState({sortType: 'minusDesc'});
                  else this.setState({sortType: 'minusAsc'});
                }}
              >
                <div style={{display:'flex', alignItems:'center'}}>
                  金额
                  {sortType==='minusDesc'&&<ArrowDropDownIcon/>}
                  {sortType==='minusAsc'&&<ArrowDropUpIcon/>}
                </div>
              </TableCell>
              <TableCell style={{padding:'0px',color: mainColor}}>使用条件</TableCell>
              <TableCell style={{padding:'0px',color: mainColor}}>类型</TableCell>
              {width!=='xs'&&<TableCell style={{padding:'0px',color: mainColor}}>领取日期</TableCell>}
              <TableCell style={{padding:'0px',color: mainColor, cursor:'pointer'}}
                onClick={()=>{
                  if(sortType&&sortType!=='usedDateDesc') this.setState({sortType: 'usedDateDesc'});
                  else this.setState({sortType: 'usedDateAsc'});
                }}
              >
                <div style={{display:'flex', alignItems:'center'}}>
                  使用日期
                  {sortType==='usedDateDesc'&&<ArrowDropDownIcon/>}
                  {sortType==='usedDateAsc'&&<ArrowDropUpIcon/>}
                </div>
              </TableCell>
              <TableCell style={{padding:'0px',color: mainColor}}>备注</TableCell>
            </TableRow>
          </TableHead>
          <TableBody displayRowCheckbox={false}>
            {filteredCouponArr.map((item, index)=>{
              return(
                <TableRow key={index}>
                  <TableCell style={{padding:'0px'}}>{item.cashier?item.cashier:'-'}</TableCell>
                  <TableCell style={{padding:'0px'}}>{item.minus}元</TableCell>
                  <TableCell style={{padding:'0px'}}>满{item.full}元</TableCell>
                  <TableCell style={{padding:'0px'}}>{item.type==0?'添加关注赠送':(item.type==1?'自由领取':'新客专享')}</TableCell>
                  {width!=='xs'&&<TableCell style={{padding:'0px'}}>{new Date(item.gettedDate).toLocaleString()}</TableCell>}
                  <TableCell style={{padding:'0px'}}>{new Date(item.usedDate).toLocaleString()}</TableCell>
                  <TableCell style={{padding:'0px'}}>{item.extrInf}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredCouponArr.length===0&&
          <div style={{display:'flex', justifyContent:'center', marginTop:'1.5rem'}}><Typography variant="h5">无</Typography></div>
        }
      </React.Fragment>
    )
  }

  filter=()=>{
    const {startDate, endDate, targetCashier, sortType } = this.state;
    const {gettedCouponArr} = this.props;
    let filteredCouponArr = gettedCouponArr;
    if(startDate||endDate){
      const startDateLoc = startDate||new Date(0);
      const endDateLoc = endDate||new Date('3000-12-30');
      startDateLoc.setHours(0, 0, 0, 0);
      endDateLoc.setHours(23, 59, 59, 999);
      filteredCouponArr=filteredCouponArr.filter(function(item){
        const usedDate = new Date(item.usedDate);
        if((usedDate.getTime()>startDateLoc.getTime())&&
          (usedDate.getTime()<endDateLoc.getTime())){
          return true;
        }
        return false;
      });
    }
    let targetCashierLoc = targetCashier;
    if(targetCashierLoc==='全部') targetCashierLoc=undefined;
    if(targetCashierLoc){
      filteredCouponArr=filteredCouponArr.filter(function(item){
        if(item.cashier===targetCashierLoc){
          return true;
        }
        return false;
      });
    }
    if(!sortType||sortType==='usedDateDesc'){
      filteredCouponArr.sort(
        function(a,b){
          return new Date(b.usedDate)-new Date(a.usedDate);
        }
      )
    }
    else if(sortType==='usedDateAsc'){
      filteredCouponArr.sort(
        function(a,b){
          return new Date(a.usedDate)-new Date(b.usedDate);
        }
      )
    }
    else if(sortType==='minusDesc'){
      filteredCouponArr.sort(
        function(a,b){
          return new Date(b.minus)-new Date(a.minus);
        }
      )
    }
    else if(sortType==='minusAsc'){
      filteredCouponArr.sort(
        function(a,b){
          return new Date(a.minus)-new Date(b.minus);
        }
      )
    }
    return filteredCouponArr;
  }
}
const mapStateToProps = ({
  gettedCouponModel:{gettedCouponArr},
  shopModel: {cashiers},
})=>{
  return {
    gettedCouponArr,
    cashiers: cashiers||[]
  };
}
const styles=()=>({
});
export default connect(mapStateToProps)(withWidth()(withStyles(styles, {withTheme: true })(UsedCouponTable)));


