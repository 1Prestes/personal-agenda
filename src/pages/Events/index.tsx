import React, { useState, useEffect } from 'react'
import { Button, Popconfirm, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import { IEvent, useDeleteEventMutation, useListEventsMutation } from '../../services/events'
import { getUserIdByToken } from '../../helpers/jwt'
import { useAppSelector } from '../../store/hooks'
import { EventsContainer } from './styles'
import { CreateEventDrawer } from './createEventDrawer'

interface IDeleteEvents {
  iduser: string
  idevent: string
}

export const Events: React.FC = () => {
  const events = useAppSelector(state => state.listEventsSlice.events)
  const [listEvents, { isLoading }] = useListEventsMutation()
  const [deleteEvent, { isLoading: isDeleteEventLoading, isSuccess }] = useDeleteEventMutation()
  const [openCreateEventDrawer, setOpenCreateEventDrawer] = useState(false)
  const [reload, setReload] = useState(false)

  const { Title } = Typography

  const loadEvents = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listEvents(iduser as string).unwrap()
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      void loadEvents()
    }
  }, [isSuccess])

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
      render: (value: Date) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: 'Data Final',
      dataIndex: 'final_date',
      key: 'final_date',
      render: (value: Date) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: 'Ações',
      dataIndex: 'idevent',
      render: (_: string, record: IEvent) =>
        events.length >= 1
          ? (
            <Popconfirm
              title={'Deseja excluir este evento?'}
              okButtonProps={{ loading: isDeleteEventLoading }}
              onConfirm={async () => await confirmDelete({ idevent: record?.idevent, iduser: record?.iduser })}
              cancelText="Cancelar"
              okText="Confirmar"
            >
              <Button danger>Excluir</Button>
            </Popconfirm>)
          : null
    }
  ]

  return <>
    <div style={{
    }}>
      <EventsContainer>
        <Row justify="space-between">
          <Title level={4}>Meus Eventos</Title>
          <Button type='primary' onClick={() => setOpenCreateEventDrawer(true)}>Novo</Button>
        </Row>

        <Table
          dataSource={events}
          columns={columns}
          loading={isLoading || reload}
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>
          }}
          rowKey="idevent"
        />;
      </EventsContainer>
    </div>

    <CreateEventDrawer
      openCreateEventDrawer={openCreateEventDrawer}
      closeCreateEventDrawer={() => setOpenCreateEventDrawer(false)}
      reload={() => {
        setReload(true)
        setTimeout(() => {
          setReload(false)
        }, 300)
      }}
    />
  </>
}
