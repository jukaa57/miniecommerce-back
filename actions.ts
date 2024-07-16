import { prisma } from './shared/connections';
import { products, cart, favorites, customers } from '@prisma/client'
import { now } from './shared/util';

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

export async function createProduct(data: products) {
    await prisma.products.create({
        data: {...data, slug: data.slug.toLowerCase()}
    })
    return {
        error: null,
        message: 'Product created successfully'
    }
}
export async function updateProduct(slug: string, data: products) {
    await prisma.products.update({
        where: {
            slug: slug,
        },
        data: {...data, updated_at: now}
    })
    return {
        error: null,
        message: 'Product updated successfully'
    }
}
export async function deleteProduct(slug: string) {
    await prisma.products.delete({
        where: {
            slug: slug,
        },
    })
    return {
        error: null,
        message: 'Product deleted successfully'
    }
}


export async function getCart(idCustomer: string) {
    const cart = await prisma.cart.findMany({
        where: {
            idCustomer: idCustomer
        }
    })
    return cart
}
export async function addToCart(data: cart) {
    const product = await prisma.products.findFirst({
        where: {
            id: data.idProduct
        }
    })
    if(!product) {
        return {
            error: true,
            message: 'Product not found'
        }
    }
    if(product.stock < data.quantity) {
        return {
            error: true,
            message: 'Quantity is bigger than the stock available'
        }
    }
    const cart = await prisma.cart.findFirst({
        where: {
            idProduct: data.idProduct,
            AND: [{
                idCustomer: data.idCustomer
            }]
        }
    })
    if(cart) {
        await prisma.cart.updateMany({
            where:{
                idProduct: data.idProduct,
                idCustomer: data.idCustomer
            },
            data: {
                quantity: cart.quantity + data.quantity,
                priceUnity: cart.priceUnity + data.priceUnity,
                priceTotal: cart.priceTotal + data.priceTotal,
                add_at: now
            }
        })
        return {
            error: null,
            message: 'Product updated to cart'
        }
    }
    await prisma.cart.create({
        data: {
            idProduct: data.idProduct,
            quantity: data.quantity,
            priceUnity: data.priceUnity,
            priceTotal: data.priceTotal,
            idCustomer: data.idCustomer
        }
    })

    return {
        error: null,
        message: 'Product add to cart'
    }
}
export async function removeToCart(data: cart) {
    const product = await prisma.cart.findFirst({
        where: {
            idProduct: data.idProduct,
            AND: [{
                idCustomer: data.idCustomer
            }]
        }
    })
    if(!product) {
        return {
            error: true,
            message: 'Product not found'
        }
    }
    await prisma.cart.deleteMany({
        where: {
            idProduct: data.idProduct,
            idCustomer: data.idCustomer
        }
    })

    return {
        error: null,
        message: 'Product remove to cart'
    }
}


export async function addToFavorites(data: favorites) {
    const product = await prisma.products.findFirst({
        where: {
            id: data.idProduct
        }
    })
    if(!product) {
        return {
            error: true,
            message: 'Product not found'
        }
    }
    const favorites = await prisma.favorites.findFirst({
        where: {
            idProduct: data.idProduct,
            AND: [{
                idCustomer: data.idCustomer
            }]
        }
    })
    if(favorites) {
        return {
            error: true,
            message: 'Product already added to favorites'
        }
    }
    await prisma.favorites.create({
        data: {
            idProduct: data.idProduct,
            idCustomer: data.idCustomer
        }
    })

    return {
        error: null,
        message: 'Product add to favorites'
    }
}
export async function removeToFavorites(data: favorites) {
    const product = await prisma.products.findFirst({
        where: {
            id: data.idProduct
        }
    })
    if(!product) {
        return {
            error: true,
            message: 'Product not found'
        }
    }
    await prisma.favorites.deleteMany({
        where: {
            idProduct: data.idProduct,
            idCustomer: data.idCustomer
        }
    })

    return {
        error: null,
        message: 'Product remove to favorites'
    }
}




export async function createCustomers(data: any) {
    const findCustomers = await prisma.customers.findFirst({
        where: {
            email: data.email
        }
    })

    if(findCustomers) {
        return {
            error: true,
            message: 'Customer already exists'
        }
    }

    await prisma.customers.create({
        data: {
            email: data.email,
            name: data.name
        }
    })
    return {
        error: null,
        message: 'Customer created successfully'
    }
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