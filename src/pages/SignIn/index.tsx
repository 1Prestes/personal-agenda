import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Col, Form, Input, message, Row, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { ILoginRequest, useLoginMutation } from '../../services/auth'
import { useAppSelector } from '../../store/hooks';
import { setToken } from '../../helpers/storage';
import { Banner, Header, SignInContainer } from './styles'

export const SignIn = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const { Paragraph, Title } = Typography;
  const [login, { isLoading }] = useLoginMutation()
  const [messageApi, contextHolder] = message.useMessage();
  const { token, error } = useAppSelector(state => state.auth)
  let from = location.state?.from?.pathname || "/";

  const onFinish = async (values: ILoginRequest) => {
    await login(values).unwrap()
  };

  useEffect(() => {
    if (token) {
      setToken(token)
      navigate(from, { replace: true });
    }
  }, [token])

  useEffect(() => {
    if (error?.code === 'HAE-002') {
      messageApi.open({
        type: 'error',
        content: 'Usuário ou senha inválido',
      });
    }
  }, [error, messageApi])

  const onFinishFailed = (errorInfo: Object) => {
    console.log('Failed:', errorInfo);
  };

  return <>
    {contextHolder}
    <Row wrap style={{
      maxWidth: 1440,
    }}>
      <Col className="gutter-row" span={12}>
        <Header>
          <Title type="success">Personal Agenda</Title>
        </Header>

        <SignInContainer>
          <Title level={2}>Bem vindo de volta</Title>
          <Paragraph>por favor insira seus dados</Paragraph>
          <Col span={24}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Por favor insira seu nome de usuário!' }]}
              >
                <Input disabled={isLoading} prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Nome de usuário' minLength={3} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
              >
                <Input.Password disabled={isLoading} prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Senha' minLength={6} />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox disabled={isLoading}>Lembre de mim</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button loading={isLoading} type="primary" htmlType="submit" size="middle" block>
                  Entrar
                </Button>
              </Form.Item>
            </Form>

            <Typography>Não tem uma conta? <Link to={'/'}>Inscrever-se</Link></Typography>

          </Col>
        </SignInContainer>
      </Col>

      <Col className="gutter-row" span={12}>
        <Banner />
      </Col>
    </Row>
  </>
}
