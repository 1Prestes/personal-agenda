import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import { NoticeType } from 'antd/es/message/interface'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { useAppSelector } from '../../store/hooks'
import { IContact, useCreateContactMutation, useUpdateContactMutation } from '../../services/contact'

interface IContactDrawerParams {
  openContactDrawer: boolean
  closeContactDrawer: () => void
  reload: () => void
  contact?: IContact
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const ContactDrawer: React.FC<IContactDrawerParams> = ({
  openContactDrawer,
  closeContactDrawer,
  reload,
  contact
}: IContactDrawerParams) => {
  const [createContact, { isLoading, isSuccess, reset: resetCreateContact }] = useCreateContactMutation()
  const [updateContact, {
    isLoading: isUpdateContactLoading,
    isSuccess: isUpdateSuccess,
    reset: resetUpdateContact
  }] = useUpdateContactMutation()
  const user = useAppSelector(state => state.getUserSlice.user)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  useEffect(() => {
    if (contact) {
      form.setFieldsValue({
        ...contact,
        birth_date: dayjs(contact.birth_date).add(3, 'hours')
      })
    } else {
      form.resetFields()
    }
  }, [contact])

  const onFinish = async (): Promise<void> => {
    await form.validateFields()

    const values = form.getFieldsValue()
    const payload = {
      ...values,
      iduser: user?.iduser,
      birthDate: dayjs(values?.birth_date).subtract(3, 'hours').toISOString(),
      ...(contact && { idcontact: contact.idcontact })
    }

    delete payload?.birth_date

    contact ? await updateContact(payload).unwrap() : await createContact(payload).unwrap()
  }

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      void showMessage({
        type: 'success',
        message: contact ? 'Contato atualizado com sucesso!' : 'Contato registrado com sucesso!'
      })
      reload()
      form.resetFields()
      resetCreateContact()
      resetUpdateContact()
      closeContactDrawer()
    }
  }, [isSuccess, isUpdateSuccess])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading || isUpdateContactLoading}
      style={{ marginRight: 30 }}
      onClick={closeContactDrawer}
    >
      Cancelar
    </Button>
    <Button
      onClick={onFinish}
      type='primary'
      loading={isLoading || isUpdateContactLoading}
    >
      {contact ? 'Editar' : 'Cadastrar'}
    </Button>
  </Row>

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={contact ? 'Editar contato' : 'Criar novo contato'}
        width={720}
        onClose={closeContactDrawer}
        open={openContactDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
        forceRender
      >
        <Form
          layout="vertical"
          form={form}
          disabled={isLoading || isUpdateContactLoading}
        >
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, informe o nome do contato' }]}
            >
              <Input placeholder="Nome" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="address"
              label="Endereço"
              rules={[{ required: true, message: 'Por favor, informe o endereço do contato' }]}
            >
              <Input placeholder="Endereço" />
            </Form.Item>
          </Col>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="birth_date"
                label="Data de nascimento"
                rules={[{ required: true, message: 'Por favor, selecione a data de nascimento do contato' }]}
              >
                <DatePicker
                  format={'DD/MM/YYYY'}
                  locale={locale}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
