-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_postId_fkey";

-- DropForeignKey
ALTER TABLE "Curtida" DROP CONSTRAINT "Curtida_publicacaoId_fkey";

-- CreateIndex
CREATE INDEX "Comentario_postId_idx" ON "Comentario"("postId");

-- CreateIndex
CREATE INDEX "Comentario_usuarioId_idx" ON "Comentario"("usuarioId");

-- CreateIndex
CREATE INDEX "Curtida_publicacaoId_idx" ON "Curtida"("publicacaoId");

-- CreateIndex
CREATE INDEX "Publicacao_usuarioId_idx" ON "Publicacao"("usuarioId");

-- AddForeignKey
ALTER TABLE "Curtida" ADD CONSTRAINT "Curtida_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "Publicacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Publicacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
