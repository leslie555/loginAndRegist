import React from 'react';
import {connect} from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import AddInShopCommodityUsingSearch from './AddInShopCommodityUsingSearch';
// import AddInShopCommodityUsingUrl from './AddInShopCommodityUsingUrl';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

class AddInShopCommodityDialog extends React.Component{
  // state = {
  //   value: 0,
  // };

  // handleChange = (event, value) => {
  //   this.setState({ value });
  // };
  handleClose = ()=>{this.props.dispatch({
    type:'addInShopCommodityModel/updateState',
    payload:{open:false}
  })};
  render(){
    console.log('AddInShopCommodityDialog rendered');
    // const {value} = this.state;
    const {isLargeDialog, width} = this.props;
    return (
      <Dialog
        open={this.props.open||false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={isLargeDialog? 'lg': 'sm'}
        fullScreen={width==='xs'}
      >
        
        <DialogTitle id="alert-dialog-title" style={{display: 'flex',alignItems: 'center', justifyContent: 'space-between'}}
          disableTypography
        >
          {width==='xs'&&
            <Button color="primary" size="large" style={{justifyContent: 'flex-start',padding: 0, minWidth: 0,}} onClick={this.handleClose}><ChevronLeft/>退出</Button>
          }
          <Typography variant="h6">添加新商品</Typography>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </DialogTitle>
        <DialogContent>
          <AddInShopCommodityUsingSearch />
          {/*<Tabs value={value} onChange={this.handleChange} centered>
            <Tab label="货号搜索" />
            <Tab label="网页提取" />
          </Tabs>
          {value === 0 && <AddInShopCommodityUsingSearch />}
          {value === 1 && <AddInShopCommodityUsingUrl />}*/}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose}>退出</Button>
        </DialogActions>
      </Dialog>

    );
  }
}

const mapStateToProps = ({/*appModel, */addInShopCommodityModel})=>{
  // const screenWidth = appModel.screenWidth;
  // // 搜索到结果后通过重设dialogRenderAgain来强制对话框调整高度
  const {open, searchResult, commodityFromUrl/*, dialogRenderAgain*/} = addInShopCommodityModel;
  return ({ open, isLargeDialog: Boolean(searchResult&&searchResult.length>0||commodityFromUrl)/*, dialogRenderAgain, screenWidth*/ })
};
export default connect(mapStateToProps)(withWidth()(AddInShopCommodityDialog));
