import { useState } from "react";
import {
  Typography,
  Button,
  Table,
  Tag,
  Flex,
  Statistic,
  Row,
  Col,
  Card,
  Tooltip,
  Modal,
  Empty,
  Grid,
} from "antd";
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTransaction } from "../../hooks/useTransaction";
import { TransactionModal } from "../../components/modals/TransactionModal";
import type { Transaction } from "../../types/Transaction";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function Transactions() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const {
    transactions,
    isLoadingTransactions,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    deleteTransaction,
  } = useTransaction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [modal, modalContextHolder] = Modal.useModal();

  // --- Navigation ---
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // --- Actions ---
  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    modal.confirm({
      title: "Excluir Transação",
      icon: <ExclamationCircleOutlined />,
      content: `Tem certeza que deseja excluir "${transaction.description}"?`,
      okText: "Sim, excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        await deleteTransaction(transaction.id);
      },
    });
  };

  // --- Summary ---
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // --- Table ---
  const columns: ColumnsType<Transaction> = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (date: string) =>
        new Date(date).toLocaleDateString("pt-BR"),
      sorter: (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (desc: string, record) => (
        <Flex align="center" gap={8}>
          {record.type === "income" ? (
            <ArrowUpOutlined style={{ color: "#52c41a", flexShrink: 0 }} />
          ) : (
            <ArrowDownOutlined style={{ color: "#ff4d4f", flexShrink: 0 }} />
          )}
          <Text ellipsis={{ tooltip: desc }}>{desc}</Text>
        </Flex>
      ),
    },
    {
      title: "Categoria",
      dataIndex: ["category", "name"],
      key: "category",
      responsive: ["md"],
      render: (name: string, record) => (
        <Tag color={record.category?.color ?? "default"}>{name}</Tag>
      ),
    },
    {
      title: "Conta",
      dataIndex: ["bankAccount", "name"],
      key: "bankAccount",
      responsive: ["lg"],
      render: (name?: string) => name ?? <Text type="secondary">—</Text>,
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 130,
      render: (amount: number, record) => (
        <Text
          strong
          style={{ color: record.type === "income" ? "#52c41a" : "#ff4d4f" }}
        >
          {record.type === "expense" ? "- " : "+ "}
          {amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 110,
      align: "center",
      responsive: ["sm"],
      render: (isPaid: boolean, record) =>
        isPaid ? (
          <Tag color="success">Pago</Tag>
        ) : (
          <Tag color={record.type === "income" ? "blue" : "warning"}>
            Pendente
          </Tag>
        ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Flex gap={4} justify="center">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {modalContextHolder}

      {/* ── Header ── */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap="small"
        style={{ marginBottom: 24 }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Transações
          </Title>
          <Text type="secondary">Receitas e despesas da família</Text>
        </div>

        <Flex align="center" gap="small">
          {/* Month/Year navigator */}
          <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
          <Text strong style={{ minWidth: 140, textAlign: "center", fontSize: 15 }}>
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </Text>
          <Button icon={<RightOutlined />} onClick={handleNextMonth} />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            {!isMobile && "Nova Transação"}
          </Button>
        </Flex>
      </Flex>

      {/* ── Summary Cards ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderTop: "3px solid #52c41a" }}>
            <Statistic
              title="Total Receitas"
              value={totalIncome}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderTop: "3px solid #ff4d4f" }}>
            <Statistic
              title="Total Despesas"
              value={totalExpense}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderTop: `3px solid ${balance >= 0 ? "#1890ff" : "#fa8c16"}`,
            }}
          >
            <Statistic
              title="Saldo do Mês"
              value={balance}
              precision={2}
              prefix="R$"
              valueStyle={{ color: balance >= 0 ? "#1890ff" : "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Table ── */}
      <Card bordered={false}>
        <Table<Transaction>
          dataSource={transactions}
          columns={columns}
          rowKey="id"
          loading={isLoadingTransactions}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={`Nenhuma transação em ${MONTHS[selectedMonth - 1]} ${selectedYear}.`}
              >
                <Button type="primary" onClick={handleOpenCreate}>
                  Adicionar Transação
                </Button>
              </Empty>
            ),
          }}
          rowClassName={(record) =>
            record.type === "income" ? "row-income" : "row-expense"
          }
        />
      </Card>

      {/* ── Modal ── */}
      <TransactionModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
}
