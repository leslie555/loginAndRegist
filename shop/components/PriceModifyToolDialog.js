import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import {storeDataToModels} from '../models/appModel';


class PriceModifyToolDialog extends React.Component{
  handleClose = ()=>{this.props.dispatch({
    type:'editPriceModel/updateState',
    payload:{open:false, targetRegions: undefined, rate: undefined}
  })};
  render(){
    const {commodityOrder, shopId,open,targetRegions, rate, classes, dispatch} = this.props;
    if(!(commodityOrder instanceof Array)) return null;
    let {targetRegionsError, rateError,} = this.props;
    console.log('PriceModifyToolDialog rendered!');
    
    return (
      <div >
        <Dialog
          open={open||false}
          onClose={this.handleClose}
          // disableBackdropClick
          classes={{paper: global.classes.dialogWidth}}
        >
          <DialogTitle>促销价快速生成工具：</DialogTitle>
          <DialogContent>
            
            <p>该工具的作用是根据商品的标价，乘以一定的比例得到促销价格。</p>
            <FormControl fullWidth error={Boolean(targetRegionsError)}>
              <InputLabel htmlFor="select-multiple-chip">选择需要设置促销价的分类</InputLabel>
              <Select
                multiple
                value={targetRegions}
                onChange={(event)=>{
                  let values = event.target.value;
                  //当选择‘所有商品’选项时，其它选项将自动被去除
                  if(!targetRegions.includes('所有商品')&&values.includes('所有商品'))
                    values = ['所有商品'];
                  if(targetRegions.length==1&&targetRegions[0]=='所有商品'&&values.length==2) {
                    if(values[0]=='所有商品') values = [values[1]];
                    else values = [values[0]];
                  }
                  dispatch({
                    type:'editPriceModel/updateState',
                    payload:{targetRegions:values, targetRegionsError:undefined}
                  });
                }}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="所有商品"
                >
                  <Checkbox checked={targetRegions.indexOf('所有商品') > -1} />
                  <ListItemText primary={'所有商品'} />
                </MenuItem>
                {commodityOrder.map(region => (
                  <MenuItem
                    key={region.regionName}
                    value={region.regionName}
                  >
                    <Checkbox checked={targetRegions.indexOf(region.regionName) > -1} />
                    <ListItemText primary={region.regionName} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{targetRegionsError}</FormHelperText>
            </FormControl>
            <br/>
            <TextField
              label="乘以多大的比率"
              value={rate||''}
              helperText={rateError}
              error={Boolean(rateError)}
              fullWidth
              onChange={(evt)=>{
                let rate = Number(evt.target.value);
                if(isNaN(rate)||rate>100||rate<0){
                  dispatch({
                    type:'editPriceModel/updateState',
                    payload:{rate, rateError:'请输入大于0小于100的数值'}
                  });
                }
                else {
                  dispatch({
                    type:'editPriceModel/updateState',
                    payload:{rate, rateError:undefined}
                  });
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.handleClose}
              key={1}
            >取消</Button>,
            <Button
              color="primary"
              onClick={()=>{
                if(!targetRegions||targetRegions.length==0){
                  targetRegionsError='请选择'
                }
                if(!rate||rate==''){
                  rateError='请输入'
                }
                if(targetRegionsError || rateError){
                  dispatch({
                    type:'editPriceModel/updateState',
                    payload:{targetRegionsError,rateError}
                  });
                  return;
                }
                else{
                  this.changePrices(targetRegions, rate*0.01);
                  this.handleClose();
                }
              }}
              key={2}
            >确定</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  changePrices = (targetRegions, rate)=>{
    const {commodityOrder, shopId, producerId, dispatch} = this.props;
    let commodityIds = [];
    if(targetRegions.length==1&&targetRegions[0]=='所有商品'){
      for(let k of commodityOrder){
        commodityIds = commodityIds.concat(k.commodities);
      }
    }
    else{
      for(let k of commodityOrder){
        if(targetRegions.includes(k.regionName)){
          commodityIds = commodityIds.concat(k.commodities);
        }
      }
    }
    // console.log(commodityIds);
    global.myFetch(
      {
        url: global.serverBaseUrl+
        (global.realm==='shop'?`/Shops/${shopId}`:`/producers/${producerId}`)
        +'/resetPrices',
        method: 'POST',
        data: {commodityIds:commodityIds,rate:rate, shopId},
      }
    )
      .then((json)=>{
        if(!json||!(json instanceof Array)){
          global.Toast.error('操作过程中出现错误');
        }
        else if(json.length!=commodityIds.length){
          global.Toast.warning('有'+(commodityIds.length-json.length)
            +'个商品未修改成功，请手工修改');
        }
        if(global.realm==='shop') dispatch({type:'appModel/queryWithAdditions'});
        else {
          global.myFetch({
            url: `${global.serverBaseUrl}/producers/${producerId}/shops`,
            data:{filter:{where:{id:global.enteringShopId}, include: {inShopCommodities: 'commodity'}}}
          })
            .then((result)=>{
              storeDataToModels(result[0]);
              global.Toast.success('操作成功！')
            })
        }
      })
      .catch((ex)=>{
        global.Toast.error('操作过程中出现错误');
        if(global.realm==='shop') dispatch({type:'appModel/queryWithAdditions'});
        else {
          global.myFetch({
            url: `${global.serverBaseUrl}/producers/${producerId}/shops`,
            data:{filter:{where:{id:global.enteringShopId}, include: {inShopCommodities: 'commodity'}}}
          })
            .then((result)=>{
              storeDataToModels(result[0]);
            })
        }
        console.error(ex);
      })
  }
}


const styles = theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const mapStateToProps = ({
  commodityOrderModel: commodityOrder, shopModel, producerModel,
  editPriceModel: {open, targetRegions, rate, targetRegionsError, rateError},
})=>{
  return {
    commodityOrder,
    shopId: shopModel.id,
    producerId:producerModel&&producerModel.id,
    open, targetRegions: targetRegions||[], rate, targetRegionsError, rateError
  }
};
const mapDispatchToProps = (dispatch)=>({
  dispatch
});
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles, { withTheme: true })(PriceModifyToolDialog));


