import { useEffect } from 'react'
import { Button, Col, Drawer, Form, Input, message, Row } from 'antd'
import { NoticeType } from 'antd/es/message/interface'

import { IGroup, useCreateGroupMutation, useUpdateGroupMutation } from '../../services/group'
import { useAppSelector } from '../../store/hooks'

interface IGroupDrawerParams {
  openGroupDrawer: boolean
  closeGroupDrawer: () => void
  group?: IGroup
  reload: () => void
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const GroupDrawer: React.FC<IGroupDrawerParams> = ({ openGroupDrawer, closeGroupDrawer, group, reload }: IGroupDrawerParams) => {
  const user = useAppSelector(state => state.getUserSlice.user)
  const [createGroup, {
    isLoading: isCreateGroupLoading,
    isSuccess: isCreateGroupSuccess,
    reset: resetCreateGroup
  }] = useCreateGroupMutation()
  const [updateGroup, {
    isLoading: isUpdateGroupLoading,
    isSuccess: isUpdateGroupSuccess,
    reset: resetUpdateGroup
  }] = useUpdateGroupMutation()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const onFinish = async (): Promise<void> => {
    await form.validateFields()

    const values = form.getFieldsValue()
    const payload = {
      ...values,
      iduser: user.iduser,
      ...(group && { idgroup: group.idgroup })
    }

    delete payload.dateTime

    group ? await updateGroup(payload).unwrap() : await createGroup(payload).unwrap()
  }

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        ...group
      })
    } else {
      form.resetFields()
    }
  }, [group])

  useEffect(() => {
    if (isCreateGroupSuccess || isUpdateGroupSuccess) {
      void showMessage({
        type: 'success',
        message: group ? 'Titulo do grupo atualizado com sucesso!' : 'Grupo registrado com sucesso!'
      })
      reload()
      resetCreateGroup()
      resetUpdateGroup()
      form.resetFields()
      closeGroupDrawer()
    }
  }, [isCreateGroupSuccess, isUpdateGroupSuccess])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      style={{ marginRight: 30 }}
      onClick={closeGroupDrawer}
      disabled={isCreateGroupLoading || isUpdateGroupLoading}
    >
      Cancelar
    </Button>
    <Button
      onClick={onFinish}
      loading={isCreateGroupLoading || isUpdateGroupLoading}
      type='primary'
    >
      {group ? 'Editar' : 'Cadastrar'}
    </Button>
  </Row>

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={group ? 'Editar grupo' : 'Criar grupo'}
        width={350}
        open={openGroupDrawer}
        onClose={closeGroupDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
        forceRender
      >
        <Form
          layout="vertical"
          disabled={isCreateGroupLoading || isUpdateGroupLoading}
          form={form}
          initialValues={{
            title: group?.title ?? ''
          }}
        >
          <Col span={24}>
            <Form.Item
              name="title"
              label="Titulo"
              rules={[
                { required: true, message: 'Por favor, informe um titulo para o grupo' },
                { min: 3, message: 'O título deve ser maior ou igual a 3 caracteres' }
              ]}
            >
              <Input minLength={3} placeholder="Titulo" />
            </Form.Item>
          </Col>
        </Form>
      </Drawer>
    </>
  )
}
