import { useState } from "react";
import {
  Typography,
  Button,
  Row,
  Col,
  Card,
  Statistic,
  Flex,
  Tag,
  Empty,
  Grid,
  Modal,
  Tooltip,
  Divider,
} from "antd";
import {
  PlusOutlined,
  CreditCardOutlined,
  BankOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useBankAccount } from "../../hooks/useBankAccount";
import { BankAccountModal } from "../../components/modals/BankAccountModal";
import { BANKS_LIST, getBankColor } from "../../utils/banks";
import type { BankAccount } from "../../types/BankAccount";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export function BankAccounts() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const { bankAccounts, isLoadingAccounts, deleteBankAccount } =
    useBankAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );

  const [modal, modalContextHolder] = Modal.useModal();

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = (account: BankAccount) => {
    modal.confirm({
      title: "Excluir Conta",
      icon: <ExclamationCircleOutlined />,
      content: `Tem certeza que deseja excluir a conta "${account.name}"? Isso não pode ser desfeito.`,
      okText: "Sim, excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        await deleteBankAccount(account.id);
      },
    });
  };

  const getBankName = (bankValue: string) => {
    return BANKS_LIST.find((b) => b.value === bankValue)?.label || bankValue;
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {modalContextHolder}
      {/* Cabeçalho */}
      <Flex
        vertical={isMobile}
        justify="space-between"
        gap="small"
        align="center"
        style={{ marginBottom: 24 }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Minhas Contas
          </Title>
          <Text type="secondary">Gerencie saldos e cartões de crédito</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Nova Conta
        </Button>
      </Flex>

      {/* Lista de Contas (Grid) */}
      <Row gutter={[16, 16]}>
        {bankAccounts.map((account) => {
          const bankColor = getBankColor(account.bankLogo);
          const creditCardsCount = account.creditCards?.length || 0;

          return (
            <Col xs={24} sm={12} lg={12} key={account.id}>
              <Card
                //hoverable
                style={{ borderTop: `4px solid ${bankColor}` }}
                actions={[
                  <EditOutlined onClick={() => handleOpenEdit(account)} />,
                  <DeleteOutlined
                    style={{ color: "#ff4d4f" }}
                    onClick={() => handleDelete(account)}
                  />,
                ]}
              >
                <Card.Meta
                  avatar={
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: bankColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 24,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      <BankOutlined />
                    </div>
                  }
                  title={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* Nome da Conta */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                        }}
                      >
                        {account.name}
                      </Text>
                      {/* Nome do Banco */}
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, fontWeight: 400, marginTop: 2 }}
                      >
                        {getBankName(account.bank)}
                      </Text>
                    </div>
                  }
                  description={
                    <Flex vertical gap="middle" style={{ marginTop: 20 }}>
                      {/* Saldo */}
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Saldo Disponível
                        </Text>
                        <Statistic
                          value={account.initialBalance}
                          precision={2}
                          prefix="R$"
                          valueStyle={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#1f1f1f",
                          }}
                        />
                      </div>

                      {/* Seção de Cartão de Crédito */}
                      {account.hasCreditCard && (
                        <div
                          style={{
                            background: "#f5f5f5",
                            padding: 12,
                            borderRadius: 8,
                          }}
                        >
                          <Flex
                            align="center"
                            gap="small"
                            style={{ marginBottom: 8 }}
                          >
                            <CreditCardOutlined style={{ color: bankColor }} />
                            <Text strong style={{ fontSize: 13 }}>
                              Cartão de Crédito
                            </Text>
                          </Flex>

                          <Flex style={{ marginBottom: 4 }} gap="small">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Limite Total
                            </Text>
                            <Text strong>
                              R${" "}
                              {account.creditCardLimit?.toLocaleString(
                                "pt-BR",
                                { minimumFractionDigits: 2 }
                              )}
                            </Text>
                          </Flex>

                          <Flex
                            gap="small"
                            style={{ fontSize: 12, color: "#595959" }}
                            vertical={isMobile}
                          >
                            <Tag icon={<CalendarOutlined />}>
                              Fecha dia {account.invoiceClosingDay}
                            </Tag>
                            <Tag icon={<CalendarOutlined />}>
                              Vence dia {account.invoiceDueDay}
                            </Tag>
                          </Flex>

                          {creditCardsCount > 0 && (
                            <>
                              <Divider style={{ margin: "8px 0" }} />
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {creditCardsCount}{" "}
                                {creditCardsCount === 1
                                  ? "cartão vinculado"
                                  : "cartões vinculados"}
                              </Text>
                            </>
                          )}
                        </div>
                      )}
                    </Flex>
                  }
                />
              </Card>
            </Col>
          );
        })}

        {/* Estado Vazio */}
        {!isLoadingAccounts && bankAccounts.length === 0 && (
          <Col span={24}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Nenhuma conta cadastrada nesta família."
            >
              <Button type="primary" onClick={handleOpenCreate}>
                Cadastrar Primeira Conta
              </Button>
            </Empty>
          </Col>
        )}
      </Row>

      {/* Modal (Criação e Edição) */}
      <BankAccountModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false), setEditingAccount(null);
        }}
        accountToEdit={editingAccount}
      />
    </div>
  );
}
