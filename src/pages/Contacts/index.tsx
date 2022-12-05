import React, { useState, useEffect } from 'react'
import { Button, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import { ContactDrawer } from './contactDrawer'
import { useAppSelector } from '../../store/hooks'
import { useListContactsMutation } from '../../services/contact'
import { getUserIdByToken } from '../../helpers/jwt'

export const Contacts: React.FC = () => {
  const contacts = useAppSelector(state => state.listContactsSlice.contacts)
  const [listContacts, { isLoading }] = useListContactsMutation()
  const [openContactDrawer, setOpenContactDrawer] = useState(false)
  const [reload, setReload] = useState(false)
  const { Title } = Typography

  const loadContacts = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listContacts(iduser as string).unwrap()
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  useEffect(() => {
    if (reload) {
      void loadContacts()
    }
  }, [reload])

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
      />;
    </div>

    <ContactDrawer
      openContactDrawer={openContactDrawer}
      closeContactDrawer={() => setOpenContactDrawer(false)}
      reload={() => {
        setReload(true)
        setTimeout(() => {
          setReload(false)
        }, 300)
      }}
    />
  </>
}
