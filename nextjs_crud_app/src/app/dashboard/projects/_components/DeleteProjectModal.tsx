import { Modal,  message } from "antd";
import { useState } from "react";

type DeleteProjectModalProps = {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onReload: () => void;
};

const DeleteProjectModal = ({
  id,
  open,
  onClose,
  onReload,
}: DeleteProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to delete project");

      messageApi.success("Project deleted successfully");
      onClose();
      onReload();
    } catch (error) {
      messageApi.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Confirm Delete"
        onCancel={onClose}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        Are you sure you want to delete this project? This action cannot be undone.
      </Modal>
    </>
  );
};

export default DeleteProjectModal;
