import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  OutlinedInput,
  ListItemText,
} from "@mui/material";
import {
  Wrapper,
  Container,
  TitleTable,
  ButtonAddEquipamento,
  ContainerRegister,
  ButtonRegister,
  ContainerTitleRegister,
} from "./AlunoStyle.jsx";
import { TextField } from "@mui/material";
import Modal from "react-modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import api from "../../../api/api.ts";
import DefaultLayout from '../../../layout/DefaultLayout.tsx';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Aluno = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingEqp, setEditingEqp] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ip, setIp] = useState("");
  const [localId, setLocalId] = useState("");
  const [locals, setLocals] = useState([]);
  const [client, setClient] = useState([]);
  const [user, setUser] = useState([]);
  const [localName, setLocalName] = useState([]);
  const [clientName, setClientName] = useState([]);
  const [IndActive, setIndActive] = useState(0);

  
  const loadSelectOptions = async () => {
    // Carregue as opções de clientes
    const clientResponse = await api.get('/client');
    if (clientResponse.status === 200) {
      setClientOptions(clientResponse.data);
    } else {
      console.log(clientResponse.data);
    }
  
    // Carregue as opções de locais
    const localResponse = await api.get('/locations/list/');
    if (localResponse.status === 200) {
      setLocalOptions(localResponse.data);
    } else {
      console.log(localResponse.data);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocalName(value);
  };
  const handleChangeClient = (event) => {
    const {
      target: { value },
    } = event;
    setClientName(value);
  };
  const rowsPerPage = 10;
  const getLocals = (id) => {
    api.get("/locations/list/").then((res) => {
      if (res.status == 200) {
        console.log(res.data);
        setLocals(res.data);
      } else {
        console.log(res.data);
      }
    });
    console.log(id);
  };
  const getClients = () => {
    api.get("/client").then((res) => {
      if (res.status == 200) {
        setClient(res.data);
      } else {
        console.log(res.data);
      }
    });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function getEqpsAtt() {
    api.get("/equipments/").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }

  const handleOpenModal = () => {
    setEditingEqp(null);
    setName("");
    setDescription("");
    setIp("");
    setLocalId("");
    setClientName("");
    setLocalName("");
    setIndActive(0);
    setOpenModal(true);
    getClients();
    getLocals(user.client_id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getUser();
    const fetchData = async () => {
      api.get("/equipments/").then((res) => {
        setData(res.data);
      });
    };

    fetchData();
  }, []);

  const getUser = () => {
    const users = sessionStorage.getItem("user");
    setUser(users ? JSON.parse(users) : null);
    if (users !== null) {
      return JSON.parse(users);
    } else {
      return { user_type: "default" };
    }
  };
  const editEqp = (eqp) => {
    console.log(eqp)
    setEditingEqp(eqp);
    setName(eqp.Name);
    setDescription(eqp.Description);
    setIp(eqp.IP);
    getClients();
    setIndActive(eqp.IndActive);
    setClientName(eqp.ClientID);
    setLocalId(eqp.LocalID);
    setOpenModal(true);
    loadSelectOptions()
  };

  const deleteEqp = (Id) => {
    api
      .delete("/equipments/delete/" + Id + "/")
      .then((res) => {
        if (res.status == 200 || res.status == 204) {
          console.log(res);
          toast.success("Equipamento Removido com Sucesso");
          getEqpsAtt();
        } else {
          toast.success(res.data);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const addOrUpdateEqp = () => {
    if (!name || !description || !ip) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const eqpObject = {
      IP: ip,
      ClientID: clientName,
      LocalID: localName,
      IndActive: IndActive,
      Description: description,
      Name: name,
    };
    console.log(eqpObject);
    if (editingEqp) {
      api
        .put("/equipments/update/" + editingEqp.Id + "/", eqpObject)
        .then((res) => {
          // Atualiza o estado data com os valores atualizados
          setData((prevData) =>
            prevData.map((eqp) =>
              eqp.Id === editingEqp.Id ? { ...eqp, ...eqpObject } : eqp
            )
          );
          toast.success("Equipment updated successfully.");
          console.log(res);
          getEqpsAtt();
        })
        .catch((error) => {
          toast.error("An error occurred while updating equipment.");
          console.error(error);
        });
    } else {
      api
        .post("/equipments/", eqpObject)
        .then((res) => {
          toast.success("Equipment added successfully.");
          getEqpsAtt();
        })
        .catch((error) => {
          toast.error("An error occurred while adding equipment.");
        });
    }

    setOpenModal(false);
    setEditingEqp(null);
  };

  return (
    <DefaultLayout>
    <Wrapper>
      <Container>
        <Paper sx={{ width: "90%" }}>
          <TableContainer component={Paper} sx={{ padding: "1rem" }}>
            <TitleTable>
              <Typography variant="h4" gutterBottom>
                Alunos
              </Typography>
              <ButtonAddEquipamento onClick={handleOpenModal}>
                ADICIONAR
              </ButtonAddEquipamento>
            </TitleTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>NOME</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>TELEFONE</TableCell>
                  <TableCell>ENDEREÇO</TableCell>
                  <TableCell>FOTO</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>AÇÕES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((eqp) => (
                    <TableRow key={eqp.Id}>
                      <TableCell>{eqp.Id}</TableCell>
                      <TableCell>{eqp.Name}</TableCell>
                      <TableCell>{eqp.Description}</TableCell>
                      <TableCell>{eqp.IP}</TableCell>
                      <TableCell>{eqp.LocalID}</TableCell>
                      <TableCell>{eqp.ClientID}</TableCell>
                      <TableCell>{eqp.IndActive ? 'ATIVO' : 'INATIVO'}</TableCell>
                      <TableCell
                        sx={{ width: "auto", display: "flex", gap: "1rem" }}
                      >
                        <EditIcon
                          sx={{ color: "blue", cursor: "pointer" }}
                          onClick={() => {
                            editEqp(eqp);
                          }}
                        />

                        <DeleteIcon
                          sx={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            deleteEqp(eqp.Id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[rowsPerPage]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Paper>
      </Container>
      <Modal
        isOpen={openModal}
        ariaHideApp={false}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgb(21,20,20, 0.8)",
            zIndex: 1000,
          },
          content: {
            position: "absolute",
            top: "6rem",
            width: "30%",
            minWidth: "20rem",
            textAlign: "center",
            margin: "0 auto",
            bottom: "10rem",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
          },
        }}
      >
        <ContainerRegister>
          <ContainerTitleRegister>
            <div></div>
            <Typography variant="h4" gutterBottom>
              Cadastro de Alunos
            </Typography>
            <div></div>
          </ContainerTitleRegister>
          <TextField
            label="NOME"
            fullWidth
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="EMAIL"
            fullWidth
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="TELEFONE"
            fullWidth
            value={ip}
            required
            onChange={(e) => setIp(e.target.value)}
          />
          
         
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={IndActive}
            label="Status"
            onChange={(e) => setIndActive(e.target.value)}
          >
            <MenuItem value={'true'}>ATIVO</MenuItem>
            <MenuItem value={'false'}>INATIVO</MenuItem>
          </Select>
        </FormControl>

          <ButtonRegister onClick={addOrUpdateEqp}>
            {editingEqp ? "ATUALIZAR" : "CADASTRAR"}
          </ButtonRegister>
          <ButtonRegister $cancel={true} onClick={handleCloseModal}>
            CANCELAR
          </ButtonRegister>
        </ContainerRegister>
      </Modal>
    </Wrapper>
    </DefaultLayout>
  );
};

export default Aluno;
