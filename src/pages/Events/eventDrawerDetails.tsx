import React, { useEffect } from 'react'
import { Button, Descriptions, Drawer, Popconfirm, Row, Table, Typography } from 'antd'
import { FieldTimeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { IEvent } from '../../services/events'
import { useListContactsFromEventMutation } from '../../services/eventsRelationship'
import { useAppSelector } from '../../store/hooks'
import { IContact } from '../../services/contact'

interface IEventDrawerParams {
  openEventDrawerDetails: boolean
  closeEventDrawerDetails: () => void
  event: IEvent | undefined
}

export const EventDrawerDetails: React.FC<IEventDrawerParams> = ({
  openEventDrawerDetails,
  closeEventDrawerDetails,
  event
}: IEventDrawerParams) => {
  const [listContactsFromEvent, { isLoading }] = useListContactsFromEventMutation()
  const contacts = useAppSelector(state => state.listContactsFromEventSlice?.event.contacts)

  const loadEvents = async (): Promise<void> => {
    await listContactsFromEvent({
      idevent: event?.idevent as string,
      iduser: event?.iduser as string
    }).unwrap()
  }

  useEffect(() => {
    if (event && openEventDrawerDetails) {
      void loadEvents()
    }
  }, [event])

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      style={{ marginRight: 30 }}
      onClick={closeEventDrawerDetails}
    >
      Voltar
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
              title={'Deseja excluir este contato?'}
              onConfirm={() => console.log('excluir')}
              cancelText="Cancelar"
              okText="Confirmar"
            >
              <Button danger>Excluir</Button>
            </Popconfirm>
            )
          : null
    }
  ]

  return (
    <>
      <Drawer
        destroyOnClose={true}
        title={<>
          <Descriptions.Item>
            <FieldTimeOutlined /> {dayjs(event?.initial_date).add(3, 'hours').format('HH:mm')} - {dayjs(event?.final_date).add(3, 'hours').format('HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item>
            <Typography style={{
              whiteSpace: 'normal'
            }}>
              {event?.title}
            </Typography>
          </Descriptions.Item>
        </>}
        width={720}
        onClose={closeEventDrawerDetails}
        open={openEventDrawerDetails}
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
