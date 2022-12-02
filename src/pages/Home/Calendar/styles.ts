import styled from 'styled-components'

export const Cell = styled.div``

export const EventLine = styled.li`
  &:hover {
    background: #cfffe2;
    border-radius: 4px;
    padding: 0 7px;
  }
`

export const EventsContainer = styled.div`
  width: 500px;
  padding: 10px 0 0 20px;
`


export const EventCard = styled.div`
  background-color: #ebf2f7;
  padding: 15px 10px;
  margin-top: 10px;
  border-radius: 0.375rem;
  transition: transform .2s;

  &:hover {
    z-index: 10;
    transform: scale(1.03);
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
    cursor: pointer;
  }
`
