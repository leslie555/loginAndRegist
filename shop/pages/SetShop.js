import React from 'react'
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AutoComplete from '../../AutoComplete';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import AddressDialog from '../components/AddressDialog'
import { routerRedux } from 'dva/router';

import Typography from '@material-ui/core/Typography';


class SetShop extends React.Component{
  UNSAFE_componentWillMount(){
    if(global.realm === 'shop'&&!this.props.oldShopData.name) global.Toast.info('您需要先完善店铺信息，才能进行其它操作');
  }
  componentWillUnmount(){
    this.props.dispatch({type:'editShopModel/replace',payload:{}});
  }
  render(){
    let {editShopModel, modifiedShopData, newShopData, brands, editAddressDialogOpen, oldShopData, dispatch} = this.props;
    let {name, address, gcjLng, gcjLat, floor, extraInf,brandName, shopType, customerPhone, responsiblePersonInf, cashiers} = newShopData;
    let {nameErr, addressErr, brandNameErr, shopTypeErr, responsiblePersonMobileErr, responsiblePersonEmailErr} = editShopModel;
    let shopTypes = [
      '女装',
      '男装',
      '女装 男装',
      '童装/童鞋',
      '中老年服装',
      '运动/户外',
      '女鞋',
      '男鞋',
      '女鞋 男鞋',
      '内衣/居家',
      '裤子',
      '皮草',
      '母婴',
      '饰品',
      '箱包',
      '其它',
    ];
    return(
      <Paper >
        <div style={{
          margin:'0 auto',
          padding:'2rem 0.7rem',
          width:'24rem',
          maxWidth:'100%',
        }}
        >
          <TextField
            label="店铺名称"
            placeholder="必填、公开"
            required
            fullWidth
            helperText={nameErr}
            error={Boolean(nameErr)}
            value={name||''}
            onChange={(evt)=>{this.handleChange('name', evt.target.value.trim())}}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="地址"
            placeholder="必填、公开"
            required
            fullWidth
            helperText={addressErr}
            error={Boolean(addressErr)}
            value={address?
              (address.city+address.district
              +(address.detailedAddress?address.detailedAddress:'')
              +'('+gcjLng+','+gcjLat+')'
              +(floor?'  楼层:'+floor:'')
              )
              :
              ''}
            onClick={this.handleAddress}
            onFocus={(e)=>{e.target.blur(); }}
            multiline
            style={{marginBottom: '1.5rem'}}
            rowsMax="3"
          />
          {global.realm!=='producer'&&
            <AutoComplete
              label="主营品牌"
              placeholder="请输入商品的品牌名称"
              required
              fullWidth
              value={brandName||''}
              dataSource={brands}
              dataSourceConfig={{key: 'chineseName'}}
              helperText={brandNameErr}
              error={Boolean(brandNameErr)}
              onChange={(newValue)=>{this.handleChange('brandName',newValue)}}
            />
          }
          <FormControl required error={Boolean(shopTypeErr)}
            fullWidth
            style={{marginTop: '2rem'}}
          >
            <InputLabel htmlFor="age-simple">主营商品</InputLabel>
            <Select
              value={shopType||''}
              onChange={(evt)=>this.handleChange('shopType', evt.target.value)}
              name="age"
              inputProps={{
                name: 'age',
                id: 'age-simple',
              }}
            >
              {shopTypes.map((val)=>{
                return (<MenuItem value={val} key={val}>{val}</MenuItem>);
              })}
              {/*<MenuItem value='其它'>其它</MenuItem>*/}
            </Select>
            <FormHelperText>{shopTypeErr}</FormHelperText>
          </FormControl>
          <TextField
            label="客服电话"
            placeholder="选填、公开"
            fullWidth
            value={customerPhone?customerPhone:''}
            onChange={(evt)=>this.handleChange('customerPhone', evt.target.value.trim())}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="负责人姓名"
            placeholder="选填、不公开"
            fullWidth
            value={responsiblePersonInf.name||''}
            onChange={(evt)=>this.handleResponsiblePersonChange('name', evt.target.value.trim())}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="负责人手机号"
            placeholder="选填、不公开"
            fullWidth
            helperText={responsiblePersonMobileErr}
            error={Boolean(responsiblePersonMobileErr)}
            value={responsiblePersonInf.mobile||''}
            onChange={(evt)=>this.handleResponsiblePersonChange('mobile', evt.target.value.trim())}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="负责人邮箱"
            placeholder="选填、不公开"
            fullWidth
            helperText={responsiblePersonEmailErr}
            error={Boolean(responsiblePersonEmailErr)}
            value={responsiblePersonInf.email||''}
            onChange={(evt)=>this.handleResponsiblePersonChange('email', evt.target.value.trim())}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="收银员姓名"
            placeholder="选填、不公开，用于系统记账，多个收银员以空格隔开"
            fullWidth
            value={cashiers?cashiers.join(' '):''}
            onChange={this.handleCashiersChange}
            onBlur={this.handleCashiersInputBlur}
            style={{marginBottom: '1.5rem'}}
          />
          <TextField
            label="备注信息"
            placeholder="选填"
            fullWidth
            value={extraInf||''}
            onChange={(evt)=>this.handleChange('extraInf', evt.target.value.trim())}
            style={{marginBottom: '1.5rem'}}
          />
          {Object.keys(modifiedShopData).length!=0&&
            <div style={{marginTop:'1rem', display:'flex', justifyContent:'flex-end'}}>
              <Button color="primary" style={{marginRight:'1rem'}} onClick={this.handleCancel}>取消修改</Button>
              <Button color="primary" variant="contained" onClick={this.handleConfirm}>保存修改</Button>
            </div>
          }
        </div>
        {global.realm!=='producer'&&oldShopData&&oldShopData.brandName&&!oldShopData.brandId&&
          <Typography variant="h6" 
            style={{
              color:'orange',    
              maxWidth: '50rem',
              margin: '0 auto',
              padding: '2rem 0.5rem',
            }}
          >
            {`您店铺所经营的品牌"${oldShopData.brandName}"尚未被收录，我们将在48小时内收录该品牌的相关信息，请耐心等待。我们可能会与您联系核实具体的品牌信息，请保持电话畅通。`}
          </Typography>
        }
        {editAddressDialogOpen&&<AddressDialog/>}
      </Paper>
    );
  }
  handleChange=(propertyName, newValue)=>{
    let modifiedShopData = this.props.modifiedShopData;
    this.props.dispatch({type:'editShopModel/updateState',
      payload:{
        [propertyName+'Err']:undefined,
        modifiedShopData:{...modifiedShopData, [propertyName]: newValue}
      }
    });
  }
  handleResponsiblePersonChange=(propertyName, newValue)=>{
    let {modifiedShopData, oldShopData} = this.props;
    if(!modifiedShopData.responsiblePersonInf) modifiedShopData.responsiblePersonInf = oldShopData.responsiblePersonInf;
    const newModifiedShopData = {...modifiedShopData, responsiblePersonInf:{...modifiedShopData.responsiblePersonInf, [propertyName]:newValue}}
    this.props.dispatch({type:'editShopModel/updateState',
      payload:{
        ['responsiblePerson'+propertyName.slice(0,1).toUpperCase()+propertyName.slice(1)+'Err']:undefined,
        modifiedShopData:newModifiedShopData
      }
    });
  }
  handleAddress=()=>{
    this.props.dispatch({type:'editAddressModel/updateState',
      payload:{open:true, address:this.props.newShopData.address,
        gcjLng:this.props.newShopData.gcjLng,
        gcjLat:this.props.newShopData.gcjLat,
        amapBuildingId:this.props.newShopData.amapBuildingId,
        floor:this.props.newShopData.floor,
      }
    });
  };
  handleCashiersChange=(evt)=>{
    let newModifiedShopData = {...this.props.modifiedShopData};
    newModifiedShopData.cashiers = evt.target.value.replace(/\s+/g,' ').split(' ');
    this.props.dispatch({type:'editShopModel/updateState',payload:{modifiedShopData: newModifiedShopData}});
  };
  handleCashiersInputBlur=()=>{
    const {modifiedShopData} = this.props;
    if(!modifiedShopData.cashiers) return;
    
    const newCashiers = global.dereplication(modifiedShopData.cashiers);
    if(newCashiers===modifiedShopData.cashiers) return;

    let newModifiedShopData = {...this.props.modifiedShopData};
    newModifiedShopData.cashiers = newCashiers;
    this.props.dispatch({type:'editShopModel/updateState',payload:{modifiedShopData: newModifiedShopData}});
  }
  handleCancel=()=>{
    this.props.dispatch({type:'editShopModel/replace',payload:{}});
  }
  handleConfirm=()=>{
    if(global.realm==='shop'&&!this.props.shopAuth.writeShop) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    let {editShopModel, oldShopData, modifiedShopData, newShopData, brands, producerId, shopArr, dispatch} = this.props;
    let {name, address, brandName, shopType, responsiblePersonInf, } = newShopData;
    let {nameErr, addressErr, brandNameErr, shopTypeErr, 
      responsiblePersonMobileErr, responsiblePersonEmailErr} = editShopModel;
    if(!name) nameErr='该项为必填项';
    if(!address) addressErr = '该项为必填项';
    if(global.realm!=='producer'&&!brandName) brandNameErr = '该项为必填项';
    if(!shopType) shopTypeErr = '该项为必填项';
    if(responsiblePersonInf.mobile&&!new RegExp(global.mobileRegExpStr).test(responsiblePersonInf.mobile)) responsiblePersonMobileErr = '手机号格式错误';
    if(responsiblePersonInf.email&&!new RegExp(global.emailRegExpStr).test(responsiblePersonInf.email)) responsiblePersonEmailErr = 'email格式错误';

    if(nameErr||addressErr||brandNameErr||shopTypeErr||responsiblePersonMobileErr||responsiblePersonEmailErr) {
      dispatch({
        type:'editShopModel/updateState',
        payload:{nameErr,addressErr,brandNameErr,shopTypeErr
          ,responsiblePersonMobileErr, responsiblePersonEmailErr}
      });
      return;
    }

    if(global.realm==='producer'){
      if(global.editingShopIndex==='createShop'){
        global.myFetch({
          url:`${global.serverBaseUrl}/producers/${producerId}/shops`,
          method: 'POST',
          data: [modifiedShopData],
        })
          .then(function(result){
            const newShopArr = [...shopArr];
            newShopArr.unshift(result[0]);
            dispatch({type:'shopsModel/updateState', payload:{shopArr: newShopArr, page:0}});
            dispatch(routerRedux.goBack());
          })
          .catch(function(err){
            console.error(err);
          })
      }
      else{
        global.myFetch({
          url:`${global.serverBaseUrl}/producers/${producerId}/shops/${oldShopData.id}`,
          method: 'PUT',
          data: modifiedShopData,
        })
          .then(function(){
            dispatch({type:'shopModel/replace', payload: newShopData});
            dispatch({type:'editShopModel/updateState',payload:{modifiedShopData: undefined}});
          })
          .catch(function(err){
            console.error(err);
          })
      }

      return;
    }

    let k;
    if(modifiedShopData.brandName){
      for(k in brands){
        if(brands[k].chineseName == modifiedShopData.brandName){
          modifiedShopData.brandId = brands[k].id;
          newShopData.brandId = brands[k].id;
          break;
        }
        if(k==brands.length-1) {
          modifiedShopData.brandId = null;
          newShopData.brandId = null;
        }
      }
    }

    const fun1=()=>{
      global.myFetch({
        url:global.serverBaseUrl+'/MyUsers/me/shop',
        method: 'PUT', 
        data: modifiedShopData,
      })
        .then((json)=>{
          if(json.id){
            dispatch({type:'shopModel/replace', payload: newShopData});
            dispatch({type:'editShopModel/updateState',payload:{modifiedShopData: undefined}});
            if(!oldShopData.name) {
              dispatch(routerRedux.push('/consoleOfShop/inShopCommoditiesManage'))
            }
            global.Toast.success('修改成功');
          }
          else throw(json);
        }).catch((ex)=>{
          console.log(ex)
        })
    }

    if(k==brands.length-1){
      modifiedShopData.brandId = null;
      global.MyDialog.confirm({
        message:'您店铺主营的品牌尚未被系统收录。在输入主营品牌时，下拉提示框中的品牌是已经被系统收录的品牌，请尽量从其中选择。点击“取消”按钮返回重新输入，点击“确定”按钮忽略本提示并向系统提交信息。',
        actions:[
          {text:'取消'},
          {text:'确认', cb:fun1}
        ],
      });
    }
    else{
      fun1();
    }
  }
}
const mapStateToProps=({ brandModel: {brandsArray: brands}, shopModel, editAddressModel, editShopModel, producerModel, shopsModel})=>{
  const editAddressDialogOpen = editAddressModel.open;
  const oldShopData = shopModel || {};
  if(!oldShopData.responsiblePersonInf) oldShopData.responsiblePersonInf={};
  const modifiedShopData = editShopModel.modifiedShopData||{};
  const newShopData = {...oldShopData, ...modifiedShopData};
  return {editAddressDialogOpen, editShopModel, oldShopData, modifiedShopData, 
    newShopData, brands, shopArr:shopsModel&&shopsModel.shopArr, 
    producerId:producerModel&&producerModel.id, shopAuth:shopModel.shopAuth||{},
  };
}

const mapDispatchToProps = (dispatch)=>{
  return {dispatch};
}
const styles = theme => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SetShop));