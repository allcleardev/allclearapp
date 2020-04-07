import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import Form from '@material-ui/core/Container';

import { Button, Grid } from '@material-ui/core';
import Axios from 'axios';

import RoundHeader from '../components/headers/header-round';
import ProgressBottom from '../components/progressBottom';
import PhoneNumber from '../components/phoneNumber';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function PhoneVerify({ props }) {
  const [state, setState] = React.useState({
    checkedB: true,
    loading: false,
  });

  const history = useHistory();

  //eslint-disable-next-line
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  //eslint-disable-next-line
  async function verifyLogin() {
    setState({ loading: true });
    const phone = sessionStorage.getItem('phone');

    if (!phone) {
      //show error message
      setState({ loading: false });
      return;
    }
    await Axios.post('https://api-dev.allclear.app/peoples/auth', {
      phone,
    })
      .then((response) => {
        console.log(response);
        sessionStorage.setItem('phone', phone);
        history.push('/auth-verification');
      })
      .catch((error) => {
        //show error message
        setState({ loading: false });
      });
  }

  return (
    <div className="background-responsive">
      <div className="phone-verify onboarding-page">
        <RoundHeader>
          <h1 className="heading">Sign In</h1>
          <h2 className="sub-heading">Enter your phone number to be sent a verification code.</h2>
        </RoundHeader>
        {state.loading === false ? (
          <Form noValidate autoComplete="off" className="onboarding-body">
            <PhoneNumber className="hide-mobile"></PhoneNumber>

            <div className="button-container">
              <Link to="/phone-verify" className="hide-mobile">
                <Button variant="contained" className="back">
                  Back
                </Button>
              </Link>
              <Button onClick={() => verifyLogin()} variant="contained" color="primary" className="next">
                Send Verification Code
              </Button>
            </div>
          </Form>
        ) : (
           <Grid container justify="center">
             <Grid item xs={12} sm={6}>
               <LinearProgress color="primary" value="50" variant="indeterminate" />
             </Grid>
           </Grid>
         )}
        {state.loading === false ? <ProgressBottom progress="100px"></ProgressBottom> : null}
      </div>
    </div>
  );
}
