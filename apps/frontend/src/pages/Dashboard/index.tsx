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
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useFamily } from "../../hooks/useFamily";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { CreateFamilyModal } from "../../components/modals/CreateFamilyModal";
import { JoinFamilyModal } from "../../components/modals/JoinFamilyModal";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export function Dashboard() {
  const { families, isLoadingFamilies, activeFamily } = useFamily();
  const { user } = useAuth();

  // Estados para controlar os modais (reutilizáveis!)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Estado de Carregamento
  if (isLoadingFamilies) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" tip="Carregando informações da família..." />
      </div>
    );
  }

  // Estado "Primeiro Acesso" (Onboarding)
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

            <Flex
              gap="middle"
              style={{ marginTop: 24 }}
              wrap="wrap"
              justify="center"
            >
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

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Visão geral de <strong>{activeFamily?.name}</strong>
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless">
            <Statistic
              title="Saldo Atual"
              value={1128.93}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix="R$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless">
            <Statistic
              title="Receitas (Mês)"
              value={5000}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="R$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless">
            <Statistic
              title="Despesas (Mês)"
              value={3871}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="R$"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card
          title="Últimas Transações"
          variant="borderless"
          style={{ width: "100%" }}
        >
          <Empty description="Nenhuma transação registrada este mês." />
        </Card>
      </div>
    </div>
  );
}
