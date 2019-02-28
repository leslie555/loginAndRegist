import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AutoComplete from '../../AutoComplete';
import Search from 'material-ui/svg-icons/action/search';
import ToAddCommodityPanel from './ToAddCommodityPanel';
import Typography from '@material-ui/core/Typography';

class AddInShopCommodityUsingSearch extends React.Component{
  render(){

    let {open, searchResult, dispatch} = this.props;
    if(!open) return null;
    return (
      <div>
        <h3>货号搜索：</h3>
        <AutoComplete
          label="品牌名称"
          placeholder="请输入商品的品牌名称"
          value={this.props.searchedBrandName}
          disabled
          dataSource={this.props.brands}
          dataSourceConfig={{key: 'chineseName'}}
          helperText={this.props.searchedBrandError}
          onChange={(newValue)=>{
            // dispatch({
            //   type:'addInShopCommodityModel/updateState',
            //   payload:{searchedBrandName:newValue,searchedBrandError:undefined}
            // });
          }}
          onBlur={()=>{
            let {searchedBrandName, brands} = this.props;
            let searchedBrandId;
            if(!searchedBrandName){
              this.props.dispatch({
                type:'addInShopCommodityModel/updateState',
                payload:{searchedBrandError:'该项不能为空'}
              });
            }
            else{
              for(let k in brands){
                if(brands[k].chineseName == searchedBrandName){
                  searchedBrandId = brands[k].id;
                  break;
                }
              }
              if(typeof searchedBrandId == 'undefined'){
                this.props.dispatch({
                  type:'addInShopCommodityModel/updateState',
                  payload:{
                    searchedBrandError:'提醒：该品牌暂未收录。输入下拉提示中的品牌为已收录的品牌，请尽量从其中选择。如果其中确实没有您想要的品牌，请忽略本提醒。'
                  }
                });
              }
            }
          }}
        />
        <TextField
          label="货号"
          value={this.props.searchText||''}
          onChange={(evt)=>{
            this.props.dispatch({
              type:'addInShopCommodityModel/updateState',
              payload:{searchText:evt.target.value,searchTextError:undefined}
            });
          }}
          error={Boolean(this.props.searchTextError)}
          helperText={this.props.searchTextError}
          fullWidth
          style={{marginTop:'2rem'}}
          onKeyDown={(evt)=>{
            if(evt.keyCode===13) this.handleSearchBtnPressed();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          icon={<Search/>}
          onClick={this.handleSearchBtnPressed}
          fullWidth
          className={global.classes.submitBtn}
        >搜索</Button>
        {
          searchResult&&searchResult.map(
            (commodity, index)=><ToAddCommodityPanel commodity={commodity} key={index}/>
          )
        }
        {
          searchResult&&searchResult.length==0&&
          <Typography variant="body1" color="error">没有搜索到相应结果！可能原因：1、输入的货号错误;2、货号中包含了色号和尺码号,应予以剔除;3、系统暂未收录该商品的信息。</Typography>
        }
      </div>
    );
  }

  handleSearchBtnPressed=()=>{
    const {searchText, searchedBrandName, brands, dispatch} = this.props;
    dispatch({
      type:'addInShopCommodityModel/updateState',
      payload:{searchResult:undefined}
    });
    let errorFlag;//用于标志搜索关键字是否存在错误，如此存在则不发起搜索
    if(!searchText){
      errorFlag = true;
      dispatch({
        type:'addInShopCommodityModel/updateState',
        payload:{searchTextError:'该项不能为空！'}
      });
    }
    else if(searchText.length<4){
      errorFlag = true;
      dispatch({
        type:'addInShopCommodityModel/updateState',
        payload:{searchTextError:'字符串长度不能小于4'}
      });
    }
    let searchedBrandId;
    if(!searchedBrandName){
      errorFlag = true;
      dispatch({
        type:'addInShopCommodityModel/updateState',
        payload:{searchedBrandError:'该项不能为空'}
      });
    }
    else{
      for(let k in brands){
        if(brands[k].chineseName == searchedBrandName){
          searchedBrandId = brands[k].id;
          break;
        }
      }
      if(typeof searchedBrandId == 'undefined'){
        dispatch({
          type:'addInShopCommodityModel/updateState',
          payload:{
            searchedBrandError:'提醒：该品牌暂未收录。输入下拉提示中的品牌为已收录的品牌，请尽量从其中选择。如果其中确实没有您想要的品牌，请忽略本提醒。'
          }
        });
      }
      else{
        dispatch({
          type:'addInShopCommodityModel/updateState',
          payload:{searchedBrandId}
        });
      }
    }
    if(errorFlag){
      return;
    }
    dispatch({
      type:'addInShopCommodityModel/searchCommodity',
      payload:{searchedBrandId,searchedBrandName,searchText},
    });
  };

}

const mapStateToProps = ({addInShopCommodityModel, brandModel: {brandsArray: brands}, shopModel})=>{
  let open = addInShopCommodityModel.open;
  let searchedBrandName, searchedBrandId, searchedBrandError, searchText, searchTextError, searchResult;
  if(open){
    searchedBrandName = addInShopCommodityModel.searchedBrandName;
    if(typeof searchedBrandName == 'undefined'){
      searchedBrandName = shopModel.brandName;
    }
    searchedBrandId = addInShopCommodityModel.searchedBrandId;
    searchedBrandError = addInShopCommodityModel.searchedBrandError;
    searchText = addInShopCommodityModel.searchText;
    // if(typeof searchText == 'undefined'||searchText == '') searchText='Yjly-7008 Yepp-188 [BY17596]';//searchText用于controlled input的value，因此不能为undef
    searchTextError = addInShopCommodityModel.searchTextError;
    searchResult = addInShopCommodityModel.searchResult;
  }

  return ({
    open,
    brands,
    searchedBrandName,
    searchedBrandId,
    searchedBrandError,
    searchText,
    searchTextError,
    searchResult,
  })
};
const mapDispatchToProps = (dispatch)=>({
  dispatch
});
export default connect(mapStateToProps,mapDispatchToProps)(AddInShopCommodityUsingSearch);
