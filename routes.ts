import {app} from './server';
import { createValidateCode, sendEmailSignUpValidation, validateEmail, validatePassword } from './shared/util';
import { addToCart, addToFavorites, createCustomers, createProduct, deleteProduct, getAllProductsActive, removeToCart, removeToFavorites, slugExists, updateProduct } from './actions';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from './shared/connections';
import { cart, customers, favorites, products } from '@prisma/client'

export async function Routes() {
    const id = uuidv4();
    app.get('/api/products', async (req, res) => {
        const products = await getAllProductsActive()
        res.send(products);
    });

    app.post('/api/product/new', async (req, res, next) => {
        const data: products = req.body
        if(!data.name || !data.slug || !data.price) return res.status(500).send('Bad Request \n Informations is required')
        const isExists = await slugExists(data.slug)
        if(isExists) return res.status(400).send('Bad Request \n Product already exists')
        const action = await createProduct(data)
        // redisClient.hSet(`credential:${id}`, {username, email, password})

        if(action.error === null)
        return res.status(200).send(action.message)
        
        return res.status(500).send(action.message)
        
    });
    app.put('/api/product/edit/:slug', async (req, res, next) => {
        const productSlug = req.params.slug
        const action = await updateProduct(productSlug, req.body)
        if(action.error === null)
        return res.status(200).send(action.message)
        
        return res.status(500).send(action.message)
    })
    app.delete('/api/product/delete/:slug', async (req,res, next) => {
        const productSlug = req.params.slug
        const action = await deleteProduct(productSlug)
        if(action.error === null) 
        return res.status(200).send(action.message)
        
        return res.status(500).send(action.message)
    })


    app.post('/api/favorites', async (req, res, next) => {
        const data: favorites = req.body
        const action = await addToFavorites(data)
        if(action.error === null) 
        return res.status(200).send(action.message)

        return res.status(500).send(action.message)
    })
    app.delete('/api/favorites', async (req, res, next) => {
        const data: favorites = req.body
        const action = await removeToFavorites(data)
        if(action.error === null) 
        return res.status(200).send(action.message)

        return res.status(500).send(action.message)
    })


    app.post('/api/cart', async (req, res, next) => {
        const data: cart = req.body
        const action = await addToCart(data)
        if(action.error === null) 
        return res.status(200).send(action.message)

        return res.status(500).send(action.message)
    })
    app.delete('/api/cart', async (req, res, next) => {
        const data: cart = req.body
        const action = await removeToCart(data)
        if(action.error === null) 
        return res.status(200).send(action.message)

        return res.status(500).send(action.message)
    })

    app.post('/api/confirm-purchase', async (req, res, next) => {
        const data: cart = req.body
        const action = await addToCart(data)
        if(action.error === null) 
        return res.status(200).send(action.message)

        return res.status(500).send(action.message)
    })

    app.post('/api/customer', async (req, res, next) => {
        const random = Math.floor(Math.random() * 999)
        const data = {
            email: `teste${random}@mail.com`,
            name: `teste${random}`
        }
        const action = await createCustomers(data)
        if(action.error === null)
        return res.status(200).send(action.message +'\n'+ data.email + '\n' + data.name)

        return res.status(500).send(action.message)
    })
}