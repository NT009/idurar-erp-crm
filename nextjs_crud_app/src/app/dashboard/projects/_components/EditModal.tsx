"use client";

import { Modal, Form, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import FormItems from "./Form";

type CreateProjectPayload = {
  name: string;
  description: string;
  status: string;
};

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  onReload: () => void;
};

const EditProjectModal: React.FC<Props> = ({ id, open, onClose, onReload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Load existing project details
  useEffect(() => {
    if (!id || !open) return;
    fetchProject();
  }, [id, open]);

  const fetchProject = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();

      if (!res.ok) {
        messageApi.error(data?.message || "Failed to load project");
        return;
      }
      const formData = {
        name: data?.data?.name,
        description: data?.data?.description,
        status: data?.data?.status,
      };
      form.setFieldsValue(formData);
    } catch (err: any) {
      messageApi.error(err.message || "Unexpected error occurred");
    } finally {
      setFetching(false);
    }
  };
  // Submit update
  const handleSubmit = async (values: CreateProjectPayload) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error?.fieldErrors) {
          const fields = Object.entries(data.error.fieldErrors)
            .map(([key, msgs]) => `${key}: ${(msgs as string[]).join(", ")}`)
            .join("\n");
          messageApi.error(`Validation failed:\n${fields}`);
        } else {
          messageApi.error(data?.message || "Failed to update project");
        }
        return;
      }

      messageApi.success(data?.message || "Project updated successfully!");
      onReload();
      onClose();
      form.resetFields();
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
        title="Edit Project"
        open={open}
        onCancel={onClose}
        footer={null}
      >
        <Spin spinning={fetching}>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ status: "pending" }}
          >
            <FormItems />
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default EditProjectModal;
