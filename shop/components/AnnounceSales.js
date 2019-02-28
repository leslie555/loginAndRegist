import React from 'react';
import {connect} from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {DateTimeFormat} from './CurrentSales';
import Typography from '@material-ui/core/Typography';
import PanelInSalesSet from './PanelInSalesSet';
import { withStyles } from '@material-ui/core/styles';
import speakerPic from '../imgs/speaker.png';

class CurrentSales extends React.Component{
  constructor(props){
    super(props);
    const {announceSalesInf: oldAnnounceSalesInf} = this.props;
    this.state={
      showForm: undefined,
      salesText: oldAnnounceSalesInf&&oldAnnounceSalesInf.salesText,
      salesStartDate: oldAnnounceSalesInf&&oldAnnounceSalesInf.salesStartDate,
      salesEndDate: oldAnnounceSalesInf&&oldAnnounceSalesInf.salesEndDate,
    };
  }
  render(){
    const {dispatch, salesInf, announceSalesInf: oldAnnounceSalesInf, classes} = this.props;
    const oldSalesText = oldAnnounceSalesInf&&oldAnnounceSalesInf.salesText;
    const oldSalesStartDate = oldAnnounceSalesInf&&oldAnnounceSalesInf.salesStartDate;
    const oldSalesEndDate = oldAnnounceSalesInf&&oldAnnounceSalesInf.salesEndDate;
    const {showForm, salesText, salesStartDate, salesEndDate } = this.state;
    return (
      <PanelInSalesSet title="促销预告" picSrc={speakerPic}>
        {showForm&&
          <React.Fragment>
            <TextField
              label="促销语"
              placeholder="如：全场八折、买一送一"
              value={salesText?salesText:''}
              fullWidth
              onChange={(e)=>{
                let tmp = e.target.value.trim();
                if(tmp&&tmp.length>15) {
                  tmp = salesText.slice(0, 15);
                }
                this.setState({salesText: tmp });
              }}
            />
            <div style={{height:'2px'}}/> {/*chrome的bug，没有这行，后面的DatePicker不会显示横线*/}
            <DatePicker
              id='startDatePicker'
              floatingLabelText="促销开始日期"
              value={salesStartDate&&new Date(salesStartDate)}
              minDate={new Date(global.ServerDate.now()+1000*60*60*24)}
              disableYearSelection={true}
              DateTimeFormat={DateTimeFormat}
              okLabel="确定"
              cancelLabel="取消"
              locale="zh"
              firstDayOfWeek={0}
              style={{width: '100%', marginTop: '1rem'}}
              textFieldStyle={{width: '100%'}}
              onChange={(evt, date)=>{
                date.setHours(0, 0, 0, 0);
                if(salesEndDate&&new Date(date).getTime()>new Date(salesEndDate).getTime()){
                  this.setState({salesStartDate: date, salesEndDate: date});
                } else {
                  this.setState({salesStartDate: date});
                }
              }}
            />
            <div style={{height:'2px'}}/> {/*chrome的bug，没有这行，后面的DatePicker不会显示横线*/}
            <DatePicker
              id='endDatePicker'
              floatingLabelText="促销结束日期"
              value={salesEndDate&&new Date(salesEndDate)}
              minDate={new Date(salesStartDate)}
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
              width: '100%', justifyContent: 'flex-end', marginTop: '1rem'
            }}>
              <Button
                className={classes.btn} variant="outlined"
                onClick={()=>{this.setState({
                  showForm:false,
                  salesText: oldSalesText,
                  salesStartDate:oldSalesStartDate,
                  salesEndDate:oldSalesEndDate
                });}}
              >取消
              </Button>
              {(salesText&&salesStartDate&&salesEndDate&&(salesText!==oldSalesText||salesStartDate!==oldSalesStartDate||salesEndDate!==oldSalesEndDate))&&
                <Button color="primary" variant="contained"
                  className={classes.btn}
                  onClick={()=>{
                    if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                      return;
                    }
                    dispatch({
                      type: 'shopModel/updateStateWithServer',
                      payload:{
                        announceSalesInf:{salesText, salesStartDate, salesEndDate},
                      }
                    });
                    this.setState({showForm:false})
                  }}
                >确定
                </Button>
              }
            </div>
          </React.Fragment>
        }
        

        {!showForm&&oldSalesText&&oldSalesStartDate&&new Date(oldSalesStartDate).getTime()>global.ServerDate.now()&&
          <div style={{color:'green', alignSelf: 'start'}}>
            <Typography variant="h5" style={{marginTop:'0.5rem'}}>当前发布的促销预告</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem', color: 'green'}}>促销语为：{oldSalesText}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem', color: 'green'}}>开始日期为：{new Date(oldSalesStartDate).toLocaleDateString()}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem', color: 'green'}}>结束日期为：{new Date(oldSalesEndDate).toLocaleDateString()}</Typography>
            {salesInf&&salesInf.salesText&&new Date(salesInf.salesEndDate).getTime()>global.ServerDate.now()&&
              <Typography variant="h6" style={{marginTop:'0.5rem', color:'orange'}}>当前存在促销活动的情况下，促销预告不会向顾客展示</Typography>
            }
            <Button
              className={classes.btn}
              variant="outlined"
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
                        this.setState({salesText: undefined, salesStartDate:undefined, salesEndDate:undefined});
                        dispatch({
                          type: 'shopModel/updateStateWithServer',
                          payload:{
                            announceSalesInf:null,
                          }
                        });
                      }
                    }
                  ],
                });
              }}
            >撤销
            </Button><Button
              color="primary"
              className={classes.btn}
              variant="outlined"
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm:true})
              }}
            >修改
            </Button>
          </div>
        }
        {!showForm&&(!oldSalesText||!oldSalesStartDate||!oldSalesEndDate)&&
          <React.Fragment>
            <Typography style={{color:'green', alignSelf: 'start'}}>
              本店没有预告促销活动！
            </Typography>
            <Button 
              className={classes.btn}
              variant="contained"
              color="primary"
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm:true})
              }}
            >立即发布</Button>
          </React.Fragment>
        }
        {!showForm&&oldSalesText&&oldSalesStartDate&&new Date(oldSalesStartDate).getTime()<global.ServerDate.now()&&
          <React.Fragment>
            <Typography variant="h6" style={{marginTop:'0.5rem'}}>促销语为：{oldSalesText}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem'}}>开始日期为：{new Date(oldSalesStartDate).toLocaleDateString()}</Typography>
            <Typography variant="h6" style={{marginTop:'0.5rem'}}>结束日期为：{new Date(oldSalesEndDate).toLocaleDateString()}</Typography>
            <Typography variant="h6" color="error" style={{marginTop:'0.5rem'}}>
              促销预告的开始日期已过！
            </Typography>
            <Button 
              className={classes.btn}
              onClick={()=>{
                if(global.realm==='shop'&&!this.props.shopAuth.writeSalesInf) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.setState({showForm:true})
              }}
              variant="contained"
              color="primary"
            >发布新的预告</Button>
          </React.Fragment>
        }
      </PanelInSalesSet>
    );
  }
}
const mapStateToProps = ({
  shopModel,
})=>{
  return {
    salesInf: shopModel.salesInf, 
    announceSalesInf: shopModel.announceSalesInf,
    shopAuth: shopModel.shopAuth||{},
  };
};
const styles={
  btn: {
    paddingLeft:'3rem',
    paddingRight:'3rem',
    marginTop:'1.5rem',
    marginLeft:'1rem',
  }
}
export default connect(mapStateToProps)(withStyles(styles)(CurrentSales));
