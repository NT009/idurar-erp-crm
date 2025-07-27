import { sendError, sendSuccess } from "@/lib/ api-response";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/project.model";
import { projectCreateValidator } from "@/validator/project.validator";
import { NextRequest } from "next/server";

// POST /api/projects
export async function POST(req: NextRequest) {
  try {
    // 1. Connect to DB
    await connectToDatabase();

    // 2. Parse & validate input
    const body = await req.json();
    const parsed = projectCreateValidator.safeParse(body);
    if (!parsed.success) {
      return sendError({
        message: "Validation failed",
        statusCode: 400,
        error: parsed.error.flatten(),
      });
    }

    // 3. Create project
    const project = await Project.create({
      ...parsed.data,
      removed: false,
    });

    // 4. Return success response
    return sendSuccess({
      data: project.toJSON(),
      statusCode: 201,
      message: "Project created successfully",
    });
  } catch (error) {
    return sendError({
      message: "Failed to create project",
      statusCode: 500,
      error,
    });
  }
}
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;

    // Get pagination params with defaults
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Extract and validate status
    const status = searchParams.get("status");
    const allowedStatuses = ["pending", "in-progress", "completed"];

    // Build filter
    const filter: any = { removed: false };
    if (status && allowedStatuses?.includes(status)) {
      filter.status = status;
    }
    // Count total
    const total = await Project.countDocuments(filter);

    // Get paginated projects
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    const meta = {
      page,
      total,
      next: page < totalPages,
      prev: page > 1,
    };

    return sendSuccess({
      data: projects.map((project) => project.toJSON()),
      meta,
    });
  } catch (error) {
    return sendError({
      message: "Failed to fetch projects",
      error,
    });
  }
}
