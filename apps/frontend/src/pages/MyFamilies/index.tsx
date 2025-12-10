import { useState } from "react";
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  List,
  Avatar,
  Collapse,
  Tag,
  Tooltip,
  message,
  Flex,
} from "antd";
import {
  PlusOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
  DeleteOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useFamily } from "../../hooks/useFamily";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export function MyFamilies() {
  const {
    families,
    activeFamily,
    selectFamily,
    createFamily,
    joinFamily,
    removeMember,
  } = useFamily();
  const { user } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    joinForm.resetFields();
  };

  const handleCreateFamily = async (values: { name: string }) => {
    setLoadingAction(true);
    try {
      await createFamily(values.name);
      messageApi.success("Família criada com sucesso!");
      closeCreateModal();
    } catch (error) {
      messageApi.error("Erro ao criar família.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleJoinFamily = async (values: { familyId: string }) => {
    setLoadingAction(true);
    try {
      await joinFamily(values.familyId);
      messageApi.success("Você entrou na família com sucesso!");
      closeJoinModal();
    } catch (error) {
      messageApi.error("Código inválido ou você já participa desta família.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveMember = (
    familyId: string,
    memberId: string,
    memberName: string
  ) => {
    Modal.confirm({
      title: "Remover membro",
      icon: <ExclamationCircleOutlined />,
      content: `Tem certeza que deseja remover ${memberName} desta família?`,
      okText: "Sim, remover",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await removeMember(familyId, memberId);
          message.success("Membro removido com sucesso.");
        } catch (error) {
          message.error("Erro ao remover membro.");
          console.error(error);
        }
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    messageApi.success("Código copiado!");
  };

  const isUserAdmin = (familyMembers: any[]) => {
    const me = familyMembers.find((m) => m.userId === user?.id);
    return me?.role === "admin";
  };

  return (
    <div style={{ maxWidth: "80%", margin: "0 auto" }}>
      {contextHolder}

      {/* --- Cabeçalho --- */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Minhas Famílias
          </Title>
          <Text type="secondary">Gerencie seus grupos financeiros</Text>
        </div>
        <Flex gap="small">
          <Button
            icon={<UsergroupAddOutlined />}
            onClick={() => setIsJoinModalOpen(true)}
          >
            Entrar em Família
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Criar Nova
          </Button>
        </Flex>
      </Flex>

      {/* --- Lista de Famílias --- */}
      <Collapse accordion size="large" style={{ background: "#fff" }}>
        {families.map((family) => {
          const isAdmin = isUserAdmin(family.members || []);
          const isActive = activeFamily?.id === family.id;

          return (
            <Panel
              key={family.id}
              header={
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ width: "100%" }}
                >
                  <Flex align="center" gap="small">
                    <Text strong style={{ fontSize: 16 }}>
                      {family.name}
                    </Text>
                    {isActive && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        Ativa
                      </Tag>
                    )}
                    {isAdmin && <Tag color="blue">Admin</Tag>}
                  </Flex>

                  {/* Botão para Selecionar como Ativa (se não for a atual) */}
                  {!isActive && (
                    <Button
                      size="small"
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectFamily(family.id);
                        message.success(`Agora usando: ${family.name}`);
                      }}
                    >
                      Selecionar
                    </Button>
                  )}
                </Flex>
              }
            >
              {/* --- Conteúdo do Painel (Detalhes) --- */}

              {/* Código de Convite */}
              <Card
                size="small"
                title="Código de Convite"
                style={{ marginBottom: 16, background: "#f9f9f9" }}
              >
                <Flex justify="space-between" align="center">
                  <Text copyable={{ text: family.id }} code>
                    {family.id}
                  </Text>
                  <Button
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={() => copyToClipboard(family.id)}
                  >
                    Copiar
                  </Button>
                </Flex>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Compartilhe este código para convidar pessoas.
                </Text>
              </Card>

              {/* Lista de Membros */}
              <Title level={5}>Membros</Title>
              <List
                itemLayout="horizontal"
                dataSource={family.members}
                renderItem={(member: any) => (
                  <List.Item
                    actions={
                      isAdmin && member.userId !== user?.id
                        ? [
                            <Tooltip title="Remover membro" key={member.userId}>
                              <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  handleRemoveMember(
                                    family.id,
                                    member.userId,
                                    member.user.name
                                  )
                                }
                              />
                            </Tooltip>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<UserOutlined />}
                          style={{
                            backgroundColor: "#fde3cf",
                            color: "#f56a00",
                          }}
                        />
                      }
                      title={
                        <Flex gap="small" align="center">
                          <Text>{member.user.name}</Text>
                          {member.role === "admin" && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>
                              Admin
                            </Tag>
                          )}
                          {member.userId === user?.id && (
                            <Tag style={{ marginLeft: 8 }}>Você</Tag>
                          )}
                        </Flex>
                      }
                      description={member.user.email}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          );
        })}
      </Collapse>

      {/* --- Criar Família --- */}
      <Modal
        title="Criar Nova Família"
        open={isCreateModalOpen}
        onCancel={closeCreateModal}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateFamily}>
          <Form.Item
            name="name"
            label="Nome da Família"
            rules={[
              {
                required: true,
                message: "Dê um nome para sua família (ex: Casa, Viagem)",
              },
            ]}
          >
            <Input placeholder="Ex: Família Silva" />
          </Form.Item>
          <Flex justify="end" gap="small">
            <Button onClick={closeCreateModal}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loadingAction}>
              Criar Família
            </Button>
          </Flex>
        </Form>
      </Modal>

      {/* --- Entrar em Família --- */}
      <Modal
        title="Entrar em uma Família"
        open={isJoinModalOpen}
        onCancel={closeJoinModal}
        footer={null}
      >
        <Form form={joinForm} layout="vertical" onFinish={handleJoinFamily}>
          <Paragraph>
            Peça ao administrador da família o{" "}
            <strong>Código de Convite</strong> e cole abaixo.
          </Paragraph>
          <Form.Item
            name="familyId"
            label="Código de Convite (ID)"
            rules={[{ required: true, message: "Insira o código da família" }]}
          >
            <Input placeholder="Ex: 550e8400-e29b..." />
          </Form.Item>
          <Flex justify="end" gap="small">
            <Button onClick={closeJoinModal}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loadingAction}>
              Entrar
            </Button>
          </Flex>
        </Form>
      </Modal>
    </div>
  );
}
