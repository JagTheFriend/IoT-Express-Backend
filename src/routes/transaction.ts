import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";

const newTransactionSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  receiverId: z.string(),
  senderId: z.string(),
  description: z.string().optional(),
});

export async function newTransaction(req: Request, res: Response) {
  const parsedBody = newTransactionSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          { id: parsedBody.data.receiverId },
          { id: parsedBody.data.senderId },
        ],
      },
    });

    if (!users.length) {
      res.status(400).json({ message: "User Not Found" });
      return;
    }

    await db.transaction.create({
      data: { ...parsedBody.data, status: "pending" },
    });
    res.status(201).json({ message: "Transaction Created" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getTransaction(req: Request, res: Response) {
  try {
    const transaction = await db.transaction.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    if (!transaction) {
      res.status(404).json({ message: "Transaction Not Found" });
      return;
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const updateTransactionSchema = z.object({
  description: z.string(),
});

export async function updateTransaction(req: Request, res: Response) {
  const parsedBody = updateTransactionSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  try {
    await db.transaction.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        description: parsedBody.data.description,
      },
    });
    res.status(200).json({ message: "Transaction Updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
