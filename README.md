# NEXT-HXB-SDK is a example using Hexabase with package hexabase-sdk(@hexabase/hexabase-js)

This is a example nextjs with hexabase-sdk:

- Frontend:
  - Next.js.
- Backend:
  - [hexabase.com](https://www.hexabase.com/):
  - [@hexabase/hexabase-js](https://www.npmjs.com/package/@hexabase/hexabase-js): Using hexabase sdk

### - Create new project

Sign up to Hexabase - [https://www.hexabase.com/](https://www.hexabase.com/) and create a new project. Wait for your database to start.


## How to use

### - Using `create-next-app`

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example locally:

```bash
npx create-next-app --example https://github.com/b-eee/next-hxb-sdk hexabase-next-sdk
```

### - Using this repo

After you clone this repo, you can do step by step:

### - Required configuration

Copy the `.env.example` file into a file named `.env` in the root directory of the example:

```bash
cp .env.example .env
```

Set your Hexabase url ro accept service graphql of hexabase

```bash
BASE_URL = https://hxb-graph.hexabase.com/graphql
```
### - Run the development server

Now install the dependencies and start the development server.

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Visit http://localhost:3000 ! Open your browser with this url
### - You should login with your account:

![Image Login](https://user-images.githubusercontent.com/85870043/175240151-b0a9c31f-99f7-4822-954e-8ceead79bb9b.png)
### - You will see all your dashboard:
![Image Dashboard](https://user-images.githubusercontent.com/85870043/175240363-e8b5f25e-a762-46d3-b96a-a1be868fd5d7.png)

### - Your Item when you choice one datastore:
![Image Items](https://user-images.githubusercontent.com/85870043/175240577-32711f61-6eff-401a-b761-711e496635d0.png)
## Authors

- [Hexabase](https://hexabase.com)

Hexabase is open source, You can follow at https://github.com/b-eee