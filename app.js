const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongo = require("mongoose");
let db = "mongodb+srv://vedupaji:8490856735@cluster0.rkl7h.mongodb.net/vartchat?retryWrites=true&w=majority"
mongo.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Done");
}).catch(() => {
    console.log("Sorry");
});

let user_real_feedback = {};
let store_data_in_database = mongo.model('users_feedback10', {
    name: { type: String },
    message: { type: String }
});

const save_data_of_user = () => {
    let data_of_user = new store_data_in_database({
        "name": user_real_feedback.name,
        "message": user_real_feedback.message
    });

    data_of_user.save((err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result[2])
        }
    })

   /* store_data_in_database.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data)
        }
    })*/
}

app.set('view engine', 'hbs')
app.get('/', (req, res) => {
    res.render("index")
});


http.listen(port, () => {
    console.log(`Ok`);
});

io.on('connection', (socket) => {
    console.log(`Connected`);
    socket.on('get_data', (user_feedback) => {
        user_real_feedback.name = user_feedback.name;
        user_real_feedback.message = user_feedback.message;
        //console.log(user_real_feedback);
        save_data_of_user();
    })
    socket.on('disconnect', () => {
        console.log("bye")
    })
});