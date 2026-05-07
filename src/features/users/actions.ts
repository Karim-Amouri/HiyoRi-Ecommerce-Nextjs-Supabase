"use server";

import db from "@/lib/supabase/db";
import createClient from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { profiles } from "../../lib/supabase/schema";
import { AdminUserFormData } from "@/features/users/validations";

export const getCurrentUser = async () => {
  const cookieStore = cookies();
  const supabase = createClient({ cookieStore });

  const userResponse = await supabase.auth.getUser();
  return userResponse.data.user;
};

export const getCurrentUserSession = async () => {
  const cookieStore = cookies();
  const supabase = createClient({ cookieStore });

  const userResponse = await supabase.auth.getSession();
  return userResponse.data.session;
};

export const isAdmin = async (currentUser: User | null) =>
  currentUser?.app_metadata.isAdmin;

export const getUser = async ({ userId }: { userId: string }) => {
  const cookieStore = cookies();
  const adminAuthClient = createClient({ cookieStore, isAdmin: true }).auth
    .admin;

  try {
    const { data } = await adminAuthClient.getUserById(userId);
    return data;
  } catch {
    throw new Error("There is an error");
  }
};

export const listUsers = async ({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
}) => {
  const cookieStore = cookies();
  const adminAuthClient = createClient({ cookieStore, isAdmin: true }).auth
    .admin;

  const {
    data: { users },
  } = await adminAuthClient.listUsers({
    page,
    perPage,
  });

  return users;
};

export const createUser = async ({
  email,
  name,
  password,
}: AdminUserFormData) => {
  const cookieStore = cookies();
  const adminAuthClient = createClient({ cookieStore, isAdmin: true }).auth
    .admin;

  try {
    const existedUser = await db.query.profiles.findFirst({
      where: eq(profiles.email, email),
    });

    if (existedUser) {
      throw new Error(`User with email ${email} is existed.`);
    }

    const res = await adminAuthClient.createUser({
      email,
      password,
      role: "ADMIN",
      user_metadata: { name },
    });

    return res;
  } catch {
    throw new Error("Unexpected error occured.");
  }
};
