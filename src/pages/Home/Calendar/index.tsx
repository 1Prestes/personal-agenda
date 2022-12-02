import React, { useState } from 'react';
import { BadgeProps, Descriptions, Typography } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { FieldTimeOutlined } from '@ant-design/icons'

import { EventModalProps } from '../EventModal';
import { Cell, EventCard, EventLine, EventsContainer } from './styles';
import { useAppSelector } from '../../../store/hooks';
import { IEvent } from '../../../services/events';


const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 2:
      listData = [
        { type: 'warning', title: 'This is warning event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', title: 'This is warning event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is usual event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'error', title: 'This is error event.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', title: 'This is warning event', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'success', title: 'This is very long usual event。。....', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'error', title: 'This is error event 1.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'error', title: 'This is error event 2.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'error', title: 'This is error event 3.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
        { type: 'error', title: 'This is error event 4.', description: 'Role com a trupe para capturar a esfera de 5 estrelas.', initial_date: "2022-12-26T01:36:22.194Z", final_date: "2022-12-27T01:37:22.194Z", place: "Google meet" },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

export const Schedule: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState<IEvent>();
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const events = useAppSelector(state => state.listEventsSlice.events)

  const { Title } = Typography

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const handleEventClicked = (event: IEvent) => {
    setEventSelected(event)
    setIsEventModalOpen(true)
  }


  const dateCellRender = (value: Dayjs) => {
    return (
      <Cell className="events">
        {events?.filter(event => dayjs(event.initial_date).format('YYYY-MM-DD') === dayjs(value).format('YYYY-MM-DD'))
          .map((event) => (
            <EventLine onClick={() => handleEventClicked(event)} key={event?.title}>
              <Badge status={'success' as BadgeProps['status']} text={event?.title} />
            </EventLine>
          ))}
      </Cell>
    );
  };

  return <>
    <div style={{
      display: 'flex',
    }}>
      <Calendar
        style={{
          width: 'fit-content',
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
          height: '100vh',
        }}>
          {
            events?.filter(event =>
              dayjs(event.initial_date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
            )
              .map(event => <EventCard key={event.idevent}>
                <Descriptions.Item>
                  <FieldTimeOutlined /> {dayjs(eventSelected?.initial_date).format('HH:mm')} - {dayjs(event?.final_date).format('HH:mm')}</Descriptions.Item>
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
              </EventCard>)
          }
        </div>
      </EventsContainer>
    </div>
    <EventModalProps
      isEventModalOpen={isEventModalOpen}
      event={eventSelected}
      close={() => setIsEventModalOpen(false)}
    />
  </>
};

