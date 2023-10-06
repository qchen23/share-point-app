import request from "../axios-request";

const updateUser = (user) => {
  request
    .put(`/users/update/${user._id}`, user)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("Error when updating user: " + err);
    });
};

export default updateUser;
