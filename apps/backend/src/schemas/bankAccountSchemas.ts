import { z } from "zod";

export const createBankAccountSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Nome da conta é obrigatório"),
      bank: z.string().min(1, "Nome do banco é obrigatório"),

      bankLogo: z.string().optional(),

      initialBalance: z.number().default(0),
      hasCreditCard: z.boolean().default(false),
      creditCardLimit: z.number().optional(),
      invoiceClosingDay: z.number().min(1).max(31).optional(),
      invoiceDueDay: z.number().min(1).max(31).optional(),

      creditCards: z
        .array(
          z.object({
            nickname: z.string().min(1, "Apelido do cartão é obrigatório"),
          })
        )
        .optional(),
    })
    .refine(
      (data) => {
        if (data.hasCreditCard) {
          return (
            !!data.invoiceClosingDay &&
            !!data.invoiceDueDay &&
            !!data.creditCardLimit
          );
        }
        return true;
      },
      {
        message:
          "Para contas com cartão de crédito, o limite e os dias da fatura são obrigatórios.",
        path: ["hasCreditCard"],
      }
    ),
});

export const updateBankAccountSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      bank: z.string().min(1).optional(),
      bankLogo: z.string().optional(),
      initialBalance: z.number().optional(),
      hasCreditCard: z.boolean().optional(),
      creditCardLimit: z.number().optional(),
      invoiceClosingDay: z.number().min(1).max(31).optional(),
      invoiceDueDay: z.number().min(1).max(31).optional(),
    })
    .refine(
      (data) => {
        if (data.hasCreditCard === true) {
          return (
            !!data.invoiceClosingDay &&
            !!data.invoiceDueDay &&
            !!data.creditCardLimit
          );
        }
        return true;
      },
      {
        message:
          "Para ativar o cartão de crédito, informe o limite e os dias da fatura.",
        path: ["hasCreditCard"],
      }
    ),
});
