const Playlist = require("../models/playlist");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const axios = require("axios");
const { generateServerError } = require("../utils/utils");

/**
 *
 * @param {*} req
 * @param {*} res
 * Import User Playlist
 */
exports.ImportPlaylist = (req, res) => {
  const parameters = {
    playlist: req.body.playListArray,
    userid: req.params.userId,
  };
  const promiseArra = [];

  User.findOne({
    _id: parameters["userid"],
  }).then((response) => {
    if (!response) {
      return res.status(404).send({
        message: "User does not exist",
      });
    }

    parameters.playlist.forEach((error) => {
      promiseArra.push(test(error, response.id, response.email));
    });

    Promise.all(promiseArra).then(() => {
      Playlist.find().then((lists) => {
        const PlaylistArray = [];

        lists.forEach((list) => {
          list.users.forEach((userResponse) => {
            if (
              userResponse.id == parameters.userid &&
              list.type == "private"
            ) {
              PlaylistArray.push(list);
            }
          });
        });

        lists.forEach((list) => {
          if (list.type == "public") {
            PlaylistArray.push(list);
          }
        });

        lists.forEach((list) => {
          list.songs = _.sortBy(list.songs, ["grade"]);
        });

        return res.json({
          message: "User playLists",
          playLists: PlaylistArray,
        });
      });
    });
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * Delete User From Playlist
 */
exports.DeleteUserFromPlaylist = (req, res) => {
  const parameters = {
    PId: req.params.playListId,
    user: req.params.userIdToDelete,
  };

  Playlist.findOne({
    _id: parameters["PId"],
  }).then((response) => {
    if (!response) {
      return res.status(404).send({
        message: "PlayList does not exist",
      });
    }

    let index = -1;

    response.users.forEach((user, key) => {
      if (parameters["user"] == user.id) {
        index = key;
      }
    });

    response.users.splice(index, 1);

    Playlist.findOneAndUpdate(
      {
        _id: parameters["PId"],
      },
      {
        $set: {
          users: response.users,
        },
      },
      {
        new: true,
      }
    )
      .then((list) => {
        list.songs = _.sortBy(list.songs, ["grade"]);

        return res.json({
          message: "User playList",
          list,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: "Server related error occured!",
        });
      });
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * Add Music To Playlist
 */
exports.AddMusicToPlaylist = (req, res) => {
  const parameters = {
    PId: req.params.playListId,
  };

  Playlist.findOne({
    _id: parameters["PId"],
  }).then((response) => {
    if (!response) {
      return res.status(404).send({
        message: "Playlist does'nt exist",
      });
    }

    let test = false;

    response.users.forEach((user) => {
      if (user.id == parameters["userid"] && user.role == "RW") {
        test = true;
      }
    });

    if (!test) {
      return res.status(403).send({
        message: "User not permitted to the playlist",
      });
    }

    const songs = response.songs;

	//add request to deezer to add track
	
    songs.push({
      id: parameters["songid"],
      grade: songs.length - 1,
      name: parameters["songname"],
    });

    Playlist.findOneAndUpdate(
      {
        _id: parameters["PId"],
      },
      {
        $set: {
          songs,
        },
      },
      {
        new: true,
      }
    )
      .then((list) => {
        list.songs = _.sortBy(list.songs, ["grade"]);

        return res.json({
          message: "User playlist",
          list,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: "Server related error occured!",
        });
      });
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * Update Private Playlist
 */
exports.UpdatePrivatePlaylist = (req, res) => {
  const bodyParams = {
    type: req.body.type,
    newUser: req.body.newUser,
  };
  const urlParams = {
    PId: req.params.playListId,
    userid: req.params.userId,
  };

  Playlist.findOne({
    _id: urlParams["PId"],
  }).then((response) => {
    if (!response) {
      return res.status(404).send({
        message: "Playlist not found",
      });
    }

    User.findOne({
      username: bodyParams["newUser"],
    }).then((userResponse) => {
      if (!userResponse) {
        return res.status(404).send({
          message: "User does not exist",
        });
      }
      if (userResponse._id.toString() == urlParams["userid"]) {
        return res.status(403).send({
          message: "Creator can not be added",
        });
      }

      let test = false;
      let doubleUser = false;
      let index = -1;

      response.users.forEach((userResponse_2, key) => {
        if (
          userResponse_2.id == urlParams["userid"] &&
          userResponse_2.role == "RW"
        ) {
          test = true;
        }
        if (userResponse._id.toString() === userResponse_2.id) {
          doubleUser = true;
          index = key;
        }
      });
      if (!test) {
        return res.status(403).send({
          message: "User not permitted to access playlist",
        });
      }

      const users = response.users;
      let temp = "R";

      if (bodyParams["type"] == "read") {
        temp = "R";
      }

      if (bodyParams["type"] == "read&&write") {
        temp = "RW";
      }

      if (!doubleUser) {
        users.push({
          id: user.id,
          role: temp,
          username: user.username,
          super: false,
        });
      } else {
        users[index] = {
          id: user.id,
          role: temp,
          username: user.username,
          super: false,
        };
      }

      Playlist.findOneAndUpdate(
        {
          _id: urlParams["PId"],
        },
        {
          $set: {
            users,
          },
        },
        {
          new: true,
        }
      )
        .then((list) => {
          list.songs = _.sortBy(list.songs, ["grade"]);

          return res.json({
            message: "Your playList",
            list,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: "Server related error occured!",
          });
        });
    });
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * Update Public Playlist
 */
exports.UpdatePublicPlaylist = (req, res) => {
  const parameters = {
    PId: req.params.playListId,
    userid: req.params.userId,
  };

  Playlist.findOne({
    _id: parameters["PId"],
  })
    .then((playList, response) => {
      if (!response) {
        return res.status(404).send({
          message: "Playlist not available",
        });
      }

      let test = false;

      response.users.forEach((userResponse) => {
        if (
          userResponse.id == parameters["userid"] &&
          userResponse.role === "RW"
        ) {
          test = true;
        }
      });

      if (!test) {
        return res.status(403).send({
          message: "Access not permitted to the playlist!",
        });
      }

      Playlist.findOneAndUpdate(
        {
          _id: parameters["PId"],
        },
        {
          $set: {
            songs: req.body.songs,
            users: req.body.users,
            description: req.body.description,
            type: req.body.type,
          },
        },
        {
          new: true,
        }
      )
        .then((list) => {
          list.songs = _.sortBy(list.songs, ["grade"]);

          return res.json({
            message: "Your playList",
            playlist: list,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: "Server related error occured!",
          });
        });
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Server related error occured!",
      });
    });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * Get Playlist By Name
 */
exports.GetUserPlaylistWithName = (req, res) => {
  const parameters = {
    name: req.params.name,
    userid: req.params.userId,
  };

  Playlist.findOne({
    name: parameters["name"],
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
            message: "Access not permitted to the playlist!",
          });
        }
      }

      return res.json({
        message: "Your playList",
        playList: response,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Server related error occured!",
      });
    });
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.GetAllUserPlaylists = (req, res) => {
  const url = `https://api.deezer.com/user/me/playlists?access_token=${req.user.deezerToken}`;

  axios
    .get(url)
    .then((result) => {
      /* res.json({ success: true, playList: result.data }); */
      console.log(result.data);
      res.status(200).send({ success: true, playLists: result.data.data });
    })
    .catch((err) => {
      const resStatusCode = 500;
      const fullError = { success: false, errors: err.array() };
      const message = "Something went wrong in server";
      return generateServerError(res, resStatusCode, fullError, message);
    });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * Create Playlist
 */
exports.CreatePlaylist = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Playlist.findOne({
    name: req.body.title,
  })
    .then((response) => {
      if (response) {
        return res.status(400).send({
          message: "Playlist with a name already exist!",
        });
      } else {
        //api call to deezer
        /* const deezerId = "555605401";
        const deezerToken =
          "frGBBx2Ae5OTAJuuSwUaq7t1LRCz9nR4WFrdZOfWb5F0lFg30h";

        const url = `https://api.deezer.com/user/${deezerId}/playlists?title=${req.body.title}&access_token=${deezerToken}`; */

        const url = `https://api.deezer.com/user/${req.user._deezerId}/playlists?title=${req.body.title}&access_token=${req.user.deezerToken}`;

        axios
          .post(url)
          .then((result) => {
           
            const parameters = {
              _deezerPId: result.data.id,
              name: req.body.title,
              type: req.body.type,
            };
            const playlist = new Playlist(parameters);

            //Save playlist
            playlist.save((error, playlist) => {
              if (error) {
                return res.status(500).send({
                  message: "Server related error occured!",
                });
              }

              Playlist.findByIdAndUpdate(
                { _id: playlist._id },
                {
                  $push: {
                    users: { id: req.user._id, role: "RW", creator: true },
                  },
                },
                { new: true },
                (err, newPlaylist) => {
                  if (err) {
                    const resStatusCode = 500;
                    const fullError = { success: false, errors: err };
                    const message = "Something went wrong in server";
                    return generateServerError(
                      res,
                      resStatusCode,
                      fullError,
                      message
                    );
                  }

                  return res.status(200).send({
                    success: true,
                    message: "playlist successfully created",
                    playlist: newPlaylist,
                  });
                }
              );
            });
          })
          .catch((err) => {
            const resStatusCode = 500;
            const fullError = { success: false, errors: err };
            const message = "Something went wrong in server";
            return generateServerError(res, resStatusCode, fullError, message);
          });
      }
    })
    .catch((err) => {
      const resStatusCode = 500;
      const fullError = { success: false, errors: err.array() };
      const message = "Something went wrong in server";
      return generateServerError(res, resStatusCode, fullError, message);
    });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * Add tracks to Playlist
 */
exports.addPlaylistTracks = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const url = `https://api.deezer.com/playlist/${req.params.PId}/tracks?request_method=post&songs=${req.params.trackid}&access_token=${req.user.deezerToken}`;
  axios
    .get(url)
    .then((result) => {
      res.json({ success: true, message: "Track Added" });
    })
    .catch((err) => {
      res.json({ success: false, message: "Track already added" });
    });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * get tracks from Playlist
 */
exports.getPlaylistTracks = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const url = `https://api.deezer.com/playlist/${req.params.PId}/tracks?&access_token=${req.user.deezerToken}`;

  axios
    .get(url)
    .then((result) => {
      res.json({ success: true, playListId: result.data });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
};
