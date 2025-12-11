import { Modal, Form, Input, Button, Flex, Typography, message } from "antd";
import { useState } from "react";
import { useFamily } from "../../hooks/useFamily";

const { Paragraph } = Typography;

interface JoinFamilyModalProps {
  open: boolean;
  onCancel: () => void;
  isMobile?: boolean;
}

export function JoinFamilyModal({
  open,
  onCancel,
  isMobile = true,
}: JoinFamilyModalProps) {
  const { joinFamily } = useFamily();
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const handleOk = async (values: { familyId: string }) => {
    setLoading(true);
    try {
      await joinFamily(values.familyId);
      messageApi.success("Você entrou na família com sucesso!");
      form.resetFields();
      setTimeout(() => {
        onCancel();
      }, 500);
    } catch (error) {
      messageApi.error("Código inválido ou você já participa desta família.");
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
    <Modal
      title="Entrar em uma Família"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered={isMobile}
    >
      {contextHolder}

      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Paragraph>
          Insira o <strong>Código de Convite</strong> fornecido pelo
          administrador.
        </Paragraph>
        <Form.Item
          name="familyId"
          label="Código de Convite (ID)"
          rules={[{ required: true, message: "Insira o código da família" }]}
        >
          <Input placeholder="Ex: 550e8400-e29b..." />
        </Form.Item>
        <Flex justify="end" gap="small">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Entrar
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}
