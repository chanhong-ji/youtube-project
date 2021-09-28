import User from "../model/User";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, location } = req.body;
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
  } catch (error) {
    const errorMessage = error._message;
    return res.render("join", { pageTitle: "Join", errorMessage });
  }
  return res.redirect("/");
};

export const login = (req, res) => res.send("user login");

export const see = (req, res) => res.send("Edit User profile");
export const logout = (req, res) => res.send("logout User");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
