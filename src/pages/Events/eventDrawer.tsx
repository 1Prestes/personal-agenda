import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import { NoticeType } from 'antd/es/message/interface'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

import { IEvent, useCreateEventMutation, useUpdateEventMutation } from '../../services/events'
import { useAppSelector } from '../../store/hooks'

interface IEventDrawerParams {
  openEventDrawer: boolean
  closeEventDrawer: () => void
  reload: () => void
  toEdit: IEvent | undefined
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const EventDrawer: React.FC<IEventDrawerParams> = ({
  openEventDrawer,
  closeEventDrawer,
  reload,
  toEdit
}: IEventDrawerParams) => {
  const [createEvent, { isLoading, isSuccess, reset: resetCreateEvent }] = useCreateEventMutation()
  const [updateEvent, {
    isLoading: isUpdateEventLoading,
    isSuccess: isUpdateEventSuccess,
    reset: resetUpdateEvent
  }] = useUpdateEventMutation()
  const user = useAppSelector(state => state.getUserSlice.user)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  useEffect(() => {
    if (toEdit) {
      form.setFieldsValue({
        ...toEdit,
        dateTime: [dayjs(toEdit.initial_date).add(3, 'hours'), dayjs(toEdit.final_date).add(3, 'hours')]
      })
    } else {
      form.resetFields()
    }
  }, [toEdit])

  const onFinish = async (): Promise<void> => {
    await form.validateFields()

    const values = form.getFieldsValue()
    const initialDate = dayjs(values.dateTime[0]).subtract(3, 'hours').toISOString()
    const finalDate = dayjs(values.dateTime[1]).subtract(3, 'hours').toISOString()
    const payload = {
      ...values,
      iduser: user.iduser,
      initialDate,
      finalDate,
      ...(toEdit && { idevent: toEdit.idevent })
    }

    delete payload.dateTime

    toEdit ? await updateEvent(payload).unwrap() : await createEvent(payload).unwrap()
  }

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    if (isSuccess || isUpdateEventSuccess) {
      void showMessage({
        type: 'success',
        message: isUpdateEventSuccess && toEdit ? 'Evento atualizado com sucesso!' : 'Evento registrado com sucesso!'
      })
      reload()
      resetUpdateEvent()
      resetCreateEvent()
      form.resetFields()
      closeEventDrawer()
    }
  }, [isSuccess, isUpdateEventSuccess])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading || isUpdateEventLoading}
      style={{ marginRight: 30 }}
      onClick={() => {
        form.resetFields()
        closeEventDrawer()
      }}
    >
      Cancelar
    </Button>
    <Button
      onClick={onFinish}
      type='primary'
      loading={isLoading || isUpdateEventLoading}
    >
      {toEdit ? 'Editar' : 'Cadastrar'}
    </Button>
  </Row>

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={toEdit ? 'Editar evento' : 'Criar novo evento'}
        width={720}
        onClose={() => {
          form.resetFields()
          closeEventDrawer()
        }}
        open={openEventDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
        forceRender
      >
        <Form
          layout="vertical"
          form={form}
          disabled={isLoading || isUpdateEventLoading}
          hideRequiredMark
        >
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
