import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import {createClient} from '@hexabase/hexabase-js' 

const baseUrl = `${process.env.URL}`;
export const workspaceService = {
    getWorkspaces,
    setWorkspace
};

// get all workspaces
async function getWorkspaces() {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url: baseUrl, token: user.token})
    const {workspaces, error} = await hexabase.workspaces.get()
    return workspaces
}

// set workspace current id
async function setWorkspace(id) {
    const user = JSON.parse(localStorage.getItem('user'))
    const setCurrentWsPl = {
        workspace_id: id
    }
    const hexabase = await createClient({ url: baseUrl, token: user.token})
    const {data, error} = await hexabase.workspaces.setCurrent(setCurrentWsPl)
    return data
}


