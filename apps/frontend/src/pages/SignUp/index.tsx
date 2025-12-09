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
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useState } from "react";

const { Title, Text } = Typography;

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirm?: string;
}

export function SignUp() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignUpFormValues) => {
    setLoading(true);
    try {
      const { confirm, ...registerData } = values;

      await authService.register(registerData);

      messageApi.success("Cadastro realizado com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      messageApi.open({
        type: "error",
        content:
          "Erro ao criar conta. Verifique os dados ou tente outro e-mail.",
      });
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: "100vh", background: token.colorBgContainer }}>
      {contextHolder}
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
        <Title style={{ color: "#fff", marginBottom: 0, textAlign: "center" }}>
          Junte-se ao WePlan
        </Title>
        <Text
          style={{
            color: "rgba(255,255,255, 0.8)",
            fontSize: 17,
            textAlign: "center",
          }}
        >
          Comece a transformar a vida financeira da sua família hoje mesmo.
        </Text>
      </Col>

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
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={2}>Crie sua conta</Title>
            <Text type="secondary">Preencha seus dados abaixo.</Text>
          </div>

          <Form
            name="register"
            layout="vertical"
            size="large"
            onFinish={onFinish} // onFinish
            scrollToFirstError
          >
            {/*  NOME */}
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira seu nome!",
                  whitespace: true,
                },
                { min: 3, message: "O nome deve ter pelo menos 3 letras." },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nome Completo" />
            </Form.Item>

            {/* Campo EMAIL */}
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "O e-mail não é válido!" },
                { required: true, message: "Por favor, insira seu e-mail!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="E-mail" />
            </Form.Item>

            {/* Campo SENHA */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor, crie uma senha!" },
                { min: 6, message: "A senha deve ter no mínimo 6 caracteres." },
              ]}
              hasFeedback // Mostra ícone de check verde quando válido
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
            </Form.Item>

            {/* Campo CONFIRMAR SENHA */}
            <Form.Item
              name="confirm"
              dependencies={["password"]} // Este campo depende do campo 'password'
              hasFeedback
              rules={[
                { required: true, message: "Por favor, confirme sua senha!" },
                // Validação customizada para comparar as senhas
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("As senhas não coincidem!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirme a Senha"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 45, fontWeight: 600, marginTop: 10 }}
              >
                Cadastrar
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Já tem uma conta? </Text>
              <Link to="/login" style={{ fontWeight: 600 }}>
                Faça Login
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
