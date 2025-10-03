import { prisma } from "../prisma";

export const getUserRowBySupabaseId = (supabaseId: string) => {
  return prisma.platformUser.findFirst({
    where: {
      supabaseUid: supabaseId,
    },
  });
};
