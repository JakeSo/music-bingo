import 'dotenv/config';
import express from 'express';
import querystring from 'querystring';
import { Buffer } from 'buffer';
import axios from 'axios';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
const app = express();
const server = createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: 'http://localhost:5173'
        }
    });
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const state = Math.random().toString(20).slice(2, 6);
const redirect_uri = "http://localhost:8888/callback";
app.use(cors({ credentials: true, origin: "http://localhost:5173"}))
app.use(cookieParser());


app.get('/login', (req, res) => {

    //Spotify Auth
    // var state = generateRandomString(16);
    var scope = 'streaming user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope,
            redirect_uri,
            state: state
        })
    );
});

app.get('/callback', (req, res) => {

    var code = req.query.code || null;
    var reqState = req.query.state || null;

    if (!reqState || reqState != state) {
        console.error("Invalid state")
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        axios.post(authOptions.url, authOptions.form, { headers: authOptions.headers })
            .then(response => {
                console.log(response.data);
                res.cookie('authToken', response.data.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: response.data.expires_in * 1000

                })
                res.cookie('refreshToken', response.data.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: response.data.expires_in * 1000

                })

                res.redirect('http://localhost:5173/host');
            })
            .catch(error => console.error(error.data));

    }
})

app.get('/verify', (req, res) => {
    var authToken = req.cookies?.authToken;
    var refreshToken = req.cookies?.refreshToken;
    if (!authToken) {

        if (!refreshToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        } else {
            var expires_in = "";
            authToken, refreshToken, expires_in = refreshToken(refreshToken);
            if (!authToken) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                res.cookie('authToken', authToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: expires_in * 1000

                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: expires_in * 1000

                });
            }
        }
    } else {
        res.status(200).send();
    }
});

const refreshToken = (refresh_token) => {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    axios.post(authOptions.url, authOptions.form, { headers: authOptions.headers }).then(response => {
        if (response.statusCode === 200) {
            return response.data.access_token, response.data.refreshToken, response.data.expires_in
        } else {
            return;
        }});
};

app.get('*', (req, res) => {

})

app.get('/host', (req, res) => {
    //Generate game code

});

app.get('/join', (req, res) => {

})

server.listen(8888, () => {
    console.log("Server listening on port 8888");
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('create room', (roomCode) => {
        socket.join(roomCode);
        console.log(`Room created with code: ${roomCode}`);
    });

    socket.on('join room', (roomCode, name, callback) => {
        const rooms = io.sockets.adapter.rooms;
        console.dir(rooms);
        if (rooms.has(roomCode) && !rooms.get(roomCode)?.has(socket.id)){
            socket.join(roomCode);
            io.to(roomCode).emit('user joined', { socketId: socket.id, name: name })
            console.log(`User joined room: ${roomCode}`);
            callback(true);
        } else if (!rooms.get(roomCode)?.has(socket.id)){
            callback(false);
            console.log(`Invalid room.`);
        }
    });

    socket.on('close room', roomCode => {
        console.log('closing room ' + roomCode);
        io.socketsLeave(roomCode);
    })

    socket.on('play song', (roomCode, song) => {
        io.to(roomCode).emit('play song', song);
    });

    socket.on('leaving room', () => {
        console.log(socket.rooms);
        socket.rooms.forEach( room => {
            if (room != socket.id) {
                socket.to(room).emit('user left', socket.id);
            }
        })
    })

    socket.on('disconnect', () => {
        
        console.log('user disconnected');
    });
});
