const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try{
        await prisma.categoria.createMany({
            skipDuplicates: true,
            
            data: [
            {
                nome: "Backend",
                slug: "backend"
            },

            {
                nome: "Frontend",
                slug: "frontend"
            },

            {
                nome: "Inteligência Artificial",
                slug: "inteligencia-artificial"
            },
            {
                nome: "Banco de Dados",
                slug: "banco-de-dados"
            },

            {
                nome: "DevOps",

                slug: "devops"
            },

            {
                nome: "Segurança",
                slug: "seguranca"
            }
        ]
        })
    }

    catch(error){
        console.error(error)
    }

    finally{
        await prisma.$disconnect()
    }
}

main()