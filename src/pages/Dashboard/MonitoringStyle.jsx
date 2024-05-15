import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-left: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
`;
const ContainerModal = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    flex-direction: column; /* Change to column layout on smaller screens */
    align-items: center; /* Center content vertically */
  }
`;

const Wrapper = styled.div`
  padding-top: 1rem;
  padding-left: 6rem;
`;
const ContainerTitles = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const Card = styled.div`
  min-height: 140px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;
const getBackgroundImage = (error) => {
  if (error === "OK") {
    return "/img/eqp_green.png";
  } else if (error === "ALERTA") {
    return "/img/eqp.jpg";
  } else if (error === "ERRO") {
    return "/img/eqp_red.png";
  } else {
    return "/img/eqp_gray.png";
  }
};

const Img = styled.div`
  min-height: 90px;
  width: 60px;
  background-image: url(${(props) => getBackgroundImage(props.error)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  animation: ${(props) =>
    props.$error === "ERROR" ? "animate 1.2s linear infinite" : "none"};
`;
const Title = styled.div`
  text-align: center;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 0.75rem;
  gap: 1rem;
`;
const TitleEqp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: black;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
`;
const ContainerCommands = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: black;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;
const SubTitleEqp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: black;
`;
const TitleEquipment = styled.h2`
  width: 100%;
  text-align: center;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #5d5d5d;
  color: white;
  padding-top: 0.75rem;
  font-size: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Tbody = styled.tbody`
  width: 40%;
`;
const SubTitle = styled.div`
  width: 100%;
  margin-top: 1rem;
  font-size: 1.5rem;
`;

const Commands = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1rem;
  padding-bottom: 1rem;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1rem;
`;
const DetailsOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1rem;
  height: 40px;
  font-size: 1.5rem;
  padding: 0.5rem;
  text-align: center;
`;
const TitleDescriptions = styled.p`
  font-weight: bold;
  font-size: 10px;
`;
const TitleDescriptionsDiv = styled.div`
  width: 100%;
  min-width: 100px;
  text-align: center;
`;
const Paragraph = styled.p`
  text-align: center;
`;

const TableWrapper = styled.table`
  width: 100%;
`;
const TableTitles = styled.td`
  font-size: 1.2rem;
  font-weight: bold;
`;
const TableItens = styled.td`
  font-size: 1rem;
  text-align: center;
  padding: 10px;
  margin-right: 10px;
`;
const TableItensDatails = styled.td`
  font-size: 1rem;
  text-align: center;
  color: "#e68405";
  padding: 10px;
`;
const TableTr = styled.tr`
  border-bottom: 1px solid #e68405;
  padding-top: 0.5rem;
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: #0767ac;
  height: 40px;
  width: 180px;
  border-radius: 0.5rem;
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: #073658;
  }
  &:disabled {
    background-color: #e2e1e1;
    color: #818181;
  }
`;
const ButtonCommands = styled.button`
  background-color: #0767ac;
  height: 40px;
  width: 130px;
  border-radius: 0.5rem;
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 12px;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: #073658;
  }
  &:disabled {
    background-color: #e2e1e1;
    color: #818181;
  }
`;
const ButtonCommandsHelp = styled.button`
  background-color: #b81414;
  height: 40px;
  width: 130px;
  border-radius: 0.5rem;
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 12px;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: #861d1d;
  }
  &:disabled {
    background-color: #e2e1e1;
    color: #818181;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  border-radius: 8px;
  font-size: 14px;
  padding: 0px 10px;

  option {
    border-radius: 8px;
    color: black;
    background: white;
    font-weight: small;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;
const ContainerButtons = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: space-around;
  margin-top: 1rem;
  height: 40px;
  font-size: 1.5rem;
  padding: 0.5rem;
  text-align: left;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
`;
const Label = styled.label`
  text-align: left !important;
  font-size: 1.5rem;
  font-weight: bold;
`;
const InnerContainer = styled.div`
  flex: 1;
  width: 50%;
`;
const ColumnContainer = styled.div`
  width: 50%;
  max-height: 100%;
  overflow-y: auto;
`;
const ContainerCameras = styled(ColumnContainer)`
  width: 45%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 580px;
  overflow-y: auto;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
const ContainerStatus = styled(InnerContainer)`
  width: 45%;
  max-height: 600px;
  overflow-y: auto;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
const ContainerStatusWithoutCamera = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;
const Comandos = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
`;
const Camera = styled.div`
  width: 100%;
  height: 300px;
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImgCamera = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ButtonComando = styled.button`
  background-color: #212121;
  height: 40px;
  color: white;
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;
const ButtonModalCommandConfirm = styled.button`
  background-color: green;
  height: 40px;
  color: white;
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;
const ButtonModalCommandCancel = styled.button`
  background-color: red;
  height: 40px;
  color: white;
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;
const ContainerButtonModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

`
export {
  ButtonModalCommandConfirm,
  ButtonModalCommandCancel,
  ContainerButtonModal,
  ButtonComando,
  ButtonCommands,
  ButtonCommandsHelp,
  Comandos,
  ImgCamera,
  Camera,
  ContainerStatus,
  ContainerCameras,
  ContainerCommands,
  ContainerModal,
  Label,
  Card,
  StyledTextarea,
  Container,
  ContainerButtons,
  SubTitle,
  Title,
  Commands,
  Button,
  Select,
  Details,
  TitleEquipment,
  DetailsOptions,
  TitleDescriptions,
  Paragraph,
  TableWrapper,
  TableTitles,
  TableItens,
  ContainerStatusWithoutCamera,
  TableItensDatails,
  TableTr,
  ContainerTitles,
  Img,
  Tbody,
  Wrapper,
  TitleDescriptionsDiv,
  TitleEqp,
};
