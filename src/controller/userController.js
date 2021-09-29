import User from "../model/User";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    res.render("join", {
      pageTitle,
      errorMessage: "Password comfirmation does not match.",
    });
  }

  const exists = User.exists({ $or: [{ username }, { password }] });
  if (exists) {
    res.render("join", {
      pageTitle,
      errorMessage: "This is already used username/password",
    });
  }

  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
  } catch (error) {
    return res.render("join", { pageTitle, errorMessage: error._message });
  }
  return res.redirect("/");
};

export const login = (req, res) => res.send("user login");

export const see = (req, res) => res.send("Edit User profile");
export const logout = (req, res) => res.send("logout User");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
