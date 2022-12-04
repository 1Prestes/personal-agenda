import React, { useEffect, useState } from 'react'
import { Badge, BadgeProps, Calendar, List, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import locale from 'antd/es/date-picker/locale/pt_BR'

import { IEvent, useListEventsMutation } from '../../services/events'
import { EventModalProps } from '../Home/EventModal'
import { useAppSelector } from '../../store/hooks'
import { getUserIdByToken } from '../../helpers/jwt'
import { Cell, EventLine, EventsContainer } from './styles'

const getMonthData = (value: Dayjs): number | undefined => {
  if (value.month() === 8) {
    return 1394
  }
}

export const Schedule: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventSelected, setEventSelected] = useState<IEvent>()
  const [value, setValue] = useState(() => dayjs())
  const events = useAppSelector(state => state.listEventsSlice.events)
  const [todaysEvents, setTodaysEvents] = useState<IEvent[]>()
  const [listEvents, { isLoading }] = useListEventsMutation()

  const { Title } = Typography

  const loadEvents = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listEvents(iduser as string).unwrap()
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  const onSelect = (newValue: Dayjs): void => {
    setValue(newValue)
  }

  const onPanelChange = (newValue: Dayjs): void => {
    setValue(newValue)
  }

  const monthCellRender = (value: Dayjs): JSX.Element | null => {
    const num = getMonthData(value)
    return num
      ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
        )
      : null
  }

  const handleEventClicked = (event: IEvent): void => {
    setEventSelected(event)
    setIsEventModalOpen(true)
  }

  useEffect(() => {
    if (events) {
      const eventsFiltered = events?.filter((event: IEvent) =>
        dayjs(event.initial_date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      )

      setTodaysEvents(eventsFiltered)
    }
  }, [events])

  const dateCellRender = (value: Dayjs): JSX.Element => {
    return (
      <Cell className="events">
        {events?.filter((event: IEvent) => dayjs(event.initial_date).format('YYYY-MM-DD') === dayjs(value).format('YYYY-MM-DD'))
          .map((event: IEvent) => (
            <EventLine onClick={() => handleEventClicked(event)} key={event?.idevent}>
              <Badge status={'success' as BadgeProps['status']} text={event?.title} />
            </EventLine>
          ))}
      </Cell>
    )
  }

  return <>
    <div style={{
      display: 'flex'
    }}>
      <Calendar
        style={{
          width: 'fit-content'
        }}
        value={value}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        locale={locale}
      />
      <EventsContainer>
        <Title level={4}>Eventos do dia</Title>
        <div style={{
          overflow: 'auto',
          height: '100vh'
        }}>
          <List
            style={{
              cursor: 'pointer'
            }}
            itemLayout="horizontal"
            dataSource={todaysEvents}
            loading={isLoading}
            renderItem={(event) => (
              <List.Item key={event.idevent}>
                <List.Item.Meta
                  title={event.title}
                  description={event.description}
                />
              </List.Item>
            )}
          />
        </div>
      </EventsContainer>
    </div>
    <EventModalProps
      isEventModalOpen={isEventModalOpen}
      event={eventSelected}
      close={() => setIsEventModalOpen(false)}
    />
  </>
}
