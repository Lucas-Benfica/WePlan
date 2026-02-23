import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Button,
  Spin,
  Empty,
  Flex,
  Grid,
  List,
  Tag,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  SmileOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useFamily } from "../../hooks/useFamily";
import { useAuth } from "../../hooks/useAuth";
import { useBankAccount } from "../../hooks/useBankAccount";
import { useTransaction } from "../../hooks/useTransaction";
import { useState, useMemo } from "react";
import { CreateFamilyModal } from "../../components/modals/CreateFamilyModal";
import { JoinFamilyModal } from "../../components/modals/JoinFamilyModal";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const BRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

export function Dashboard() {
  const { families, isLoadingFamilies, activeFamily } = useFamily();
  const { user } = useAuth();
  const { bankAccounts } = useBankAccount();
  const { transactions, isLoadingTransactions, selectedMonth, selectedYear } =
    useTransaction();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // ── Computed stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const accountBalance = (accountId: string) => {
      const linked = transactions.filter(
        (t) => t.bankAccountId === accountId && t.isPaid
      );
      const income = linked
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expense = linked
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return income - expense;
    };

    const totalBalance = bankAccounts.reduce(
      (s, acc) => s + acc.initialBalance + accountBalance(acc.id),
      0
    );

    const monthlyIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const monthlyExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return { totalBalance, monthlyIncome, monthlyExpense, recent };
  }, [bankAccounts, transactions]);

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoadingFamilies) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Spin size="large" tip="Carregando informações da família..." />
      </div>
    );
  }

  // ── Onboarding ───────────────────────────────────────────────────────
  if (families.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}>
        <Card>
          <Flex vertical align="center" gap="middle" style={{ padding: 40 }}>
            <SmileOutlined style={{ fontSize: 64, color: "#1890ff" }} />
            <Title level={2}>Olá, {user?.name}!</Title>
            <Text type="secondary" style={{ fontSize: 16, maxWidth: 500 }}>
              Bem-vindo ao WePlan. Para começar a gerenciar suas finanças, você
              precisa criar sua primeira família ou entrar em uma existente.
            </Text>
            <Flex gap="middle" style={{ marginTop: 24 }} wrap="wrap" justify="center">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Criar minha primeira Família
              </Button>
              <Button
                size="large"
                icon={<UsergroupAddOutlined />}
                onClick={() => setIsJoinModalOpen(true)}
              >
                Entrar com código de convite
              </Button>
            </Flex>
          </Flex>
        </Card>

        <CreateFamilyModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          isMobile={isMobile}
        />
        <JoinFamilyModal
          open={isJoinModalOpen}
          onCancel={() => setIsJoinModalOpen(false)}
          isMobile={isMobile}
        />
      </div>
    );
  }

  // ── Main Dashboard ───────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Visão geral de <strong>{activeFamily?.name}</strong>
          {" — "}
          {MONTHS[selectedMonth - 1]} {selectedYear}
        </Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderTop: "3px solid #1890ff" }}>
            <Statistic
              title="Saldo Total (todas as contas)"
              value={stats.totalBalance}
              precision={2}
              prefix="R$"
              valueStyle={{
                color: stats.totalBalance >= 0 ? "#1890ff" : "#ff4d4f",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderTop: "3px solid #52c41a" }}>
            <Statistic
              title="Receitas do Mês"
              value={stats.monthlyIncome}
              precision={2}
              prefix={<ArrowUpOutlined />}
              suffix="R$"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderTop: "3px solid #ff4d4f" }}>
            <Statistic
              title="Despesas do Mês"
              value={stats.monthlyExpense}
              precision={2}
              prefix={<ArrowDownOutlined />}
              suffix="R$"
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <div style={{ marginTop: 24 }}>
        <Card
          title="Últimas Transações"
          variant="borderless"
          loading={isLoadingTransactions}
          extra={
            <Button type="link" onClick={() => navigate("/transactions")}>
              Ver todas
            </Button>
          }
        >
          {stats.recent.length === 0 ? (
            <Empty description="Nenhuma transação registrada este mês." />
          ) : (
            <List
              dataSource={stats.recent}
              renderItem={(t) => (
                <List.Item
                  key={t.id}
                  extra={
                    <Text
                      strong
                      style={{
                        color: t.type === "income" ? "#52c41a" : "#ff4d4f",
                        fontSize: 15,
                      }}
                    >
                      {t.type === "income" ? "+" : "−"} {BRL(t.amount)}
                    </Text>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background:
                            t.type === "income"
                              ? "rgba(82,196,26,0.1)"
                              : "rgba(255,77,79,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {t.type === "income" ? (
                          <ArrowUpOutlined style={{ color: "#52c41a" }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
                        )}
                      </div>
                    }
                    title={
                      <Flex align="center" gap={8}>
                        <Text style={{ fontWeight: 500 }}>{t.description}</Text>
                        {t.category && (
                          <Tag
                            color={t.category.color ?? "default"}
                            style={{ fontSize: 10 }}
                          >
                            {t.category.name}
                          </Tag>
                        )}
                      </Flex>
                    }
                    description={
                      <Flex align="center" gap={6}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(t.date).toLocaleDateString("pt-BR")}
                        </Text>
                        {t.bankAccount && (
                          <>
                            <Text type="secondary">·</Text>
                            <BankOutlined style={{ color: "#8c8c8c", fontSize: 11 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {t.bankAccount.name}
                            </Text>
                          </>
                        )}
                        <Tag
                          color={t.isPaid ? "success" : "warning"}
                          style={{ fontSize: 10, padding: "0 4px" }}
                        >
                          {t.isPaid ? "Pago" : "Pendente"}
                        </Tag>
                      </Flex>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
