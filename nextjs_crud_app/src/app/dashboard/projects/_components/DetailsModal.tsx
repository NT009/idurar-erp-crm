import { useEffect, useState } from "react";
import { Modal, Spin, Descriptions, message } from "antd";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProjectDetailsModalProps = {
  id: string | null;
  open: boolean;
  onClose: () => void;
};

const ProjectDetailsModal = ({
  id,
  open,
  onClose,
}: ProjectDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Failed to fetch project");

        setProject(json.data);
      } catch (err) {
        messageApi.error((err as Error).message);
        onClose();
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchProject();
  }, [id, open, onClose, messageApi]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="Project Details"
      >
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : project ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{project.name}</Descriptions.Item>
            <Descriptions.Item label="Description">
              {project.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {project.status || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(project.createdAt || "").toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="text-center text-gray-500">
            No project data found.
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProjectDetailsModal;
