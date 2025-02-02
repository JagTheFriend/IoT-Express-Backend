import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";

export const userRegistrationSchema = z.object({
  id: z.string(),

  email: z.string(),
  password: z.string(),
  phoneNumber: z.string(),

  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),

  dateOfBirth: z.string(),
  walletPrimaryCurrency: z.string(),

  nationality: z.string(),
  address: z.string(),

  accountType: z.string(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});

export async function newUser(req: Request, res: Response) {
  const parsedBody = userRegistrationSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  await db.user.create({
    data: parsedBody.data,
  });
  res.status(201).json({ message: "User Created" });
}

export async function getUser(req: Request, res: Response) {
  const user = await db.user.findFirst({
    where: {
      id: req.query.id as string,
    },
    include: {
      card: {},
    },
  });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  res.status(200).json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const user = await db.user.delete({
    where: {
      id: req.query.id as string,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  res.status(200).json({ message: "User Deleted" });
}
