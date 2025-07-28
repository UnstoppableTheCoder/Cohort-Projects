const removeSensitiveData = (userObj) => {
  const { password, ...user } = userObj;
  return user;
};

export default removeSensitiveData;
