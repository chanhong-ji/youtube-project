export const join = (req, res) => res.render("home.pug");
export const login = (req, res) => res.send("user login");

export const see = (req, res) => res.send("Edit User profile");
export const logout = (req, res) => res.send("logout User");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
