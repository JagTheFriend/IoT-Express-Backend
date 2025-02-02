import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";

export const cardRegistrationSchema = z.object({
  id: z.string().optional(),
  authorId: z.string(),
  cardHolderName: z.string(),
  cardNumber: z.string(),
  validTill: z.string(),
});

export async function newCard(req: Request, res: Response) {
  const parsedBody = cardRegistrationSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  try {
    await db.card.create({
      data: parsedBody.data,
    });
    res.status(201).json({ message: "Card Created" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCard(req: Request, res: Response) {
  const card = await db.card.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  if (!card) {
    res.status(404).json({ message: "Card Not Found" });
    return;
  }

  res.status(200).json(card);
}

const cardUpdateSchema = z.object({
  authorId: z.string().optional(),
  cardHolderName: z.string().optional(),
  cardNumber: z.string().optional(),
  validTill: z.string().optional(),
});

export async function updateCard(req: Request, res: Response) {
  const parsedBody = cardUpdateSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  const card = await db.card.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  if (!card) {
    res.status(404).json({ message: "Card Not Found" });
    return;
  }

  await db.card.update({
    where: {
      id: req.query.id as string,
    },
    data: {
      authorId: parsedBody.data.authorId,
      cardHolderName: parsedBody.data.cardHolderName,
      cardNumber: parsedBody.data.cardNumber,
      validTill: parsedBody.data.validTill,
    },
  });

  if (!card) {
    res.status(404).json({ message: "Card Not Found" });
    return;
  }

  res.status(200).json({ message: "Card Updated" });
}

export async function deleteCard(req: Request, res: Response) {
  const card = await db.card.findFirst({
    where: {
      id: req.query.id as string,
    },
  });

  if (!card) {
    res.status(404).json({ message: "Card Not Found" });
    return;
  }

  await db.card.delete({
    where: {
      id: req.query.id as string,
    },
  });

  res.status(200).json({ message: "Card Deleted" });
}
