import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';

import Typography from '@material-ui/core/Typography';

class UseCoupon extends React.Component{
  state={
    code: '', 
    selectedCashier: this.props.cashiers.length==1?this.props.cashiers[0]:null, 
    extrInf: '', 
    codeErr: undefined, 
    selectedCashierErr: undefined, 
    messageEle: null,
    targetGettedCoupon: undefined,
    hideCodeInput:false,
  }
  UNSAFE_componentWillMount(){
    const {gettedCouponMap, shopId, dispatch} = this.props;
    if(!gettedCouponMap || !(gettedCouponMap instanceof Array)){
      dispatch({type:'gettedCouponModel/query', shopId: shopId});
    }
  }
  render(){
    let {code, codeErr, messageEle, targetGettedCoupon,hideCodeInput, selectedCashierErr, selectedCashier, extrInf} = this.state;
    const {cashiers} = this.props;
    let menuItems = cashiers.map((value)=>{
      return <MenuItem value={value} key={value}>{value}</MenuItem>
    });

    return(
      <Paper style={{minHeight:'220px'}}>
        <div style={{margin:'0 auto',
          padding:'0 0.7rem',
          width:'24rem',
          maxWidth:'100%',
        }}>
          {!hideCodeInput&&!targetGettedCoupon&&
            <React.Fragment>
              <TextField id='code' value={code} fullWidth
                label="代金券码"
                helperText={codeErr}
                error={Boolean(codeErr)}
                style={{marginTop:'3rem'}}
                onChange={(evt)=>{
                  this.setState({code:evt.target.value.trim().toLowerCase(), codeErr:undefined})
                }}/>

              <div style={{display:'flex', justifyContent:'center'}}>
                <Button color="primary" variant="contained"
                  onClick={this.handleVerify}
                  style={{marginTop:'4rem',marginBottom:'1rem', paddingLeft: '3rem', paddingRight:'3rem'}}
                >
                  验证
                </Button>
              </div>
            </React.Fragment>
          }
          {targetGettedCoupon&&
            <React.Fragment>
              <p style={{color: 'green', paddingTop:'2rem'}}>
                金额：{targetGettedCoupon.minus}元<br/>
                使用条件：实付满{targetGettedCoupon.full}元<br/>
                使用码：{code}<br/>
                领取日期：{new Date(targetGettedCoupon.gettedDate).toLocaleDateString()}<br/>
                有效截止日期：{new Date(targetGettedCoupon.validDate).toLocaleDateString()}<br/>
                类型：{targetGettedCoupon.type==0?'添加关注赠送':(targetGettedCoupon.type==1?'自由领取':'粉丝专享')}
              </p>
              <FormControl
                fullWidth
                error={Boolean(selectedCashierErr)}
                style={{marginTop:'1rem'}}
              >
                <InputLabel htmlFor="age-required">收银员</InputLabel>
                <Select
                  value={selectedCashier||''}
                  onChange={(evt) => {
                    this.setState({selectedCashier: evt.target.value, selectedCashierErr: undefined});
                  }}
                  name="age"
                  inputProps={{
                    id: 'age-required',
                  }}
                >
                  {menuItems}
                </Select>
                <FormHelperText>{selectedCashierErr}</FormHelperText>
              </FormControl>
  
              <TextField id='extrInf' value={extrInf} fullWidth
                label="备注信息"
                style={{marginTop:'1rem'}}
                onChange={(evt)=>{
                  this.setState({extrInf:evt.target.value})
                }}
              />
              <div style={{marginTop:'2rem'}}>
                <Button color="primary" variant="contained" style={{paddingLeft:'3rem', paddingRight:'3rem', marginRight:'2rem'}}
                  onClick={()=>{
                    if(cashiers.length>1&&selectedCashier==null){
                      this.setState({selectedCashierErr:'请选择收银员'})
                      return;
                    }
  
  
                    if(typeof extrInf != 'string' || extrInf==''){
                      global.MyDialog.confirm({
                        message:'您没有输入备注信息，确认要继续吗？',
                        actions:[
                          {
                            text:'取消'
                          },
                          {
                            text:'继续',
                            color:'primary',
                            cb:this.changeServerData.bind(undefined,targetGettedCoupon)
                          }
                        ]
                      })
                      return;
                    }
                    this.changeServerData(targetGettedCoupon)
                  }}
                >确认使用</Button>
                <Button 
                  color="primary"
                  onClick={this.clear}
                >取消</Button>
              </div>
            </React.Fragment>
          }
          {messageEle}
        </div>
        <p 
          style={{margin:'2rem auto', maxWidth:'60rem', padding:'1rem 0.7rem'}}
        >说明：顾客使用代金券时，店员须将代金券码在这里输入，以验证代金券的真伪和有效性。本系统还会对代金券的使用进行统计，方便店铺对账。备注信息为选填，可以填入订单号之类的信息，方便事后追溯。收银员姓名在“店铺信息”中设置。顾客一次购物仅限使用一张代金券。代金券可以同店铺的其它优惠促销活动同时享受，店铺不得以任何理由拒绝顾客使用代金券。</p>
      </Paper>
    );
  }
  handleVerify = ()=>{
    const {code} = this.state;
    let errExist;
    if(!code){
      this.setState({codeErr:'请输入代金券码！'})
      errExist=true;
    }
    else if(code.length<4||!code.match(/^[0-9a-zA-Z]+$/)){
      this.setState({codeErr:'代金券码输入错误！请检查。'})
      errExist=true;
    }
    if(errExist) return;
    this.verifyFn(false)();
  }

  verifyFn = (refreshedFlag)=>()=>{//refreshedFlag用以标志是否运行过downloadCouponsInf

    let {code, selectedCashier, } = this.state;
    let {gettedCouponMap, shopId,  dispatch} = this.props;

    let gettedCouponId = global.disturb(global.convertTo10(code));
    let targetGettedCoupon = gettedCouponMap[gettedCouponId];
    if(!targetGettedCoupon&&!refreshedFlag){//如果store中没有找到，则刷新gettedCouponModel，!refreshedFlag保证这段代码不会无限重复运行
      dispatch({
        type:'gettedCouponModel/query', shopId, 
        callback:this.verifyFn(true)
      });
      return;
    }
    if(!targetGettedCoupon){
      this.setState({messageEle: <p style={{color:'red'}}>该代金券不存在！</p>});
      return;
    }
    if(targetGettedCoupon.usedDate){
      this.setState({
        messageEle:
        <React.Fragment>
          <p style={{color:'red'}}>该代金券于
            {new Date(targetGettedCoupon.usedDate).toLocaleString()}
            已经使用。{targetGettedCoupon.cashier?('收银员为'+targetGettedCoupon.cashier):''}
          </p>
          <p>
            金额：{targetGettedCoupon.minus}元<br/>
            使用条件：实付满{targetGettedCoupon.full}元<br/>
            使用码：{code}<br/>
            领取日期：{new Date(targetGettedCoupon.gettedDate).toLocaleDateString()}<br/>
            有效截止日期：{new Date(targetGettedCoupon.validDate).toLocaleDateString()}<br/>
            类型：{targetGettedCoupon.type==0?'添加关注赠送':(targetGettedCoupon.type==1?'自由领取':'粉丝专享')}<br/>
            收银员：{targetGettedCoupon.cashier}<br/>
            使用时间：{new Date(targetGettedCoupon.usedDate).toLocaleString()}<br/>
          </p>
        </React.Fragment>
      });
      return;
    }
    if(new Date(targetGettedCoupon.validDate).getTime()<global.ServerDate.now()){
      this.setState({ messageEle:<p style={{color:'red'}}>该代金券已过期！</p>});
      return;
    }
    this.setState({
      targetGettedCoupon,
      messageEle:null
    });
  }

  changeServerData=()=>{
    let {code, selectedCashier, extrInf,targetGettedCoupon} = this.state;
    let { shopId, } = this.props;

    global.myFetch({
      url:`https://host${targetGettedCoupon.id%global.hostCnt+1}.yiyimap.com/api/Shops/${shopId}/gettedCoupons/${targetGettedCoupon.id}`,
      method: 'PUT', 
      data: {usedDate: new global.ServerDate(), cashier: selectedCashier, extrInf:extrInf},
    })
      .then((json)=>{
        if(!json){
          this.setState({messageEle:
            <p style={{color:'red'}}>使用代金券失败！</p>}
          );
          return;
        }
        for(let k in json){
          targetGettedCoupon[k] = json[k];
        }
        this.setState({
          targetGettedCoupon: undefined,
          hideCodeInput:true,
          messageEle:
          <React.Fragment>
            <p>
              金额：{targetGettedCoupon.minus}元<br/>
              使用条件：实付满{targetGettedCoupon.full}元<br/>
              使用码：{code}<br/>
              领取日期：{new Date(targetGettedCoupon.gettedDate).toLocaleDateString()}<br/>
              有效截止日期：{new Date(targetGettedCoupon.validDate).toLocaleDateString()}<br/>
              类型：{targetGettedCoupon.type==0?'添加关注赠送':(targetGettedCoupon.type==1?'自由领取':'粉丝专享')}<br/>
              收银员：{targetGettedCoupon.cashier}<br/>
              使用时间：{new Date(targetGettedCoupon.usedDate).toLocaleString()}<br/>
            </p>
            <Typography variant="h5" style={{color:'green', marginTop:'1rem'}}>代金券使用成功!</Typography>
            <Button 
              color="primary" variant="contained" 
              style={{marginTop:'2rem', paddingLeft:'3rem', paddingRight:'3rem'}}
              onClick={this.clear}
            >
              返回
            </Button>
          </React.Fragment>
        });
      })
  }
  clear = ()=>{
    const {cashiers} = this.props;
    this.setState({
      code: '', 
      selectedCashier: cashiers.length==1?cashiers[0]:null, 
      extrInf: '', 
      messageEle: null,
      codeErr: undefined, 
      selectedCashierErr: undefined, 
      targetGettedCoupon: null,
      hideCodeInput:false,
    });
  }
}

const styles = {};
const mapStateToProps = ({
  gettedCouponModel: {gettedCouponMap}, 
  shopModel
})=>{
  let cashiers = shopModel.cashiers||[];
  return {
    cashiers, 
    shopId:shopModel.id, gettedCouponMap,
  };
}
export default connect(mapStateToProps)(withStyles(styles)(UseCoupon));
