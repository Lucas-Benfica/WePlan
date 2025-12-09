import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout, Menu, Button, theme, Avatar, Flex, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  WalletOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0" // No mobile, a sidebar desaparece totalmente
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        style={{ background: "#fff" }} // Sidebar clean branca
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          {/* Logo simples */}
          <Flex align="center" justify="center" gap="small">
            <div
              style={{
                width: 32,
                height: 32,
                background: colorPrimary,
                borderRadius: 8,
              }}
            ></div>
            {!collapsed && (
              <Text strong style={{ fontSize: 18 }}>
                WePlan
              </Text>
            )}
          </Flex>
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <WalletOutlined />,
              label: "Transações",
            },
            {
              key: "3",
              icon: <TeamOutlined />,
              label: "Minha Família",
            },
          ]}
        />

        {/* Botão de Logout fixo no fim (opcional) */}
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Flex align="center" gap="small">
            <Text strong>Olá, Lucas</Text>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: colorPrimary }}
            />
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* O Outlet renderiza a página filha (ex: Dashboard) aqui dentro */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
