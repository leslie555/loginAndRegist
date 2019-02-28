import React from 'react';
import {connect} from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import async from 'async';

class AddImgDialog extends React.Component{
  render() {
    console.log('AddImgDialog rendered!');
    const {
      open, multiple
    } = this.props;
    return (
      <Dialog
        open={open||false}
        onClose={this.handleClose}
        maxWidth="lg"
      >
        <DialogTitle>
          <Typography variant="h6">添加图片</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField label="图片url" fullWidth onChange={this.handleUrlInputChange} />
          <p>或</p>
          <input type="file" multiple={multiple||false} onChange={this.handleFileSelecterChange}/>
        </DialogContent>
      </Dialog>
    );
  }

  handleUrlInputChange = (evt)=>{
    const {okCb, producerId, commodity, dispatch} = this.props;
    const url = evt.target.value.trim();
    // if(url.indexOf('yiyimap.com')>-1||url.indexOf('producer-img')>-1){
    //   alert('请输入第三方URL，而不是衣衣地图上的URL')
    //   return;
    // }
    global.myFetch({
      url: `${global.serverBaseUrl}/Producers/${producerId}/getBosSTS`,
      method: 'get'
    }).then((bosSts)=>{
      let headers = {
        Host: 'producer-img.gz.bcebos.com',
        'x-bce-fetch-source': global.addHttpsToUrl(url),
        'x-bce-security-token': bosSts.sessionToken,
        'Content-Length': 0,
        'x-bce-date': new Date().toISOString(),
      }
      const fileName = global.urlToBosFileName(url);
      const objectKey = `${producerId}/${commodity.id}/${fileName}`;
      const auth = new global.baidubce.sdk.Auth(bosSts.accessKeyId, bosSts.secretAccessKey);
      headers.Authorization = auth.generateAuthorization('POST', `/${objectKey}`, {fetch: ''}, headers);
      dispatch({type:'appModel/updateState', payload:{circularProgressShow: true}});
      fetch(
        `https://producer-img.gz.bcebos.com/${objectKey}?fetch`,
        {
          method:'POST',
          headers
        }
      )
        .then((res)=>{
          return res.json();
        })
        .then((json)=>{
          if(json.code === 'success') {
            okCb(fileName);
            this.handleClose();
          }
          else console.error(json);
          dispatch({type:'appModel/updateState', payload:{circularProgressShow: false}})
        })
        .catch(function(err){
          console.error(err)
          dispatch({type:'appModel/updateState', payload:{circularProgressShow: false}})
        })
    })
  }

  handleFileSelecterChange = (evt)=>{
    const {commodity} = this.props;
    const files = evt.target.files;
    for(let file of files){
      if(global.getImgsInCommodity(commodity).indexOf(file.name)>-1){
        global.MyDialog.confirm({
          message: '服务器上存在同名图片，上传将覆盖原图片。',
          actions:[
            {text: '取消上传'},
            {
              text: '继续上传', color: 'primary', autoFocus:  true,
              cb:()=>{
                this.uploadImgs(files);
                setTimeout(function(){
                  global.MyDialog.info('注意，您需要清除浏览器缓存后才能看到看到图片真实的变化！');
                }, 1000)
              },
            },
          ]
        });
        return;
      }
    }
    this.uploadImgs(files);
  }

  uploadImgs = (files)=>{
    const {okCb, producerId, commodity, dispatch} = this.props;
    global.myFetch({
      url: `${global.serverBaseUrl}/Producers/${producerId}/getBosSTS`,
      method: 'get'
    }).then((bosSts)=>{
      const config = {
        credentials: {
          ak: bosSts.accessKeyId, // STS服务器下发的临时ak
          sk: bosSts.secretAccessKey // STS服务器下发的临时sk
        },
        sessionToken: bosSts.sessionToken,  // STS服务器下发的sessionToken
        endpoint: 'http://gz.bcebos.com'
      };
      const client = new global.baidubce.sdk.BosClient(config);
      dispatch({type:'appModel/updateState', payload:{circularProgressShow: true}})
      async.each(
        files, 
        function(file,callback){
          const fileName = file.name;
          client.putObjectFromBlob('producer-img', `${producerId}/${commodity.id}/${fileName}`, file)
            .then(()=>{
              okCb(fileName);
              callback()
            })
            .catch(function(err){
              if(err) console.error('client.putObjectFromBlob', err)
              callback(err);
            });
        },
        (err)=>{
          dispatch({type:'appModel/updateState', payload:{circularProgressShow: false}});
          if(!err) this.handleClose();
        }
      );
    })
  }

  handleClose = ()=>{
    this.props.dispatch({
      type:'addImgDialogModel/replace',
      payload:{}
    });
  };
}
const mapStateToProps=({
  addImgDialogModel: {open, okCb, commodity, multiple},
  producerModel
})=>{
  const producerId = producerModel&&producerModel.id;
  return {open, okCb, producerId,commodity, multiple};
};

const styles = {};

export default connect(mapStateToProps)(withWidth()(withStyles(styles)(AddImgDialog)));
