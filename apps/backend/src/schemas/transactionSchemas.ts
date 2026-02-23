import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.number().positive("O valor deve ser positivo"),
    type: z.enum(["income", "expense"], {
      message: "Tipo deve ser 'income' ou 'expense'",
    }),
    date: z.string().datetime({ message: "Data inválida. Use o formato ISO 8601." }),
    isPaid: z.boolean().default(false),
    paymentMethod: z.enum(["debit", "credit"]).optional(),
    categoryId: z.string().uuid("ID de categoria inválido"),
    bankAccountId: z.string().uuid("ID de conta bancária inválido").optional(),
    creditCardId: z.string().uuid("ID de cartão de crédito inválido").optional(),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(["income", "expense"]).optional(),
    date: z.string().datetime().optional(),
    isPaid: z.boolean().optional(),
    paymentMethod: z.enum(["debit", "credit"]).optional().nullable(),
    categoryId: z.string().uuid().optional(),
    bankAccountId: z.string().uuid().optional().nullable(),
    creditCardId: z.string().uuid().optional().nullable(),
  }),
});
