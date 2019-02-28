import React from 'react';
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';

class QrCode extends React.Component{
  state={
    showForm:false,
    repertorySoftwareName: undefined,
    repertorySoftwareNameErr: undefined,
  }
  render(){
    const {userId, shopId} = this.props;
    const url = `http://www.yiyimap.com/?tellerId=${userId}/#/shop/${shopId}`
    return (
      <Paper style={{padding:'0.5rem', fontSize:18}}>
        <p>您店铺的推广链接为：</p>
        <p style={{color: global.TheBlue}}>{url}</p>
        <p>顾客通过该链接注册并下载APP后将自动关注您的店铺，同时您也可以获得20个积分。你的店铺在衣衣地图平台上发布广告时，1积分可以抵1元现金使用。此外，已经安装衣衣地图APP的顾客通过该链接可以直接跳转到您的店铺首页。</p>
        <p>该链接对应的二维码如下图所示，如果采用不同的容错率，生成的二维码可能与下图不同，但识别后的链接都应该与上面的链接完全一致。</p>
        <QRCode value={url} level="H" size={260}/>
        <p>二维码台牌制作：通过以下淘宝网址，告诉淘宝店家您店铺的推广链接，他将为您制作您店铺的二维码台牌。
          <br/>
          <a href="https://detail.tmall.com/item.htm?id=555216647907" target="_blank" rel="noopener noreferrer">
            https://detail.tmall.com/item.htm?id=555216647907
          </a>
        </p>
        <p>宣传海报制作：通过以下淘宝网址，告诉淘宝店家您店铺的推广链接，他将为您制作带有您店铺二维码的宣传海报。
          <br/>
          <a href="https://detail.tmall.com/item.htm?id=561389307633&skuId=3863646332858" target="_blank" rel="noopener noreferrer">
            https://detail.tmall.com/item.htm?id=561389307633&skuId=3863646332858
          </a>
        </p>
        <p>传单制作：通过以下淘宝网址，告诉淘宝店家您店铺的推广链接，他将为您制作带有您店铺二维码的传单。
          <br/>
          <a href="https://detail.tmall.com/item.htm?id=560684638032" target="_blank" rel="noopener noreferrer">
            https://detail.tmall.com/item.htm?id=560684638032
          </a>
        </p>
      </Paper>
    );
  }
}

const styles={
}

export default connect(function({userModel:{id: userId}, shopModel:{id:shopId}}){
  return {userId, shopId}
})(withStyles(styles)(QrCode));

