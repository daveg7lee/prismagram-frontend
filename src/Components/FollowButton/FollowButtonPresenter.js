/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import Button from "../Button";

export default ({ isFollowing, onClick }) => (
  <Button text={isFollowing ? "Unfollow" : "Follow"} onClick={onClick} />
);
