import { Button, Card, Input, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 

export function SignIn() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Acesse o WePlan" style={{ width: 400 }}>
        <Form layout="vertical">
          <Form.Item name="email" label="E-mail">
            <Input prefix={<UserOutlined />} placeholder="seu@email.com" />
          </Form.Item>
          <Form.Item name="password" label="Senha">
            <Input.Password prefix={<LockOutlined />} placeholder="Sua senha" />
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            Entrar
          </Button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
             <Link to="/register">Não tem conta? Cadastre-se</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}