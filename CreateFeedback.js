import React from 'react';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from './fileUploaderGallery'
import './fileUploaderGallery/gallery.css'

let uploadedImgs = {};
class CreateFeedback extends React.Component{

  componentDidMount(){
    uploadedImgs = {};
  }
  state={
    level:1,
    openSelect:false,
  }

  render(){
    const {showCreateForm, title, content, titleErr, contentErr, phone, phoneErr, dispatch, classes, width} = this.props;
    return(
      <React.Fragment>
        {showCreateForm&&
          <div style={{maxWidth:'40rem', width:'100%', margin:'0 auto'}}>
            <TextField
              label="标题"
              value={title||''}
              onChange={(evt)=>{
                dispatch({type:'createFeedbackModel/updateState', payload:{title:evt.target.value, titleErr:undefined}})
              }}
              helperText={titleErr}
              error={Boolean(titleErr)}
              fullWidth
              style={{marginBottom:'1.5rem'}}
            />
            <InputLabel htmlFor="serious-level">严重程度</InputLabel>
            <Select
              fullWidth
              style={{marginBottom:'1.5rem'}}
              open={this.state.openSelect}
              onClose={()=>{this.setState({openSelect:false})}}
              onOpen={()=>{this.setState({openSelect:true})}}
              value={this.state.level}
              onChange={this.handleChangeLevel}
              inputProps={{
                name: 'level',
                id: 'serious-level',
              }}
            >
              <MenuItem value={1}>不严重</MenuItem>
              <MenuItem value={2}>严重</MenuItem>
              <MenuItem value={3}>很严重</MenuItem>
            </Select>
            <TextField
              label="电话"
              placeholder="请输入你的联系电话"
              value={phone||''}
              onChange={(evt)=>{
                dispatch({type:'createFeedbackModel/updateState', payload:{phone:evt.target.value.trim(), phoneErr:undefined}})
              }}
              helperText={phoneErr}
              error={Boolean(phoneErr)}
              fullWidth
              style={{marginBottom:'1.5rem'}}
            />
            <p>描述：</p>
            <TextField
              value={content||''}
              placeholder="请尽量详细地描述您遇到的问题，以便我们更快地解决。"
              onChange={(evt)=>{
                dispatch({type:'createFeedbackModel/updateState', payload:{content:evt.target.value, contentErr:undefined}})
              }}
              helperText={contentErr}
              error={Boolean(contentErr)}
              fullWidth
              variant="outlined"
              multiline
              rowsMax="20"
              rows="4"
              style={{marginBottom:'1.5rem'}}
            />
            <p>上传图片(最多5张图片)：</p>
            {/*react-fine-uploader的代码有bug，无法通过给Gallery传fileInput-text参数将
            select files等英文改为中文，于是我把Gallery的代码复制到了工程中，直接在里面改，
            在fileUploaderGallery中搜索peter，可以查看我改了什么地方*/}
            <Gallery 
              dropzone-disabled={width==='xs'? true:false }
              status-text={{
                canceled: '已取消',
                deleted: '已删除',
                deleting: '删除中...',
                paused: '已暂停',
                queued: '排队中...',
                retrying_upload: '重传...',
                submitting: '提交中...',
                uploading: '上传中...',
                upload_failed: '上传失败',
                upload_successful: '上传成功'
              }}
              uploader={ uploader } 
              fileInput-accept='image/*'
            />
            <div style={{display:'flex', justifyContent:'space-evenly',marginTop:'1.5rem' ,paddingBottom:'3rem'}}>
              <Button color="primary" variant="outlined"
                onClick={this.handleClose}
                style={{paddingLeft:'3rem', paddingRight:'3rem'}}
              >
                取消
              </Button>
              <Button color="primary" variant="contained" 
                onClick={this.handleSubmit}
                style={{paddingLeft:'3rem', paddingRight:'3rem'}}
              >
                提交
              </Button>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }

  handleChangeLevel=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }
  handleSubmit=()=>{
    const {title, content, phone, dispatch} = this.props;
    let errExist;
    if(!title) {
      dispatch({type:'createFeedbackModel/updateState', payload:{titleErr:'标题不能为空'}});
      errExist = true;
    }
    if(!content) {
      dispatch({type:'createFeedbackModel/updateState', payload:{contentErr:'描述不能为空'}});
      errExist = true;
    }
    if(!phone) {
      dispatch({type:'createFeedbackModel/updateState', payload:{phoneErr:'描述不能为空'}});
      errExist = true;
    }
    if(errExist) return;
    global.myFetch( {
      url: global.serverBaseUrl+'/MyUsers/me/feedbacks',
      method: 'POST', 
      data:{
        title, type:2, phone, seriousLevel:this.state.level,
        conversation:[{
          text:content, 
          imgs: Object.keys(uploadedImgs).map(function(uuid){
            return `https://feedback-img.gz.bcebos.com/${uuid}`
          }),
          sender:'feedbacker',
        }],
        
      }
    })
      .then(()=>{
        global.Toast.success('反馈成功');
      })
      .catch(()=>{
        global.Toast.error('反馈失败');
      })
    this.handleClose();
  }

  handleClose=()=>{
    this.props.dispatch({type:'createFeedbackModel/updateState', payload:{
      showCreateForm: false,
      title: undefined,
      content: undefined,
      titleErr: undefined,
      contentErr: undefined,
      phone:undefined,
      phoneErr:undefined,
    }})
  }
}

const mapStateToProps= ({createFeedbackModel:{showCreateForm, title, content, titleErr, contentErr, phone, phoneErr}})=>{
  return {showCreateForm, title, content, titleErr, contentErr, phone, phoneErr, };
}

export default connect(mapStateToProps)(CreateFeedback);

const uploader = new FineUploaderTraditional({
  options: {
    validation:{
      itemLimit: 5,//最多上传5张图片
    },
    deleteFile: {
      enabled: true,
      endpoint: 'https://feedback-img.gz.bcebos.com'
    },
    request: {
      inputName: 'file',//bos要求文件内容的参数名为file
      uuidName: 'key',//bos要求文件名的参数名为key
      paramsInBody: true,//参数都放在http请求的body中
      requireSuccessJson: false,//bos不会返回json数据，只有header
      endpoint: 'https://feedback-img.gz.bcebos.com',
      // customHeaders:{}
    },
    retry: {
      enableAuto: true//上传失败后自动重传
    },
    scaling: {//上传缩小后的图片，不传原图
      sendOriginal: false,
      sizes: [
        {name: '', maxSize: 2000}//图片宽高不超过maxSize
      ]
    },
    callbacks:{
      onComplete:function(id,name,responseJSON, /*xhr*/){
        if(responseJSON.success===true) {
          const uuid = uploader.methods.getUuid(id);
          uploadedImgs[uuid] = 1;
        }
      },
      onDeleteComplete:function(id,xhr,isError){
        if(!isError) {
          const uuid = uploader.methods.getUuid(id);
          delete uploadedImgs[uuid];
        }
      }
    }
  }
})