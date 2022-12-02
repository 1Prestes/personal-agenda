import React from 'react';
import { Button, Descriptions, Modal, Typography } from 'antd';
import { FieldTimeOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { IEvent } from '../../../services/events';
import { BorderType, ModalContainer } from './styles';

interface IEventModalProps {
  isEventModalOpen: boolean
  close: () => void
  event?: IEvent
}

export const EventModalProps: React.FC<IEventModalProps> = ({ isEventModalOpen, close, event }) => {

  return (
    <>
      <Modal
        width={300}
        footer
        open={isEventModalOpen}
        onCancel={close}
      >
        <ModalContainer>
          <BorderType />
          <div style={{ padding: '10px 0' }}>
            <Descriptions.Item>
              <FieldTimeOutlined /> {dayjs(event?.initial_date).format('HH:mm')} - {dayjs(event?.final_date).format('HH:mm')}</Descriptions.Item>
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
        </ModalContainer>
      </Modal>
    </>
  );
};
