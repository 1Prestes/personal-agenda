import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import 'dayjs/locale/pt-br';
import locale from 'antd/es/date-picker/locale/pt_BR';

import { Banner, Header, RegisterContainer } from './styles';
import { useCreateUserMutation } from '../../services/user';

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
  const [createUser, { isLoading, isSuccess }] = useCreateUserMutation()
  const [messageApi, contextHolder] = message.useMessage();
  let navigate = useNavigate();

  const initialValues = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    birthDate: '',
    agreement: '',
  }

  const onFinish = async (values: any) => {
    values.birthDate = dayjs(values.birthDate).format('YYYY-MM-DD')
    console.log('Received values of form: ', values);
    await createUser(values).unwrap()
  };

  useEffect(() => {
    if (isSuccess) {
      messageApi.open({
        type: 'success',
        content: 'Cadastro realizado com sucesso!',
      });

      navigate('/');
    }
  }, [isSuccess])

  return (
    <>
      {contextHolder}
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
              disabled={isLoading}
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

              <Form.Item name="birthDate" label="Data de nascimento">
                <DatePicker
                  format={'DD/MM/YYYY'}
                  locale={locale}
                  placeholder='Selecione a data'
                />
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
                  loading={isLoading}
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
    </>
  );
};

