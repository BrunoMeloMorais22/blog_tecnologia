-- DropForeignKey
ALTER TABLE "Publicacao" DROP CONSTRAINT "Publicacao_usuarioId_fkey";

-- AddForeignKey
ALTER TABLE "Publicacao" ADD CONSTRAINT "Publicacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
