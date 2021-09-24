let videos = [
  {
    title: "First video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second video",
    rating: 4,
    comments: 2,
    createdAt: "5 minutes ago",
    views: 48,
    id: 2,
  },
  {
    title: "Third video",
    rating: 4,
    comments: 2,
    createdAt: "7 minutes ago",
    views: 48,
    id: 3,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Eiditing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect(`/`);
};
