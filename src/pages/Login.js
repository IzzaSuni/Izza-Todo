import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { CreateNote, GetNotes, UpdateNote, UseDoLogIn } from "../services";
import Input from "../components/Input";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Cookies from "universal-cookie";
import { useHistory, withRouter } from "react-router-dom";
import Img from "../components/Img";
import IsLogin from "../utils/isLogin";
import CheckUsername from "../utils/checkUname";
import generateErrEmail from "../utils/GenerateError";

const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();
const Github = new GithubAuthProvider();
const firebaseConfig = {
  apiKey: "AIzaSyAjZX0rIvNdmRXab8sDlkjihku_Bh4y0jg",
  authDomain: "notes-9e77e.firebaseapp.com",
  projectId: "notes-9e77e",
  storageBucket: "notes-9e77e.appspot.com",
  messagingSenderId: "518427613842",
  appId: "1:518427613842:web:af718e1b48a3b7972be44b",
  measurementId: "G-4QZVSNXS15",
};

const useStyles = makeStyles({
  card: {
    width: "40vw",
    background: "#2B2B2B",
    borderRadius: "8px",
    padding: "32px",
    margin: "16px 0",
  },
  container: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Login = () => {
  const history = useHistory();
  const classes = useStyles();
  const [msg, setMsg] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  //check if signed
  const { signed } = IsLogin();
  if (signed) {
    history.replace("/publicNote");
  }

  //handleSubmit
  const submit = (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[2].value;
    signInWithEmailAndPassword(auth, email, password)
      .then((e) => {
        const cookies = new Cookies();
        cookies.set("akikToken", e._tokenResponse.idToken, {
          path: "/",
          maxAge: 43200,
        });
        setMsg({ type: "success", msg: "berhasil login" });
        setLoading(false);
        history.push(`/publicNote/Private`);
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password")
          setMsg({ msg: "Maaf email atau password salah 👀", type: "error" });
        if (err.code === "auth/user-not-found")
          setMsg({ msg: "Maaf user tidak ditemukan 👀", type: "error" });
        setLoading(false);
        return err;
      });
  };

  //handleLogin
  const login = (type) => {
    switch (type) {
      case "google":
        return signInWithPopup(auth, providerGoogle)
          .then((e) => {
            console.log(e);
            const cookies = new Cookies();
            cookies.set("akikToken", e._tokenResponse.idToken, {
              path: "/",
              maxAge: 43200,
            });
            setMsg({ type: "success", msg: "berhasil login" });
            setLoading(false);
            CheckUsername({ id: e.user.uid, username: e.user.displayName });
            history.push(`/publicNote/Private`);
          })
          .catch((err) => {
            return err;
          });
      case "facebook":
        return signInWithPopup(auth, providerFacebook)
          .then((e) => {
            const cookies = new Cookies();
            cookies.set("akikToken", e._tokenResponse.idToken, {
              path: "/",
              maxAge: 43200,
            });
            setMsg({ type: "success", msg: "berhasil login" });
            setLoading(false);
            CheckUsername({ id: e.user.uid, username: e.user.displayName });
            history.push(`/publicNote/Private`);
          })
          .catch((err) => {
            return err;
          });

      case "github":
        return signInWithPopup(auth, Github)
          .then((e) => {
            const cookies = new Cookies();
            cookies.set("akikToken", e._tokenResponse.idToken, {
              path: "/",
              maxAge: 43200,
            });
            setMsg({ type: "success", msg: "berhasil login" });
            setLoading(false);
            CheckUsername({ id: e.user.uid, username: e.user.displayName });
            history.push(`/publicNote/Private`);
          })
          .catch((err) => {
            return err;
          });
    }
  };

  //handleChangeE
  const handleChangeE = (e) => {
    const helperE = document.getElementById("helperEmail");
    const msg = generateErrEmail(e.target.value, "email");
    if (msg === "e-mail sesuai format") helperE.style.color = "green";
    else {
      helperE.style.color = "yellow ";
    }
    helperE.innerHTML = msg;
  };

  //handleChangeP
  const handleChangeP = (e) => {
    const helperP = document.getElementById("helperPass");
    const msg = generateErrEmail(e.target.value, "pass");
    if (msg === "sukses") helperP.style.color = "green";
    else {
      helperP.style.color = "yellow ";
    }
    helperP.innerHTML = msg;
  };

  //return
  return (
    <Box className={classes.container}>
      <Box className={`${classes.card} shadow loginCard`}>
        <Typography textAlign="center" variant={"h4"}>
          Login
        </Typography>
        <Box marginY={3}>
          <form onSubmit={submit}>
            <Box>
              <Input
                type="email"
                label={"Email"}
                inputType="text"
                hdlChange={handleChangeE}
              />
              <Box height={"12px"} mt={1} pl="14px">
                <Typography id="helperEmail"></Typography>
              </Box>
            </Box>

            <Box mt={2}>
              <Input
                type="email"
                label="Password"
                inputType={"password"}
                hdlChange={handleChangeP}
              />
              <Box height={"12px"} my={1} pl="14px">
                <Typography id="helperPass" />
              </Box>
            </Box>
            <Box display="flex" justifyContent={"center"} pb={0.5}>
              <Input
                type={"buttonLoading"}
                loading={loading}
                className={{ width: "30%" }}
              >
                Login
              </Input>
            </Box>
            <Box>
              <Typography textAlign={"center"}>atau login dengan</Typography>
            </Box>
            <Box
              display="inline-flex"
              justifyContent={"center"}
              width="100%"
              py={2}
            >
              <Img
                onClick={() => login("facebook")}
                src="/facebook.svg"
                px={"8px"}
              />
              <Img
                onClick={() => login("google")}
                src="/google.svg"
                px={"8px"}
              />
              <Img
                src="/Github.svg"
                px={"8px"}
                onClick={() => login("github")}
              />
            </Box>
            <Typography textAlign={"center"}>Belum punya akun?</Typography>
            <Box
              sx={{ cursor: "pointer" }}
              display="flex"
              justifyContent={"center"}
              onClick={() => history.push("/signUp")}
            >
              <Typography>Daftar</Typography>
            </Box>
          </form>
        </Box>
        <Typography textAlign="center">{msg.msg}</Typography>
      </Box>
    </Box>
  );
};

export default Login;