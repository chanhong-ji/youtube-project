export const trending = (req, res) => res.send("trending videos");
export const search = (req, res) => res.send("search videos");

export const upload = (req, res) => res.send("upload video");
export const see = (req, res) => {
  console.log(req.params);
  res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) => res.send("remove video");
