# aws-elasticcache-issue

### Step 1
```bash
npm i
```

### Step 2
```bash
cp .env.defaults .env
```
After provide values for vars

### Step 3
```bash
npm run start
```

### Step 4
Open a link (http://localhost:3000) in a browser

### Step 5
Monitor output




*In order to connect to the ElasticCache Redis with local machine you need to run the following command*
```bash
ssh -N -L 6379:amazon.elastic.cache.redis.instance:6379 forge@ip.of.remote.server -i /Users/Shared/.ssh/secret_file
```

*If you want to run Redis in docker container then you must run command below*
```bash
docker-compose up -d
```
