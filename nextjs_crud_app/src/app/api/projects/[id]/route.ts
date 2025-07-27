import { sendError, sendSuccess } from "@/lib/ api-response";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/project.model";
import { projectUpdateValidator } from "@/validator/project.validator";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError({ message: "Invalid project ID", statusCode: 400 });
    }

    // Find project by ID, excluding removed
    const project = await Project.findOne({ _id: id, removed: false });

    if (!project) {
      return sendError({ message: "Project not found", statusCode: 404 });
    }

    return sendSuccess({
      data: project.toJSON(),
      message: "Project fetched successfully",
    });
  } catch (error) {
    return sendError({ message: "Failed to fetch project", error });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id: projectId } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return sendError({ statusCode: 400, message: "Invalid project ID" });
    }

    const body = await req.json();
    const parsed = projectUpdateValidator.safeParse(body);

    if (!parsed.success) {
      return sendError({
        statusCode: 400,
        message: "Validation failed",
        error: parsed.error.flatten(),
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      parsed.data,
      { new: true } // Return updated document
    );

    if (!updatedProject) {
      return sendError({ statusCode: 404, message: "Project not found" });
    }

    return sendSuccess({
      statusCode: 200,
      message: "Project updated successfully",
      data: updatedProject.toJSON(),
    });
  } catch (error) {
    return sendError({
      statusCode: 500,
      message: "Failed to update project",
      error,
    });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const project = await Project.findByIdAndUpdate(
      id,
      { removed: true },
      { new: true }
    );

    if (!project) {
      return sendError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    return sendSuccess({
      statusCode: 200,
      data: project,
      message: "Project deleted  successfully",
    });
  } catch (error) {
    return sendError({
      statusCode: 500,
      message: "Failed to delete project",
      error,
    });
  }
}
