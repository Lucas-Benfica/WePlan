import { Modal, Form, Input, Button, Flex, message } from "antd";
import { useState } from "react";
import { useFamily } from "../../hooks/useFamily";

interface CreateFamilyModalProps {
  open: boolean;
  onCancel: () => void;
  isMobile?: boolean;
}

export function CreateFamilyModal({
  open,
  onCancel,
  isMobile = true,
}: CreateFamilyModalProps) {
  const { createFamily } = useFamily();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = async (values: { name: string }) => {
    setLoading(true);
    try {
      await createFamily(values.name);
      messageApi.success("Família criada com sucesso!");
      form.resetFields();
      onCancel();
    } catch (error) {
      messageApi.error("Erro ao criar família.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Criar Nova Família"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered={isMobile}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          name="name"
          label="Nome da Família"
          rules={[
            {
              required: true,
              message: "Dê um nome para sua família (ex: Casa, Viagem)",
            },
          ]}
        >
          <Input placeholder="Ex: Família Silva" />
        </Form.Item>
        <Flex justify="end" gap="small">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Criar Família
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}
