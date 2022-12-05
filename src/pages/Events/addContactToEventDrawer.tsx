import React, { useEffect } from 'react'
import { Button, Drawer, message, Popconfirm, Row, Table, Typography } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

import { IContact, useListContactsMutation } from '../../services/contact'
import { getUserIdByToken } from '../../helpers/jwt'
import { useAppSelector } from '../../store/hooks'
import { IEvent } from '../../services/events'
import { IAddContactToEventRequest, useAddContactToEventMutation } from '../../services/eventsRelationship'

interface IAddContactToEventDrawerParams {
  openAddContactToEventDrawer: boolean
  closeAddContactToEventDrawer: () => void
  reload: () => void
  event: IEvent
}

interface IMessageProps {
  type: NoticeType
  message: string
}

export const AddContactToEventDrawer: React.FC<IAddContactToEventDrawerParams> = ({
  openAddContactToEventDrawer,
  closeAddContactToEventDrawer,
  reload,
  event
}: IAddContactToEventDrawerParams) => {
  const [messageApi, contextHolder] = message.useMessage()
  const contacts = useAppSelector(state => state.listContactsSlice.contacts)
  const [listContacts, { isLoading }] = useListContactsMutation()
  const [addContactToEvent, {
    isLoading: isAddContactToEventLoading,
    isSuccess,
    reset: resetAddContactToEvent
  }] = useAddContactToEventMutation()

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
    if (isSuccess) {
      void showMessage({
        type: 'success',
        message: 'Contato adicionado ao evento com sucesso!'
      })
      reload()
      resetAddContactToEvent()
      closeAddContactToEventDrawer()
    }
  }, [isSuccess])

  const confirmAddContactToEvent = async ({ idevent, idcontact, iduser }: IAddContactToEventRequest): Promise<void> => {
    await addContactToEvent({ idevent, idcontact, iduser }).unwrap()
  }

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      disabled={isLoading}
      style={{ marginRight: 30 }}
      onClick={closeAddContactToEventDrawer}
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
      title: 'Data de nascimento',
      dataIndex: 'bithDate',
      key: 'birthDate',
      render: (value: Date) => dayjs(value).add(3, 'hours').format('DD/MM/YYYY')
    },
    {
      title: 'Endereço',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: () => <Typography style={{ textAlign: 'center' }}>Ações</Typography>,
      dataIndex: 'idevent',
      render: (_: string, record: IContact) =>
        contacts.length >= 1
          ? (
            <Popconfirm
              title={'Deseja adicionar este contato ao evento?'}
              onConfirm={async () => await confirmAddContactToEvent({
                idcontact: record.idcontact,
                idevent: event.idevent,
                iduser: record.iduser
              })}
              cancelText="Cancelar"
              okButtonProps={{
                loading: isAddContactToEventLoading
              }}
              okText="Confirmar"
            >
              <Button type='primary'>Adicionar</Button>
            </Popconfirm>
            )
          : null
    }
  ]

  return (
    <>
      {contextHolder}
      <Drawer
        destroyOnClose={true}
        title={'Adicionar contato ao evento'}
        width={520}
        onClose={closeAddContactToEventDrawer}
        open={openAddContactToEventDrawer}
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
