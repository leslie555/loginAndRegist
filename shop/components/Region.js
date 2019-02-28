import React from 'react';
import Sortable from 'sortablejs';
import Button from '@material-ui/core/Button';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import CommodityIcon from './CommodityIcon'
// import {getNewOrder} from './TwoLevelSortable'
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

class Region extends React.Component{
  sortableGroupDecorator = (instance) => {
    const {width, shopAuth} = this.props;
    if (instance&&width!=='xs') {
      let options = {
        // draggable: ".image", // Specifies which items inside the element should be sortable
        group: 'shared',
        //商品由一个region移动到另一个region时触发该函数
        onAdd: (evt)=>{
          evt.from.appendChild(evt.item);//还原sortablejs插件所做的view的改变
          this.props.dispatch({
            type:'commodityOrderModel/changeCommodityOrder',
            fromRegionName:evt.from.getAttribute('data-regin-name'),
            toRegionName:evt.to.getAttribute('data-regin-name'),
            oldIndex:evt.oldIndex,
            newIndex:evt.newIndex
          });
        },
        //商品在一个region内部移动时触发该函数
        onUpdate:  (evt) => {
          let regionName = evt.from.getAttribute('data-regin-name');
          this.props.dispatch({
            type:'commodityOrderModel/changeCommodityOrder',
            fromRegionName:regionName,
            toRegionName:regionName,
            oldIndex:evt.oldIndex,
            newIndex:evt.newIndex
          });
        },
        onMove:function (evt, originalEvent) {
          if(global.realm==='shop'&&!shopAuth.sortInShopCommodity) {
            global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
            return false;
          }
        }
      };
      Sortable.create(instance, options);
    }
  };
  deleteRegion = ()=>{
    const {region: {regionName, commodities}, shopAuth} = this.props;
    if(global.realm==='shop'&&!shopAuth.sortInShopCommodity) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    if(commodities instanceof Array && commodities.length > 0)
      global.Toast.error('只能删除空的分类');
    else
      global.MyDialog.confirm({
        message:'确认要删除该分类吗？',
        actions: [
          {text: '取消'},
          {text: '删除', cb: ()=>{
            global.dispatch({
              type:'commodityOrderModel/deleteRegion',
              regionName:regionName
            });
          }}
        ],
      });
  }
  // shouldComponentUpdate(nextProps,nextState){
  //   if(JSON.stringify(this.props.region) == JSON.stringify(nextProps.region))
  //     return false;
  //   else return true;
  // }
  handleAddCommodity = ()=>{
    const {shopAuth} = this.props;
    if(global.realm==='shop'&&!shopAuth.writeInShopCommodity) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    this.props.dispatch({
      type:'addInShopCommodityModel/updateState',
      payload:{
        open:true,
        toAddRegion:this.props.region.regionName
      }
    });
  }
  render(){
    console.log('region rendered ',this.props.region.regionName);
    const {width, region, commodityOrder, classes, shopAuth, dispatch} = this.props;
    const {regionName, regionExtrInf} = region;
    // console.log(region);
    if(!region) return null;
    return (
      <Paper style={{marginTop: '2rem'}}>
        <div className="region-move-handle" style={{display:'flex', justifyContent: 'space-between', cursor: 'move'}}>
          <Paper className={classes.titlePanel}>
            <Typography variant="h5" className={classes.editable}
              onClick={()=>{
                dispatch({
                  type:'inputDialogModel/updateState',
                  payload:{
                    open:true,
                    title:'分类的名称',
                    initText:regionName,
                    onOk:(newVal)=>{
                      if(global.realm==='shop'&&!shopAuth.sortInShopCommodity) {
                        global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                        return false;
                      }
                      dispatch({
                        type: 'commodityOrderModel/changeRegionName', 
                        payload: {oldRegionName: regionName, newRegionName:newVal}
                      });
                    },
                    onCancel:()=>{},
                    validateFn:(newVal)=>{
                      let errorText;
                      if(commodityOrder) {
                        for(let item of commodityOrder){
                          if(item.regionName !== regionName && item.regionName === newVal){
                            errorText = '该分类名称已存在';
                            break;
                          }
                        }
                      }
                      return errorText;
                    }
                  }
                });
              }}
            >{regionName}</Typography>
            <Typography variant="subtitle2" className={classes.editable}
              onClick={()=>{
                dispatch({
                  type:'inputDialogModel/updateState',
                  payload:{
                    open:true,
                    title:'促销信息',
                    initText:regionExtrInf,
                    onOk:(newVal)=>{
                      if(global.realm==='shop'&&!shopAuth.writeSalesInf) {
                        global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                        return false;
                      }
                      dispatch({
                        type: 'commodityOrderModel/changeRegionExtrInf', 
                        payload: {oldRegionExtrInf:regionExtrInf, newRegionExtrInf:newVal, regionName}
                      });
                    },
                    onCancel:()=>{},
                    validateFn:()=>{}
                  }
                });
              }}
            >{regionExtrInf||'未设置促销信息'}</Typography>
          </Paper>
          <div>
            <Button color="primary" style={{'float':'right'}}
              onClick={this.deleteRegion}
            ><Delete style={{marginRight: '0.3rem'}}/>{width!=='xs'&&'删除分类'}</Button>
            <Button color="primary"
              style={{'float':'right'}} onClick={this.handleAddCommodity}
            ><AddBox style={{marginRight: '0.3rem'}} />{width!=='xs'&&'添加商品'}</Button>
          </div>
        </div>
        <div  style={{minHeight:100, clear: 'both'}} ref={this.sortableGroupDecorator} data-regin-name={regionName}>
          {region.commodities&&region.commodities.map(
            (commodityId)=>{
              return (
                <CommodityIcon
                  commodityId = {commodityId}
                  key={commodityId}
                />
              );
            }
          )}
        </div>
      </Paper>
    )
  }
}
const mapStateToProps=({commodityOrderModel: commodityOrder, shopModel}, ownProps)=>{
  for(let k in commodityOrder){
    if(commodityOrder[k].regionName == ownProps.regionName)
      return {region:commodityOrder[k], commodityOrder, shopAuth:shopModel.shopAuth||{}};
  }
  return {commodityOrder, shopAuth:shopModel.shopAuth||{}}
}
const styles=(theme)=>{
  const mainColor = theme.palette.primary.main;
  const svgStr = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${mainColor}" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`);
  
  return ({
    titlePanel: {
      display:'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      position: 'relative',
      padding: '0.4rem 1rem',
      backgroundColor: theme.palette.secondary.light,
      left: '1.2rem',
      bottom: '1.2rem',
      width: '11rem',
      height: '5rem'
    },
    editable: {
      color: 'white',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.main,
        '&:after': {
          content: `url('data:image/svg+xml;%20charset=utf8,${svgStr}')`,
          position: 'relative',
          top: '4px',
          left: '6px',
        }
      },
    },
  })
}
export default connect(mapStateToProps)(withWidth()(withStyles(styles)(Region)));
