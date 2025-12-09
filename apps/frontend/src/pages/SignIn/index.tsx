import {
  Button,
  Form,
  Input,
  Typography,
  Row,
  Col,
  theme,
  message,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

interface SignInFormValues {
  email: string;
  password: string;
}

export function SignIn() {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const onFinish = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      await signIn(values);
      messageApi.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Email ou senha inválidos",
      });
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: "100vh", background: token.colorBgContainer }}>
      {contextHolder}
      {/* Lado Esquerdo - Visual (Some em telas pequenas xs=0) */}
      <Col
        xs={0}
        md={12}
        lg={14}
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #001529 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          padding: 40,
        }}
      >
        <Title style={{ color: "#fff", marginBottom: 0 }}>WePlan</Title>
        <Text
          style={{
            color: "rgba(255,255,255, 0.8)",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Gestão financeira familiar simplificada.
        </Text>
      </Col>

      {/* Lado Direito - Formulário */}
      <Col
        xs={24}
        md={12}
        lg={10}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Title level={2}>Bem-vindo de volta!</Title>
            <Text type="secondary">
              Por favor, insira seus dados para entrar.
            </Text>
          </div>

          <Form name="login" layout="vertical" size="large" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor insira seu e-mail!" },
                { type: "email", message: "E-mail inválido!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="E-mail" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor insira sua senha!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 45, fontWeight: 600, marginTop: 10 }}
              >
                Entrar
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Não tem uma conta? </Text>
              <Link to="/register" style={{ fontWeight: 600 }}>
                Cadastre-se
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
