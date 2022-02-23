import User from "../model/User";
import Video from "../model/Video";
import Comment from "../model/Comment";

const isHeroku = process.env.NODE_ENV === "production";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  const dateList = String(video.createdAt).split(" ");
  const date = dateList[3] + ". " + dateList[1] + ". " + dateList[2];
  return res.render("watch", {
    pageTitle: video.title,
    video,
    date,
  });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  if (String(_id) !== String(video.owner)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(_id) !== String(video.owner)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changed saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      videoUrl: isHeroku ? video[0].location : "/" + video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : "/" + thumb[0].path,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "Now authorized");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  const user = await User.findById(_id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: {
      user: { _id, name },
    },
  } = req;

  const user = await User.findById(_id);
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    video: id,
    owner: _id,
    name,
  });

  user.comments.push(comment._id);
  user.save();
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ commentId: comment._id, commentName: name });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;

  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video);
  const user = await User.findById(comment.owner);

  if (String(user._id) !== req.session.user._id) {
    req.flash("error", "Not authorized");
    return res.redirect(`/videos/${video._id}`);
  }

  await video.comments.remove({ _id: id });
  video.save();
  await user.comments.remove({ _id: id });
  user.save();

  return res.sendStatus(200);
};
