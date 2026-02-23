import { useState, useMemo } from "react";
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
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useBankAccount } from "../../hooks/useBankAccount";
import { useTransaction } from "../../hooks/useTransaction";
import { BankAccountModal } from "../../components/modals/BankAccountModal";
import { BANKS_LIST, getBankColor } from "../../utils/banks";
import type { BankAccount } from "../../types/BankAccount";
import type { Transaction } from "../../types/Transaction";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/** Calcula o saldo atual de uma conta: initialBalance + receitas pagas - despesas pagas */
function computeCurrentBalance(
  account: BankAccount,
  transactions: Transaction[]
): number {
  const linked = transactions.filter(
    (t) => t.bankAccountId === account.id && t.isPaid
  );
  const income = linked
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = linked
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return account.initialBalance + income - expense;
}

export function BankAccounts() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const { bankAccounts, isLoadingAccounts, deleteBankAccount } =
    useBankAccount();
  const { transactions } = useTransaction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [modal, modalContextHolder] = Modal.useModal();

  // Map accountId -> currentBalance
  const balanceMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const acc of bankAccounts) {
      map[acc.id] = computeCurrentBalance(acc, transactions);
    }
    return map;
  }, [bankAccounts, transactions]);

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

      {/* Lista de Contas */}
      <Row gutter={[16, 16]}>
        {bankAccounts.map((account) => {
          const bankColor = getBankColor(account.bankLogo);
          const creditCardsCount = account.creditCards?.length || 0;
          const currentBalance = balanceMap[account.id] ?? account.initialBalance;
          const balanceDiff = currentBalance - account.initialBalance;

          return (
            <Col xs={24} sm={12} lg={12} key={account.id}>
              <Card
                style={{ borderTop: `4px solid ${bankColor}` }}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleOpenEdit(account)} />,
                  <DeleteOutlined
                    key="delete"
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
                      {/* Saldo Atual (dinâmico) */}
                      <div>
                        <Flex align="center" gap={6} style={{ marginBottom: 2 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Saldo Atual
                          </Text>
                          {balanceDiff !== 0 && (
                            <Tooltip
                              title={`Saldo inicial: ${account.initialBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                            >
                              <Tag
                                color={balanceDiff >= 0 ? "success" : "error"}
                                style={{ fontSize: 10, padding: "0 4px", margin: 0 }}
                              >
                                {balanceDiff >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                                {Math.abs(balanceDiff).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Tag>
                            </Tooltip>
                          )}
                        </Flex>
                        <Statistic
                          value={currentBalance}
                          precision={2}
                          prefix="R$"
                          valueStyle={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: currentBalance < 0 ? "#ff4d4f" : "#1f1f1f",
                          }}
                        />
                      </div>

                      {/* Cartão de Crédito */}
                      {account.hasCreditCard && (
                        <div
                          style={{
                            background: "#f5f5f5",
                            padding: 12,
                            borderRadius: 8,
                          }}
                        >
                          <Flex align="center" gap="small" style={{ marginBottom: 8 }}>
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
                              {account.creditCardLimit?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </Text>
                          </Flex>

                          <Flex gap="small" style={{ fontSize: 12 }} vertical={isMobile}>
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
                                {creditCardsCount === 1 ? "cartão vinculado" : "cartões vinculados"}
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

      {/* Modal */}
      <BankAccountModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        accountToEdit={editingAccount}
      />
    </div>
  );
}
