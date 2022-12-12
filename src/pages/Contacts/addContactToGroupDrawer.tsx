import { useEffect } from 'react'
import { Button, Drawer, message, Popconfirm, Row, Table, Typography } from 'antd'
import { NoticeType } from 'antd/es/message/interface'

import { IContact, useListContactsMutation } from '../../services/contact'
import { getUserIdByToken } from '../../helpers/jwt'
import { useAppSelector } from '../../store/hooks'
import { IGroup } from '../../services/group'
import { IAddContactToGroupRequest, useAddContactToGroupMutation } from '../../services/groupsRelationship'

interface IAddContactToGroupDrawerParams {
  openAddContactToGroupDrawer: boolean
  closeAddContactToGroupDrawer: () => void
  reload: () => void
  group: IGroup
}

interface IMessageProps {
  type: NoticeType
  message: string
}

interface IError {
  code: string
  message: string
  shortMessage: string
}

interface IErrorResponse {
  data: IError
}

export const AddContactToGroupDrawer: React.FC<IAddContactToGroupDrawerParams> = ({
  openAddContactToGroupDrawer,
  closeAddContactToGroupDrawer,
  reload,
  group
}: IAddContactToGroupDrawerParams) => {
  const [messageApi, contextHolder] = message.useMessage()
  const contacts = useAppSelector(state => state.listContactsSlice.contacts)
  const [listContacts, { isLoading }] = useListContactsMutation()
  const [addContactToGroup, {
    isLoading: isAddContactToGroupLoading,
    isSuccess,
    isError,
    error,
    reset: resetAddContactToGroup
  }] = useAddContactToGroupMutation()

  const loadContacts = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listContacts(iduser as string).unwrap()
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  const showMessage = async ({ type, message }: IMessageProps): Promise<void> => {
    await messageApi.open({
      type,
      content: message
    })
  }

  useEffect(() => {
    const code = error as IErrorResponse

    if (code?.data?.code === 'CTC-007') {
      void showMessage({
        type: 'error',
        message: 'O contato já possui um grupo marcado para esta data.'
      })

      resetAddContactToGroup()
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess) {
      void showMessage({
        type: 'success',
        message: 'Contato adicionado ao grupo com sucesso!'
      })
      reload()
      resetAddContactToGroup()
      closeAddContactToGroupDrawer()
    }
  }, [isSuccess])

  const confirmAddContactToGroup = async ({ idgroup, idcontact, iduser }: IAddContactToGroupRequest): Promise<void> => {
    await addContactToGroup({ idgroup, idcontact, iduser }).unwrap()
  }

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading}
      style={{ marginRight: 30 }}
      onClick={closeAddContactToGroupDrawer}
    >
      Cancelar
    </Button>
  </Row>

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: () => <Typography style={{ textAlign: 'end' }}>Ações</Typography>,
      dataIndex: 'idgroup',
      render: (_: string, record: IContact) =>
        contacts.length >= 1
          ? (
            <Row justify='end'>
              <Popconfirm
                title={'Deseja adicionar este contato ao grupo?'}
                onConfirm={async () => await confirmAddContactToGroup({
                  idcontact: record?.idcontact,
                  idgroup: group?.idgroup,
                  iduser: record?.iduser
                })}
                cancelText="Cancelar"
                okButtonProps={{
                  loading: isAddContactToGroupLoading
                }}
                okText="Confirmar"
              >
                <Button type='primary'>Adicionar</Button>
              </Popconfirm>
            </Row>
            )
          : null
    }
  ]

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={`Adicionar contato ao grupo: ${group?.title}`}
        width={520}
        onClose={closeAddContactToGroupDrawer}
        open={openAddContactToGroupDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
        forceRender
      >
        <Table
          dataSource={contacts}
          columns={columns}
          loading={isLoading}
          rowKey="idcontact"
        />
      </Drawer>
    </>
  )
}
