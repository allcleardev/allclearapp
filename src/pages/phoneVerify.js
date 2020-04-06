import React from "react";
import { Link, useHistory } from "react-router-dom";

import Form from "@material-ui/core/Container";

import { Button, Grid } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Axios from "axios";

import Header from "../components/header-round";
import ProgressBottom from "../components/progressBottom";
import PhoneNumber from "../components/phoneNumber";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function PhoneVerify({ props }) {
  const [state, setState] = React.useState({
    checkedB: true,
    loading: false,
  });

  const history = useHistory();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const verifyPhoneNumber = async () => {
    setState({ loading: true });
    let phone = sessionStorage.getItem("phone");

    if (!phone) {
      //show error message
      setState({ loading: false });
      return;
    }
    await Axios.post("https://api-dev.allclear.app/peoples/start", {
      phone: phone,
      beenTested: false,
      haveSymptoms: false,
    })
      .then((response) => {
        console.log(response);
        sessionStorage.setItem("phone", phone);
        history.push("/phone-verification");
      })
      .catch((error) => {
        //show error message
        setState({ loading: false });
      });
  };

  return (
    <div className="background-responsive">
      <div className="phone-verify onboarding-page">
        <Header>
          <h1 className="heading">Phone Number</h1>
          <h2 className="sub-heading">Enter your phone number to get started.</h2>
        </Header>
        {
          state.loading === false ?
            <Form noValidate autoComplete="off" className="onboarding-body">
              <PhoneNumber className="hide-mobile"></PhoneNumber>

              <div className="review-container">
                <p>Please review and agree to the
                  <a href="/terms/"> Terms & Conditions </a> and
                  <a href="/privacy/"> Privacy Policy </a> before continuing.
                </p>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedB}
                      onChange={handleChange}
                      name="checkedB"
                      color="third"
                    />
                  }
                  label="I have reviewed and agree to the Terms & Conditions and Privacy Policy"
                />
              </div>

              <div className="button-container">
                <Link to="/create-account" className="hide-mobile">
                  <Button
                    variant="contained"
                    className="back"
                  >
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={() => verifyPhoneNumber()}
                  variant="contained"
                  color="primary"
                  className="next"
                >
                  Send Verification Code
                </Button>
              </div>
            </Form>
            :
            <Grid container justify="center">
              <Grid item xs={12} sm={6}>
                <LinearProgress color="primary" value="50" />
              </Grid>
            </Grid>
        }
        {
          state.loading === false ?
            <ProgressBottom progress="0"></ProgressBottom>
            : null
        }
      </div>
    </div>
  );
}
