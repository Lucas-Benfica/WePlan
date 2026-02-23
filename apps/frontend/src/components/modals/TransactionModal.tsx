import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Flex,
  message,
  Divider,
} from "antd";
import { CurrencyInput } from "../CurrencyInput";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTransaction } from "../../hooks/useTransaction";
import { useBankAccount } from "../../hooks/useBankAccount";
import { useFamily } from "../../hooks/useFamily";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/Category";
import type { Transaction } from "../../types/Transaction";

const { Option } = Select;

interface TransactionModalProps {
  open: boolean;
  onCancel: () => void;
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  open,
  onCancel,
  transactionToEdit,
}: TransactionModalProps) {
  const { createTransaction, updateTransaction } = useTransaction();
  const { bankAccounts } = useBankAccount();
  const { activeFamily } = useFamily();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Watch reactive values for conditional rendering
  const selectedType = Form.useWatch("type", form);
  const selectedBankAccountId = Form.useWatch("bankAccountId", form);

  // Determine if the selected account has credit cards
  const selectedAccount = bankAccounts.find(
    (acc) => acc.id === selectedBankAccountId
  );
  const hasCreditCards =
    selectedType === "expense" &&
    !!selectedAccount?.creditCards?.length;

  // Load categories from API
  useEffect(() => {
    if (open && activeFamily) {
      categoryService.getAll(activeFamily.id).then(setCategories).catch(() => {
        messageApi.error("Erro ao carregar categorias.");
      });
    }
  }, [open, activeFamily]);

  // Filter categories by selected transaction type
  const filteredCategories = categories.filter(
    (c) => !selectedType || c.type === selectedType
  );

  // Populate form on open
  useEffect(() => {
    if (open) {
      if (transactionToEdit) {
        form.setFieldsValue({
          ...transactionToEdit,
          date: dayjs(transactionToEdit.date),
          bankAccountId: transactionToEdit.bankAccountId ?? undefined,
          creditCardId: transactionToEdit.creditCardId ?? undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          isPaid: false,
          date: dayjs(),
        });
      }
    }
  }, [open, transactionToEdit, form]);

  // Clear categoryId and creditCardId when type changes
  const handleTypeChange = () => {
    form.setFieldValue("categoryId", undefined);
    form.setFieldValue("creditCardId", undefined);
  };

  // Clear creditCardId when bank account changes
  const handleBankAccountChange = () => {
    form.setFieldValue("creditCardId", undefined);
  };

  const handleOk = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: (values.date as dayjs.Dayjs).toISOString(),
        bankAccountId: values.bankAccountId ?? undefined,
        creditCardId: hasCreditCards ? values.creditCardId ?? undefined : undefined,
      };

      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, payload);
        messageApi.success("Transação atualizada com sucesso!");
      } else {
        await createTransaction(payload);
        messageApi.success("Transação criada com sucesso!");
      }

      form.resetFields();
      setTimeout(onCancel, 400);
    } catch {
      messageApi.error(
        transactionToEdit ? "Erro ao atualizar transação." : "Erro ao criar transação."
      );
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
        title={transactionToEdit ? "Editar Transação" : "Nova Transação"}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={560}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleOk} style={{ marginTop: 16 }}>
          {/* Tipo */}
          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Select placeholder="Receita ou Despesa" onChange={handleTypeChange}>
              <Option value="income">
                <Flex align="center" gap={6}>
                  <ArrowUpOutlined style={{ color: "#52c41a" }} />
                  Receita
                </Flex>
              </Option>
              <Option value="expense">
                <Flex align="center" gap={6}>
                  <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
                  Despesa
                </Flex>
              </Option>
            </Select>
          </Form.Item>

          {/* Descrição e Valor */}
          <Flex gap="middle">
            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true, message: "Informe a descrição" }]}
              style={{ flex: 2 }}
            >
              <Input placeholder="Ex: Supermercado, Salário..." />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Valor"
              rules={[{ required: true, message: "Informe o valor" }]}
              style={{ flex: 1 }}
            >
              <CurrencyInput
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Flex>

          {/* Categoria */}
          <Form.Item
            name="categoryId"
            label="Categoria"
            rules={[{ required: true, message: "Selecione uma categoria" }]}
          >
            <Select
              placeholder={
                selectedType
                  ? "Selecione a categoria"
                  : "Selecione o tipo primeiro"
              }
              disabled={!selectedType}
              showSearch
              optionFilterProp="children"
            >
              {filteredCategories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider style={{ margin: "4px 0 12px" }} />

          {/* Conta Bancária */}
          <Form.Item name="bankAccountId" label="Conta Bancária">
            <Select
              placeholder="Selecione a conta (opcional)"
              allowClear
              onChange={handleBankAccountChange}
            >
              {bankAccounts.map((acc) => (
                <Option key={acc.id} value={acc.id}>
                  {acc.name} — {acc.bank}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Cartão de Crédito — condicional */}
          {hasCreditCards && (
            <Form.Item name="creditCardId" label="Cartão de Crédito">
              <Select placeholder="Selecione o cartão (opcional)" allowClear>
                {selectedAccount?.creditCards?.map((card) => (
                  <Option key={card.id} value={card.id}>
                    {card.nickname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Divider style={{ margin: "4px 0 12px" }} />

          {/* Data e Pago? */}
          <Flex gap="middle" align="flex-start">
            <Form.Item
              name="date"
              label="Data"
              rules={[{ required: true, message: "Selecione a data" }]}
              style={{ flex: 1 }}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
              />
            </Form.Item>

            <Form.Item
              name="isPaid"
              label="Pago?"
              valuePropName="checked"
              style={{ flex: "0 0 auto" }}
            >
              <Switch
                checkedChildren="Sim"
                unCheckedChildren="Não"
              />
            </Form.Item>
          </Flex>

          {/* Footer */}
          <Flex justify="end" gap="small" style={{ marginTop: 8 }}>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {transactionToEdit ? "Salvar Alterações" : "Criar Transação"}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
