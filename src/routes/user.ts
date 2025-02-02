import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";

export const userRegistrationSchema = z.object({
  id: z.string().optional(),

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

  try {
    await db.user.create({
      data: parsedBody.data,
    });
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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

const userUpdateSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),

  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),

  dateOfBirth: z.string().optional(),
  walletPrimaryCurrency: z.string().optional(),

  nationality: z.string().optional(),
  address: z.string().optional(),

  accountType: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});

export async function updateUser(req: Request, res: Response) {
  const parsedBody = userUpdateSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  const user = await db.user.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  await db.user.update({
    where: {
      id: req.query.id as string,
    },
    data: {
      email: parsedBody.data.email,
      password: parsedBody.data.password,
      phoneNumber: parsedBody.data.phoneNumber,

      username: parsedBody.data.username,
      firstName: parsedBody.data.firstName,
      lastName: parsedBody.data.lastName,

      dateOfBirth: parsedBody.data.dateOfBirth,
      walletPrimaryCurrency: parsedBody.data.walletPrimaryCurrency,

      nationality: parsedBody.data.nationality,
      address: parsedBody.data.address,

      accountType: parsedBody.data.accountType,
      businessName: parsedBody.data.businessName,
      businessType: parsedBody.data.businessType,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  res.status(200).json({ message: "User Updated" });
}

export async function deleteUser(req: Request, res: Response) {
  const user = await db.user.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  await db.user.delete({
    where: {
      id: req.query.id as string,
    },
  });

  res.status(200).json({ message: "User Deleted" });
}
