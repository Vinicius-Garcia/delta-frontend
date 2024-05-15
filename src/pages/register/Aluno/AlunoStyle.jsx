import styled from 'styled-components'

const Wrapper = styled.div`
  padding-top: 6rem;
  padding-left: 6rem;
`
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const TitleTable = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const ButtonAddEquipamento = styled.button`
  border: none;
  background-color: #141bb0;
  height: 40px;
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  color: #fff;
  border-radius: 8px;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`
const ContainerRegister = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ButtonRegister = styled.button`
  border: none;
  background-color: ${(props) => (props.$cancel ? '#6d6a6a' : '#008f30')};
    height: 40px;
  padding: 1rem;
  color: #fff;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`
const ContainerTitleRegister = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export {
  Wrapper,
  Container,
  TitleTable,
  ButtonAddEquipamento,
  ContainerRegister,
  ButtonRegister,
  ContainerTitleRegister
}
