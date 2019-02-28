import React from 'react';
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

class AutoSyncSet extends React.Component{
  state={
    showForm:false,
    repertorySoftwareName: undefined,
    repertorySoftwareNameErr: undefined,
  }
  render(){
    const {showForm, repertorySoftwareName, repertorySoftwareNameErr} = this.state;
    const {shopId, thirdPartyAks} = this.props;
    return (
      <Paper style={{padding:'0.5rem'}}>
        <p style={{fontSize:'1.2rem'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;店家可以手动修改每件商品的数量，但我们不推荐这么做，因为手动修改常常会修改不及时或修改错误。顾客通过衣衣地图APP看到某件商品有货，来到店铺后却被告知没有货了，这肯定会导致顾客的抱怨和投诉。投诉可能导致店铺评分降低甚至被强制下线。因此，实现商品数量信息实时自动地更新是非常有必要的，这就需要同店铺的供销存软件对接。成功实现对接的店铺在衣衣地图APP上可以被优先搜索到。</p>
        <p style={{fontSize:'1.2rem'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实现对接的前提条件是:您目前使用的供销存软件支持同衣衣地图对接。这一点您需要询问您的供销存软件提供商。如果不支持，您可以要求其支持该功能。供销存软件增加该功能并不复杂，成熟的软件公司可以在几天内完成该功能的开发。您可以告诉供销存软件提供商到链接<a href="//shop.yiyimap.com/threeParty.html" target="_blank" rel="noopener noreferrer">http://shop.yiyimap.com/threeParty.html</a>中查看开发需要的相关资料。</p>
        <p style={{fontSize:'1.2rem',userSelect:'text'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果您使用的供销存软件支持同衣衣地图对接，对接操作需要在供销存软件中进行，具体的操作过程请参考供销存软件提供的相关资料。供销存软件至少会要求您设置以下信息：1、店铺的ID；2、每件商品的ID；3、对接授权码。您店铺的ID为<span style={{color:'green'}}>{shopId}</span>。商品的ID需要点击每个商品的编辑按钮进行查看。对接授权码请点击下面的按钮生成。</p>
        <div style={{display:'flex', flexDirection:'column', width:'12rem', margin:'0 auto'}}>
          {showForm||!thirdPartyAks||thirdPartyAks.length===0?
            <React.Fragment>
              <TextField
                label="输入供销存软件名称"
                helperText={repertorySoftwareNameErr}
                error={Boolean(repertorySoftwareNameErr)}
                value={repertorySoftwareName||''}
                onChange={(evt)=>{
                  this.setState({repertorySoftwareName: evt.target.value, repertorySoftwareNameErr:undefined})
                }}
                style={{marginBottom: '1.5rem'}}
              />
              <Button variant="contained" color="primary"
                onClick={()=>{
                  if(!repertorySoftwareName) {
                    this.setState({repertorySoftwareNameErr:'请输入供销存软件名称'})
                    return;
                  }
                  this.createThirdPartyAk();
                }}
              >生成对接授权码</Button>
              {thirdPartyAks&&thirdPartyAks.length===1&&
                <Button onClick={()=>{
                  this.setState({showForm:false})
                }}>取消</Button>
              }
            </React.Fragment>
            :
            <React.Fragment>
              <p style={{userSelect:'text'}}>供销存软件:&nbsp;&nbsp;{thirdPartyAks[0].name}</p>
              <p style={{userSelect:'text'}}>对接授权码:&nbsp;&nbsp;{thirdPartyAks[0].ak}</p>
              <Button variant="contained" color="primary" onClick={()=>{
                this.setState({showForm:true})
              }}>重新生成对接授权码</Button>
            </React.Fragment>
          }
        </div>
      </Paper>
    );
  }
  createThirdPartyAk = async ()=>{
    const {shopId,thirdPartyAks, dispatch} = this.props;
    const {repertorySoftwareName} = this.state;
    if(thirdPartyAks&&thirdPartyAks.length===1){
      await global.myFetch({
        url: global.serverBaseUrl+'/shops/'+shopId+'/thirdPartyAks/'+thirdPartyAks[0].id, 
        method:'DELETE',
      })
    }
    const resp = await global.myFetch({
      url: global.serverBaseUrl+'/shops/'+shopId+'/thirdPartyAks', 
      method:'POST',
      data:{
        name: repertorySoftwareName,
      }
    })
    dispatch({type:'shopModel/updateState', payload:{thirdPartyAks: [resp]}})
    this.setState({showForm: false});
  }
}

const styles={
}

export default connect(function({shopModel:{id:shopId, thirdPartyAks}}){
  return {shopId, thirdPartyAks}
})(withStyles(styles)(AutoSyncSet));

