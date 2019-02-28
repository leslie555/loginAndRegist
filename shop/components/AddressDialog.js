import React from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import fetchJsonp from 'fetch-jsonp';
import withWidth from '@material-ui/core/withWidth';
import ChevronLeft from '@material-ui/icons/ChevronLeft';


class AddressDialog extends React.Component{
  state={
    newAddress: this.props.address,
    newGcjLng: this.props.gcjLng,
    newGcjLat: this.props.gcjLat,
    newAmapBuildingId: this.props.amapBuildingId,
    newFloor: this.props.floor,
    bdLng: undefined,
    bdLat: undefined,
    modified: undefined,
    fetchingBdPosition: undefined,
  };
  render(){
    console.log('AddressDialog rendered');
    const {width} = this.props;
    const { modified, newGcjLng, newGcjLat, newAddress, newFloor, fetchingBdPosition } = this.state;
    return(
      <Dialog
        open  // 对话框的显示由上级模块通过“addressDialogOpen&&”控制
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
          <Typography variant="h6">设置店铺地址</Typography>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </DialogTitle>
        <DialogContent>
          <div id="map_container" style={{height:width==='xs'? '20rem':'30rem', marginLeft: width==='xs'?'-1.2rem':undefined, marginRight: width==='xs'?'-1.2rem':undefined}}/>
          <span>{newAddress?(newAddress.city+newAddress.district):''}</span>
          <input placeholder="详细地址如：XX街XX商场X楼XX号" size={20} 
            value={newAddress&&newAddress.detailedAddress?newAddress.detailedAddress:''}
            onChange={this.handleDetailedAddressChange}
          />
          <div>
            <span>楼层：</span>
            <input size={4} value={newFloor||''}  onChange={this.handleFloorChange}/>
            <span>(填入整数，如5代表五楼，-2代表负二楼。)</span>
          </div>
          <div>{newGcjLng?('经纬度：'+newGcjLng+', '+newGcjLat):''}</div>
          <div>注：经纬度是否设置正确以顾客APP的显示为准，如果顾客APP上显示的店铺位置有明显偏差，请重新对经纬度进行相应调整</div>
        </DialogContent>
        <DialogActions>
          <Button  onClick={this.handleClose} color="primary">退出</Button>
          {/*存在修改的情况下才显示确定按钮，newGcjLng，detailedAddress是必需的，同时没有正在获取百度坐标信息*/}
          {newGcjLng&&newAddress&&newAddress.detailedAddress&&!fetchingBdPosition&&modified&&
            <Button  color="primary" variant="contained" onClick={this.handleSubmit}>保存修改</Button>
          }
        </DialogActions>
      </Dialog>
    );
  }

  componentDidMount() {
    const {gcjLng, gcjLat, amapBuildingId, floor} = this.props;
    const AMap = window.AMap;
    setTimeout(()=>{
      AMap.plugin(
        ['AMap.ToolBar', 'AMap.Geocoder'],
        ()=>{
          const map = new AMap.Map('map_container', {
            resizeEnable: true,
            zoom:14,
            center: gcjLng?[gcjLng, gcjLat]:undefined,
          });
          map.addControl(new AMap.ToolBar());   // 添加缩放控件
          const indoorMap = map.indoorMap;
          if(amapBuildingId&&floor){
            indoorMap.showIndoorMap(amapBuildingId, floor);// 直接显示相应楼层
          }
          let marker;
          if(gcjLng) {
            marker = new AMap.Marker({
              position: [gcjLng, gcjLat],
              map: map,
            });
          }
          // 点击室内图时，下面两个事件响应函数都会执行，且第二个后执行
          AMap.event.addListener(map, 'click', ({lnglat: {lng: newGcjLng, lat: newGcjLat}})=>{
            this.setState({newGcjLng, newGcjLat, newAmapBuildingId: null, newFloor: null});
            getAddressAndBdPosition(newGcjLng, newGcjLat);
            if(marker) {
              marker.setPosition(new AMap.LngLat(newGcjLng, newGcjLat));
            } else {
              marker = new AMap.Marker({
                position: [newGcjLng, newGcjLat],
                map: map,
              });
            }
          });
          AMap.event.addListener(indoorMap, 'click', ({lnglat: {lng: newGcjLng, lat: newGcjLat}, building_id: newAmapBuildingId, floor})=>{
            setTimeout(()=>{
              this.setState({newGcjLng, newGcjLat, newAmapBuildingId, newFloor: floor});
            }, 0);
          });
        }
      );
    }, 0);

    const getAddressAndBdPosition=(gcjLng, gcjLat)=>{
      const geocoder = new AMap.Geocoder({});        
      geocoder.getAddress([gcjLng, gcjLat], (status, rs)=>{
        if (status === 'complete' && rs.info === 'OK') {
          const addr = rs.regeocode.addressComponent;
          const detailedAddress = this.state.newAddress&&this.state.newAddress.detailedAddress;
          this.setState({
            newAddress: {province:addr.province, city:addr.city, district: addr.district,
              street: addr.street, township: addr.township, detailedAddress },
            modified: true,
          });
        }
      });
      this.setState({fetchingBdPosition: true}); // 获取百度坐标成功后才显示对话框的确定按钮
      fetchJsonp(`//api.map.baidu.com/geoconv/v1/?coords=${gcjLng},${gcjLat}&from=3&to=5&ak=HVHxEqPbNs4zqVxewVFGojAI8WeyUSXc`)
        .then((response)=>{
          return response.json();
        }).then((json)=>{
          this.setState({fetchingBdPosition: false, bdLng:json.result[0].x, bdLat:json.result[0].y});
        }).catch((ex)=>{
          alert('请求百度坐标失败！');
          console.error('fetchJsonp fetchingBdPosition error', ex);
        });
    };
  }

  handleClose = () => {
    this.props.dispatch({type:'editAddressModel/updateState',
      payload:{open:false}});
    this.setState({ modified:undefined, newGcjLng:undefined, newGcjLat:undefined, bdLng:undefined,  bdLat:undefined, 
      newAddress:undefined, fetchingBdPosition:undefined });
  };
  handleSubmit = () => {
    const {newAddress, bdLng, bdLat, newGcjLng, newGcjLat, newAmapBuildingId, newFloor} = this.state;
    const {gcjLng, gcjLat, amapBuildingId, floor} = this.props;
    let modifiedShopData = this.props.modifiedShopData;
    let newModifiedShopData={
      ...modifiedShopData,
      address: newAddress,
      bdLng,
      bdLat
    };
    if(newGcjLng!=gcjLng) newModifiedShopData.gcjLng = newGcjLng;
    if(newGcjLat!=gcjLat) newModifiedShopData.gcjLat = newGcjLat;
    if(newAmapBuildingId!=amapBuildingId) newModifiedShopData.amapBuildingId = newAmapBuildingId;
    if(newFloor!=floor) newModifiedShopData.floor = newFloor;
    this.props.dispatch({type:'editShopModel/updateState',payload:{modifiedShopData: newModifiedShopData}});
    this.handleClose();
  }
  handleDetailedAddressChange=(evt)=>{
    let {newAddress} = this.state;
    newAddress = {...newAddress,detailedAddress:evt.target.value};
    this.setState({newAddress, modified:true});
  }
  handleFloorChange=(evt)=>{
    this.setState({newFloor: evt.target.value, modified:true});
  }
}

const mapStateToProps=({appModel, editAddressModel, editShopModel})=>{
  const address = editAddressModel.address;
  const gcjLng = editAddressModel.gcjLng;
  const gcjLat = editAddressModel.gcjLat;
  const amapBuildingId = editAddressModel.amapBuildingId;
  const floor = editAddressModel.floor;
  const modifiedShopData = editShopModel.modifiedShopData;
  const screenWidth = appModel.screenWidth;
  return {address, gcjLng, gcjLat, amapBuildingId, floor, modifiedShopData, screenWidth};
};

const mapDispatchToProps = (dispatch)=>{
  return {dispatch};
};
export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(AddressDialog));
