import React, { useState } from 'react'
import { Button, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { ContactDrawer } from './contactDrawer'

export const Contacts: React.FC = () => {
  const [openContactDrawer, setOpenContactDrawer] = useState(false)
  const { Title } = Typography

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
        // dataSource={events}
        columns={columns}
        // loading={isLoading}
        rowKey="idcontact"
      />;
    </div>

    <ContactDrawer
      openContactDrawer={openContactDrawer}
      closeContactDrawer={() => setOpenContactDrawer(false)}
    />
  </>
}
