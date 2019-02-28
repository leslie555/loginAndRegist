import React from 'react';
import {connect} from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import areIntlLocalesSupported from 'intl-locales-supported';
import PanelInSalesSet from './PanelInSalesSet';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import salesPic from '../imgs/sales.png';


let DateTimeFormat;
if (areIntlLocalesSupported(['zh-CN'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/zh');
}

class CurrentSales extends React.Component{
  constructor(props){
    super(props);
    const {salesInf, salesEndDate} = this.props;
    this.state={
      showForm: undefined,
      salesText: salesInf&&salesInf.salesText,
      salesEndDate,
    };
  }
  render(){
    const {dispatch, salesInf: oldSalesInf, salesEndDate:oldSalesEndDate, classes} = this.props;
    const oldSalesText = oldSalesInf&&oldSalesInf.salesText;
    const {showForm, salesText, salesEndDate } = this.state;
    return (
      <PanelInSalesSet title="当前促销" picSrc={salesPic}>
        {showForm&&
          <React.Fragment>
            <TextField
              label="促销语"
              placeholder="如：全场八折、买一送一"
              value={salesText||''}
              fullWidth
              onChange={(evt)=>{
                let tmp = evt.target.value.trim();
                if(tmp&&tmp.length>15) {
                  tmp = tmp.slice(0, 15);
                }
                this.setState({salesText: tmp });
              }}
            />
            <DatePicker
              id='endDatePicker'
              floatingLabelText="促销结束日期"
              value={salesEndDate&&new Date(salesEndDate)}
              minDate={new global.ServerDate()}
              disableYearSelection={true}
              DateTimeFormat={DateTimeFormat}
              okLabel="确定"
              cancelLabel="取消"
              locale="zh"
              firstDayOfWeek={0}
              style={{width: '100%', marginTop: '1rem'}}
              textFieldStyle={{width: '100%'}}
              onChange={(evt, date)=>{
                date.setHours(23, 59, 59, 0);
                this.setState({salesEndDate: date});
              }}
            />
            
            <div style={{
              display: 'flex', 
              width: '100%', justifyContent: 'flex-end'
            }}>
              <Button 
                variant="outlined" 
                className={classes.btn}
                onClick={()=>{this.setState({showForm:false, salesText: oldSalesText, salesEndDate:oldSalesEndDate});}}
              >取消
              </Button>

              {(salesText&&salesEndDate&&(salesText!==oldSalesText||salesEndDate!==oldSalesEndDate))&&
                <Button color="primary" variant="contained"
                  className={classes.btn}
                  style={{ marginLeft: '1rem'}}
                  onClick={()=>{
                    if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                      return;
                    }
                    dispatch({
                      type: 'shopModel/updateStateWithServer',
                      payload:{
                        salesInf:{salesText},
                        salesEndDate,
                      }
                    });
                    this.setState({showForm: false})
                  }}
                >确定
                </Button>
              }
            </div>
          </React.Fragment>
        }


        {!showForm&&oldSalesText&&oldSalesEndDate&&new Date(oldSalesEndDate).getTime()>global.ServerDate.now()&&
          <div style={{color:'green'}}>
            <Typography variant="h5" style={{marginTop:'0.5rem'}}>当前正在进行的促销活动</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem', color: 'green'}}>促销语为：{oldSalesText}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem', color: 'green'}}>截止日期为：{new Date(oldSalesEndDate).toLocaleDateString()}</Typography>
            <Button variant="outlined"
              className={classes.btn}
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                global.MyDialog.confirm({
                  message:'确认要撤销促销预告吗？',
                  actions: [
                    {text: '不撤销'},
                    {
                      text: '撤销',
                      cb: ()=>{
                        this.setState({salesText: undefined, salesEndDate:undefined});
                        dispatch({
                          type: 'shopModel/updateStateWithServer',
                          payload:{
                            salesInf:null,
                            salesEndDate: null,
                            // homePageAdver: false,
                          }
                        });
                      }
                    }
                  ],
                });
              }}
            >撤销
            </Button>
            <Button 
              className={classes.btn}
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm: true})
              }} 
              color="primary" 
              variant="outlined"
            >修改</Button>

            {/*<Checkbox
                          checkedIcon={<Star />}
                          icon={<StarBorder />}
                          style={{top:'8px'}}
                          label="进行首页推广"
                          checked={homePageAdver?true:false}
                          onChange={(event)=>{
                            dispatch({
                              type: 'shopModel/updateStateWithServer',
                              payload:{
                                homePageAdver:event.target.checked,
                              }
                            });
                          }}
                        />*/}
          </div>
        }
        {!showForm&&(!oldSalesText||!oldSalesEndDate)&&
          <div>
            <div style={{color:'green', alignSelf: 'start'}}>
              本店当前没有进行促销活动！
            </div>
            <Button 
              className={classes.btn}
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm: true})
              }} 
              color="primary" variant="contained"
            >立即设置</Button>
          </div>
        }
        {!showForm&&oldSalesText&&oldSalesEndDate&&new Date(oldSalesEndDate).getTime()<global.ServerDate.now()&&
          <div>
            <Typography variant="h6" style={{marginTop:'0.5rem'}}>促销语为：{oldSalesText}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem'}}>截止日期为：{new Date(oldSalesEndDate).toLocaleDateString()}</Typography>
            <p style={{color:'red'}}>促销活动已过期！</p>
            <Button 
              className={classes.btn}
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm: true})
              }} 
              color="primary" variant="outlined"
            >重新设置</Button>
          </div>
        }
      </PanelInSalesSet>
    );
  }
}
const styles={
  btn: {
    paddingLeft:'3rem',
    paddingRight:'3rem',
    marginTop:'1.5rem',
    marginLeft:'1rem',
  }
}
export default connect(function({
  shopModel,
}){
  return {
    salesInf: shopModel.salesInf,
    salesEndDate: shopModel.salesEndDate,
    shopAuth: shopModel.shopAuth||{},
    // homePageAdver,
  };
})(withStyles(styles)(CurrentSales));

export {DateTimeFormat};