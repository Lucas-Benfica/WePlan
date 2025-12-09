import { Card, Col, Row, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Visão Geral</h2>
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
        {/* Aqui virá a tabela de transações futuras */}
        <Card
          title="Últimas Transações"
          variant="borderless"
          style={{ width: "100%" }}
        >
          <p>Lista de transações virá aqui...</p>
        </Card>
      </div>
    </div>
  );
}
