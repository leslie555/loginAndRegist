import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {connect} from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
// import MyImage from '../../MyImage';


class CommodityIcon extends React.Component{
  state={}
  // shouldComponentUpdate(nextProps){
  //   const { commodityId, hide, signPrice, priceInShop, inShopCommodity } = this.props;
  //   if(
  //     commodityId === nextProps.commodityId &&
  //     hide === nextProps.hide &&
  //     signPrice === nextProps.signPrice &&
  //     priceInShop === nextProps.priceInShop &&
  //     (inShopCommodity === nextProps.inShopCommodity ||
  //     JSON.stringify(inShopCommodity) === JSON.stringify(nextProps.inShopCommodity))
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
  handleToolBarOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleToolBarClose = () => {
    this.setState({ anchorEl: null });
  };
  render(){
    const {width, inShopCommodity, hide, shopAuth, classes} = this.props;
    //props.commodityId可能后于props.inShopCommodities更新，在删除商品的情况下，inShopCommodity可能为undefined
    if(!inShopCommodity) return null;
    // inShopCommodity.smallImgs = inShopCommodity.smallImgs || [...inShopCommodity.smallImgsDefault];
    // inShopCommodity.bigImgs = inShopCommodity.bigImgs || [...inShopCommodity.bigImgsDefault];
    let imgWidth = '7rem';
    let spacing = '0.3rem';
    //下面代码的目的是为了一行放3张图片
    if(width==='xs') {
      imgWidth = Math.floor(document.body.clientWidth*0.32);
      spacing = Math.floor((document.body.clientWidth-imgWidth*3)/6);
    }
    const signPriceToShow = !inShopCommodity.priceInShop||inShopCommodity.signPrice==inShopCommodity.priceInShop?'':inShopCommodity.signPrice;
    // console.log('commodity rendered')
    const imgUrl = (global.getIconColors(inShopCommodity)[0]||inShopCommodity.commodity.colors[0]).iconImg;
    const quantities = inShopCommodity.quantities;
    const numsInColor = {};
    for(let color in quantities){
      let item = quantities[color];
      numsInColor[color] = 0;
      for(let size in item){
        let item2 = item[size];
        numsInColor[color] = numsInColor[color]+(item2.quantity||0);
      }
    }
    const tmp =[];
    for(let key in numsInColor){
      tmp.push({color: key==='默认颜色'?'数量':key, num: numsInColor[key]})
    }
    let quantityElement = tmp.map(function(item, index){return (
      <div key={index}>
        <span className={classes.priceSpan}>{`${item.color}:${item.num}件`}</span>
      </div>
    );}) 
    if(quantityElement.length===0) {
      quantityElement = [
        <div key="1">
          <span className={classes.priceSpan}>数量:0件</span>
        </div>
      ];
    }


    return (
      <Paper data-commodityid={this.props.commodityId} style={{display:'inline-block', marginTop:0, marginBottom: '1rem', marginLeft: spacing, marginRight: spacing, opacity: hide?'0.2':undefined }}>
        <div
          style={{
            width: imgWidth,
            height: imgWidth,
            // backgroundImage: `url(${global.scaleImg(global.getUrlOnBos(imgUrl),'small')})`,
            // backgroundSize: '100% 100%',
            display:'flex',
            position:'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            cursor: 'move',
          }}
        >
          {/*<MyImage
            src={imgUrl}
            scaleFlag="small"
            style={{
              width: imgWidth,
              height: imgWidth,
              position:'absolute',
            }}
          />*/}
          <img
            src={
              global.getUrlOnBos({
                fileName:imgUrl,
                producerId: inShopCommodity.producerId, 
                commodityId:inShopCommodity.commodityId,
              })+'@w_112'
            }
            style={{
              width: imgWidth,
              height: imgWidth,
              position:'absolute',
            }}
          />
          <div style={{zIndex:1}}>
            {hide&&<VisibilityOffIcon style={{color: 'red'}}/>}
            <IconButton
              aria-owns={this.state.anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleToolBarOpen}
              className={classes.moreIconBtn}
              classes={{label: classes.moreIcon}}
            >
              <MoreHorizIcon/>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleToolBarClose}
            >
              <MenuItem  onClick={this.showEditCommodityDialog}>
                <EditIcon/>
                &nbsp;&nbsp;编辑
              </MenuItem>
              <MenuItem  onClick={()=>{
                if(global.realm==='shop'&&!shopAuth.writeInShopCommodity) {
                  global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
                  return;
                }
                this.handleToolBarClose();
                this.props.dispatch({
                  type:'inShopCommoditiesModel/toggleCommodityHide',
                  inShopCommodity:inShopCommodity
                });
              }}>
                {hide?<VisibilityIcon/>:<VisibilityOffIcon/>}
                &nbsp;&nbsp;{hide?'显示':'隐藏'}
              </MenuItem>
              <MenuItem  onClick={this.showDeleteConfirmDialog}>
                <DeleteIcon/>
                &nbsp;&nbsp;删除
              </MenuItem>
            </Menu>
          </div>
          <div style={{width: '100%', zIndex:1}}>
            {quantityElement}
            <div style={{width: '100%', display:'flex', justifyContent:'space-between', minHeight:'1rem'}}>
              {signPriceToShow?
                <span className={classes.priceSpan} style={{textDecoration:'line-through'}}>
                  {signPriceToShow}
                </span>
                :
                <span/>
              }
              <span className={classes.priceSpan}>
                {inShopCommodity.priceInShop||inShopCommodity.signPrice}
              </span>
            </div>
          </div>
        </div>
        <p className={classes.nameText} style={{width: imgWidth}}>{inShopCommodity.commodity.name}</p>
      </Paper>
    )
  }

  showDeleteConfirmDialog = () => {
    if(global.realm==='shop'&&!this.props.shopAuth.writeInShopCommodity) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    let inShopCommodityId = this.props.inShopCommodity.id;
    let commodityId = this.props.commodityId;
    this.handleToolBarClose();
    global.MyDialog.confirm({
      message:'确认要删除该商品吗？',
      actions: [
        {text: '取消'},
        {
          text: '删除',
          cb: ()=>{
            this.props.dispatch({
              type:'inShopCommoditiesModel/deleteInShopCommodity',
              commodityId,
              inShopCommodityId:inShopCommodityId
            });
          }
        }
      ],
    });
  };

  showEditCommodityDialog = ()=>{
    let inShopCommodityId = this.props.inShopCommodity.id;
    this.handleToolBarClose();
    this.props.dispatch({
      type:'editInShopCommodityModel/updateState',
      payload:{open:true,inShopCommodityId}
    });
  }
}

const mapStateToProps=({inShopCommoditiesModel: inShopCommodities, appModel: {screenWidth}, shopModel}, ownProps)=>{
  let commodityId = ownProps.commodityId;
  let inShopCommodity;
  //commodityId可能后于inShopCommodities更新，在删除商品的情况下，inShopCommodity可能为undefined
  for(let k in inShopCommodities){
    if(inShopCommodities[k].commodityId == commodityId){
      inShopCommodity = inShopCommodities[k];
      break;
    }
  }
  //虽然hide是inShopCommodity的属性，但必须单独写出来，否则hide变化时组件不会重新渲染
  return {inShopCommodity,
    hide: inShopCommodity&&inShopCommodity.hide,
    // signPrice:inShopCommodity&&inShopCommodity.signPrice,
    // priceInShop:inShopCommodity&&inShopCommodity.priceInShop,
    screenWidth,
    shopAuth: shopModel.shopAuth||{},
  };
};
const mapDispatchToProps = (dispatch)=>{
  return {dispatch};
};

const styles = {
  moreIconBtn: {
    margin: '-0.8rem -0.8rem 0 0'
  },
  moreIcon: {
    backgroundColor: '#0006',
    height: '1.3rem',
    color: '#fff'
  },
  priceSpan: {
    color: '#fff',
    backgroundColor: '#0006',
    padding: '0 0.3rem',
    fontSize: '12px',
  },
  nameText: {
    fontSize: '13px',
    height: '2.3rem',
    wordWrap: 'break-word',
    margin: 0,
    overflowY: 'hidden'
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(withStyles(styles)(CommodityIcon)));

