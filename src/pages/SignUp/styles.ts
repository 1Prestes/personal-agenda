import styled from 'styled-components'

export const Header = styled.header`
  width: 100%;
  padding: 20px 40px;
`

export const Banner = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)) center center / cover no-repeat fixed, url(https://images.unsplash.com/photo-1531214273921-f62327a9a822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  flex: 1;
  min-width: 320px;
`

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
`
