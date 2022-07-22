import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import {createClient} from '@hexabase/hexabase-js' 

const baseUrl = `${process.env.URL}`;
export const itemService = {
    getItems,
    getItemDetail
};

async function getItems(datastoreId, projectId, getItemsParameters) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url: baseUrl, token: user.token})
    const {dsItems, error} = await hexabase.items.get(getItemsParameters, datastoreId, projectId)
    return dsItems
}

async function getItemDetail(datastoreId, itemId) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url: baseUrl, token: user.token})
    const {itemDetails, error} = await hexabase.items.getItemDetail(datastoreId, itemId)
    return itemDetails
}


