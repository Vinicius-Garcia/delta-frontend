import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/api'
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  ContainerCameras,
  ContainerStatus,
  ContainerModal,
  Container,
  TitleEquipment,
  TableWrapper,
  TableTr,
  TitleDescriptions,
  Camera,
  TitleEqp,
  ContainerCommands,
  ContainerStatusWithoutCamera,
  Tbody,
  Card,
  Button,
  ButtonCommands,
  ButtonCommandsHelp,
  Wrapper,
  TitleDescriptionsDiv,
  ImgCamera,
  Img,
  ButtonModalCommandConfirm,
  ButtonModalCommandCancel,
  ContainerButtonModal,
} from "./MonitoringStyle";
import Modal from "react-modal";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const Monitoring = () => {
 
  const navigateTo = useNavigate();
  const [listaEquipamentos, setListaEquipamentos] = useState([]);
  const [statusEquipamentos, setStatusEquipamentos] = useState([]);
  const [monitoramentoEquipamentos, setMonitoramentoEquipamentos] = useState(
    []
  );
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState({});
  const [modal, setModal] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [snapshotImages, setSnapshotImages] = useState([]);
  const [nomesModule, setNomeModule] = useState([]);
  const [modalUpdateInterval, setModalUpdateInterval] = useState(null);
  const [user, setUser] = useState({});
  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [fila, setFila] = useState([]);
  const [filaTela, setFilaTela] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [locations, setLocations] = useState([]);


  function closeModal() {
    setModal(false);
    if (modalUpdateInterval) {
      clearInterval(modalUpdateInterval);
      setModalUpdateInterval(null);
    }
  }

  function closeModalConfirmation() {
    setModalConfirmation(false);
  }

  useEffect(() => {
    const users = sessionStorage.getItem("user");
    if (users != null) {
      const usuario = JSON.parse(users);
      setUser(usuario);
      if (usuario.user_type == "PERTO") {
        getEquipments();
      } else {
        getEquipmentsByClient(usuario.client_id);
      }

      const intervalId = setInterval(() => {
        if (usuario.user_type == "PERTO") {
          getEquipments();
        } else {
          getEquipmentsByClient(usuario.client_id);
        }
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      navigateTo("/");
    }
  }, []);

  
  useEffect(() => {
    listaEquipamentos.forEach((valorFila)=>{
      if(fila.length == 0){
        getStatusEquipments(valorFila.IP)
      }else{
        const verificaSeTemNaFila =  fila.includes(valorFila.IP)
        if(!verificaSeTemNaFila){
          getEquipmentStatus(valorFila.IP)
        }
      }
    })
  }, [listaEquipamentos]);
  

  useEffect(() => {
    listaEquipamentos.forEach((valorFila) => {
      if (!fila.includes(valorFila.IP)) {
        getStatusEquipments(valorFila.IP);
      }
    });
  }, [listaEquipamentos]);



  async function getEquipments() {
    await api.get("/equipments").then((response) => {
      if (response.status == 200) {
        setListaEquipamentos(response.data);
      }
    });
  }

  async function getEquipmentsByClient(id) {
    await api.get("/equipments/" + id + "/").then((response) => {
      if (response.status == 200) {
        setListaEquipamentos(response.data);
        response.data.forEach((res) => {
          getStatusEquipments(res.IP, res.Id);
        });
      }
    });
  }

  function getStatusEquipments(ip, equipmentId) {
    setFila((old) => [...old, ip]);

    const ws = new WebSocket("ws://" + ip + ":2116/");

    ws.onopen = () => {
      const x = JSON.stringify("STA");
      ws.send(x);
    };

    ws.onerror = (e) => {
      setFila((prevFila) => prevFila.filter((data) => data !== ip));
      setStatusEquipamentos((prevFila) =>
        prevFila.filter((data) => data.EquipmentId !== equipmentId)
      );
    };

    ws.onmessage = (e) => {
      setFila((prevFila) => prevFila.filter((data) => data !== ip));

      const responseSocket = JSON.parse(e.data);
      setStatusEquipamentos((prevStatusEqps) => {
        const updatedStatusEqps = prevStatusEqps.map((status) => {
          if (status.EquipmentId === responseSocket.EquipmentId) {
            return responseSocket;
          }
          return status;
        });

        if (
          !updatedStatusEqps.some(
            (status) => status.EquipmentId === responseSocket.EquipmentId
          )
        ) {
          updatedStatusEqps.push(responseSocket);
        }

        return updatedStatusEqps;
      });
    };

    ws.onclose = () => {
      ws.close();
    };
  }

  function getEquipmentStatus(equipmentId) {
    const status = statusEquipamentos.find(
      (res) => res.EquipmentId === equipmentId
    );
    return status ? status.Status : "";
  }

  function abrirDetalhes(eqp) {
    setEquipamentoSelecionado(eqp);

    getMonitoramentoEquipments(eqp.IP).then((res) => {
      setMonitoramentoEquipamentos(res);
      setModal(true);
      const snapshotImagesArray = res
        .filter(
          (statusResponse) =>
            statusResponse.Module === "SNAPSHOT" && statusResponse.Image
        )
        .map((statusResponse) => statusResponse.Image);
      setSnapshotImages(snapshotImagesArray);
      var nomesModulos = [];
      res.forEach((nomes) => {
        if (nomesModulos.length == 0) {
          nomesModulos.push(nomes.Module);
        } else {
          if (nomesModulos.indexOf(nomes.Module) == -1) {
            nomesModulos.push(nomes.Module);
          }
        }
      });

      setNomeModule(nomesModulos);
      const updateIntervalId = setInterval(() => {
        getMonitoramentoEquipments(eqp.IP).then((updatedRes) => {
          if (!filaTela.includes(updatedRes)) {
            setMonitoramentoEquipamentos(updatedRes);
          }
          setMonitoramentoEquipamentos(updatedRes);
          const snapshotImagesArray = updatedRes
            .filter(
              (statusResponse) =>
                statusResponse.Module === "SNAPSHOT" && statusResponse.Image
            )
            .map((statusResponse) => statusResponse.Image);

          setSnapshotImages(snapshotImagesArray);
        });
      }, 2000);
      setModalUpdateInterval(updateIntervalId);
    });
  }

  function getMonitoramentoEquipments(ip) {
    return new Promise(async (resolve, reject) => {
      setFilaTela((old) => [...old, ip]);
      const ws = new WebSocket("ws://" + ip + ":2116");

      ws.onopen = () => {
        const x = JSON.stringify("MONITORAMENTO");
        ws.send(x);
      };

      ws.onerror = (e) => {
        setFilaTela((prevFila) => prevFila.filter((data) => data !== ip));

        reject(e);
      };

      ws.onmessage = (e) => {
        setFilaTela((prevFila) => prevFila.filter((data) => data !== ip));

        const responseWebSocket = JSON.parse(e.data);
        resolve(responseWebSocket);
      };

      ws.onclose = () => {
        ws.close();
      };
    });
  }




  function abrirModalCategoria() {
    setCategoriaModalOpen(true);
  }

  function command(comando, categoria) {
    useCommand(comando, equipamentoSelecionado.IP, user, categoria);
  }

  function enviarCategoria() {
    const comando = `TROCAR_CATEGORIA:${categoriaSelecionada}`;

    useCommand("CAT", equipamentoSelecionado.IP, user, 1);
    setCategoriaModalOpen(false);
  }


  async function getLocations() {
    try {
      const response = await api.get("/locations/list/");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Erro ao obter a lista de locais:", error);
      return [];
    }
  }

  const groupEquipmentsByLocalName = (equipments, locations) => {
    const groupedEquipments = {};
    equipments.forEach(equipment => {
      const location = locations.find(loc => loc.id === equipment.LocalID);
      const locationName = location ? location.name : "Local Desconhecido";
      if (!groupedEquipments[locationName]) {
        groupedEquipments[locationName] = [];
      }
      groupedEquipments[locationName].push(equipment);
    });
    return groupedEquipments;
  };

  useEffect(() => {
    async function fetchLocations() {
      const locationsData = await getLocations();
      setLocations(locationsData);
    }
    fetchLocations();
  }, []);
  
  

  return (
    <div>
      <DefaultLayout>
      {Object.keys(groupEquipmentsByLocalName(listaEquipamentos.filter(equipamento => equipamento.IndActive), locations)).map(localName => (
        <div key={localName}>
          <div className="text-center">
            <hr/>
            <h2>{localName}</h2>
            <hr/>
          </div>
          <div className="flex gap-4 ">
            {groupEquipmentsByLocalName(listaEquipamentos.filter(equipamento => equipamento.IndActive), locations)[localName].map((equipment, index) => (
              <Card key={index} onClick={() => abrirDetalhes(equipment)}>
                <Img error={getEquipmentStatus(equipment.Id)} />
                <TitleDescriptionsDiv>
                  <TitleDescriptions>{equipment.Name}</TitleDescriptions>
                </TitleDescriptionsDiv>
              </Card>
            ))}
          </div>
        </div>
      ))}
     
      </DefaultLayout>
      <Modal
  isOpen={modal}
  ariaHideApp={false}
  onRequestClose={closeModal}
  style={{
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgb(21, 20, 20, 0.8)",
      zIndex: 1000,
    },
    content: {
      position: "absolute",
      top: "1rem",
      left: "10%",
      width: "80%",
      maxWidth: "900px", // Set a maximum width for larger screens
      minWidth: "320px",
      textAlign: "center",
      margin: "0 auto",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      overflowY: "auto",
      maxHeight: "90vh",
      fontSize: "8px !important",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
    },
  }}
>
  <TitleEqp>
    <h2>
      {equipamentoSelecionado.Name} - {equipamentoSelecionado.IP}
    </h2>
    <CloseIcon
      onClick={() => closeModal()}
      sx={{ color: "red", cursor: "pointer" }}
    />
  </TitleEqp>
  <ContainerCommands>
    <ButtonCommands>CATEGORIZAR</ButtonCommands>
    <ButtonCommands>PRÓXIMO DA FILA</ButtonCommands>
    <ButtonCommands>LIMPAR FILA</ButtonCommands>
    <ButtonCommands>ISENTO</ButtonCommands>
    <ButtonCommands>VIOLAÇÃO</ButtonCommands>
    <ButtonCommandsHelp>AJUDA</ButtonCommandsHelp>
  </ContainerCommands>

  <ContainerModal>
    {snapshotImages.length > 0 ? (
      <>
        <ContainerModal >
          <ContainerCameras>
            {snapshotImages.map((image, index) => (
              <Camera key={index}>
                <ImgCamera
                  key={`image-${index}`} // Add a unique key
                  src={`data:image/png;base64,${image}`}
                  alt={`Camera ${index + 1}`}
                />
              </Camera>
            ))}
          </ContainerCameras>
          <ContainerStatus>
            {nomesModule.map((moduleName, ind) => (
              <div key={ind}>
                <TitleEquipment>{moduleName.toUpperCase()}</TitleEquipment>
                <TableWrapper>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>
                        <b>DESCRIÇÃO</b>
                      </TableCell>
                      <TableCell>
                        <b>STATUS</b>
                      </TableCell>
                      <TableCell>
                        <b>ULTIMA ALTERAÇÃO</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <Tbody>
                    {monitoramentoEquipamentos.map(
                      (statusResponse, index) => {
                        if (moduleName === statusResponse.Module) {
                          return (
                            <TableTr key={index}>
                              <TableCell>
                                {statusResponse.Status === "OK" ? (
                                  <CheckCircleIcon
                                    sx={{ color: "green" }}
                                  />
                                ) : statusResponse.Status === "ERRO" ? (
                                  <WarningIcon sx={{ color: "red" }} />
                                ) : (
                                  <InfoIcon sx={{ color: "orange" }} />
                                )}
                              </TableCell>
                              <TableCell>{statusResponse.Field}</TableCell>
                              <TableCell>{statusResponse.Value}</TableCell>
                              <TableCell>
                                {new Date(
                                  statusResponse.UpdatedDate
                                ).toLocaleString("pt-BR")}
                              </TableCell>
                            </TableTr>
                          );
                        }
                        return null;
                      }
                    )}
                  </Tbody>
                </TableWrapper>
              </div>
            ))}
          </ContainerStatus>
        </ContainerModal>
      </>
    ) : (
      <ContainerStatusWithoutCamera>
        {nomesModule.map((moduleName, ind) => (
          <div key={ind}>
            <TitleEquipment>{moduleName.toUpperCase()}</TitleEquipment>
            <TableWrapper>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>
                    <b>DESCRIÇÃO</b>
                  </TableCell>
                  <TableCell>
                    <b>STATUS</b>
                  </TableCell>
                  <TableCell>
                    <b>ULTIMA ALTERAÇÃO</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <Tbody>
                {monitoramentoEquipamentos.map(
                  (statusResponse, index) => {
                    if (moduleName === statusResponse.Module) {
                      return (
                        <TableTr key={index}>
                          <TableCell>
                            {statusResponse.Status === "OK" ? (
                              <CheckCircleIcon sx={{ color: "green" }} />
                            ) : statusResponse.Status === "ERRO" ? (
                              <WarningIcon sx={{ color: "red" }} />
                            ) : (
                              <InfoIcon sx={{ color: "orange" }} />
                            )}
                          </TableCell>
                          <TableCell>{statusResponse.Field}</TableCell>
                          <TableCell>{statusResponse.Value}</TableCell>
                          <TableCell>
                            {new Date(
                              statusResponse.UpdatedDate
                            ).toLocaleString("pt-BR")}
                          </TableCell>
                        </TableTr>
                      );
                    }
                    return null;
                  }
                )}
              </Tbody>
            </TableWrapper>
          </div>
        ))}
      </ContainerStatusWithoutCamera>
    )}
  </ContainerModal>
</Modal>

    
    </div>
     
  );
};

export default Monitoring;
