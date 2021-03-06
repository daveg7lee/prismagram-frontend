/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import {
  CONFIRM_SECRET,
  CREATE_ACCOUNT,
  LOCAL_LOG_IN,
  LOG_IN,
} from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const secret = useInput("");
  const email = useInput("");

  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: { email: email.value },
  });

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
    },
  });

  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      secret: secret.value,
      email: email.value,
    },
  });

  const [localLogInMutation] = useMutation(LOCAL_LOG_IN);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        try {
          const {
            data: { requestSecret },
          } = await requestSecretMutation();
          if (!requestSecret) {
            toast.error("You don't have Account. Create Now");
            setTimeout(() => setAction("signUp"), 3000);
          } else {
            setAction("confirm");
            toast.success("Check your inbox secret is sent!");
          }
        } catch {
          toast.error("Error, Try again");
        }
      } else {
        toast.error("Email is Empty");
      }
    } else if (action === "signUp") {
      if (
        email.value !== "" &&
        username.value !== "" &&
        lastName.value !== "" &&
        firstName.value !== ""
      ) {
        try {
          const {
            data: { createAccount },
          } = await createAccountMutation();
          if (!createAccount) {
            toast.error("Error, Try again");
          } else {
            toast.success("Welcome!, Check your inbox secret is sent!");
            await requestSecretMutation();
            setTimeout(() => setAction("logIn"), 4000);
          }
        } catch (error) {
          const errorMessage = error.message
            .replace("GraphQL", "")
            .replace("e", "E")
            .replace(":", ",");
          toast.error(errorMessage);
        }
      } else {
        toast.error("All fields are required");
      }
    } else if (action === "confirm") {
      if (secret.value !== "") {
        try {
          const {
            data: { confirmSecret: token },
          } = await confirmSecretMutation();
          if (token !== "" && token !== undefined) {
            localLogInMutation({ variables: { token } });
          } else {
            throw Error();
          }
        } catch {
          toast.error("Error, Can't confirm Secret, Check again");
        }
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
      secret={secret}
      onSubmit={onSubmit}
    />
  );
};
