-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '+7 (999) 000-00-00',
    "email" TEXT NOT NULL DEFAULT 'info@tscm-group.ru',
    "address" TEXT NOT NULL DEFAULT 'Москва, ул. Примерная, 1',
    "expressPrice" TEXT NOT NULL DEFAULT '15 000 ₸',
    "standardPrice" TEXT NOT NULL DEFAULT '35 000 ₸',
    "premiumPrice" TEXT NOT NULL DEFAULT '80 000 ₸',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);