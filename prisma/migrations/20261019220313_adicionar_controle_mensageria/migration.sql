-- CreateTable
CREATE TABLE "EventoProcessado" (
    "eventId" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "processadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoProcessado_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "FalhaMensageria" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "mensagemErro" TEXT NOT NULL,
    "tentativas" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FalhaMensageria_pkey" PRIMARY KEY ("id")
);
