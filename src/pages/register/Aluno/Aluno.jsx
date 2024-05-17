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
  const [editingAluno, setEditingAluno] = useState(null);
  const [name, setName] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [id, setId] = useState();

  

  const rowsPerPage = 10;


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function getAlunos() {
    api.get("/alunos/").then((res) => {
      setData(res.data);
    });
  }

  const handleOpenModal = () => {
    setEditingAluno(null);
    setName("");
    setEmail("");
    setId()
    setTelefone("");
    setEndereco("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getAlunos() 
  }, []);


  const editAlunos = (item) => {
    console.log(item)
    setName(item.nome);
    setEmail(item.email);
    setTelefone(item.telefone);
    setEndereco(item.endereco);
    setId(item.id)
    setEditingAluno(item)
    setOpenModal(true);
  };

  const deleteAlunos= (Id) => {
    api
      .delete("/alunos/delete/" + Id + "/")
      .then((res) => {
        if (res.status == 200 || res.status == 204) {
          console.log(res);
          toast.success("Aluno Removido com Sucesso");
          getAlunos();
        } else {
          toast.success(res.data);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const addOrUpdateAlunos = () => {
    if (!name || !email || !telefone || !endereco) {
      toast.error("Campos em branco.");
      return;
    }

    const objetoAluno = {
      nome : name,
      email : email,
      endereco : endereco,
      telefone : telefone
    };
    if (editingAluno) {
      api
        .put("/alunos/update/" + id + "/", objetoAluno)
        .then((res) => {
          // Atualiza o estado data com os valores atualizados
          setData((prevData) =>
            prevData.map((eqp) =>
              eqp.Id === editingAluno.Id ? { ...eqp, ...objetoAluno } : eqp
            )
          );
          toast.success("Aluno atualizado com sucesso.");
          console.log(res);
          getAlunos();
        })
        .catch((error) => {
          toast.error("Um erro ocorreu ao atualizar o aluno.");
          console.error(error);
        });
    } else {
      api
        .post("/alunos/", objetoAluno)
        .then((res) => {
          toast.success("Aluno Adicionado com Sucesso.");
          getAlunos();
        })
        .catch((error) => {
          toast.error("Erro ao adicionar o aluno.");
        });
    }

    setOpenModal(false);
    setEditingAluno(null);
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
                  <TableCell>AÇÕES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.telefone}</TableCell>
                      <TableCell>{item.endereco}</TableCell>
                      <TableCell
                        sx={{ width: "auto", display: "flex", gap: "1rem" }}
                      >
                        <EditIcon
                          sx={{ color: "blue", cursor: "pointer" }}
                          onClick={() => {
                            editAlunos(item);
                          }}
                        />

                        <DeleteIcon
                          sx={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            deleteAlunos(item.id);
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
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="TELEFONE"
            fullWidth
            value={telefone}
            required
            onChange={(e) => setTelefone(e.target.value)}
          />
          <TextField
            label="ENDEREÇO"
            fullWidth
            value={endereco}
            required
            onChange={(e) => setEndereco(e.target.value)}
          />
  

          <ButtonRegister onClick={addOrUpdateAlunos}>
            {editingAluno ? "ATUALIZAR" : "CADASTRAR"}
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
