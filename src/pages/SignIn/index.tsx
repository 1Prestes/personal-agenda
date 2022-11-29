import { Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { Banner, Header, SignInContainer } from './styles'

export const SignIn = () => {
  const { Paragraph, Title } = Typography;

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return <Row wrap style={{
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
              <Input placeholder='Nome de usuário' minLength={3} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
            >
              <Input.Password placeholder='Senha' minLength={6} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Lembre de mim</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="middle" block>
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
}
