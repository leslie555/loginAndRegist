import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddBoxSharp';
import Exposure from '@material-ui/icons/ExposureSharp';
import TwoLevelSortable from '../components/TwoLevelSortable'
import EditCommodityDialog from '../components/EditInShopCommodityDialog'
import AddInShopCommodityDialog from '../components/AddInShopCommodityDialog'
import PriceModifyToolDialog from '../components/PriceModifyToolDialog'
import TwoLevelSortableUseSmallIcon from '../components/TwoLevelSortableUseSmallIcon'
import {connect} from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

class InShopCommoditiesManage extends React.Component{
  state={
    useSmallIcon: undefined
  }
  // UNSAFE_componentWillMount(){
  //   const {inShopCommodities, producerId, shopId, dispatch} = this.props;
  //   if(global.realm==='producer'){
  //     if(!inShopCommodities||!(inShopCommodities instanceof Array)){
  //       global.myFetch({
  //         url: `${global.serverBaseUrl}/producers/${producerId}/shops`,
  //         data:{filter:{where:{id:shopId}, include: {inShopCommodities: 'commodity'}}}
  //       })
  //         .then((result)=>{
  //           dispatch({type:'inShopCommoditiesModel/replace', payload:result[0].inShopCommodities})
  //         })
  //     }
  //   }
  // }
  handleNewRegionDialogOpen = () => {
    const {commodityOrder, shopAuth, dispatch} = this.props;
    if(global.realm==='shop'&&!shopAuth.sortInShopCommodity) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    dispatch({
      type:'inputDialogModel/updateState',
      payload:{
        open:true,
        title:'分类的名称',
        initText:'',
        onOk:(newVal)=>{
          dispatch({type:'commodityOrderModel/newRegion', payload: {regionName:newVal}});
        },
        onCancel:()=>{},
        validateFn:(newVal)=>{
          let errorText;
          if(commodityOrder&&commodityOrder instanceof Array) {
            for(let item of commodityOrder){
              if(item.regionName === newVal){
                errorText = '该分类名称已存在';
                break;
              }
            }
          }
          return errorText;
        }
      }
    });
  };
  render(){
    console.log('commoditymanage rendered');
    const {commodityNumAbove30, classes, width, shopAuth, dispatch} = this.props
    const {useSmallIcon} = this.state;
    return(
      <div>
        <div className={classes.topDiv}>
          <Button color="secondary" variant="contained" size="small"
            className={classes.rightTopBtn}
            onClick={this.handleNewRegionDialogOpen}
          ><AddIcon />&nbsp;&nbsp;增加新分类</Button>
          <Button color="primary" variant="contained" size="small"
            className={classes.rightTopBtn}
            onClick={()=>{
              if(global.realm==='shop'&&!shopAuth.writeInShopCommodity) {
                global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                return;
              }
              dispatch({
                type:'editPriceModel/updateState',
                payload:{open:true}
              })
            }}
          ><Exposure />&nbsp;&nbsp;价格工具</Button>
        </div>
        {(width==='xs'||commodityNumAbove30)&&
          <div className={classes.topDiv}>
            <Button color="primary" size="small"
              className={classes.rightTopBtn} style={{marginTop: '0.5rem'}}
              onClick={()=>{this.setState({useSmallIcon: !useSmallIcon})}}
            >
              {useSmallIcon?'退出小图标模式':'进入小图标模式'}
            </Button>
          </div>
        }
        {useSmallIcon?
          <TwoLevelSortableUseSmallIcon/>
          :
          <TwoLevelSortable/>
        }
        <AddInShopCommodityDialog/>
        <EditCommodityDialog/>
        <PriceModifyToolDialog/>

      </div>
    )
  }
}

const mapStateToProps = ({inShopCommoditiesModel: inShopCommodities, shopModel, commodityOrderModel, producerModel})=>{
  return {
    shopId: shopModel.id,
    salesInf: shopModel.salesInf,
    shopAuth: shopModel.shopAuth||{},
    inShopCommodities,
    commodityOrder: commodityOrderModel,
    commodityNumAbove30: inShopCommodities&&inShopCommodities instanceof Array
      &&(inShopCommodities.length>10),
    producerId:producerModel&&producerModel.id,
  };
}
const styles = {
  topDiv: {
    display:'flex',
    justifyContent: 'flex-end',
  },
  rightTopBtn: {
    // width: '8rem',
    marginLeft: '1rem',
    // padding: 0
  }
}
export default connect(mapStateToProps)(withStyles(styles)(withWidth()(InShopCommoditiesManage)));
