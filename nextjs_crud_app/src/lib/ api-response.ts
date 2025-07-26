import { NextResponse } from 'next/server';

type Meta = {
  page?: number;
  total?: number;
  next?:boolean;
  prev?:boolean;
};

type SuccessOptions<T> = {
  data: T;
  statusCode?: number;
  message?: string;
  meta?: Meta;
};

type ErrorOptions = {
  message?: string;
  statusCode?: number;
  error?: any;
};

/**
 * Sends a successful API response
 */
export const sendSuccess = <T>({
  data,
  statusCode = 200,
  message = 'Success',
  meta,
}: SuccessOptions<T>) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    },
    { status: statusCode }
  );
};

/**
 * Sends an error API response
 */
export const sendError = ({
  message = 'Something went wrong',
  statusCode = 500,
  error,
}: ErrorOptions) => {
  console.error('[API ERROR]', error || message);
  return NextResponse.json(
    {
      success: false,
      message,
      ...(error && { error }),
    },
    { status: statusCode }
  );
};
