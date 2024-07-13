import {app} from './server';
import { createValidateCode, sendEmailSignUpValidation, validateEmail, validatePassword } from './shared/util';
import { createProduct, getAllProductsActive, slugExists, updateProduct } from './actions';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from './shared/connections';
import { products } from '@prisma/client'

export async function Routes() {
    const id = uuidv4();

    app.get('/', async (req, res) => {
        const products = await getAllProductsActive()
        res.send(products);
    });

    app.post('/product/new', async (req, res, next) => {
        const data: products = req.body
        if(!data.name || !data.slug || !data.value) return res.status(500).send('Bad Request \n Informations is required')

        const isExists = await slugExists(data.slug)
        if(isExists) return res.status(400).send('Bad Request \n Product already exists')

        // redisClient.hSet(`credential:${id}`, {username, email, password})

        if(await createProduct(data) === 200) {
            return res.status(200).send('Product Create !!')
        } else {
            return res.status(500).send('Error !!')
        }
    });
    
    app.put('/product/edit/:slug', async (req, res, next) => {
        const productSlug = req.params.slug

        if(await updateProduct(productSlug, req.body) === 200) {
            return res.status(200).send('Product Update Success!')
        }
        return res.status(500).send('Product Update Error!')
    })
}