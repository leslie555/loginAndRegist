//antd组件，目前没有用到，


import React from 'react';
import 'antd/dist/antd.css';
import {
  Upload, Button, Icon, message,Modal
} from 'antd';
import reqwest from 'reqwest';


export default class DragPicsUpload extends React.Component {
  
  state = {
    fileList: [],
    uploading: false,
    previewVisible: false,
    previewImage:'',
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList })
  handleCancel = () => this.setState({ previewVisible: false })

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    reqwest({
      url: `//adminApi.yiyimap.com/api/Admins/${this.props.adminId}/feedbacks/${this.props.feedbackId}/`,
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('上传成功');
      },
      error: () => {
        console.log('url',reqwest.url);
        this.setState({
          uploading: false,
        });
        alert('上传失败');
      },
    });
  }

  render() {
    const { uploading, fileList ,previewVisible,previewImage} = this.state;
    // const myUrl=`//${global.serverBaseUrl}/Admins/${this.props.adminId}/feedbacks/${this.props.feedbackId}/`;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
    };
    const uploadButton=(
      <React.Fragment>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
        <p className="ant-upload-hint">支持单次拖拽一张或多张图片.</p>
      </React.Fragment>
    );
    const Dragger=Upload.Dragger;
    

    return (
      <div>
        <Dragger {...props}
          name='file'
          multiple={true}
          listType='picture-card'
          accept='image/*'
          // action={myUrl}
          onPreview={this.handlePreview}
          fileList={fileList}
          onChange={this.handleChange}
          disabled={this.state.fileList.length>=3}
        >
          {this.state.fileList.length>=3?null:uploadButton}
        </Dragger>

        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload' }
        </Button>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


          