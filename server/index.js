const keys = require('./keys');

// setup
const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(parser.json());

// init postgres
const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort
});

pgClient.on("connect", (client) => {
  client
	.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// init redis
const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// request handling
app.get('/', (req, resp) => {
	resp.send('Hello There!');
});

app.get('/values/all', async (req, resp) => {
	const values = await pgClient.query('SELECT * FROM values');
	resp.send(values.rows);
});

app.get('/values/current', async (req, resp) => {
	redisClient.hgetall('values', (err, values) => {
		resp.send(values);
	});
});

app.post('/values', async (req, resp) => {
	const index = req.body.index;
	
	if (parseInt(index) > 40) {
		return resp.status(422).send('Index is too high');
	}
	
	redisClient.hset('values', index, 'Nothing Yet!');
	redisPublisher.publish('insert', index);
	
	pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
	
	resp.send({ working: true });
});

app.listen(5000, (err) => {
	console.log('listening');
});