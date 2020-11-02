const Playlist = require("../models/playlist");
const User = require("../models/user");

/**
 * 
 * @param {*} req 
 * @param {*} res
 * Import User Playlist 
 */
exports.ImportPlaylist = (req, res) => {
    const parameters = {
        playlist: req.body.playListArray,
        userid: req.params.userId
    };
    const promiseArra = [];
    
    User.findOne({ 
        _id: parameters["userid"]
    }).then( (response) => {

        if (!response){
            return res.status(404).send({
                message: 'User does not exist'
            });
        }

        parameters.playlist.forEach( (error) => {
            promiseArra.push(test(error, response.id, response.email));
        });

        Promise.all(promiseArra).then( () => {

            Playlist.find().then( (lists) => {

                const PlaylistArray = []

                lists.forEach( (list) => {
                    list.users.forEach( (userResponse) => {
                        if (userResponse.id == parameters.userid && list.type == 'private'){
                            PlaylistArray.push(list);
                        }
                    });
                });

                lists.forEach( (list) => {
                    if (list.type == 'public'){
                        PlaylistArray.push(list);
                    }
                });
                
                lists.forEach( (list) => {
                    list.songs = _.sortBy(list.songs, ['grade']);
                });

                return res.json({
                    message: 'User playLists',
                    playLists: PlaylistArray
                });
            });
        });
    });
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Delete User From Playlist 
 */
exports.DeleteUserFromPlaylist = (req, res) => {

    const parameters = {
        PId: req.params.playListId,
        user: req.params.userIdToDelete
    };

    Playlist.findOne({
        _id: parameters["PId"]
    }).then((response) => {

        if (!response) {

            return res.status(404).send({
                message: 'PlayList does not exist'
            });

        }

        let index = -1;

        response.users.forEach((user, key) => {

            if (parameters["user"] == user.id) {
                index = key;
            }

        })

        response.users.splice(index, 1);

        Playlist.findOneAndUpdate({
            _id: parameters["PId"]
        }, {
            $set: {
                users: response.users
            }
        }, {
            new: true
        }).then((list) => {

            list.songs = _.sortBy(list.songs, ['grade']);

            return res.json({
                message: 'User playList',
                list
            });

        }).catch((error) => {

            return res.status(500).send({
                message: "Server related error occured!"
            });

        });
    });
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Add Music To Playlist 
 */
exports.AddMusicToPlaylist = (req, res) => {

    const parameters = {
        PId: req.params.playListId,
        userid: req.params.userId,
        songid: req.params.newId,
        songname: req.params.songName
    };

    Playlist.findOne({
        _id: parameters["PId"]
    }).then((response) => {

        if (!response) {
            return res.status(404).send({
                message: 'Playlist does exist'
            });
        }

        let test = false;

        response.users.forEach((user) => {
            if (user.id == parameters["userid"] && user.role == 'RW') {
                test = true;
            }
        });

        if (!test) {
            return res.status(403).send({
                message: 'User not permitted to the playlist'
            });
        }

        const songs = response.songs;

        songs.push({
            id: parameters["songid"],
            grade: songs.length - 1,
            name: parameters["songname"]
        });

        Playlist.findOneAndUpdate({
            _id: parameters["PId"]
        }, {
            $set: {
                songs
            }
        }, {
            new: true
        }).then((list) => {
            list.songs = _.sortBy(list.songs, ['grade'])

            return res.json({
                message: 'User playlist',
                list
            });
        }).catch((error) => {

            return res.status(500).send({
                message: "Server related error occured!"
            });

        });
    })

}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Update Private Playlist 
 */
exports.UpdatePrivatePlaylist = (req, res) => {

    const bodyParams = {
        type: req.body.type,
        email: req.body.email
    };
    const urlParams = {
        PId: req.params.playListId,
        userid: req.params.userId
    };

    Playlist.findOne({
        _id: urlParams["PId"]
    })
        .then((response) => {

            if (!response) {
                return res.status(404).send({
                    message: 'Playlist not found'
                });
            }

            User.findOne({
                email: bodyParams["email"]
            }).then((userResponse) => {

                if (!userResponse) {
                    return res.status(404).send({
                        message: 'User does not exist'
                    });
                }
                if (userResponse._id.toString() == urlParams["userid"]) {
                    return res.status(403).send({
                        message: 'Creator can not be added'
                    });
                }

                let test = false;
                let doubleUser = false;
                let index = -1;

                response.users.forEach((userResponse_2, key) => {
                    if (userResponse_2.id == urlParams["userid"] && userResponse_2.role == 'RW') {
                        test = true;
                    }
                    if (userResponse._id.toString() === userResponse_2.id) {
                        doubleUser = true;
                        index = key;
                    }
                })
                if (!test) {
                    return res.status(403).send({
                        message: 'User not permitted to access playlist'
                    });
                }

                const users = response.users;
                let temp = 'R';

                if (bodyParams["type"] == 'read') {
                    temp = 'R';
                }

                if (bodyParams["type"] == 'read&&write') {
                    temp = 'RW';
                }

                if (!doubleUser) {
                    users.push({
                        id: user.id,
                        role: temp,
                        email: user.email,
                        super: false
                    });
                } else {
                    users[index] = {
                        id: user.id,
                        role: temp,
                        email: user.email,
                        super: false
                    };
                }

                Playlist.findOneAndUpdate({
                    _id: urlParams["PId"]
                }, {
                    $set: {
                        users
                    }
                }, {
                    new: true
                })
                    .then((list) => {

                        list.songs = _.sortBy(list.songs, ['grade']);

                        return res.json({
                            message: 'Your playList',
                            list
                        });

                    }).catch((error) => {

                        return res.status(500).send({
                            message: "Server related error occured!"
                        });

                    });
            });
        });

}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Update Public Playlist 
 */
exports.UpdatePublicPlaylist = (req, res) => {
    const parameters = {
        PId: req.params.playListId,
        userid: req.params.userId
    };

    Playlist.findOne({
        _id: parameters["PId"]
    })
        .then((playList, response) => {
            if (!response) {
                return res.status(404).send({
                    message: 'Playlist not available'
                });
            }

            let test = false

            response.users.forEach((userResponse) => {
                if (userResponse.id == parameters["userid"] && userResponse.role === 'RW') {
                    test = true
                }
            });

            if (!test) {
                return res.status(403).send({
                    message: "Access not permitted to the playlist!"
                });
            }

            Playlist.findOneAndUpdate({
                _id: parameters["PId"]
            }, {
                $set: {
                    songs: req.body.songs,
                    users: req.body.users,
                    description: req.body.description,
                    type: req.body.type
                }
            }, {
                new: true
            }).then((list) => {
                list.songs = _.sortBy(list.songs, ['grade']);

                return res.json({
                    message: 'Your playList',
                    "playlist": list
                });
            }).catch((error) => {
                return res.status(500).send({
                    message: "Server related error occured!"
                });
            });

        }).catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * Get Playlist By Name 
 */
exports.GetUserPlaylistWithName = (req, res) => {
    const parameters = {
        name: req.params.name,
        userid: req.params.userId
    };

    Playlist.findOne({
        name: parameters["name"]
    })
        .then((response) => {

            if (response.type == 0) {
                let test = false;

                response.users.forEach((userresponse) => {
                    if (userresponse.id == parameters["userid"]) {
                        test = true;
                    }
                });

                if (!test) {
                    return res.status(403).send({
                        message: 'Access not permitted to the playlist!'
                    });
                }
            }

            return res.json({
                message: 'Your playList',
                "playList": response
            });
        }).catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.GetAllUserPlaylists = (req, res) => {
    const parameters = {
        userid: req.params.userId
    };

    Playlist.find()
        .then((playLists, response) => {

            const playlistArray = [];

            response.forEach((list) => {
                list.users.forEach((listResponse) => {
                    if (listResponse.id == parameters["userid"] && list.type == 'private') {
                        playlistArray.push(list)
                    }
                });
            });

            response.forEach((list) => {
                if (list.type === 'public') {
                    playlistArray.push(list)
                }
            });

            response.forEach((list) => {
                list.songs = _.sortBy(list.songs, ['grade']);
            });

            return res.json({
                message: 'Your playLists',
                "playLists": playlistArray
            });
        }).catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * Create Playlist 
 */
exports.CreatePlaylist = (req, res) => {
    const parameters = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        users: req.body.users
    };

    if (!parameters || !parameters["name"]) {
        return res.status(401).send({
            message: 'All fields are required!'
        });
    }

    Playlist.findOne({
        name: parameters.name
    })
        .then((response) => {
            if (response) {
                return res.status(400).send({
                    message: 'Playlist with a name already exist!'
                });
            } else {
                const playlist = new Playlist(parameters);
                //Save playlist
                playlist.save((error) => {

                    if (error) {
                        return res.status(500).send({
                            message: "Server related error occured!"
                        });
                    }

                    return res.json({
                        message: 'Your playList',
                        "playlist": playlist
                    });

                });
            }
        })
        .catch((error) => {
            return res.status(500).send({
                message: "Server related error occured!"
            });
        });
}