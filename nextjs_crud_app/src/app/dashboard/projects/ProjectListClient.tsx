"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Table,
  Spin,
  message,
  Space,
  Tooltip,
  Button,
  Select,
  MenuProps,
  Dropdown,
} from "antd";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateProjectModal from "./_components/CreateModal";
import EditProjectModal from "./_components/EditModal";
import ProjectDetailsModal from "./_components/DetailsModal";
import DeleteProjectModal from "./_components/DeleteProjectModal";

type ModalMeta = {
  type: "create" | "edit" | "details" | "delete" | null;
  id?: string | null;
};
interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
const statusOptions = ["pending", "in-progress", "completed"];
const items = [
  {
    label: "View",
    key: "read",
    icon: <EyeOutlined />,
  },
  {
    label: "Edit",
    key: "edit",
    icon: <EditOutlined />,
  },

  {
    label: "Delete",
    key: "delete",
    icon: <DeleteOutlined />,
  },
];

export default function ProjectListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  // const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [reload, setReload] = useState(false);
  const [modalMeta, setModalMeta] = useState<ModalMeta>({
    type: null,
    id: null,
  });
  const getPage = () => {
    try {
      return Number(searchParams.get("page")) || 1;
    } catch (error) {
      return 1;
    }
  };
  const getLimit = () => {
    try {
      return Number(searchParams.get("limit")) || 10;
    } catch (error) {
      return 10;
    }
  };
  const getStatus = () => {
    try {
      const status = searchParams?.get("status") || "";
      return statusOptions?.includes(status) ? status : "";
    } catch (error) {
      return "";
    }
  };
  const page = getPage();
  const limit = getLimit();
  const statusFilter = getStatus();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "",
      key: "action",
      fixed: "right" as any,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case "edit":
                  setModalMeta({
                    type: "edit",
                    id: record._id,
                  });
                  break;
                case "read":
                  setModalMeta({
                    type: "details",
                    id: record._id,
                  });
                  break;
                case "delete":
                  setModalMeta({
                    type: "delete",
                    id: record._id,
                  });
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={["click"]}
        >
          <EllipsisOutlined
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const fetchProjects = async (
    page: number,
    limit: number,
    statusFilter: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/projects?page=${page}&limit=${limit}&status=${statusFilter}`
      );
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data);
        setMeta(data?.meta);
      } else {
        message.error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page, limit, statusFilter);
  }, [page, limit, reload, statusFilter]);
  const onPaginationChange = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());
    params.set("limit", newPageSize.toString());

    router.replace(`/dashboard/projects?${params.toString()}`);
  };
  const handleStatusChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or delete status
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    // Reset pagination
    params.set("page", "1");
    params.set("limit", "10"); // or any default value you use

    router.replace(`?${params.toString()}`);
  };
  const resetModalMeta = () => {
    setModalMeta({
      type: null,
      id: null,
    });
  };
  return (
    <div className="bg-white p-6 rounded-md shadow max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Space>
          <Select
            placeholder="Filter by Status"
            allowClear
            onChange={(value) => handleStatusChange(value)}
            style={{ width: 160 }}
          >
            {statusOptions.map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setModalMeta({
                type: "create",
                id: null,
              })
            }
          >
            Create
          </Button>
        </Space>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={projects}
          pagination={{
            current: page,
            pageSize: limit,
            total: meta?.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: onPaginationChange,
          }}
          rowKey="_id"
        />
      </Spin>

      <CreateProjectModal
        open={modalMeta.type === "create"}
        onClose={resetModalMeta}
        onReload={() => setReload(!reload)}
      />
      <EditProjectModal
        id={modalMeta?.id || ""}
        open={modalMeta.type === "edit"}
        onClose={resetModalMeta}
        onReload={() => setReload(!reload)}
      />
      <ProjectDetailsModal
        id={modalMeta?.id || ""}
        open={modalMeta.type === "details"}
        onClose={resetModalMeta}
      />
      <DeleteProjectModal
        id={modalMeta?.id || ""}
        open={modalMeta.type === "delete"}
        onClose={resetModalMeta}
        onReload={() => setReload(!reload)}
      />
    </div>
  );
}
