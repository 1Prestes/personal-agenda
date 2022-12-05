import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import { NoticeType } from 'antd/es/message/interface'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

import { useCreateEventMutation } from '../../services/events'
import { useAppSelector } from '../../store/hooks'

interface ICreateEventDrawerParams {
  openCreateEventDrawer: boolean
  closeCreateEventDrawer: () => void
  reload: () => void
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const CreateEventDrawer: React.FC<ICreateEventDrawerParams> = ({ openCreateEventDrawer, closeCreateEventDrawer, reload }: ICreateEventDrawerParams) => {
  const [createEvent, { isLoading, isSuccess }] = useCreateEventMutation()
  const user = useAppSelector(state => state.getUserSlice.user)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const onFinish = async (): Promise<void> => {
    await form.validateFields()

    const values = form.getFieldsValue()
    const initialDate = dayjs(values.dateTime[0]).subtract(3, 'hours').toISOString()
    const finalDate = dayjs(values.dateTime[1]).subtract(3, 'hours').toISOString()
    const payload = {
      ...values,
      iduser: user.iduser,
      initialDate,
      finalDate
    }

    delete payload.dateTime

    await createEvent(payload).unwrap()
  }

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    if (isSuccess) {
      void showMessage({ type: 'success', message: 'Evento registrado com sucesso!' })
      reload()
      closeCreateEventDrawer()
    }
  }, [isSuccess])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading}
      style={{ marginRight: 30 }}
      onClick={closeCreateEventDrawer}
    >
      Cancelar
    </Button>
    <Button
      onClick={onFinish}
      type='primary'
      loading={isLoading}
    >
      Cadastrar
    </Button>
  </Row>

  return (
    <>
      {contextHolder}
      <Drawer
        title="Criar novo evento"
        width={720}
        onClose={closeCreateEventDrawer}
        open={openCreateEventDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
      >
        <Form layout="vertical" form={form} disabled={isLoading} hideRequiredMark>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Titulo"
              rules={[{ required: true, message: 'Por favor, informe um titulo para o evento' }]}
            >
              <Input placeholder="Titulo" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="place"
              label="Local"
              rules={[{ required: true, message: 'Por favor, informe o local do evento' }]}
            >
              <Input placeholder="Local" />
            </Form.Item>
          </Col>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dateTime"
                label="Data do evento"
                rules={[{ required: true, message: 'Por favor, selecione a data do evento' }]}
              >
                <DatePicker.RangePicker showTime
                  format={'DD/MM/YYYY HH:mm'}
                  locale={locale}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Descrição"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, informe uma descrição para o evento'
                  }
                ]}
              >
                <Input.TextArea rows={4} placeholder="Descrição" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
