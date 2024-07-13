import { prisma } from './shared/connections';

import { products } from '@prisma/client'

export async function getAllProductsActive() {
    const products = await prisma.products.findMany({
        where: {
            active: 'true'
        }
    })
    return products
}

export async function slugExists(slug: string) {
    const products = await prisma.products.findFirst({
        where: {
            slug: slug
        }
    })
    return products ? true : false
}

export async function createAccout(data: products) {
    await prisma.products.create({
        data: data
    })
    return 200
}

// export async function getAccountFull(data: _Product) {
//     const account = await prisma.users.findFirst({
//         where: {
//             email: data.email
//         }
//     })
//     return account
// }

// export async function setAccessToken(data: _Product, accessToken: string) {
//     await prisma.accessToken.create({
//         data: {
//             userId: data.id as string,
//             token: accessToken
//         },
//     })
// }