import React, { useState, useEffect } from 'react'
import { Button, Popconfirm, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import { ContactDrawer } from './contactDrawer'
import { useAppSelector } from '../../store/hooks'
import { IContact, useDeleteContactMutation, useListContactsMutation } from '../../services/contact'
import { getUserIdByToken } from '../../helpers/jwt'

interface IDeleteContact {
  idcontact: string
  iduser: string
}

export const Contacts: React.FC = () => {
  const contacts = useAppSelector(state => state.listContactsSlice.contacts)
  const [listContacts, { isLoading }] = useListContactsMutation()
  const [deleteContact, { isLoading: isDeleteContactLoading, isSuccess: isDeleceContactSuccess }] = useDeleteContactMutation()
  const [openContactDrawer, setOpenContactDrawer] = useState(false)
  const [selectedContact, setSelectedContact] = useState<IContact>()
  const [reload, setReload] = useState(false)
  const { Title } = Typography

  const loadContacts = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listContacts(iduser as string).unwrap()
  }

  const confirmDelete = async (payload: IDeleteContact): Promise<void> => {
    await deleteContact(payload).unwrap()
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  useEffect(() => {
    if (isDeleceContactSuccess || reload) {
      void loadContacts()
    }
  }, [isDeleceContactSuccess, reload])

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Data de nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
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
            <Row justify='center'>
              <Popconfirm
                title={'Deseja excluir este contato?'}
                okButtonProps={{ loading: isDeleteContactLoading }}
                onConfirm={async () => await confirmDelete({ idcontact: record?.idcontact, iduser: record?.iduser })}
                cancelText="Cancelar"
                okText="Confirmar"
              >
                <Button danger style={{ marginRight: 20 }}>Excluir</Button>
              </Popconfirm>
              <Button
                type='primary'
                onClick={() => {
                  setSelectedContact(record)
                  setOpenContactDrawer(true)
                }}
              >
                Editar
              </Button>
            </Row>
            )
          : null
    }
  ]

  return <>
    <div style={{ padding: 10 }}>
      <Row justify="space-between">
        <Title level={4}>Meus Contatos</Title>
        <Button type='primary' onClick={() => setOpenContactDrawer(true)}>Novo</Button>
      </Row>

      <Table
        dataSource={contacts}
        columns={columns}
        loading={isLoading}
        rowKey="idcontact"
      />
    </div>

    <ContactDrawer
      openContactDrawer={openContactDrawer}
      closeContactDrawer={() => {
        setSelectedContact(undefined)
        setOpenContactDrawer(false)
      }}
      contact={selectedContact}
      reload={() => {
        setReload(true)
        setTimeout(() => {
          setReload(false)
        }, 300)
      }}
    />
  </>
}
