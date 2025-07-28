const setAuthCookies = (res, token) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, options);
};

export default setAuthCookies;
