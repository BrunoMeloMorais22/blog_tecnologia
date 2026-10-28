-- CreateTable
CREATE TABLE "Curtida" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "publicacaoId" INTEGER NOT NULL,

    CONSTRAINT "Curtida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curtida_usuarioId_publicacaoId_key" ON "Curtida"("usuarioId", "publicacaoId");

-- AddForeignKey
ALTER TABLE "Curtida" ADD CONSTRAINT "Curtida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curtida" ADD CONSTRAINT "Curtida_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "Publicacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
