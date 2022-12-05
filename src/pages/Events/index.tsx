import React, { useState, useEffect } from 'react'
import { Button, Popconfirm, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import { IEvent, useDeleteEventMutation, useListEventsMutation } from '../../services/events'
import { getUserIdByToken } from '../../helpers/jwt'
import { useAppSelector } from '../../store/hooks'
import { EventsContainer } from './styles'
import { EventDrawer } from './eventDrawer'
import { EventDrawerDetails } from './eventDrawerDetails'

interface IDeleteEvents {
  iduser: string
  idevent: string
}

export const Events: React.FC = () => {
  const events = useAppSelector(state => state.listEventsSlice.events)
  const [listEvents, { isLoading }] = useListEventsMutation()
  const [deleteEvent, { isLoading: isDeleteEventLoading, isSuccess }] = useDeleteEventMutation()
  const [openEventDrawer, setOpenEventDrawer] = useState(false)
  const [openEventDrawerDetails, setOpenEventDrawerDetails] = useState(false)
  const [reload, setReload] = useState(false)
  const [eventSelected, setEventSelected] = useState<IEvent>()

  const { Title } = Typography

  const loadEvents = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listEvents(iduser as string).unwrap()
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  useEffect(() => {
    if (isSuccess || reload) {
      void loadEvents()
    }
  }, [isSuccess, reload])

  const confirmDelete = async (payload: IDeleteEvents): Promise<void> => {
    await deleteEvent(payload).unwrap()
  }

  const columns = [
    {
      title: 'Titulo',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Local',
      dataIndex: 'place',
      key: 'local'
    },
    {
      title: 'Data Inicial',
      dataIndex: 'initial_date',
      key: 'initial_date',
      render: (value: Date) => dayjs(value).add(3, 'hours').format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Data Final',
      dataIndex: 'final_date',
      key: 'final_date',
      render: (value: Date) => dayjs(value).add(3, 'hours').format('DD/MM/YYYY HH:mm')
    },
    {
      title: () => <Typography style={{ textAlign: 'center' }}>Ações</Typography>,
      dataIndex: 'idevent',
      render: (_: string, record: IEvent) =>
        events.length >= 1
          ? (
            <Row justify='space-between' >
              <Popconfirm
                title={'Deseja excluir este evento?'}
                okButtonProps={{ loading: isDeleteEventLoading }}
                onConfirm={async () => await confirmDelete({ idevent: record?.idevent, iduser: record?.iduser })}
                cancelText="Cancelar"
                okText="Confirmar"
              >
                <Button danger>Excluir</Button>
              </Popconfirm>
              <Button
                type='primary'
                onClick={() => {
                  setEventSelected(record)
                  setOpenEventDrawer(true)
                }}
              >
                Editar
              </Button>

              <Button
                type='primary'
                onClick={() => {
                  setEventSelected(record)
                  setOpenEventDrawerDetails(true)
                }}
              >
                Visualizar evento
              </Button>
            </Row>
            )
          : null
    }
  ]

  return <>
    <div>
      <EventsContainer>
        <Row justify="space-between">
          <Title level={4}>Meus Eventos</Title>
          <Button type='primary' onClick={() => setOpenEventDrawer(true)}>Novo</Button>
        </Row>

        <Table
          dataSource={events}
          columns={columns}
          loading={isLoading}
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>
          }}
          rowKey="idevent"
        />;
      </EventsContainer>
    </div>

    <EventDrawer
      openEventDrawer={openEventDrawer}
      closeEventDrawer={() => {
        setOpenEventDrawer(false)
        setEventSelected(undefined)
      }}
      toEdit={eventSelected}
      reload={() => {
        setReload(true)
        setTimeout(() => {
          setReload(false)
        }, 300)
      }}
    />

    <EventDrawerDetails
      openEventDrawerDetails={openEventDrawerDetails}
      closeEventDrawerDetails={() => {
        setOpenEventDrawerDetails(false)
      }}
      event={eventSelected}
    />
  </>
}
