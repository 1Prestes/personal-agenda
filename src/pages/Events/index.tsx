import React, { useEffect, useState } from 'react';
import { Descriptions, Card, List, Typography } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { IEvent, useListEventsMutation } from '../../services/events';
import { getUserIdByToken } from '../../helpers/jwt';
import { useAppSelector } from '../../store/hooks';
import { BorderType, EventContainer, EventsContainer } from './styles';

export const Events: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState<IEvent>();
  const events = useAppSelector(state => state.listEventsSlice.events)
  const [listEvents, { isLoading }] = useListEventsMutation();

  const { Title } = Typography

  const loadEvents = async () => {
    const iduser = getUserIdByToken();

    await listEvents(iduser).unwrap()
  }

  useEffect(() => {
    loadEvents()
  }, [])

  return <>
    <div style={{
      display: 'flex',
      margin: '0 auto'
    }}>
      <EventsContainer>
        <Title level={4}>Meus Eventos</Title>
        <div style={{
          overflow: 'auto',
          width: 'max-content',
          height: '65vh'
        }}>
          <List
            style={{
              cursor: 'pointer',
            }}
            itemLayout="horizontal"
            dataSource={events}
            loading={isLoading}
            renderItem={(event) => (
              <Card
                key={event.idevent}
                //  bordered={false}
                hoverable
                style={{
                  width: 600,
                  margin: 20,
                }}
              >
                <EventContainer>
                  <BorderType />
                  <div style={{ padding: '10px 0' }}>
                    <Descriptions.Item>
                      <FieldTimeOutlined /> {dayjs(event?.initial_date).format('HH:mm')} - {dayjs(event?.final_date).format('HH:mm')}
                    </Descriptions.Item>
                    <Descriptions
                      title={<Typography style={{
                        whiteSpace: 'normal'
                      }}>
                        {event?.title}
                      </Typography>
                      }>
                      <Descriptions.Item>{event?.description}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions.Item>Local: {event?.place}</Descriptions.Item>
                  </div>
                </EventContainer>
              </Card>
            )}
          />
        </div>
      </EventsContainer>
    </div>
  </>
};

