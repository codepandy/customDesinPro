import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Input, Button } from 'antd';
import styles from './Login.less';

const InputGroup = Input.Group;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    mobile: '',
    captcha: '',
    validMobile: true,
    captchaText: '获取验证码',
  };

  onChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  onValidateMobile = e => {
    const mobile = e.target.value;
    const reg = /^1[3456789]\d{9}$/;

    this.setState({
      validMobile: mobile.length === 0 || reg.test(mobile),
    });
  };

  onChangeMobile = e => {
    const mobile = e.target.value;
    this.onChange('mobile', mobile);
  };

  onChangeCaptcha = e => {
    this.onChange('captcha', e.target.value);
  };

  onGetCaptcha = () => {
    const { mobile } = this.state;
    const { dispatch } = this.props;
    if (mobile.length === 0) {
      Modal.warning({
        title: '手机号不能为空！',
        content: '请输入手机号再获取验证码。',
        okText: '确定',
      });
      return false;
    }
    dispatch({
      type: 'login/getCaptcha',
      payload: {
        data: { mobile },
      },
    });

    this.captchInterval = setInterval(() => {
      const { captchaText } = this.state;
      let captcha = '';
      let second = parseInt(captchaText, 10);
      if (captchaText === '获取验证码') {
        second = 60;
      }

      if (second > 0) {
        second -= 1;
        captcha = `${second}s`;
      } else {
        clearInterval(this.captchInterval);
        captcha = '获取验证码';
      }
      this.setState({
        captchaText: captcha,
      });
    }, 1000);
    return true;
  };

  onLogin = () => {
    const { mobile, captcha, validMobile } = this.state;
    const { dispatch } = this.props;
    if (mobile.length === 0 || captcha.length === 0) {
      Modal.warning({
        title: '手机号和验证码不能为空！',
        content: '请输入手机号和验证码。',
        okText: '确定',
      });
      return false;
    }
    if (validMobile) {
      dispatch({
        type: 'login/login',
        payload: {
          data: {
            mobile,
            code: captcha,
          },
        },
      });
    }
    return true;
  };

  render() {
    const { mobile, captcha, validMobile, captchaText } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.inputRow}>
          <InputGroup>
            <Input
              prefix={<span className={styles.prefix}>手机号</span>}
              style={{
                width: 380,
                height: 48,
                lineHeight: 48,
              }}
              onBlur={this.onValidateMobile}
              className={styles.mobileInput}
              maxLength={11}
              value={mobile}
              onChange={this.onChangeMobile}
            />
          </InputGroup>
        </div>

        {validMobile ? null : <div className={styles.errorRow}>手机号输入有误，请重新输入!</div>}
        <div className={styles.inputRow}>
          <InputGroup>
            <Input
              prefix={<span className={styles.prefix}>验证码</span>}
              style={{
                width: 270,
                borderLeft: 0,
                height: 48,
                lineHeight: 48,
              }}
              className={styles.mobileInput}
              value={captcha}
              onChange={this.onChangeCaptcha}
            />
          </InputGroup>
          <Button className={styles.btnCaptcha} onClick={this.onGetCaptcha}>
            {captchaText}
          </Button>
        </div>
        <div className={styles.submitRow}>
          <Button type="primary" className={styles.submit} onClick={this.onLogin}>
            登录
          </Button>
        </div>
      </div>
    );
  }
}

export default LoginPage;
