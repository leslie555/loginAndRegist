import React from 'react';
import MyAppBar from '../loginAndRegist/MyAppBar';
// import {connect} from 'react-redux'
// import { routerRedux } from 'dva/router';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
// import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import classNames from 'classnames';


class Video extends React.Component{
  render(){
    const {width} = this.props;
    return (
      <div>
        <MyAppBar
          mainTitle="衣衣地图"
          subTitle={`衣衣地图${global.realm==='shop'? '店铺端':(global.realm==='producer'? '品牌商端':'管理员')}`}
          showConsoleEntryBtn
          showLoginRegistBtn
        />
        <div style={{maxWidth:500, margin: '0 auto'}}>
          {
            global.videos.map(function(item, index){
              return (
                <div style={{display:'flex', marginTop: 30}} key={index}>
                  <div style={{width: 140, height:80, backgroundColor:'#333', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center'}}
                    onClick={function(){window.open(item.url);}}
                  >
                    <PlayCircleOutlineIcon style={{color:'#eee', fontSize:60}}/>
                  </div>
                  <div style={{marginLeft: isWidthUp('sm', width)?30:10, display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <p style={{marginTop: 0, marginBottom: 6}}>{item.name}</p>
                    <p style={{marginTop: 0, marginBottom: 6, fontSize: 14}}>时长：{item.time}</p>
                    <p style={{marginTop: 0, marginBottom: 6, fontSize: 14}}>上传日期：{item.uploadDate.toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
// const styles = (theme)=>{
//   return ({
//   });
// }
export default withWidth()(Video);
