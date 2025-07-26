"use client";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useState } from "react";
import FormItems from "./Form";

type CreateProjectPayload = {
  name: string;
  description: string;
  status: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
};

const CreateProjectModal: React.FC<Props> = ({ open, onClose, onReload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = async (values: CreateProjectPayload) => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (data?.error?.fieldErrors) {
          const fields = Object.entries(data.error.fieldErrors)
            .map(([key, msgs]) => `${key}: ${(msgs as string[]).join(", ")}`)
            .join("\n");
          messageApi.error(`Validation failed:\n${fields}`);
        } else {
          messageApi.error(data?.message || "Failed to create project");
        }
        return;
      }

      messageApi.success(data?.message || "Project created successfully!");
      form.resetFields();
      onReload();
      onClose();
    } catch (err: any) {
      messageApi.error(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Create New Project"
        open={open}
        onCancel={onClose}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ status: "pending" }}
        >
          <FormItems />
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProjectModal;
