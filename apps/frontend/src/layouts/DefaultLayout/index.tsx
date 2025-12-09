import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Flex,
  Typography,
  Dropdown,
  Switch,
  Tooltip,
  Grid,
} from "antd";
import {
  DashboardOutlined,
  WalletOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  GlobalOutlined,
  BulbOutlined,
  LeftOutlined,
  RightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export function DefaultLayout() {
  const screens = useBreakpoint();
  const isMobile = screens.lg === false;

  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const addMenuItems = [
    {
      key: "income",
      label: "Nova Receita",
      icon: <ArrowUpOutlined style={{ color: "#3f8600" }} />,
      onClick: () => console.log("Abrir modal de receita"),
    },
    {
      key: "expense",
      label: "Nova Despesa",
      icon: <ArrowDownOutlined style={{ color: "#cf1322" }} />,
      onClick: () => console.log("Abrir modal de despesa"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        // Mobile: Some totalmente (0). Desktop: Fica só os ícones (80)
        collapsedWidth={isMobile ? 0 : 80}
        // Mobile: Tela cheia (100%). Desktop: 250px
        width={isMobile ? "100%" : 250}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          position: isMobile ? "fixed" : "relative",
          height: "100vh",
          zIndex: 1000,
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Flex vertical style={{ height: "100%" }}>
          {/* --- LOGO & CABEÇALHO DO MENU --- */}
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                isMobile && !collapsed ? "space-between" : "center",
            }}
          >
            <Flex align="center" justify="center" gap="small">
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: `linear-gradient(135deg, ${colorPrimary}, #001529)`,
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <Text
                  strong
                  style={{
                    fontSize: 20,
                    color: "#001529",
                    whiteSpace: "nowrap",
                  }}
                >
                  WePlan
                </Text>
              )}
            </Flex>

            {/* Botão de FECHAR (Apenas Mobile e quando aberto) */}
            {isMobile && !collapsed && (
              <Button
                type="text"
                icon={<CloseOutlined style={{ fontSize: 20 }} />}
                onClick={() => setCollapsed(true)}
                style={{ marginLeft: 8 }}
              />
            )}
          </div>

          {/* --- MENU PRINCIPAL --- */}
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ borderRight: 0, flex: 1, padding: "0 8px" }}
            // Ao clicar em um item no mobile, fechamos o menu automaticamente
            onClick={() => isMobile && setCollapsed(true)}
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

          {/* --- RODAPÉ (Configurações) --- */}
          {(!isMobile || !collapsed) && (
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #f0f0f0",
                margin: "0 8px 16px 8px",
              }}
            >
              <Flex
                vertical
                gap="middle"
                align={collapsed ? "center" : "start"}
              >
                {/* Idioma */}
                <Tooltip
                  title={collapsed ? "Idioma: Português" : ""}
                  placement="right"
                >
                  <Flex
                    gap="small"
                    align="center"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      color: "#8c8c8c",
                    }}
                  >
                    <GlobalOutlined style={{ fontSize: 18 }} />
                    {!collapsed && (
                      <Flex
                        justify="space-between"
                        align="center"
                        style={{ width: "100%" }}
                      >
                        <Text style={{ fontSize: 14 }}>Idioma</Text>
                        <Text
                          strong
                          style={{
                            fontSize: 12,
                            background: "#f5f5f5",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          PT
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Tooltip>

                {/* Tema */}
                <Tooltip
                  title={collapsed ? "Tema: Claro" : ""}
                  placement="right"
                >
                  <Flex
                    gap="small"
                    align="center"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      color: "#8c8c8c",
                    }}
                  >
                    <BulbOutlined style={{ fontSize: 18 }} />
                    {!collapsed && (
                      <Flex
                        justify="space-between"
                        align="center"
                        style={{ width: "100%" }}
                      >
                        <Text style={{ fontSize: 14 }}>Modo Escuro</Text>
                        <Switch size="small" disabled />
                      </Flex>
                    )}
                  </Flex>
                </Tooltip>

                <div
                  style={{
                    width: "100%",
                    height: 1,
                    background: "#f0f0f0",
                    margin: "4px 0",
                  }}
                />

                <Button
                  type="text"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={signOut}
                  block={!collapsed}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    paddingLeft: collapsed ? 0 : 8,
                  }}
                >
                  {!collapsed && "Sair da conta"}
                </Button>
              </Flex>
            </div>
          )}
        </Flex>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {/* Botão Toggle */}
          <Button
            type="text"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "14px",
              width: 32,
              height: 32,
              background: "#f5f5f5",
              borderRadius: "50%",
              color: "#595959",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Flex align="center" gap="large">
            {/* Botão ADICIONAR */}
            <Dropdown
              menu={{ items: addMenuItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined style={{ fontSize: 20 }} />}
                size="large"
                style={{
                  boxShadow: "0 3px 14px 0 rgba(24, 144, 255, 0.39)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Dropdown>

            <Flex align="center" gap="small" style={{ cursor: "pointer" }}>
              {/* Informações do Usuário (SÓ DESKTOP) */}
              {!isMobile && (
                <div
                  style={{ textAlign: "right", lineHeight: 1.2, minWidth: 80 }}
                >
                  <Text strong style={{ display: "block", fontSize: 14 }}>
                    {user?.name || "Usuário"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Admin
                  </Text>
                </div>
              )}
              <Avatar
                size="large"
                style={{
                  backgroundColor: `rgba(24, 144, 255, 0.1)`,
                  color: colorPrimary,
                  border: `1px solid ${colorPrimary}`,
                }}
                icon={<UserOutlined />}
              />
            </Flex>
          </Flex>
        </Header>

        <Content
          style={{
            margin: "24px",
            minHeight: 280,
            background: "transparent",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
