import User from "../model/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
let fromJoin = null;
const isHeroku = process.env.NODE_ENV === "production";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { email, name, password, password2, location } = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password comfirmation does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ email }, { name }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email/name is already taken.",
    });
  }

  try {
    await User.create({
      email,
      name,
      password,
      location,
    });
    req.flash("info", "Success. Please login with your account.");
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { email, password } = req.body;
  const user = await User.findOne({ email, socialOnly: false }).select([
    "password",
  ]);

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this email does not exists.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "Wrong password");
    return res.status(400).render("login", { pageTitle });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("info", "Login");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: isHeroku ? process.env.GH_CLIENT : process.env.GH_CLIENT_TEST,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  if (req.headers.referer.split("/").pop() == "join") {
    fromJoin = true;
  }
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: isHeroku ? process.env.GH_CLIENT : process.env.GH_CLIENT_TEST,
    client_secret: isHeroku
      ? process.env.GH_SECRET
      : process.env.GH_SECRET_TEST,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/user";

    const userData = await (
      await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      req.flash("error", "There's no authenticated email.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email }).select([
      "socialOnly",
      "password",
    ]);

    if (!user) {
      user = await User.create({
        email: emailObj.email,
        name: userData.name || Math.random().toString(36).substr(2, 16),
        socialOnly: true,
        password: "",
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
    } else if (user.socialOnly == false) {
      req.flash("info", "Your account has been converted to github account.");
      user.socialOnly = true;
      user.password = "";
      user.save();
    } else if (user.socialOnly == true && fromJoin) {
      fromJoin = false;
      req.flash("info", "You already have an account. Please log in.");
      return res.redirect("/login");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    req.flash("error", "Unable to create an account.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) =>
  res.render("edit-profile", { pageTitle: "Edit profile" });

export const postEdit = async (req, res) => {
  const pageTitle = "Edit profile";
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { email, name, location },
    file,
  } = req;

  if (email !== req.session.user.email) {
    const takenEmail = await User.exists({ email });
    if (takenEmail) {
      return res.status(400).render("edit-profile", {
        pageTitle,
        errorMessage: "This email is already taken",
      });
    }
  }

  if (name !== req.session.user.name) {
    const takenName = await User.exists({ name });
    if (takenName) {
      return res.status(400).render("edit-profile", {
        pageTitle,
        errorMessage: "This name is taken",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file
        ? isHeroku
          ? file.location
          : "\\" + file.path
        : avatarUrl,
      email,
      name,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  req.flash("success", "Your profile has been successfully changed.");
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: { loggedInUser: _id },
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  const user = await User.findById(_id).select("password");

  const ok = bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "The current password incorrect.",
    });
  }

  if (newPassword !== newPassword1) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "The password does not match the confirmation.",
    });
  }

  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  req.flash("success", "Password has been changed successfully.");
  return res.redirect("/users/change-password");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    })
    .select("name");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("profile", { pageTitle: user.name, user });
};
