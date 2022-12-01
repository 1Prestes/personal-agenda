import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Row,
  Typography,
} from 'antd';

import { Banner, Header, RegisterContainer } from './styles';
import { Link } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 10 },
  }
};

export const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const { Paragraph, Title } = Typography;
  const [agreement, setAgreement] = useState(false)

  const initialValues = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    birthDate: '',
    agreement: '',
  }

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Row wrap>
      <RegisterContainer>
        <Header>
          <Title type="success">Personal Agenda</Title>
        </Header>

        <div
          style={{
            margin: 'auto',
          }}
        >
          <Form
            style={{
              width: '100%',
              padding: 20,
            }}
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={initialValues}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, informe seu nome!',
                },
              ]}
            >
              <Input placeholder="Ex: Jailson Mendes" />
            </Form.Item>

            <Form.Item
              name="username"
              label="Nome de usuário"
              tooltip="Seu nome de usuário para acessar a plataforma"
              rules={[{ required: true, message: 'Por favor, informe seu nome de usuário!', whitespace: true }]}
            >
              <Input placeholder="Ex: paidefamilia" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[
                {
                  required: true,
                  message: 'Por favor, informe sua senha!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder='Senha' />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirmar Senha"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Por fvaor, confirme sua senha!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As duas senhas que você digitou não correspondem!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder='Confirmação da senha' />
            </Form.Item>

            <Form.Item
              name="address"
              label="Endereço"
              rules={[
                {
                  required: true,
                  message: 'Por favor, informe seu endereço!',
                },
              ]}
            >
              <Input placeholder="Ex: Rua Bartolomeu Bueno, Caraguatatuba" />
            </Form.Item>

            <Form.Item name="date-picker" label="Data de nascimento">
              <DatePicker format={'DD/MM/YYYY'} placeholder='Selecione a data' />
            </Form.Item>

            <div
              style={{
                margin: '30px auto',
                width: '80%',
              }}
            >
              <Form.Item
                name="agreement"
                valuePropName="checked"
                noStyle
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Você deve aceitar os termos')),
                  },
                ]}
              >
                <Checkbox onChange={(value) => setAgreement(value.target.checked)}>
                  Aceito os Termos de Uso e a Política de Privacidade
                </Checkbox>
              </Form.Item>
            </div>

            <div
              style={{
                width: '60%',
                margin: 'auto',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={!agreement}
              >
                Cadastrar
              </Button>
            </div>
          </Form>

          <div style={{
            textAlign: 'center',
            marginTop: 10
          }}>
            <Paragraph>Já tem uma conta? <Link to={'/'}>Entrar</Link></Paragraph>
          </div>

        </div>
      </RegisterContainer>

      <Banner />
    </Row>
  );
};

