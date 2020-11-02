const Room = require("../models/room");
const User = require("../models/user");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.DeleteUser = (req, res) => {
    const paramters = {
        roomid: req.params.roomId,
        userid: req.params.userIdToDelete
    };

    Room.findOne({
        _id: paramters.roomid
    })
    .then( (roomResponse) => {

        if (!roomResponse){
            return res.status(404).send({ message: 'No room found' });
        }

        let counter = -1;
        roomResponse.users.forEach((user, key) => {

            if (paramters.userid.toString() == user.id) {
              counter = key
            }

        });

        roomResponse.users.splice(counter, 1);

        Room.findOneAndUpdate({
            _id: paramters.roomid
        }, {
            $set: {
                users: roomResponse.users
            }
        }, {
            new: true
        }).then( (roomResponse_2) => {
            roomResponse_2.songs = _.sortBy(roomResponse_2.songs, ['vote'], ['desc']);
            return res.json({
                message: 'User room', room
            });
        }).catch( (error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
    })
    .catch( (error) => {
        return res.status(500).send({
            message: "Server related error occured!"
        });
    });
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Add Music TO Play List 
 */
exports.AddToMusicList = (req, res) => {
    const parameters = {
        roomid: req.params.roomId,
        newid: req.params.newId,
        track: req.params.songName
    };

    Room.findOne({
        _id: parameters["roomid"]
    }).then( (roomResponse) => {
        
        if (!roomResponse){ 
            return res.status(404).send({
                message: 'Room not found'
            });
        }

        const songs = roomResponse.songs;
        
        songs.push({
            id: parameters["newid"],
            grade: songs.length - 1,
            name: parameters["track"],
            vote: 0
        });
        
        Room.findOneAndUpdate({
            _id: parameters["roomid"]
        }, {
            $set: { songs }
        }, {
            new: true
        }).then(roomResponse_2 => {
            roomResponse_2.songs = _.sortBy(roomResponse_2.songs, ['vote'], ['desc']);
  
            return res.json({
                message: 'Your room', roomResponse_2
            });
        }).catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
      })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * Update Private Room 
 */
exports.PrivateRoomUpdate = (req, res) => {
    //const params = filter(req.body, updateParamsPrivate)
    const parameters = {
        roomid: req.params.roomId,
        type: req.body.type,
        email: req.body.email,
        location: req.body.location,
        userid: req.params.userId
    };

    Room.findOne({
        _id: parameters["roomid"]
    })
        .then((respose) => {
            if (!response) {
                return res.status(404).send({ message: 'Room does not exist!' });
            }

            User.findOne({
                email: parameters["email"]
            })
                .then((userResponse) => {
                    if (!userResponse) {
                        return res.status(404).send({
                            message: 'User not found'
                        });
                    }

                    if (userResponse._id.toString() == parameters["userid"]) {
                        return res.status(403).send({
                            message: `Creator can not be added!`
                        });
                    }
                    let test = false
                    let doubleUser = false
                    let index = -1
                    userResponse.users.forEach((user, key) => {
                        if (user.id == parameters["userid"]) {
                            test = true;
                        }
                        if (userResponse._id.toString == user.id) {
                            doubleUser = true;
                            index = key;
                        }
                    });

                    if (!test) {
                        return res.status(403).send({
                            message: 'YOu are not invited to access this room.'
                        });
                    }

                    const users = respose.users;
                    let temp = "R";
                    if (parameters.type.toString() == 'read') {
                        temp = 'R';
                    }
                    if (parameters.type.toString() == 'read&&write') {
                        temp = 'RW'
                    }
                    if (!doubleUser) {
                        users.push({
                            id: userResponse.id,
                            role: temp,
                            email: userResponse.email,
                            super: false
                        });
                    } else {
                        users[index] = {
                            id: userResponse..id,
                            role: temp,
                            email: userResponse.email,
                            super: false
                        };
                    }
                    Room.findOneAndUpdate({
                        _id: req.params.roomId
                    }, {
                        $set: { users }
                    }, {
                        new: true
                    })
                        .then(roomResponse => {
                            roomResponse.songs = _.sortBy(roomResponse.songs, ['vote'], ['desc']);
                            //Return user room
                            return res.json({
                                message: 'User room', roomResponse
                            });
                        }).catch((error) => {
                            return res.status(500).send({
                                message: "Server related error occured!"
                            });
                        });
                })
                .catch((error) => {
                    return res.status(500).send({
                        message: "Server related error occured!"
                    });
                });
        })
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Update Public Room 
 */
exports.PublicRoomUpdate = (req, res) => {
    const parameters = {
        songs: req.body.songs,
        users: req.body.users,
        description: req.body.description,
        location: req.body.location,
        type: req.body.type,
        roomid: req.params.roomId
    };

    Room.find({
        _Id: parameters["roomid"]
    })
        .then((response) => {
            if (!response.type == 0) {
                return res.status(404).send({
                    message: "Room not found"
                });
            }
            Room.findOneAndUpdate({
                _Id: parameters["roomid"]
            }, {
                $set: params
            }, {
                new: true
            })
                .then((response) => {
                    response.songs = _.sortBy(response.songs, , ['vote'], ['desc']);

                    return res.json({ message: 'Your room', room })
                })
                .catch((error) => {
                    return res.status(500).send({
                        message: "Server related error occured!"
                    });
                });

        })
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });

}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Get Room By Name 
 */
exports.RoomName = (req, res) => {
    const parameters = {
        name: req.params.name,
        id: req.params.userId
    };

    Room.find({
        name: parameters["name"]
    })
        .then((response) => {
            if (response.type == 0) {
                let isUser = false;
                response.users.forEach((user) => {
                    if (parameters["id"] == user.id) {
                        isUser = true;
                    }

                    if (!isUser) {
                        return res.status(403).send({
                            message: 'An error occured trying to access the room, it might be because you do not have permission to access room!'
                        });
                    }
                });
            }
            return res.json({
                message: 'Room you created', response
            });
        })
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });

}
/**
 * 
 * @param {*} Degrees
 * Conver egrees to Radius 
 */
const ConvertDToR = (Degrees) => {
    const constant = 180;
    return Degrees * (Math.PI / constant);
}
/**
 * All calculations in KMs
 * 
 * @param {*} LatPos1 
 * @param {*} LongPos1 
 * @param {*} LatPos2 
 * @param {*} LongPos2 
 */
const GetOtherUsersDistance = (LatPos1, LongPos1, LatPos2, LongPos2) => {
    const R = 6371 // Radius of the earth in km
    const LatDistance = ConvertDToR(LatPos2 - LatPos1);
    const LongDistance = ConvertDToR(LongPos2 - LongPos1);
    const Area = (((Math.sin(LatDistance / 2) * Math.sin(LatDistance / 2)) + (Math.cos(ConvertDToR(LatPos1)) * Math.cos(ConvertDToR(LatPos2)))) * (Math.sin(LongDistance / 2) * Math.sin(LongDistance / 2)))
    const EarthRadius = 6371;
    const Displacement = 2 * Math.atan2(Math.sqrt(Area), Math.sqrt(1 - Area));

    return Radius * Displacement;
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * 
 * All rooms 
 */
exports.GetAllRooms = (req, res) => {
    const parameters = {
        long: req.params.long,
        lat: req.params.lat,
        userid: req.params.userId
    };

    Room.find()
        .then((response => {
            //Store All Rooms
            let AllRoms = [];
            response.forEach((eachRoom) => {

                if (parameters["lat"] && parameters["long"]) {
                    if ((eachRoom.type === 'private' && eachRoom.location.active == 1
                        && (eachRoom.location.distance >= GetOtherUsersDistance(eachRoom.location.center.lat, eachRoom.location.center.long, parameters["lat"], parameters["long"]))) || eachRoom.type === 'public')
                        AllRoms.push(eachRoom);
                    else {
                        eachRoom.users.forEach((user) => {
                            if (eachRoom.type == 'private' && user.id == parameters["userid"])
                                AllRoms.push(eachRoom);
                        });
                    }
                });
            return res.json({
                message: 'Rooms you have created', rooms: eachRoom
            });
        }))
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });

}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * 
 * Create Room
 * 
 *  **/
exports.Create = (req, res) => {
    //Get Params
    const parameters = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        type: req.body.type,
        users: req.body.users,
        songs: req.body.songs
    }
    //Check if is not null
    if (!parameters || !parameters["name"] || !parameters["description"]) {
        //return 404
        return res.status(401).send({
            message: "One or more input field is empty"
        });
    }
    //Find Room
    Room.findOne(name: parameters.["name"])
        .then((response) => {
            if (response)
                return res.status(400).send({
                    message: `A room with a name of ${parameters["name"]}, already exist!`
                });

            const room = new Room({
                name: parameters["name"],
                description: parameters["description"],
                type: parameters["type"],
                users: parameters["users"],
                location: {
                    active: 0,
                    center: {
                        lat: 0,
                        long: 0
                    },
                    distance: 0
                }
            });

            room.save((error) => {
                if (error)
                    return res.status(500).send({
                        message: "An error occured saving a room"
                    });

                return res.send({
                    message: `Room has been successfully saved ${room}`
                });
            });
        })
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
} 