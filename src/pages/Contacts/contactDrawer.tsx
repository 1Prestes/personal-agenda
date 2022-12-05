import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import { NoticeType } from 'antd/es/message/interface'
import 'dayjs/locale/pt-br'

import { useAppSelector } from '../../store/hooks'
import { IContact, useCreateContactMutation } from '../../services/contact'
import dayjs from 'dayjs'

interface IContactDrawerParams {
  openContactDrawer: boolean
  closeContactDrawer: () => void
  reload: () => void
  toEdit?: IContact | undefined
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const ContactDrawer: React.FC<IContactDrawerParams> = ({
  openContactDrawer,
  closeContactDrawer,
  reload,
  toEdit
}: IContactDrawerParams) => {
  const [createContact, { isLoading, isSuccess, reset: resetCreateContact }] = useCreateContactMutation()
  const user = useAppSelector(state => state.getUserSlice.user)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  useEffect(() => {
    if (toEdit) {
      form.setFieldsValue({
        ...toEdit
      })
    } else {
      form.resetFields()
    }
  }, [toEdit])

  const onFinish = async (): Promise<void> => {
    await form.validateFields()

    const values = form.getFieldsValue()
    const payload = {
      ...values,
      iduser: user?.iduser,
      birthDate: dayjs(values?.birth_date).subtract(3, 'hours').toISOString(),
      ...(toEdit && { idcontact: toEdit.idcontact })
    }

    delete payload?.birth_date

    await createContact(payload).unwrap()
  }

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    if (isSuccess) {
      void showMessage({
        type: 'success',
        message: 'Contato registrado com sucesso!'
      })
      reload()
      resetCreateContact()
      closeContactDrawer()
    }
  }, [isSuccess])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading}
      style={{ marginRight: 30 }}
      onClick={closeContactDrawer}
    >
      Cancelar
    </Button>
    <Button
      onClick={onFinish}
      type='primary'
      loading={isLoading}
    >
      {toEdit ? 'Editar' : 'Cadastrar'}
    </Button>
  </Row>

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={toEdit ? 'Editar contato' : 'Criar novo contato'}
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
          disabled={isLoading}
          hideRequiredMark
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
