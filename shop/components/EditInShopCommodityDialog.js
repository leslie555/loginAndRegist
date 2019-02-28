import React from 'react';
import {connect} from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import CommodityInfPanel  from './CommodityInfPanel';


class EditCommodityDialog extends React.Component{
  state={
  }
  render() {
    console.log('EditCommodityDialog rendered!');

    const {
      open,
      modifiedFlag, 
      inShopCommodityNew, 
      width, dispatch, classes,
    } = this.props;
    if(!open) return null;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        maxWidth="lg"
        fullScreen={width==='xs'}
      >
        <DialogTitle id="alert-dialog-title" style={{display: 'flex',alignItems: 'center', justifyContent: 'space-between'}}
          disableTypography
        >
          {width==='xs'&&
            <Button color="primary" size="large" style={{justifyContent: 'flex-start',padding: 0, minWidth: 0,}} onClick={this.handleClose}><ChevronLeft/>退出</Button>
          }
          <Typography variant="h6">编辑商品信息</Typography>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </DialogTitle>
        <DialogContent>
          <div >
            <p><span style={{fontWeight: 'bold'}}>inShopCommdityId：</span><span>{inShopCommodityNew.id}</span></p>
            <CommodityInfPanel commodity={inShopCommodityNew.commodity}/>
            <div className={classes.inputDiv}>
              <span style={{fontWeight: 'bold'}}>标价：</span>
              <input size='4' defaultValue={inShopCommodityNew.signPrice}
                onChange={this.handleNumberPropertyChange('signPrice')}/>
            </div>
            <div className={classes.inputDiv}>
              <span style={{fontWeight: 'bold'}}>促销价：</span>
              <input size='4' defaultValue={inShopCommodityNew.priceInShop}
                onChange={this.handleNumberPropertyChange('priceInShop')}
              />
            </div>
            <div className={classes.inputDiv}>
              <span style={{fontWeight: 'bold'}}>数量：</span>
              <div style={{flexDirection: 'row'}}>
                <span className={classes.tableCell}></span>
                {inShopCommodityNew.commodity.sizes.map((size)=><span key={size} className={classes.tableCell}>{size}</span>)}
              </div>
              {inShopCommodityNew.commodity.colors.map((colorObj)=>
                <div key={colorObj.color} style={{flexDirection: 'row'}}>
                  <span className={classes.tableCell}>{colorObj.color}</span>
                  {inShopCommodityNew.commodity.sizes.map((size)=>{
                    return (
                      <span key={size} className={classes.tableCell}>
                        {
                          inShopCommodityNew.quantities&&
                          inShopCommodityNew.quantities[colorObj.color]&&
                          inShopCommodityNew.quantities[colorObj.color][size]&&
                          inShopCommodityNew.quantities[colorObj.color][size].quantity||''
                        }
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            退出
          </Button>
          <Button  color="primary" autoFocus variant="contained"
            disabled={!modifiedFlag}
            onClick={()=>{
              if(global.realm==='shop'&&!this.props.shopAuth.writeInShopCommodity) {
                global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                return;
              }
              dispatch({
                type:'editInShopCommodityModel/ConfirmModifyInShopCommodity'
              });
            }}
          >
            提交修改
          </Button>
        </DialogActions>
      </Dialog>
    );
  }


  handleClose = ()=>{
    this.props.dispatch({
      type:'editInShopCommodityModel/replace',
      payload:{}
    });
  };
  //用于修改字符串属性
  handleStringPropertyChange = (propertyName)=>(evt)=>{
    let inShopCommodityNew = this.props.inShopCommodityNew;
    inShopCommodityNew[propertyName] = evt.target.value.trim();
    this.props.dispatch({
      type:'editInShopCommodityModel/updateState',
      payload:{inShopCommodityNew,modifiedFlag:true}
    });
  };
  //用于修改浮点型的属性
  handleNumberPropertyChange = (propertyName)=>(evt)=>{
    let inShopCommodityNew = this.props.inShopCommodityNew;
    inShopCommodityNew[propertyName] = parseInt(evt.target.value);
    this.props.dispatch({
      type:'editInShopCommodityModel/updateState',
      payload:{inShopCommodityNew,modifiedFlag:true}
    });
  };

  handleImgClick = (url, evt)=>{
    global.dispatch({type:'appModel/updateState',payload:{hugeImgUrl: url}});
    evt.nativeEvent.stopImmediatePropagation();
    evt.preventDefault();
    evt.stopPropagation();
  }
}

const mapStateToProps=({ 
  editInShopCommodityModel, 
  editInShopCommodityModel: {
    open,
    modifiedFlag,
    inShopCommodityId,
  }, 
  inShopCommoditiesModel: inShopCommodities,
  shopModel
})=>{
  let inShopCommodityNew;
  if(open){
    inShopCommodityNew = editInShopCommodityModel.inShopCommodityNew;
    //store中可能不包含inShopCommodityNew而只有inShopCommodityId，因此需要获取
    // inShopCommodityNew,注意这里必须使用深复制
    if(typeof inShopCommodityNew == 'undefined' && typeof inShopCommodityId != 'undefined'){
      let inShopCommodity;
      for(let k in inShopCommodities){
        if(inShopCommodities[k].id == inShopCommodityId){
          inShopCommodity = inShopCommodities[k];
          break;
        }
      }
      inShopCommodityNew = global.deepClone(inShopCommodity);
      inShopCommodityNew.commodity = inShopCommodity.commodity;
      //下面这行代码必须要有，否则在inShopCommodityNew为undefined的情况下，
      // 每次store改变本组件都会重新渲染，因为每次都deepClone出了新的对象
      editInShopCommodityModel.inShopCommodityNew = inShopCommodityNew;
    }
  }
  return {
    open,
    modifiedFlag, 
    inShopCommodityNew, 
    shopAuth: shopModel.shopAuth||{}
  };
};

const styles=(theme)=>({
  inputDiv: {
    marginBottom: 16,
  },

  theImg: {
    width: '100%', 
    minHeight: '3rem',
    maxHeight: '15rem',
    cursor: 'pointer',
    boxShadow: '0 0 5px #999',
    [theme.breakpoints.up('sm')]: {
      width:'112px',
    },
  },

  tableCell:{
    display:'inline-block',
    width: 65,
    textAlign: 'center',
  }
});

export default connect(mapStateToProps)(withWidth()(withStyles(styles)(EditCommodityDialog)));

