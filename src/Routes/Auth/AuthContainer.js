/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { CREATE_ACCOUNT, LOG_IN } from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const email = useInput("fjdlaskfjlaskf@gmail.com");

  const [requestSecret] = useMutation(LOG_IN, {
    update: (_, { data: { requestSecret } }) => {
      if (!requestSecret) {
        toast.error("You don't have Account. Create Now");
        setTimeout(() => setAction("signUp"), 4000);
      }
    },
    variables: { email: email.value },
  });

  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    update: (_, { data: { createAccount } }) => {
      if (createAccount) {
        toast.success("Welcome!");
      }
    },
    variables: {
      username: username.value,
      email: email.value,
      lastName: lastName.value,
      firstName: firstName.value,
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        requestSecret();
      } else {
        toast.error("Email is Empty");
      }
    } else if (action === "SignUp") {
      if (
        email.value !== "" &&
        username.value !== "" &&
        lastName.value !== "" &&
        firstName.value !== ""
      ) {
        createAccount();
      } else {
        toast.error("All fields are required");
      }
    }
  };

  return (
    <AuthPresenter
      setAction={setAction}
      action={action}
      username={username}
      firstName={firstName}
      lastName={lastName}
      email={email}
      onSubmit={onSubmit}
    />
  );
};
