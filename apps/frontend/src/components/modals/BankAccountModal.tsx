import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Flex,
  Select,
  Switch,
  Typography,
  Space,
  Divider,
  message,
  Grid,
} from "antd";
import { CurrencyInput } from "../CurrencyInput";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useBankAccount } from "../../hooks/useBankAccount";
import { BANKS_LIST } from "../../utils/banks";
import type { BankAccount } from "../../types/BankAccount";

const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface BankAccountModalProps {
  open: boolean;
  onCancel: () => void;
  accountToEdit?: BankAccount | null;
}

export function BankAccountModal({
  open,
  onCancel,
  accountToEdit,
}: BankAccountModalProps) {
  const { createBankAccount, updateBankAccount } = useBankAccount();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const hasCreditCard = Form.useWatch("hasCreditCard", form);

  useEffect(() => {
    if (open) {
      if (accountToEdit) {
        // Modo Edição
        form.setFieldsValue({
          ...accountToEdit,
          // Garante que o array de cartões exista
          creditCards: accountToEdit.creditCards || [],
        });
      } else {
        // Modo Criação (Limpa tudo)
        form.resetFields();
        form.setFieldsValue({
          initialBalance: 0,
          hasCreditCard: false,
          creditCards: [],
        });
      }
    }
  }, [open, accountToEdit, form]);

  const handleOk = async (values: any) => {
    setLoading(true);
    try {
      if (accountToEdit) {
        // Atualizar
        await updateBankAccount({
          id: accountToEdit.id,
          ...values,
        });
        messageApi.success("Conta atualizada com sucesso!");
      } else {
        // Criar
        await createBankAccount(values);
        messageApi.success("Conta criada com sucesso!");
      }

      form.resetFields();
      setTimeout(() => {
        onCancel();
      }, 500);
    } catch (error) {
      messageApi.error(
        accountToEdit ? "Erro ao atualizar conta." : "Erro ao criar conta."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={accountToEdit ? "Editar Conta" : "Nova Conta Bancária"}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          {/* --- Dados Básicos da Conta --- */}
          <Flex gap="middle" wrap="wrap">
            <Form.Item
              name="name"
              label="Apelido da Conta"
              rules={[{ required: true, message: "Ex: Conta Principal" }]}
              style={{ flex: 2, minWidth: 200 }}
            >
              <Input placeholder="Ex: NuConta, Carteira" />
            </Form.Item>

            <Form.Item
              name="bank"
              label="Instituição"
              rules={[{ required: true, message: "Selecione o banco" }]}
              style={{ flex: 1, minWidth: 150 }}
            >
              <Select
                placeholder="Selecione"
                onChange={(value) => {
                  form.setFieldValue("bankLogo", value);
                }}
              >
                {BANKS_LIST.map((bank) => (
                  <Option key={bank.value} value={bank.value}>
                    <Space>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: bank.color,
                        }}
                      />
                      {bank.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="bankLogo" hidden>
              <Input />
            </Form.Item>
          </Flex>

          <Form.Item
            name="initialBalance"
            label="Saldo Atual"
            rules={[{ required: true, message: "Informe o saldo atual" }]}
          >
            <CurrencyInput />
          </Form.Item>

          <Divider />

          {/* --- Seção Cartão de Crédito --- */}
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 16 }}
          >
            <Space>
              <CreditCardOutlined style={{ fontSize: 18, color: "#1890ff" }} />
              <Text strong>Possui Cartão de Crédito?</Text>
            </Space>
            <Form.Item name="hasCreditCard" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </Flex>

          {hasCreditCard && (
            <div
              style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}
            >
              <Flex gap="middle" vertical={isMobile}>
                <Form.Item
                  name="creditCardLimit"
                  label="Limite Total"
                  rules={[{ required: true, message: "Obrigatório" }]}
                  style={{ flex: 1 }}
                >
                  <CurrencyInput />
                </Form.Item>

                <Form.Item
                  name="invoiceClosingDay"
                  label="Dia Fechamento"
                  rules={[{ required: true, message: "Dia que vira" }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    min={1}
                    max={31}
                    style={{ width: "100%" }}
                    placeholder="Ex: 25"
                  />
                </Form.Item>

                <Form.Item
                  name="invoiceDueDay"
                  label="Dia Vencimento"
                  rules={[{ required: true, message: "Dia que paga" }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    min={1}
                    max={31}
                    style={{ width: "100%" }}
                    placeholder="Ex: 5"
                  />
                </Form.Item>
              </Flex>

              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Cartões Vinculados
              </Text>

              <Form.List name="creditCards">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Flex
                        key={key}
                        gap="small"
                        align="baseline"
                        style={{ marginBottom: 8 }}
                      >
                        {/* Isso garante que o ID seja enviado no update */}
                        <Form.Item {...restField} name={[name, "id"]} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "nickname"]}
                          rules={[
                            { required: true, message: "Nome do cartão" },
                          ]}
                          style={{ flex: 1, margin: 0 }}
                        >
                          <Input
                            placeholder="Ex: Cartão Virtual Uber"
                            prefix={<CreditCardOutlined />}
                          />
                        </Form.Item>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Flex>
                    ))}
                    <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Adicionar outro cartão
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          )}

          <Divider />

          <Flex justify="end" gap="small">
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {accountToEdit ? "Salvar Alterações" : "Criar Conta"}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
