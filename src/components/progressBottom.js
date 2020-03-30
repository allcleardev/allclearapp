import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const BorderLinearProgress = withStyles({
  bar: {
    borderRadius: 20,
    backgroundColor: "#fff"
  }
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function ProgressBottom() {
  const classes = useStyles();

  return (
    <div className="progress-bottom">
      <BorderLinearProgress
        className="progress-bottom-bar"
        variant="determinate"
        color="secondary"
        value={30}
      />
    </div>
  );
}
